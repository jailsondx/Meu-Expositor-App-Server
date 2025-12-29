import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`\n🚀 Backend rodando na porta: ${process.env.PORT}\n🌐 database: ${process.env.DB_HOST}`);
});
