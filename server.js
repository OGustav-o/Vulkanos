const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("./portfolio.db");

// Cria a tabela e insere dados falsos se estiver vazia
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, title TEXT, tech TEXT)`,
  );
  db.get("SELECT COUNT(*) as count FROM projects", (err, row) => {
    if (row.count === 0) {
      db.run(
        "INSERT INTO projects (title, tech) VALUES ('Sistema de Gestão Industrial', 'Node.js, SQLite')",
      );
      db.run(
        "INSERT INTO projects (title, tech) VALUES ('API Gateway Financeiro', 'Express, JavaScript')",
      );
    }
  });
});

// Serve a pasta public para o navegador
app.use(express.static(path.join(__dirname, "public")));

// Rota que entrega os dados do SQLite para o Frontend
app.get("/api/projects", (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000"),
);
