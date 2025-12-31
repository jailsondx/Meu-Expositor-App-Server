import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { addFigureToCollection, createCollection, getUserCollections } from '../functions/Collections.js';
import { getFigureCollectionStatus } from '../functions/getFigureCollectionStatus.js';

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



router.get('/figure-status', auth, async (req, res) => {
  const userId = req.userId;
  const figureId = req.query.figureId;
  try {
    const result = await getFigureCollectionStatus(userId, figureId);
    handleResponse(res, result);
  } catch (error) {
    handleError(res, error);
  }
});



router.post('/:collectionId/add-figure', auth, async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { figureId } = req.body;
    const userId = req.userId;

    if (!collectionId || !figureId) {
      return res.status(400).json({
        success: false,
        message: 'collectionId e figureId são obrigatórios',
      });
    }

    const result = await addFigureToCollection(collectionId, figureId, userId);

    handleResponse(res, result);
  } catch (error) {
    console.error('Erro na rota add-figure:', error);

    res.status(500).json({
      success: false,
      message: 'Erro interno ao adicionar figure à coleção',
    });
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
