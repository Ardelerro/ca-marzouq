<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
  export let projects: { name: string; description: string; link: string; technologies: string[] }[];
	let sectionRef: HTMLElement;

	onMount(async () => {
		const { default: gsap } = await import('gsap');
		const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
		gsap.registerPlugin(ScrollTrigger);
		gsap.utils.toArray('.project-card').forEach((card: any, index: number) => {
			gsap.fromTo(
				card,
				{ opacity: 0, y: 40 },
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					delay: index * 0.1,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: card,
						start: 'top 80%',
						toggleActions: 'play none none none'
					}
				}
			);
		});
	});
</script>

<section id="projects" class="projects-section" bind:this={sectionRef}>
	<h2>Projects</h2>
	<div class="grid-container">
		{#each projects as project, index (project.name)}
			<ProjectCard
				name={project.name}
				description={project.description}
				link={project.link}
				technologies={project.technologies}
				{index}
			/>
		{/each}
	</div>
</section>

<style>
	.projects-section {
		padding: 2rem;
		max-width: 1600px;
		margin: auto;
		padding-top: 65px;
	}

	h2 {
		color: white;
		font-size: 2rem;
		margin-bottom: 1.5rem;
	}

	.grid-container {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
		justify-content: center;
	}

	@media (min-width: 640px) {
		.grid-container {
			grid-template-columns: repeat(2, 1fr);
			justify-content: center;
		}
		.projects-section {
			padding-top: 5px;
		}
	}

	@media (min-width: 1024px) {
		.grid-container {
			grid-template-columns: repeat(3, 1fr);
			justify-content: center;
		}
	}
</style>
