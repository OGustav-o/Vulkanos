import { filterProjects, mergeProjects } from "./project-utils.js";

const state = { projects: [], query: "", category: "Todos" };
const grid = document.getElementById("projetos");
const count = document.getElementById("project-count");
const search = document.getElementById("project-search");
const filters = document.getElementById("filters");
const errorPanel = document.getElementById("error");
const emptyPanel = document.getElementById("empty-state");
const notice = document.getElementById("project-notice");
const retry = document.getElementById("retry-projects");

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function projectCard(project, index) {
  const card = element("article", "project-card");
  const top = element("div", "card-top");
  top.append(
    element("span", "card-category", project.category),
    element("span", "card-index", String(index + 1).padStart(2, "0")),
  );
  card.append(
    top,
    element("h3", "", project.title),
    element("p", "project-description", project.description),
  );
  if (project.tech.length) {
    const tags = element("ul", "tags");
    tags.setAttribute("aria-label", "Tecnologias");
    for (const tech of project.tech) tags.append(element("li", "", tech));
    card.append(tags);
  }
  const links = element("div", "card-links");
  for (const [url, label] of [
    [project.repository, "Código no GitHub"],
    [project.demo, "Abrir projeto"],
  ]) {
    if (!url) continue;
    const link = element("a", "", `${label} ↗`);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute(
      "aria-label",
      `${label}: ${project.title} (abre em nova aba)`,
    );
    links.append(link);
  }
  if (links.childElementCount) card.append(links);
  return card;
}

function renderProjects() {
  const visible = filterProjects(state.projects, state.query, state.category);
  grid.replaceChildren(
    ...visible.map((project) =>
      projectCard(project, state.projects.indexOf(project)),
    ),
  );
  count.textContent = `${visible.length} de ${state.projects.length} projetos`;
  emptyPanel.hidden = visible.length > 0 || state.projects.length === 0;
  for (const button of filters.querySelectorAll("button"))
    button.setAttribute(
      "aria-pressed",
      String(button.textContent === state.category),
    );
}

function renderFilters() {
  const categories = [
    "Todos",
    ...new Set(state.projects.map((project) => project.category)),
  ];
  if (!categories.includes(state.category)) state.category = "Todos";
  filters.replaceChildren(
    ...categories.map((category) => {
      const button = element("button", "filter", category);
      button.type = "button";
      button.setAttribute("aria-pressed", String(category === state.category));
      button.addEventListener("click", () => {
        state.category = category;
        renderProjects();
      });
      return button;
    }),
  );
}

async function fetchProjects(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Catálogo indisponível");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Formato de catálogo inválido");
    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function loadProjects() {
  retry.disabled = true;
  errorPanel.hidden = true;
  notice.hidden = true;
  grid.setAttribute("aria-busy", "true");
  count.textContent = "Carregando projetos…";
  let local = [];
  // As duas fontes começam juntas; o catálogo local aparece sem aguardar o banco.
  const remoteRequest = fetchProjects("/api/projects", 5000).then(
    (data) => ({ data }),
    () => ({ data: [], failed: true }),
  );
  try {
    local = await fetchProjects("/projects.json", 5000);
    state.projects = mergeProjects(local);
    if (state.projects.length) {
      renderFilters();
      renderProjects();
      document.querySelector(".project-toolbar").hidden = false;
    }
  } catch {
    /* A API ainda pode fornecer o catálogo completo. */
  }
  const remote = await remoteRequest;
  state.projects = mergeProjects(local, remote.data);
  if (state.projects.length) {
    renderFilters();
    renderProjects();
    document.querySelector(".project-toolbar").hidden = false;
    if (remote.failed) {
      notice.textContent =
        "Exibindo o catálogo local. As atualizações online estão temporariamente indisponíveis.";
      notice.hidden = false;
    }
  } else {
    count.textContent = "Catálogo indisponível";
    errorPanel.hidden = false;
    document.querySelector(".project-toolbar").hidden = true;
    grid.replaceChildren();
  }
  grid.setAttribute("aria-busy", "false");
  retry.disabled = false;
}

search.addEventListener("input", () => {
  state.query = search.value;
  renderProjects();
});
document.getElementById("clear-filters").addEventListener("click", () => {
  state.query = "";
  state.category = "Todos";
  search.value = "";
  renderProjects();
  search.focus();
});
retry.addEventListener("click", loadProjects);

const printButton = document.getElementById("print-profile");
printButton.hidden = false;
printButton.addEventListener("click", () => window.print());
window.addEventListener("beforeprint", () => {
  grid.replaceChildren(...state.projects.map(projectCard));
});
window.addEventListener("afterprint", renderProjects);
document.getElementById("year").textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.getElementById("main-nav");
const mobile = window.matchMedia("(max-width: 700px)");
function setMenu(open) {
  navigation.hidden = mobile.matches && !open;
  menuButton.setAttribute("aria-expanded", String(open));
}
function syncMenu() {
  menuButton.hidden = !mobile.matches;
  setMenu(false);
}
menuButton.addEventListener("click", () =>
  setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
);
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobile.matches && !navigation.hidden) {
    setMenu(false);
    menuButton.focus();
  }
});
mobile.addEventListener("change", syncMenu);
syncMenu();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of navigation.querySelectorAll("a")) {
          if (link.hash === `#${entry.target.id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("main > section")
    .forEach((section) => observer.observe(section));
}

loadProjects();
