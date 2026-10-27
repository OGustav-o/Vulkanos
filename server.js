import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import handler from "./api/projects.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.disable("x-powered-by");
app.all("/api/projects", handler);
app.use(express.static(path.join(directory, "public")));
app.use((req, res) =>
  res.status(404).type("text").send("Página não encontrada."),
);

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`Vulkanos disponível em http://localhost:${port}`),
  );
}

export default app;
