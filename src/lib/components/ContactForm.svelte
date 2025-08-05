<script lang="ts">
	import { onMount } from 'svelte';

	let name = '';
	let email = '';
	let message = '';
	let isSubmitting = false;
	let status: 'idle' | 'success' | 'error' = 'idle';
	let errorMessage = '';

	let nameError = '';
	let emailError = '';
	let messageError = '';

	function validateName(value: string): string {
		if (!value.trim()) return 'Name is required';
		if (value.trim().length < 2) return 'Name must be at least 2 characters';
		if (value.trim().length > 50) return 'Name must be less than 50 characters';
		return '';
	}

	function validateEmail(value: string): string {
		if (!value.trim()) return 'Email is required';
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) return 'Please enter a valid email address';
		return '';
	}

	function validateMessage(value: string): string {
		if (!value.trim()) return 'Message is required';
		if (value.trim().length < 10) return 'Message must be at least 10 characters';
		if (value.trim().length > 1000) return 'Message must be less than 1000 characters';
		return '';
	}

	// Real-time validation
	$: nameError = name ? validateName(name) : '';
	$: emailError = email ? validateEmail(email) : '';
	$: messageError = message ? validateMessage(message) : '';

	$: isFormValid =
		!nameError && !emailError && !messageError && name.trim() && email.trim() && message.trim();

	async function handleSubmit(e: Event) {
		e.preventDefault();

		// Final validation
		const finalNameError = validateName(name);
		const finalEmailError = validateEmail(email);
		const finalMessageError = validateMessage(message);

		if (finalNameError || finalEmailError || finalMessageError) {
			nameError = finalNameError;
			emailError = finalEmailError;
			messageError = finalMessageError;
			return;
		}

		isSubmitting = true;
		status = 'idle';
		errorMessage = '';

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					message: message.trim()
				}),
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			});

			const result = await res.json();

			if (res.ok) {
				status = 'success';
				name = '';
				email = '';
				message = '';

                setTimeout(() => {
					status = 'idle';
				}, 5000);
			} else {
				status = 'error';
				errorMessage = result.error || 'Failed to send message. Please try again.';
			}
		} catch (error) {
			status = 'error';
			errorMessage = 'Network error. Please check your connection and try again.';
		} finally {
			isSubmitting = false;
		}
	}

	onMount(async () => {
		const { default: gsap } = await import('gsap');
		const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
		gsap.registerPlugin(ScrollTrigger);

		const formElements = document.querySelectorAll(
			'.contact-form > .form-grid > div, .form-footer'
		);

		gsap.from(formElements, {
			opacity: 0,
			y: 40,
			duration: 0.7,
			stagger: 0.15,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: '.contact-form',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});
	});
</script>

<section id="contact" class="contact-section" aria-labelledby="contact-heading">
	<div class="container">
		<div class="header">
			<h2 id="contact-heading" class="title">Get in Touch</h2>
			<p class="subtitle">
				I'd love to hear from you. Send me a message and I'll respond as soon as possible.
			</p>
		</div>

		<form on:submit|preventDefault={handleSubmit} class="contact-form" novalidate>
			<div class="form-grid">
				<div class="form-group">
					<label for="name" class="label">
						Full Name
						<span class="required" aria-label="required">*</span>
					</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						class="input"
						class:error={nameError}
						placeholder="Enter your full name"
						autocomplete="name"
						aria-describedby={nameError ? 'name-error' : undefined}
						aria-invalid={!!nameError}
						disabled={isSubmitting}
						required
					/>
					{#if nameError}
						<p id="name-error" class="error-message" role="alert">{nameError}</p>
					{/if}
				</div>

				<div class="form-group">
					<label for="email" class="label">
						Email Address
						<span class="required" aria-label="required">*</span>
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						class="input"
						class:error={emailError}
						placeholder="Enter your email address"
						autocomplete="email"
						aria-describedby={emailError ? 'email-error' : undefined}
						aria-invalid={!!emailError}
						disabled={isSubmitting}
						required
					/>
					{#if emailError}
						<p id="email-error" class="error-message" role="alert">{emailError}</p>
					{/if}
				</div>

				<div class="form-group full-width">
					<label for="message" class="label">
						Message
						<span class="required" aria-label="required">*</span>
					</label>
					<textarea
						id="message"
						bind:value={message}
						class="textarea"
						class:error={messageError}
						placeholder="Tell me how I can help you..."
						rows="6"
						aria-describedby={messageError ? 'message-error' : undefined}
						aria-invalid={!!messageError}
						disabled={isSubmitting}
						required
					></textarea>
					<div class="character-count">
						<span class="count" class:warning={message.length > 900}>
							{message.length}/1000
						</span>
					</div>
					{#if messageError}
						<p id="message-error" class="error-message" role="alert">{messageError}</p>
					{/if}
				</div>
			</div>

			<div class="form-footer">
				{#if status === 'success'}
					<div class="success-message" role="alert">
						<svg class="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
						<span>Message sent successfully! I'll get back to you soon.</span>
					</div>
				{/if}

				{#if status === 'error'}
					<div class="error-message-box" role="alert">
						<svg class="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clip-rule="evenodd"
							/>
						</svg>
						<span>{errorMessage}</span>
					</div>
				{/if}

				<button
					type="submit"
					class="submit-button"
					disabled={!isFormValid || isSubmitting}
					aria-describedby="submit-help"
				>
					{#if isSubmitting}
						<svg class="spinner" viewBox="0 0 24 24" aria-hidden="true">
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
								opacity="0.25"
							/>
							<path
								fill="currentColor"
								opacity="0.75"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						Sending...
					{:else}
						Send Message
					{/if}
				</button>
			</div>
		</form>
	</div>
</section>

<style>
	.contact-section {
		background: linear-gradient(to bottom, rgba(10, 10, 10, 0.65), rgba(10, 10, 10, 0.45));
		padding: 4rem 0;
		min-height: 100vh;
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
	}

	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 1.5rem;
		width: 100%;
		z-index: 1;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.title {
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 700;
		color: white;
		margin: 0 0 1rem 0;
		letter-spacing: -0.025em;
		line-height: 1.1;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #d1d5db;
		margin: 0;
		line-height: 1.6;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.contact-form {
		background: rgba(20, 20, 20, 0.8);
		border-radius: 16px;
		padding: 2.5rem;
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.4),
			0 0 0 1px rgba(255, 255, 255, 0.05);
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	.label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #f3f4f6;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.required {
		color: #ef4444;
		font-weight: 500;
	}

	.input,
	.textarea {
		padding: 0.875rem 1rem;
		border: 1px solid #374151;
		border-radius: 8px;
		font-size: 1rem;
		transition: all 0.2s ease;
		background-color: #1f2937;
		color: #f9fafb;
		font-family: inherit;
		width: 100%;
		box-sizing: border-box;
	}

	.input:focus,
	.textarea:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
	}

	.input:disabled,
	.textarea:disabled {
		background-color: #f9fafb;
		border-color: #d1d5db;
		color: #9ca3af;
		cursor: not-allowed;
	}

	.input.error,
	.textarea.error {
		border-color: #f87171;
		box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.3);
	}

	.textarea {
		resize: vertical;
		min-height: 120px;
		line-height: 1.6;
	}

	.character-count {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.5rem;
	}

	.count {
		font-size: 0.75rem;
		color: #9ca3af;
		font-weight: 500;
	}

	.count.warning {
		color: #fbbf24;
	}

	.error-message {
		color: #ef4444;
		font-size: 0.875rem;
		margin-top: 0.5rem;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.form-footer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.submit-button {
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.875rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 140px;
		justify-content: center;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.submit-button:hover:not(:disabled) {
		background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
		transform: translateY(-1px);
		box-shadow: 0 6px 20px -6px rgba(59, 130, 246, 0.4);
	}

	.submit-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.submit-button:disabled {
		background: #9ca3af;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.spinner {
		width: 1rem;
		height: 1rem;
		animation: spin 1s linear infinite;
	}

	.success-message,
	.error-message-box {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		border-radius: 8px;
		font-weight: 500;
		text-align: center;
		width: 100%;
		max-width: 400px;
	}

	.success-message {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #15803d;
	}

	.error-message-box {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
	}

	.success-message .icon,
	.error-message-box .icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.contact-section {
			padding: 2rem 0;
		}

		.container {
			padding: 0 1rem;
		}

		.title {
			font-size: 2rem;
		}

		.subtitle {
			font-size: 1rem;
		}

		.contact-form {
			padding: 1.5rem;
		}

		.form-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.header {
			margin-bottom: 2rem;
		}
	}

	@media (max-width: 480px) {
		.title {
			font-size: 1.75rem;
		}

		.contact-form {
			padding: 1rem;
		}

		.submit-button {
			width: 100%;
		}
	}
</style>
