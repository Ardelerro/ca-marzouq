<script lang="ts">
	import { onMount } from 'svelte';

	let section: HTMLElement;
	let heading: HTMLHeadingElement;
	let paragraphs: NodeListOf<HTMLParagraphElement>;
	let isMobile = false;
    export let aboutMe:{name:string, occupation:string, school:string, degree:string, bio:string[]}
	onMount(() => {
		let ScrollTrigger: any;
		let handleResize: () => void;

		(async () => {
			isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			
			const { default: gsap } = await import('gsap');
			ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
			gsap.registerPlugin(ScrollTrigger);

			paragraphs = section.querySelectorAll('p');

			const animationDuration = isMobile ? 0.4 : 0.8;
			const staggerDelay = isMobile ? 0.1 : 0.15;

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					start: isMobile ? 'top 90%' : 'top 80%',
					refreshPriority: isMobile ? -1 : 0
				}
			});

			gsap.set([heading, ...paragraphs], {
				transform: 'translate3d(0,0,0)'
			});

			tl.from(heading, {
				y: isMobile ? 20 : 40,
				opacity: 0,
				duration: animationDuration,
				ease: 'power2.out'
			});

			tl.from(
				paragraphs,
				{
					y: isMobile ? 15 : 30,
					opacity: 0,
					duration: animationDuration * 0.75,
					ease: 'power2.out',
					stagger: staggerDelay
				},
				isMobile ? '<0.1' : '<0.2'
			);

			handleResize = () => {
				ScrollTrigger.refresh();
			};

			window.addEventListener('resize', handleResize);
			window.addEventListener('orientationchange', handleResize);
		})();

		return () => {
			if (handleResize) {
				window.removeEventListener('resize', handleResize);
				window.removeEventListener('orientationchange', handleResize);
			}
		};
	});
</script>

<section id="about" aria-labelledby="contact-heading" class="about-section" bind:this={section}>
	<h1 id="contact-heading" bind:this={heading}>Hi there!</h1>
	<p>
		I'm <span class="highlight">{aboutMe.name}</span>, a {aboutMe.occupation} studying {aboutMe.degree} at {aboutMe.school}.
	</p>
    {#each aboutMe.bio as aboutSection}
        <p>{aboutSection}</p>
    {/each}
</section>

<style>
.about-section {
	padding: 2rem;
	padding-top: 65px;
	max-width: 1000px;
	margin: 0 auto;
	color: white;
	border-radius: 12px;
	transform: translate3d(0, 0, 0);
	will-change: transform;
	box-sizing: border-box;
	font-smooth: always;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

h1 {
	margin-top: 50px;
	margin-bottom: 1rem;
	font-size: 2.25rem;
	font-weight: 700;
	line-height: 1.2;
	color: #1a73e8;
}

p {
	font-size: 1.125rem;
	line-height: 1.6;
	margin-bottom: 1rem;
}

.highlight {
	font-weight: 600;
	color: #60a5fa;
}


@media (max-width: 768px) {
	.about-section {
		padding: 3rem 1rem 4rem;

	}

	h1 {
		margin-top: 30px;
		font-size: 2rem;
		margin-bottom: 1.25rem;
	}

	p {
		font-size: 1.05rem;
		margin-bottom: 1.25rem;
	}
}

@media (max-width: 480px) {
	.about-section {
		padding: 3rem 1rem 3rem;

		border-radius: 8px;
	}

	h1 {
		margin-top: 20px;
		font-size: 1.75rem;
		margin-bottom: 1.25rem;
	}

	p {
		font-size: 1rem;
		line-height: 1.5;
	}
}

@media (max-width: 360px) {
	.about-section {
		padding: 3rem 1rem 2rem;
	}

	h1 {
		font-size: 1.5rem;
	}

	p {
		font-size: 0.95rem;
	}
}

@media (max-height: 500px) and (orientation: landscape) {
	.about-section {
		padding: 3rem 1rem 4rem;

	}

	h1 {
		padding: 3rem 1rem 4rem;
		margin-top: 10px;
		margin-bottom: 0.75rem;
	}

	p {
        padding: 3rem 1rem 4rem;
		margin-bottom: 0.75rem;
	}
}
</style>