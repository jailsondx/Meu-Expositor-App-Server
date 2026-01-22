import mysql from 'mysql2/promise';
import 'dotenv/config';

let db;

export default async function TestDatabase() {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,   
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    // Teste de conexão
    const connection = await db.getConnection();
    console.log('✅ Conexão com o banco de dados bem-sucedida!');
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar no banco de dados:', error);
  }
}

TestDatabase()


export { db };
