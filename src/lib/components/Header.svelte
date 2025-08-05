<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let headerEl: HTMLElement;

  onMount(() => {
    gsap.from(headerEl, {
      y: -80,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    });

    const shrinkOnScroll = () => {
      if (window.scrollY > 50) {
        headerEl.classList.add('scrolled');
      } else {
        headerEl.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', shrinkOnScroll);
    return () => window.removeEventListener('scroll', shrinkOnScroll);
  });
</script>

<header bind:this={headerEl} class="header">
  <div class="container">
    <div class="logo">Marzouq Mohsin</div>
    <nav class="nav">
      <a href="#about">About</a>
      <a href="#projects">Projects</a>
      <a href="#contact">Contact</a>
    </nav>
  </div>
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
    background: rgba(10, 10, 10, 0.7);
    border-bottom: 1px solid transparent;
  }

  .header.scrolled {
    background: rgba(10, 10, 10, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.08);
    padding: 0.5rem 0;
  }

  .container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent, #38bdf8);
    letter-spacing: -0.5px;
    user-select: none;
  }

  .nav {
    display: flex;
    gap: 2rem;
  }

  .nav a {
    font-size: 1rem;
    color: #f9fafb;
    text-decoration: none;
    position: relative;
    transition: color 0.2s ease;
  }

  .nav a::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 0%;
    height: 2px;
    background: var(--accent, #38bdf8);
    transition: width 0.3s ease;
  }

  .nav a:hover {
    color: var(--accent, #38bdf8);
  }

  .nav a:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    .nav {
      display: none;
    }
  }
</style>
