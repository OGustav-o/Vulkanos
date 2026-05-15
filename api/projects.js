import { createClient } from '@libsql/client';

// Cliente inicializado fora do handler para melhor performance (reutilização de conexões)
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Executa a query de forma assíncrona
    const result = await db.execute('SELECT * FROM projects ORDER BY id DESC');
    
    // O Turso retorna os dados em result.rows
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na API Projects (Turso):', error);
    
    // Retorna uma lista vazia ou erro 500 se preferires
    return res.status(500).json({ 
      error: 'Falha ao conectar com o banco de dados',
      details: error.message 
    });
  }
}