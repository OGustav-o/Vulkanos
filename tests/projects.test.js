import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@libsql/client";
import {
  mergeProjects,
  filterProjects,
  safeUrl,
} from "../public/project-utils.js";

test("mescla catálogo com dados legados, sem duplicar títulos ou aceitar registros inválidos", () => {
  const result = mergeProjects(
    [
      {
        title: " Gestão ",
        description: "Texto revisado",
        tech: ["React"],
        category: "Web",
      },
    ],
    [
      { title: "gestao", description: "Texto antigo" },
      { title: "Outro", tech: "Node.js, SQLite" },
      null,
      { title: 12 },
    ],
  );
  assert.equal(result.length, 2);
  assert.equal(result[0].description, "Texto revisado");
  assert.deepEqual(result[1].tech, ["Node.js", "SQLite"]);
  assert.equal(result[1].category, "Outros projetos");
});

test("busca sem acentos combina tecnologia, palavras e categoria", () => {
  const projects = mergeProjects([
    { title: "Gestão", category: "Indústria", tech: ["Node.js"] },
    { title: "Site", category: "Web", tech: ["React"] },
  ]);
  assert.equal(filterProjects(projects, "GESTAO node", "Indústria").length, 1);
  assert.equal(filterProjects(projects, "gestao", "Web").length, 0);
  assert.equal(filterProjects(projects, "", "Todos").length, 2);
  assert.equal(filterProjects(projects, "inexistente", "Todos").length, 0);
});

test("somente URLs externas HTTP/HTTPS sem credenciais são aceitas", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "/relative",
    "//example.com",
    "https://user:password@example.com",
    null,
  ])
    assert.equal(safeUrl(url), null);
  assert.equal(
    safeUrl("https://github.com/OGustav-o"),
    "https://github.com/OGustav-o",
  );
  assert.equal(
    mergeProjects([
      { title: "<img onerror=alert(1)>", repository: "javascript:alert(1)" },
    ])[0].repository,
    null,
  );
});

test("catálogo contém MES Cydak com stack documentada e sem os projetos removidos", async () => {
  const catalog = JSON.parse(
    await readFile(new URL("../public/projects.json", import.meta.url), "utf8"),
  );
  assert.equal(
    new Set(catalog.map((project) => project.title)).size,
    catalog.length,
  );
  const mes = catalog.find((project) => project.title === "MES Cydak");
  assert.ok(mes);
  assert.ok(mes.tech.includes(".NET 10"));
  assert.ok(mes.tech.includes("Blazor Server"));
  assert.match(mes.description, /reenvio ordenado/);
  for (const title of ["CydakInsta", "Petisquinho", "Sarahismo"]) {
    assert.ok(!catalog.some((project) => project.title === title));
    assert.ok(
      !mergeProjects(catalog, [{ title: ` ${title.toUpperCase()} ` }]).some(
        (project) => project.title.toLowerCase() === title.toLowerCase(),
      ),
    );
  }
});

test("API e arquivos funcionam sem Turso; falha remota preserva catálogo; métodos e 404 corretos", async (t) => {
  const oldUrl = process.env.TURSO_DATABASE_URL;
  const oldToken = process.env.TURSO_AUTH_TOKEN;
  delete process.env.TURSO_DATABASE_URL;
  delete process.env.TURSO_AUTH_TOKEN;
  const { default: app } = await import("../server.js");
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const folder = await mkdtemp(path.join(tmpdir(), "vulkanos-test-"));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(folder, {
      recursive: true,
      force: true,
      maxRetries: 8,
      retryDelay: 150,
    });
    if (oldUrl === undefined) delete process.env.TURSO_DATABASE_URL;
    else process.env.TURSO_DATABASE_URL = oldUrl;
    if (oldToken === undefined) delete process.env.TURSO_AUTH_TOKEN;
    else process.env.TURSO_AUTH_TOKEN = oldToken;
  });
  const response = await fetch(`${base}/api/projects`);
  assert.equal(response.status, 200);
  const projects = await response.json();
  assert.ok(projects.some((project) => project.title === "MES Cydak"));
  assert.equal(
    (await fetch(`${base}/api/projects`, { method: "POST" })).status,
    405,
  );
  assert.equal(
    (await fetch(`${base}/api/projects`, { method: "OPTIONS" })).status,
    204,
  );
  assert.equal(
    (await fetch(`${base}/api/projects`, { method: "HEAD" })).status,
    200,
  );
  for (const file of [
    "/",
    "/app.js",
    "/project-utils.js",
    "/projects.json",
    "/style.css",
    "/logo.png",
    "/downloads/curriculo-gustavo-melo.pdf",
    "/downloads/curriculo-gustavo-melo.docx",
  ])
    assert.equal((await fetch(`${base}${file}`)).status, 200, file);
  assert.equal((await fetch(`${base}/missing.js`)).status, 404);
  assert.equal((await fetch(`${base}/package.json`)).status, 404);
  const pdfResponse = await fetch(
    `${base}/downloads/curriculo-gustavo-melo.pdf`,
  );
  assert.match(pdfResponse.headers.get("content-type"), /application\/pdf/);
  assert.equal(
    Buffer.from(await pdfResponse.arrayBuffer())
      .subarray(0, 5)
      .toString(),
    "%PDF-",
  );
  const docxResponse = await fetch(
    `${base}/downloads/curriculo-gustavo-melo.docx`,
  );
  assert.equal(
    Buffer.from(await docxResponse.arrayBuffer())
      .subarray(0, 2)
      .toString(),
    "PK",
  );
  // Base temporária sem tabela: falha de consulta real, sem rede ou credenciais.
  process.env.TURSO_DATABASE_URL = pathToFileURL(
    path.join(folder, "empty.db"),
  ).href;
  const { getProjects } = await import(
    `../lib/projects.js?failure=${Date.now()}`
  );
  assert.deepEqual(await getProjects(), projects);
  // Base temporária com dados remotos: acrescenta novos títulos e preserva os revisados.
  const db = createClient({ url: process.env.TURSO_DATABASE_URL });
  await db.execute(
    "CREATE TABLE projects (id INTEGER PRIMARY KEY, title TEXT, tech TEXT, description TEXT)",
  );
  await db.execute({
    sql: "INSERT INTO projects VALUES (1, ?, ?, ?)",
    args: ["Projeto remoto", "Node.js, SQLite", "Descrição remota"],
  });
  await db.execute({
    sql: "INSERT INTO projects VALUES (2, ?, ?, ?)",
    args: ["MES Cydak", "Stack não validada", "Texto legado"],
  });
  const merged = await getProjects();
  assert.equal(merged.length, projects.length + 1);
  assert.equal(
    merged.find((project) => project.title === "Projeto remoto").description,
    "Descrição remota",
  );
  assert.deepEqual(
    merged.find((project) => project.title === "MES Cydak").tech,
    projects.find((project) => project.title === "MES Cydak").tech,
  );
  db.close();
});
