/* global Fuse */
// BORA Soluções Esportivas — Main JS
// Loads all HTML components, injects them, then wires up interactivity.

const COMPONENTS = [
  'hero',
  'sobre',
  'missao-visao-valores',
  'produtos-servicos',
  'planos',
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
      const res = await fetch(`./components/${name}.html`, { cache: 'no-store' });
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
  initSearch();
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

// ---- SEARCH ----
function initSearch() {
  if (typeof Fuse === 'undefined') {
    console.warn('[BORA] Fuse.js not loaded — search disabled.');
    return;
  }

  const SEARCH_INDEX = [
    {
      title: 'Sobre o BORA',
      subtitle: 'Nossa história, quem somos e o que fazemos',
      anchor: '#sobre',
      keywords: 'quem somos história empresa 2018 futebol amador atleta amador origem fundação',
    },
    {
      title: 'Missão, Visão e Valores',
      subtitle: 'Propósito, visão de futuro e valores institucionais',
      anchor: '#missao',
      keywords: 'missão visão valores ética transparência responsabilidade social pioneiro tecnologia jornalismo entretenimento propósito',
    },
    {
      title: 'Produtos e Serviços',
      subtitle: 'Organização de campeonatos, cobertura, transmissão e fotografia',
      anchor: '#servicos',
      keywords: 'serviços produtos organização campeonato cobertura esportiva transmissão ao vivo fotografia esportiva melhores momentos gols clipes vídeo filmagem jornalismo',
    },
    {
      title: 'Planos de Contratação',
      subtitle: 'Plano Aplicativo, Transmissão + Cobertura e Aplicativo Exclusivo',
      anchor: '#planos',
      keywords: 'planos preço quanto custa orçamento contratação aplicativo transmissão cobertura exclusivo boletim tabela artilharia regulamento estatísticas gestão comercial',
    },
    {
      title: 'Clientes',
      subtitle: 'Organizações e campeonatos atendidos pelo BORA',
      anchor: '#clientes',
      keywords: 'clientes quem confia ALIFA APCEF ASBAC ASSEJUS Louveira Minas Brasília campeonatos jogos atletas impactados cidades depoimentos parceiros patrocinadores',
    },
    {
      title: 'Feedback e Depoimentos',
      subtitle: 'O que atletas e organizadores dizem sobre o BORA',
      anchor: '#feedback',
      keywords: 'feedback depoimentos avaliações opinião atletas organizadores satisfação experiência',
    },
    {
      title: 'BORA na Mídia',
      subtitle: 'Entrevistas e matérias em Globo, CBN, Metrópoles e mais',
      anchor: '#midia',
      keywords: 'mídia imprensa Globo CBN Metrópoles Rádio Alternativa DF Esportes entrevista matéria notícia televisão rádio',
    },
    {
      title: 'BORA App',
      subtitle: 'Aplicativo para campeonatos, estatísticas e classificações',
      anchor: '#bora-app',
      keywords: 'app aplicativo celular smartphone baixar App Store Google Play campeonatos estatísticas classificações tabela',
    },
    {
      title: 'Trabalhe Conosco',
      subtitle: 'Vagas abertas: repórter, editor, operador e mais',
      anchor: '#trabalhe',
      keywords: 'vagas emprego trabalhe conosco repórter esportivo editor vídeo operador mesa de corte produtor conteúdo freelancer narrador árbitro jornalismo esportivo renda extra faculdade candidatura',
    },
    {
      title: 'Perguntas Frequentes',
      subtitle: 'Dúvidas sobre serviços, preços, cidades e campeonatos',
      anchor: '#faq',
      keywords: 'perguntas frequentes FAQ dúvidas quanto custa preço cidades Brasília Goiânia São Paulo Campinas Louveira Salvador Luziânia futebol tênis beach tennis tipos campeonatos',
    },
  ];

  const fuse = new Fuse(SEARCH_INDEX, {
    keys: ['title', 'subtitle', 'keywords'],
    threshold: 0.4,
    minMatchCharLength: 2,
    ignoreLocation: true,
    includeScore: true,
  });

  const searchBtn       = document.getElementById('search-btn');
  const searchBtnMobile = document.getElementById('search-btn-mobile');
  const searchPanel     = document.getElementById('search-panel');
  const searchInput     = document.getElementById('search-input');
  const searchResults   = document.getElementById('search-results');
  const searchClose     = document.getElementById('search-close');

  if (!searchBtn || !searchPanel || !searchInput) return;

  function openSearch() {
    searchPanel.classList.add('is-open');
    requestAnimationFrame(() => searchInput.focus());
  }

  function closeSearch() {
    searchPanel.classList.remove('is-open');
    searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  }

  searchBtn.addEventListener('click', openSearch);

  if (searchBtnMobile) {
    searchBtnMobile.addEventListener('click', () => {
      document.getElementById('mobile-nav')?.classList.remove('is-open');
      document.getElementById('nav-toggle')?.setAttribute('aria-expanded', 'false');
      openSearch();
    });
  }

  searchClose.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
  });

  document.addEventListener('click', (e) => {
    const nav = document.getElementById('main-nav');
    if (nav && !nav.contains(e.target)) closeSearch();
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (!query) { searchResults.innerHTML = ''; return; }
    renderResults(fuse.search(query).slice(0, 5));
  });

  function renderResults(results) {
    if (!results.length) {
      searchResults.innerHTML = '<p class="search-no-results">Nenhum resultado encontrado.</p>';
      return;
    }
    searchResults.innerHTML = results.map(r => `
      <a href="${r.item.anchor}" class="search-result-item" data-anchor="${r.item.anchor}">
        <span class="search-result-title">${r.item.title}</span>
        <span class="search-result-sub">${r.item.subtitle}</span>
      </a>
    `).join('');

    searchResults.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(el.getAttribute('data-anchor'));
        closeSearch();
        if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', loadComponents);
