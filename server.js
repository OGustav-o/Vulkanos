import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Inicialização do Cliente Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para buscar projetos
app.get('/api/projects', async (req, res) => {
  // CORS headers para permitir acesso do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const result = await db.execute('SELECT * FROM projects ORDER BY id DESC');
    res.json(result.rows || []);
  } catch (err) {
    console.error('Erro ao buscar projetos no Turso:', err);
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});

// Rota raiz para o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tratamento de 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Exportação obrigatória para a Vercel funcionar com Express
export default app;