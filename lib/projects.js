import { readFile } from "node:fs/promises";
import { createClient } from "@libsql/client";
import { mergeProjects } from "../public/project-utils.js";

export async function getProjects() {
  const local = JSON.parse(
    await readFile(new URL("../public/projects.json", import.meta.url), "utf8"),
  );
  if (!process.env.TURSO_DATABASE_URL) return mergeProjects(local);
  let db;
  try {
    db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const result = await db.execute("SELECT * FROM projects ORDER BY id DESC");
    return mergeProjects(local, result.rows);
  } catch {
    console.warn("Catálogo remoto indisponível; usando os projetos locais.");
    return mergeProjects(local);
  } finally {
    db?.close();
  }
}
