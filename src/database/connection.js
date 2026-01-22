import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

// cria o pool uma única vez
function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,

      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,

      // Railway exige SSL
      ssl: {
        rejectUnauthorized: false,
      },

      connectTimeout: 10000,
    });
  }
  return pool;
}

// mantém compatibilidade com seu código atual
const db = createPool();

// função opcional de teste
async function testDatabaseConnection() {
  const connection = await db.getConnection();
  connection.release();
  console.log('✅ Banco de dados conectado');
  return true;
}

export { db, testDatabaseConnection };
