/**
 * Vulkanos Portfolio App
 * Gerencia carregamento de projetos e interatividade da página
 */

// Configuração da API
const API_BASE = '/api';

// Estado da aplicação
const appState = {
  projects: [],
  isLoading: true,
  error: null,
};

/**
 * Inicializa a aplicação
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupScrollBehavior();
  setupSmoothScroll();
});

/**
 * Inicializa a aplicação
 */
async function initializeApp() {
  try {
    await loadProjects();
    renderProjects();
    setupIntersectionObserver();
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
    showError();
  }
}

/**
 * Carrega projetos da API
 */
async function loadProjects() {
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');

  try {
    appState.isLoading = true;
    
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    appState.projects = Array.isArray(data) ? data : [];
    appState.error = null;

    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
    appState.error = error.message;
    appState.projects = [];

    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    if (errorElement) {
      errorElement.style.display = 'block';
    }

    throw error;
  } finally {
    appState.isLoading = false;
  }
}

/**
 * Renderiza os projetos na página
 */
function renderProjects() {
  const projectsContainer = document.getElementById('projetos');

  if (!projectsContainer) {
    console.error('Container de projetos não encontrado');
    return;
  }

  // Se não há projetos, mostra mensagem
  if (appState.projects.length === 0) {
    projectsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="color: var(--text-muted); font-size: 1.1rem;">
          Nenhum projeto cadastrado no banco de dados.
        </p>
      </div>
    `;
    return;
  }

  // Renderiza cada projeto como um card
  const cardsHTML = appState.projects
    .map((projeto, index) => createProjectCard(projeto, index))
    .join('');

  projectsContainer.innerHTML = cardsHTML;

  // Adiciona animação aos cards
  const cards = projectsContainer.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

/**
 * Cria um card de projeto
 */
function createProjectCard(projeto, index) {
  const { title, tech, description } = projeto;

  // Processa as tags de tecnologia
  const tags = (tech || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`)
    .join('');

  const projectDescription = description || 'Descrição não disponível.';

  return `
    <div class="card" data-project-id="${index}">
      <h3>${escapeHtml(title || 'Projeto sem título')}</h3>
      <p class="desc">${escapeHtml(projectDescription)}</p>
      <div class="tech-tags">
        ${tags}
      </div>
    </div>
  `;
}

/**
 * Escapa caracteres HTML para evitar XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Configura o comportamento de scroll
 */
function setupScrollBehavior() {
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';

    // Determina qual seção está visível
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 200) {
        currentSection = section.getAttribute('id');
      }
    });

    // Atualiza o link ativo na navegação
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * Configura scroll suave para links de âncora
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Ignora links vazios
      if (href === '#') return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

/**
 * Configura Intersection Observer para animações ao entrar na viewport
 */
function setupIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    }
  );

  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(card);
  });
}

/**
 * Mostra mensagem de erro
 */
function showError() {
  const errorElement = document.getElementById('error');
  const loadingElement = document.getElementById('loading');
  const projectsContainer = document.getElementById('projetos');

  if (loadingElement) {
    loadingElement.style.display = 'none';
  }

  if (errorElement) {
    errorElement.style.display = 'block';
  }

  if (projectsContainer) {
    projectsContainer.innerHTML = '';
  }
}

/**
 * Função para recarregar projetos (útil para desenvolvimento)
 */
window.reloadProjects = async function () {
  console.log('Recarregando projetos...');
  try {
    await loadProjects();
    renderProjects();
    console.log('Projetos recarregados com sucesso');
  } catch (error) {
    console.error('Erro ao recarregar projetos:', error);
  }
};

// Expõe o estado da aplicação para debug
window.appState = appState;
