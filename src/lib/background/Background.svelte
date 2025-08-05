<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		baseX: number;
		baseY: number;
	}

	const PARTICLE_COUNT = 150;
	const MAX_DISTANCE = 200;
	const PARTICLE_COLOR = 'rgba(56, 189, 248, 0.6)'; // blue-ish accent
	const LINE_COLOR = 'rgba(56, 189, 248, 0.2)';

	let particles: Particle[] = [];
	let animationFrameId: number;
	let mouseX = 0;
	let mouseY = 0;
	let windowWidth = 0;
	let windowHeight = 0;

	function random(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	function initParticles(width: number, height: number) {
		particles = [];
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			const x = random(0, width);
			const y = random(0, height);
			particles.push({
				x,
				y,
				baseX: x,
				baseY: y,
				vx: random(-1.05, 1.05),
				vy: random(-1.05, 1.05),
				radius: random(1.5, 3)
			});
		}
	}

	function drawParticle(p: Particle) {
		if (!ctx) return;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
		ctx.fillStyle = PARTICLE_COLOR;
		ctx.fill();
	}

	function drawLine(p1: Particle, p2: Particle, dist: number) {
		if (!ctx) return;

		const alpha = 1 - dist / MAX_DISTANCE;
		ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.25})`;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.stroke();
	}

	function animate() {
		if (!ctx) return;

		const width = canvas.width;
		const height = canvas.height;

		ctx.clearRect(0, 0, width, height);

		const parallaxStrength = 0.24;
		const centerX = windowWidth / 2;
		const centerY = windowHeight / 2;

		particles.forEach((p) => {
			p.x += p.vx;
			p.y += p.vy;

			if (p.x <= 0 || p.x >= width) p.vx *= -1;
			if (p.y <= 0 || p.y >= height) p.vy *= -1;

			const offsetX = (mouseX - centerX) * parallaxStrength * (p.radius / 3);
			const offsetY = (mouseY - centerY) * parallaxStrength * (p.radius / 3);

			const baseX = p.x + offsetX;
			const baseY = p.y + offsetY;

			drawParticle({ ...p, x: baseX, y: baseY });

			p.baseX = baseX;
			p.baseY = baseY;
		});

		for (let i = 0; i < PARTICLE_COUNT; i++) {
			for (let j = i + 1; j < PARTICLE_COUNT; j++) {
				const p1 = particles[i];
				const p2 = particles[j];
				const dx =
					p1.x +
					(mouseX - centerX) * parallaxStrength * (p1.radius / 3) -
					(p2.x + (mouseX - centerX) * parallaxStrength * (p2.radius / 3));
				const dy =
					p1.y +
					(mouseY - centerY) * parallaxStrength * (p1.radius / 3) -
					(p2.y + (mouseY - centerY) * parallaxStrength * (p2.radius / 3));
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < MAX_DISTANCE) {
					drawLine(
						{
							...p1,
							x: p1.x + (mouseX - centerX) * parallaxStrength * (p1.radius / 3),
							y: p1.y + (mouseY - centerY) * parallaxStrength * (p1.radius / 3)
						},
						{
							...p2,
							x: p2.x + (mouseX - centerX) * parallaxStrength * (p2.radius / 3),
							y: p2.y + (mouseY - centerY) * parallaxStrength * (p2.radius / 3)
						},
						dist
					);
				}
			}
		}

		animationFrameId = requestAnimationFrame(animate);
	}

	function resize() {
		if (!canvas) return;
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
		canvas.width = windowWidth;
		canvas.height = windowHeight;
		initParticles(canvas.width, canvas.height);
	}

	function onMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		resize();
		mouseX = window.innerWidth / 2;
		mouseY = window.innerHeight / 2;
		window.addEventListener('resize', resize);
		window.addEventListener('mousemove', onMouseMove);
		animate();

		return () => {
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', onMouseMove);
			cancelAnimationFrame(animationFrameId);
		};
	});
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
	canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 0;
		pointer-events: none;
		user-select: none;
		background: var(--bg-color, #0a0a0a);
	}
</style>
