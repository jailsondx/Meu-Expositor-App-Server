import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

let db;

async function testDatabase() {
  try {
    db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10
    });

    // 🔍 Teste de conexão
    const client = await db.connect();
    console.log('✅ Conexão com o PostgreSQL (Neon) bem-sucedida!');
    client.release();

  } catch (error) {
    console.error('❌ Erro ao conectar no PostgreSQL:', error.message);
  }
}

testDatabase();

export { db };
