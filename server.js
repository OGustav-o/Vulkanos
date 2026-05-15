import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const dbPath = path.join(process.cwd(), 'portfolio.db');
const db = new sqlite3.Database(dbPath);

// Cria a tabela e insere dados falsos se estiver vazia
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY, 
      title TEXT NOT NULL, 
      tech TEXT NOT NULL,
      description TEXT
    )`,
  );
  
  db.get('SELECT COUNT(*) as count FROM projects', (err, row) => {
    if (err) {
      console.error('Erro ao verificar projetos:', err);
      return;
    }

    if (row.count === 0) {
      const projects = [
        {
          title: 'Sistema de Gestão Industrial',
          tech: 'Node.js, SQLite, Express',
          description: 'Plataforma robusta para gerenciamento de processos industriais com interface intuitiva e relatórios em tempo real.',
        },
        {
          title: 'API Gateway Financeiro',
          tech: 'Express, JavaScript, RESTful',
          description: 'Gateway de pagamentos seguro com integração de múltiplos provedores e validação de transações.',
        },
        {
          title: 'Dashboard Analítico',
          tech: 'Node.js, SQLite, Vanilla JS',
          description: 'Dashboard responsivo com visualização de dados em tempo real e gráficos interativos.',
        },
        {
          title: 'Microserviço de Autenticação',
          tech: 'Express, JWT, SQLite',
          description: 'Serviço de autenticação escalável com suporte a OAuth2 e gerenciamento de sessões.',
        },
      ];

      projects.forEach(project => {
        db.run(
          'INSERT INTO projects (title, tech, description) VALUES (?, ?, ?)',
          [project.title, project.tech, project.description],
          (err) => {
            if (err) {
              console.error('Erro ao inserir projeto:', err);
            }
          },
        );
      });

      console.log('✅ Projetos iniciais inseridos no banco de dados');
    }
  });
});

// Serve a pasta public para o navegador
app.use(express.static(path.join(__dirname, 'public')));

// Rota que entrega os dados do SQLite para o Frontend
app.get('/api/projects', (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  db.all('SELECT * FROM projects ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar projetos:', err);
      return res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
    res.json(rows || []);
  });
});

// Rota raiz redireciona para index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

export default app;
/*
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     🌋 VULKANOS - SOFTWARE HOUSE      ║
║                                        ║
║  Servidor rodando em:                 ║
║  http://localhost:${PORT}                  ║
║                                        ║
║  API: http://localhost:${PORT}/api/projects ║
╚════════════════════════════════════════╝
  `);
});
*/