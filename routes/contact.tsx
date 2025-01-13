import { Head } from "$fresh/runtime.ts";

export default function ContactPage() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <Head>
        <title>Contact - Retro Ranker</title>
      </Head>
      
      <h1 class="text-4xl font-bold mb-6">Get in Touch</h1>
      
      <div>
        <section>
          <h2 class="text-2xl font-semibold mb-3">Support My Work</h2>
          <p class="mb-4">
            If you find Retro Ranker helpful and want to support its development,
            you can buy me a coffee or contribute to the project.
          </p>
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <a 
              href="https://ko-fi.com/yourname" 
              target="_blank"
              class="small-card"
              style="text-decoration: none;"
            >
              <i class="ph ph-coffee text-4xl"></i>
              <span>Buy me a coffee</span>
            </a>
            <a 
              href="https://github.com/yourusername" 
              target="_blank"
              class="small-card"
              style="text-decoration: none;"
            >
              <i class="ph ph-github-logo text-4xl"></i>
              <span>GitHub</span>
            </a>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">My Other Projects</h2>
          <ul class="list-disc list-inside space-y-2">
            <li>
              <a href="https://portfolio.nergy.space" target="_blank" class="text-primary">
                Portfolio
              </a>
              - My portfolio website
            </li>
            <li>
              <a href="https://blog.nergy.space" target="_blank" class="text-primary">
                Blog
              </a>
              - My blog website
            </li>
          </ul>
        </section>

        <section class="mt-6">
          <h2 class="text-2xl font-semibold mb-3">Connect With Me</h2>
          <div class="flex gap-4">
            <a 
              href="https://twitter.com/yourusername" 
              target="_blank"
              class="small-card"
              style="text-decoration: none;"
            >
              <i class="ph ph-twitter-logo text-4xl"></i>
              <span>Twitter</span>
            </a>
            <a 
              href="https://linkedin.com/in/yourusername" 
              target="_blank"
              class="small-card"
              style="text-decoration: none;"
            >
              <i class="ph ph-linkedin-logo text-4xl"></i>
              <span>LinkedIn</span>
            </a>
            <a 
              href="mailto:your@email.com" 
              class="small-card"
              style="text-decoration: none;"
            >
              <i class="ph ph-envelope-simple text-4xl"></i>
              <span>Email</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
