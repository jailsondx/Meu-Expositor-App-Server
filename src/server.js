import dotenv from 'dotenv';
import app from './app.js';
import cors from 'cors';
import { testDatabaseConnection } from './database/connection.js';


dotenv.config();


app.use(cors());


app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Backend rodando na porta: ${process.env.PORT}\n🌐 database: ${process.env.DB_HOST}`);
 testDatabaseConnection();
});

//ARQUIVO PARA RODAR O BACKEND LOCALMENTE NO PC PARA DESENVOLVIMENTO