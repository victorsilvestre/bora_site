// BORA Soluções Esportivas — Main JS
// Loads all HTML components, injects them, then wires up interactivity.

const COMPONENTS = [
  'hero',
  'sobre',
  'missao-visao-valores',
  'produtos-servicos',
  'cases',
  'clientes',
  'feedback',
  'midia',
  'app',
  'trabalhe',
  'faq',
  'footer',
];

async function loadComponents() {
  const app = document.getElementById('app');
  if (!app) return;

  for (const name of COMPONENTS) {
    try {
      const res = await fetch(`./components/${name}.html`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      app.appendChild(wrapper);
    } catch (err) {
      console.warn(`[BORA] Could not load component "${name}":`, err.message);
    }
  }

  initNav();
  initFAQ();
}

// ---- NAV: mobile toggle ----
function initNav() {
  const toggle    = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close mobile nav when a link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---- FAQ: accordion ----
function initFAQ() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded   = trigger.getAttribute('aria-expanded') === 'true';
      const contentId  = trigger.getAttribute('aria-controls');
      const content    = contentId ? document.getElementById(contentId) : null;

      // Close all
      triggers.forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        const id = t.getAttribute('aria-controls');
        if (id) document.getElementById(id)?.classList.remove('is-open');
      });

      // Open this one if it was closed
      if (!expanded && content) {
        trigger.setAttribute('aria-expanded', 'true');
        content.classList.add('is-open');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', loadComponents);
