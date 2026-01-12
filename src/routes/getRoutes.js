import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { getAllFigures } from '../functions/AllFigures.js';
import { getRecentFigures } from '../functions/RecentFigures.js';
import { getFigureCollectionStatus, getUserCollections, getCollectionById } from '../functions/Collections.js';
import { getFilters } from '../functions/SearchFigures.js';

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


router.get('/Filters', async (req, res) => {
  try {
    const result = await getFilters();
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



router.get('/getAllCollectionsUser', auth, async (req, res) => {
  try {
    const result = await getUserCollections(req.userId);
    handleResponse(res, result);
  } catch (error) {
    handleError(res, error);
  }
});



router.get('/figureStatus', auth, async (req, res) => {
  const userId = req.userId;
  const figureId = req.query.figureId;
  try {
    const result = await getFigureCollectionStatus(userId, figureId);
    handleResponse(res, result);
  } catch (error) {
    handleError(res, error);
  }
});







// Métodos auxiliares para padronizar respostas e erros
const handleResponse = (res, result) => {
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
      error: result.error
    });
  }
};


const handleError = (res, error) => {
  console.error('Erro no processamento:', error);

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: error.message || 'Erro desconhecido'
  });
};


export default router;
