<script lang="ts">
	import { onMount } from 'svelte';

	let container: HTMLDivElement;
	let headline: HTMLHeadingElement;
	let subtext: HTMLParagraphElement;
	let cta: HTMLButtonElement;
	let arrowContainer: HTMLDivElement;

	onMount(async () => {
		const { default: gsap } = await import('gsap');
		const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
		gsap.registerPlugin(ScrollTrigger);

		const text = 'Hi, I am Marzouq';
		headline.textContent = '';

		const tl = gsap.timeline();

		for (let i = 0; i <= text.length; i++) {
			tl.to(headline, {
				duration: 0.05,
				textContent: text.slice(0, i),
				ease: 'none',
				onUpdate() {
					headline.textContent = text.slice(0, i);
				}
			});
		}

		tl.from(subtext, { y: 30, opacity: 0, duration: 1 }, '>0.2').from(
			cta,
			{ scale: 0.9, opacity: 0, duration: 1 },
			'<0.2'
		);

		gsap.to(arrowContainer, {
			y: 30,
			repeat: -1,
			yoyo: true,
			ease: 'power1.inOut',
			duration: 1
		});
	});
</script>

<div bind:this={container} class="hero">
	<div class="inner">
		<h1 bind:this={headline}></h1>
		<p bind:this={subtext}>
			Software engineer with a love for embedded systems, graphics, and elegant architecture.
		</p>
		<a href="#contact">
			<button bind:this={cta} class="cta"> Let’s Get in Touch → </button>

			<div bind:this={arrowContainer} class="scroll-indicator">
				<svg
					width="24"
					height="48"
					viewBox="0 0 24 48"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4 12L12 20L20 12"
						stroke="white"
						stroke-width="4"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M4 28L12 36L20 28"
						stroke="white"
						stroke-width="4"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</a>
	</div>
</div>

<style>
	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 4rem 1rem;
		background: linear-gradient(to bottom, rgba(10, 10, 10, 0.65), rgba(10, 10, 10, 0.45));
		position: relative;
		overflow: hidden;
		text-align: center;
		box-sizing: border-box;
	}

	.inner {
		max-width: 900px;
		margin: 0 auto;
		z-index: 1;
		padding: 0 1rem;
	}

	h1 {
		font-size: clamp(2.2rem, 6vw, 5rem);
		line-height: 1.1;
		font-weight: 700;
		color: white;
		margin-bottom: 1rem;
		white-space: normal;
		overflow: hidden;
	}

	p {
		font-size: 1.25rem;
		color: #d1d5db;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.cta {
		padding: 0.75rem 1.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		border: none;
		background-color: var(--accent, #38bdf8);
		color: black;
		border-radius: 0.5rem;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			background-color 0.3s ease;
	}

	.cta:hover {
		transform: scale(1.05);
		background-color: #0ea5e9;
	}

	.scroll-indicator {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1;
		opacity: 0.75;
		pointer-events: none;
	}

	.scroll-indicator svg {
		display: block;
		width: 24px;
		height: 48px;
	}

	@media (max-width: 600px) {
		.hero {
			padding: 3rem 1rem 6rem;
		}

		h1 {
			font-size: 2rem;
			white-space: normal;
		}

		p {
			font-size: 1rem;
			margin-bottom: 1.5rem;
		}

		.cta {
			font-size: 1rem;
			padding: 0.6rem 1.2rem;
		}

		.scroll-indicator {
			bottom: 1.5rem;
		}
	}
</style>
