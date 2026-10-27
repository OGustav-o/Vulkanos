import { getProjects } from "../lib/projects.js";

export default async function handler(req, res) {
  res.setHeader("Allow", "GET, HEAD, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!["GET", "HEAD"].includes(req.method))
    return res.status(405).json({ error: "Método não permitido." });
  try {
    const projects = await getProjects();
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.status(200).json(projects);
  } catch {
    return res
      .status(500)
      .json({ error: "Não foi possível carregar os projetos." });
  }
}
