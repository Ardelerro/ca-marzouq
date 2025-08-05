<script lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<footer class="footer" role="contentinfo" aria-label="Site footer">
  <div class="container">
    <nav class="footer-nav" aria-label="Footer navigation">
      <ul>
        <li><a href="/#about" rel="noopener">About</a></li>
        <li><a href="/#projects" rel="noopener">Projects</a></li>
        <li><a href="/#contact" rel="noopener">Contact</a></li>
        <li><a href="https://linkedin.com/in/marzouq-mohsin-50ba3424b" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li><a href="https://github.com/ardelerro" target="_blank" rel="noopener noreferrer">GitHub</a></li>
      </ul>
    </nav>
  </div>
</footer>

<style>
  :global(body) {
    margin: 0;
  }

  .footer {
    background-color: #0a0a0a;
    color: #cbd5e1;
    padding: 2rem 1rem;
    font-size: 0.9rem;
    border-top: 1px solid #222;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .copyright {
    flex: 1 1 100%;
    text-align: center;
    margin: 0;
    color: #94a3b8;
  }

  .footer-nav ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 0;
    margin: 0;
    justify-content: center;
    flex: 1 1 100%;
  }

  .footer-nav a {
    color: #94a3b8;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .footer-nav a:hover,
  .footer-nav a:focus-visible {
    color: #38bdf8;
    outline: none;
  }

  @media (min-width: 600px) {
    .copyright {
      flex: 0 0 auto;
      text-align: left;
    }
    .footer-nav ul {
      flex: 0 0 auto;
      justify-content: flex-end;
    }
  }
</style>
