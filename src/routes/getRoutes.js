import { Router } from 'express';
import { getAllFigures } from '../functions/AllFigures.js';
import { getRecentFigures } from '../functions/RecentFigures.js';
import { getCollectionById } from '../functions/getCollectionById.js';

const router = Router();

//router.get('/AllFigures', getAllFigures);

router.get('/AllFigures', async (req, res) => {
  try {
    const result = await getAllFigures();
    handleResponse(res, result);
  } catch (error) {
    handleError(res, error);
  }
});

router.get('/RecentFigures', async (req, res) => {
  try {
    const result = await getRecentFigures();
    handleResponse(res, result);
  } catch (error) {
    handleError(res, error);
  }
});

router.get('/getCollectionById', async (req, res) => {
  const collectionId = req.query.collectionId || '';
  try {
    const result = await getCollectionById(collectionId);
    handleResponse(res, result);
  } catch (error) {
    handleError(res, error);
  }
});



// Métodos auxiliares para padronizar respostas e erros
const handleResponse = (res, result) => {
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(500).json({ message: result.message, error: result.error });
  }
};

const handleError = (res, error) => {
  console.error('Erro no processamento:', error);
  /*
  return res.status(500).json({
    message: 'Erro interno do servidor',
    error: 'Erro desconhecido',
  });
  */
};

export default router;
