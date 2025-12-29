import { Router } from 'express';
import { registerUser, loginUser } from '../functions/Users.js';

const router = Router();

/**
 * REGISTRO
 * NÃO USA AUTH
 */
router.post('/register', async (req, res) => {
  try {
    const result = await registerUser(req.body);
    handleResponse(res, result);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * LOGIN
 * NÃO USA AUTH
 */
router.post('/login', async (req, res) => {
  try {
    const result = await loginUser(req.body);
    handleResponse(res, result);
  } catch (error) {
    handleError(res, error);
  }
});

/* ===== HELPERS ===== */

const handleResponse = (res, result) => {
  if (result.success) {
    return res.status(200).json({
      message: result.message,
      data: result.data,
    });
  }

  return res.status(400).json({
    message: result.message,
    error: result.error,
  });
};

const handleError = (res, error) => {
  console.error('Erro no processamento:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor',
  });
};

export default router;
