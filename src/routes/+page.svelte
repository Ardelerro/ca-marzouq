<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import Projects from '$lib/components/Projects.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import AboutMe from '$lib/components/AboutMe.svelte';
  import Footer from '$lib/components/Footer.svelte';
  export let data;
  const { projects, bio } = data;
</script>

<Hero hero={bio['hero']} />
<AboutMe aboutMe={bio['about-me']} />
<Projects {projects}/>
<ContactForm />
<Footer links={bio['links']} />
