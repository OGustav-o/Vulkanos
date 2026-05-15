import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Dados de fallback caso o SQLite falhe no ambiente serverless
  const fallbackProjects = [
    {
      id: 1,
      title: 'Sistema de Gestão Industrial',
      tech: 'Node.js, SQLite, Express',
      description: 'Plataforma robusta para gerenciamento de processos industriais com interface intuitiva.'
    },
    {
      id: 2,
      title: 'API Gateway Financeiro',
      tech: 'Express, JavaScript, RESTful',
      description: 'Gateway de pagamentos seguro com integração de múltiplos provedores.'
    },
    {
      id: 3,
      title: 'Dashboard Analítico',
      tech: 'Node.js, SQLite, Vanilla JS',
      description: 'Dashboard responsivo com visualização de dados em tempo real.'
    }
  ];

  try {
    // Caminho absoluto para o banco de dados no Vercel
    // Em funções serverless, o arquivo deve estar incluído no bundle
    const dbPath = path.resolve(process.cwd(), 'portfolio.db');
    
    // Verifica se o arquivo existe
    if (!fs.existsSync(dbPath)) {
      console.warn('Banco de dados não encontrado em:', dbPath);
      return res.status(200).json(fallbackProjects);
    }

    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

    db.all('SELECT * FROM projects ORDER BY id DESC', [], (err, rows) => {
      db.close();
      
      if (err) {
        console.error('Erro na query do banco:', err);
        return res.status(200).json(fallbackProjects);
      }

      // Se o banco estiver vazio, retorna o fallback
      if (!rows || rows.length === 0) {
        return res.status(200).json(fallbackProjects);
      }

      res.status(200).json(rows);
    });
  } catch (error) {
    console.error('Erro crítico na API:', error);
    // Retorna os dados de fallback para que o site nunca fique "quebrado"
    res.status(200).json(fallbackProjects);
  }
}
