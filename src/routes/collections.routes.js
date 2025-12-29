import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { createCollection, getUserCollections } from '../functions/Collections.js';

const router = Router();



router.post('/createCollection', auth, async (req, res) => {
  const result = await createCollection({
    userId: req.userId,
    name: req.body.name,
  });
  handleResponse(res, result);
});



router.get('/loadCollections', auth, async (req, res) => {
  try {
    const result = await getUserCollections(req.userId);
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
  } else {
    return res.status(500).json({
      message: result.message,
      error: result.error,
    });
  }
};

const handleError = (res, error) => {
  console.error('Erro no processamento:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor',
    error: 'Erro desconhecido',
  });
};

export default router;
