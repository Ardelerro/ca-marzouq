import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';

// Types
interface ContactRequest {
	name: string;
	email: string;
	message: string;
}

interface BrevoEmailRequest {
	sender: {
		name: string;
		email: string;
	};
	to: Array<{
		email: string;
		name: string;
	}>;
	subject: string;
	htmlContent: string;
	textContent?: string;
}

// Configuration
const CONFIG = {
	RECIPIENT_EMAIL: 'marzouq.mohsin11@gmail.com',
	RECIPIENT_NAME: 'Marzouq Mohsin',
	MAX_NAME_LENGTH: 50,
	MAX_MESSAGE_LENGTH: 1000,
	MIN_MESSAGE_LENGTH: 10,
	RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
	RATE_LIMIT_MAX_REQUESTS: 5
};

// Simple in-memory rate limiting (use Redis/database in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Validation functions
function validateName(name: string): string | null {
	if (!name || typeof name !== 'string') return 'Name is required';
	const trimmed = name.trim();
	if (trimmed.length < 2) return 'Name must be at least 2 characters';
	if (trimmed.length > CONFIG.MAX_NAME_LENGTH)
		return `Name must be less than ${CONFIG.MAX_NAME_LENGTH} characters`;
	if (!/^[a-zA-Z\s\-'\.]+$/.test(trimmed)) return 'Name contains invalid characters';
	return null;
}

function validateEmail(email: string): string | null {
	if (!email || typeof email !== 'string') return 'Email is required';
	const trimmed = email.trim().toLowerCase();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
	if (trimmed.length > 254) return 'Email address is too long';
	return null;
}

function validateMessage(message: string): string | null {
	if (!message || typeof message !== 'string') return 'Message is required';
	const trimmed = message.trim();
	if (trimmed.length < CONFIG.MIN_MESSAGE_LENGTH)
		return `Message must be at least ${CONFIG.MIN_MESSAGE_LENGTH} characters`;
	if (trimmed.length > CONFIG.MAX_MESSAGE_LENGTH)
		return `Message must be less than ${CONFIG.MAX_MESSAGE_LENGTH} characters`;
	return null;
}

function sanitizeInput(input: string): string {
	return input
		.trim()
		.replace(/[<>]/g, '') // Remove potential HTML tags
		.replace(/\0/g, ''); // Remove null bytes
}

function getClientIP(request: Request): string {
	// Try various headers that might contain the real IP
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0].trim();
	}

	return request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || '127.0.0.1';
}

function checkRateLimit(clientIP: string): boolean {
	const now = Date.now();
	const clientData = rateLimitStore.get(clientIP);

	if (!clientData || now > clientData.resetTime) {
		// Reset or initialize
		rateLimitStore.set(clientIP, {
			count: 1,
			resetTime: now + CONFIG.RATE_LIMIT_WINDOW
		});
		return true;
	}

	if (clientData.count >= CONFIG.RATE_LIMIT_MAX_REQUESTS) {
		return false;
	}

	clientData.count++;
	return true;
}

function createEmailContent(
	name: string,
	email: string,
	message: string
): {
	htmlContent: string;
	textContent: string;
} {
	const timestamp = new Date().toLocaleString('en-US', {
		timeZone: 'UTC',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});

	const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: 600; color: #495057; margin-bottom: 5px; display: block; }
        .value { background: #f8f9fa; padding: 10px; border-radius: 4px; border-left: 3px solid #007bff; }
        .message-content { white-space: pre-wrap; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #6c757d; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2 style="margin: 0; color: #007bff;">New Contact Form Submission</h2>
        <p style="margin: 5px 0 0 0; color: #6c757d;">Received on ${timestamp} UTC</p>
      </div>
      
      <div class="content">
        <div class="field">
          <label class="label">From:</label>
          <div class="value">${sanitizeInput(name)}</div>
        </div>
        
        <div class="field">
          <label class="label">Email:</label>
          <div class="value">${sanitizeInput(email)}</div>
        </div>
        
        <div class="field">
          <label class="label">Message:</label>
          <div class="value message-content">${sanitizeInput(message)}</div>
        </div>
      </div>
      
      <div class="footer">
        <p>This email was sent from your website's contact form.</p>
      </div>
    </body>
    </html>
  `;

	const textContent = `
New Contact Form Submission
Received on ${timestamp} UTC

From: ${sanitizeInput(name)}
Email: ${sanitizeInput(email)}

Message:
${sanitizeInput(message)}

---
This email was sent from your website's contact form.
  `;

	return { htmlContent, textContent };
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Rate limiting
		const clientIP = getClientIP(request);
		if (!checkRateLimit(clientIP)) {
			return json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
		}

		// Parse and validate content type
		const contentType = request.headers.get('content-type');
		if (!contentType?.includes('application/json')) {
			return json({ error: 'Invalid content type. Expected application/json.' }, { status: 400 });
		}

		// Parse request body
		let body: ContactRequest;
		try {
			body = await request.json();
		} catch {
			return json({ error: 'Invalid JSON in request body.' }, { status: 400 });
		}

		// Validate required fields exist
		if (!body || typeof body !== 'object') {
			return json({ error: 'Request body must be a valid object.' }, { status: 400 });
		}

		const { name, email, message } = body;

		// Validate each field
		const nameError = validateName(name);
		if (nameError) {
			return json({ error: nameError }, { status: 400 });
		}

		const emailError = validateEmail(email);
		if (emailError) {
			return json({ error: emailError }, { status: 400 });
		}

		const messageError = validateMessage(message);
		if (messageError) {
			return json({ error: messageError }, { status: 400 });
		}

		// Check for required environment variablesd
		const brevoApiKey = import.meta.env.VITE_BREVO_API_KEY;
		if (!brevoApiKey) {
			console.error('VITE_BREVO_API_KEY environment variable is not set');
			return json(
				{ error: 'Email service is not configured. Please try again later.' },
				{ status: 500 }
			);
		}

		// Sanitize inputs
		const sanitizedName = sanitizeInput(name);
		const sanitizedEmail = sanitizeInput(email);
		const sanitizedMessage = sanitizeInput(message);

		// Create email content
		const { htmlContent, textContent } = createEmailContent(
			sanitizedName,
			sanitizedEmail,
			sanitizedMessage
		);

		// Prepare Brevo API request
		const brevoRequest: BrevoEmailRequest & { replyTo: { email: string; name?: string } } = {
			sender: {
				name: 'Marzouq Mohsin',
				email: 'contact@marzouq.ca'
			},
			replyTo: {
				email: sanitizedEmail,
				name: sanitizedName
			},
			to: [
				{
					email: CONFIG.RECIPIENT_EMAIL,
					name: CONFIG.RECIPIENT_NAME
				}
			],
			subject: `New Contact Form Message from ${sanitizedName}`,
			htmlContent,
			textContent
		};

		// Send email via Brevo
		const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': brevoApiKey,
				Accept: 'application/json'
			},
			body: JSON.stringify(brevoRequest)
		});

		if (!brevoResponse.ok) {
			const errorText = await brevoResponse.text();
			console.error('Brevo API error:', {
				status: brevoResponse.status,
				statusText: brevoResponse.statusText,
				body: errorText
			});

			// Don't expose internal API errors to client
			return json({ error: 'Failed to send email. Please try again later.' }, { status: 500 });
		}

		// Success response
		return json(
			{
				success: true,
				message: 'Message sent successfully'
			},
			{
				status: 200,
				headers: {
					'Cache-Control': 'no-cache, no-store, must-revalidate'
				}
			}
		);
	} catch (err) {
		// Log error for debugging (make sure to sanitize logs in production)
		console.error('Contact form error:', err);

		return json(
			{ error: 'An unexpected error occurred. Please try again later.' },
			{ status: 500 }
		);
	}
};

// Optional: Add other HTTP methods with appropriate responses
export const GET: RequestHandler = async () => {
	return json({ error: 'Method not allowed. Use POST to submit contact form.' }, { status: 405 });
};

export const PUT: RequestHandler = async () => {
	return json({ error: 'Method not allowed. Use POST to submit contact form.' }, { status: 405 });
};

export const DELETE: RequestHandler = async () => {
	return json({ error: 'Method not allowed. Use POST to submit contact form.' }, { status: 405 });
};
