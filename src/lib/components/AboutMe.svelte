<script lang="ts">
	import { onMount } from 'svelte';

	let section: HTMLElement;
	let heading: HTMLHeadingElement;
	let paragraphs: NodeListOf<HTMLParagraphElement>;

	onMount(async () => {
		const { default: gsap } = await import('gsap');
		const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
		gsap.registerPlugin(ScrollTrigger);

		paragraphs = section.querySelectorAll('p');

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: 'top 80%'
			}
		});

		tl.from(heading, {
			y: 40,
			opacity: 0,
			duration: 0.8,
			ease: 'power2.out'
		});

		tl.from(
			paragraphs,
			{
				y: 30,
				opacity: 0,
				duration: 0.6,
				ease: 'power2.out',
				stagger: 0.15
			},
			'<0.2'
		);
	});
</script>

<section id="about" aria-labelledby="contact-heading" class="about-section" bind:this={section}>
	<h1 id="contact-heading" bind:this={heading}>Hi there!</h1>
	<p>
		I’m <span class="highlight">Marzouq Mohsin</span>, a Software Engineer studying Electrical
		Engineering & Computer Science at Western University.
	</p>
	<p>When I’m not coding, you’ll catch me gaming, at the gym, or bluffing my friends at poker.</p>
	<p>Enough about me, here’s some of my work below:</p>
</section>

<style>
	.about-section {
		padding: 2rem;
		max-width: 1000px;
		margin: auto;
		color: white;
		border-radius: 12px;
		padding-top: 65px;
	}

	h1 {
		margin-top: 50px;
		font-weight: 700;
		font-size: 2.25rem;
		margin-bottom: 1rem;
		color: #1a73e8;
	}

	p {
		font-size: 1.125rem;
		margin-bottom: 1rem;
	}

	.highlight {
		font-weight: 600;
		color: #1a73e8;
	}

	@media (max-width: 480px) {
		section {
			padding: 0 0.5rem;
		}

		h1 {
			font-size: 1.75rem;
		}

		p {
			font-size: 1rem;
		}
	}
</style>
