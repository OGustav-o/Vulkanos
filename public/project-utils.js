export function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function safeUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function normalizeProject(project) {
  if (!project || typeof project.title !== "string" || !project.title.trim())
    return null;
  const tech = Array.isArray(project.tech)
    ? project.tech
    : String(project.tech ?? "").split(",");
  return {
    title: project.title.trim(),
    category:
      typeof project.category === "string" && project.category.trim()
        ? project.category.trim()
        : "Outros projetos",
    description:
      typeof project.description === "string" && project.description.trim()
        ? project.description.trim()
        : "Conheça mais sobre este projeto entrando em contato.",
    tech: tech
      .filter((value) => typeof value === "string" && value.trim())
      .map((value) => value.trim()),
    repository: safeUrl(project.repository),
    demo: safeUrl(project.demo),
  };
}

export function mergeProjects(local, remote = []) {
  const projects = new Map();
  // Remoções editoriais também se aplicam aos registros legados do banco.
  const excluded = new Set(["cydakinsta", "petisquinho", "sarahismo"]);
  for (const item of [
    ...(Array.isArray(local) ? local : []),
    ...(Array.isArray(remote) ? remote : []),
  ]) {
    const project = normalizeProject(item);
    if (!project) continue;
    const key = normalizeText(project.title);
    if (excluded.has(key)) continue;
    // O catálogo revisado tem prioridade sobre descrições antigas do banco.
    if (!projects.has(key)) projects.set(key, project);
  }
  return [...projects.values()];
}

export function filterProjects(projects, query, category) {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  return projects.filter((project) => {
    const text = normalizeText(
      [project.title, project.description, ...project.tech].join(" "),
    );
    return (
      (!category || category === "Todos" || project.category === category) &&
      terms.every((term) => text.includes(term))
    );
  });
}
