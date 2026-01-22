import express from 'express';
import { testDatabaseConnection } from '../database/connection.js';

const router = express.Router();

router.get('/db-test', async (req, res) => {
  try {
    await testDatabaseConnection();
    res.json({
      ok: true, 
      message: 'Banco conectado com sucesso 🚀' 
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

export default router;
