<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';

	export let name: string;
	export let description: string;
	export let link: string;
	export let technologies: string[];
	export let index: number;

	let cardRef: HTMLElement;
	let observer: IntersectionObserver;
	let hasAnimated = false;

	onMount(() => {
		gsap.set(cardRef, {
			opacity: 0,
			y: 40
		});

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						hasAnimated = true;
						gsap.to(cardRef, {
							opacity: 1,
							y: 0,
							duration: 0.8,
							delay: index * 0.15,
							ease: 'power2.out'
						});
						observer.unobserve(cardRef);
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '50px' 
			}
		);

		if (cardRef) {
			observer.observe(cardRef);
		}
	});

	onDestroy(() => {
		if (observer && cardRef) {
			observer.unobserve(cardRef);
		}
	});
</script>

<article class="project-card" bind:this={cardRef}>
	<div class="card-content">
		<div class="header-row">
			<h3 class="project-title">{name}</h3>
			<a
				class="github-link"
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="View on GitHub"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 24 24"
					class="github-icon"
				>
					<path
						d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 
          3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
          0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61
          -.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.084-.729.084-.729
          1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997
          .108-.776.418-1.305.76-1.605-2.665-.3-5.467-1.332-5.467-5.93
          0-1.31.468-2.38 1.236-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322
          3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405
          2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176
          .765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92
          .435.375.81 1.096.81 2.215 0 1.6-.015 2.885-.015 3.28
          0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297
          c0-6.627-5.373-12-12-12"
					/>
				</svg>
			</a>
			<span class="project-index">{index + 1}</span>
		</div>
		<p>{description}</p>
	</div>
	<div class="tech-grid">
		{#each technologies as tech}
			<span class="tech">{tech}</span>
		{/each}
	</div>
</article>

<style>
.project-card {
	background-color: #1e293b57;
	border: 1px solid #60a5fa;
	border-radius: 12px;
	padding: 1.5rem;
	color: white;
	position: relative;
	transition: all 0.2s ease;
	box-shadow: 0 6px 10px rgba(96, 165, 250, 0.35);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	max-width: 100%;
	min-height: 320px;
	box-sizing: border-box;
}

.card-content {
	flex-grow: 1;
}

.project-card:hover {
	background-color: #1e293bd8;
	box-shadow: 0 8px 28px rgba(96, 165, 250, 0.55);
}

.header-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
	flex-wrap: wrap;
}

.project-title {
	flex: 1;
	margin: 0;
	font-size: 1.3rem;
	word-break: break-word;
	overflow-wrap: break-word;
}

.project-index {
	font-size: 1.3rem;
	flex-shrink: 0;
	color: #60a5fa;
}

.github-link {
	flex-shrink: 0;
	opacity: 0;
	transition: opacity 0.3s ease;
	color: #60a5fa;
}

.project-card:hover .github-link {
	opacity: 1;
}

.github-icon {
	width: 24px;
	height: 24px;
}

h3,
p {
	word-break: break-word;
	overflow-wrap: break-word;
}

h3 {
	font-size: 1.3rem;
	margin: 0 0 0.5rem 0;
}

p {
	margin: 0.5rem 0 1rem;
	font-size: 1rem;
	color: #e2e8f0;
}

.tech-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	gap: 0.5rem;
	margin-top: auto;
}

.tech {
	background-color: #334155;
	padding: 0.3rem 0.75rem;
	border-radius: 8px;
	font-size: 0.875rem;
	text-align: center;
	white-space: nowrap;
	overflow-wrap: break-word;
}

@media (max-width: 600px) {
	.project-card {
		padding: 1rem;
		min-height: auto;
	}

	.project-title {
		font-size: 1.1rem;
	}

	.project-index {
		font-size: 1.1rem;
	}

	p {
		font-size: 0.95rem;
	}

	.tech-grid {
		grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
	}

	.github-icon {
		width: 20px;
		height: 20px;
	}
}

</style>