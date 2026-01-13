import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { SearchFigures, SearchFiguresInCollection } from '../functions/Select/SearchFigures.js';
import { CreateCollection } from '../functions/Insert/CreateCollection.js';
import { addFigureToCollection } from '../functions/Insert/addFigureToCollection.js';

const router = Router();

router.post('/SearchFigures', auth, async (req, res) => {
  const nameSearch = req.body.search;
  const brandId = req.body.brandId
  const lineId = req.body.lineId
  const page = req.body.page
  const limit = req.body.limit
  try {
    const result = await SearchFigures(nameSearch, brandId, lineId, page, limit);
    handleResponse(res, result);
  } catch (error) {
    console.error('Erro na rota SearchFigures:', error);
    handleError(res, error);
  }
});

router.post('/SearchFiguresInCollection', auth, async (req, res) => {
  const nameSearch = req.body.search;
  const collectionId = req.body.collectionId;
  const brandId = req.body.brandId
  const lineId = req.body.lineId
  const page = req.body.page
  const limit = req.body.limit
  try {
    const result = await SearchFiguresInCollection(nameSearch, collectionId, brandId, lineId, page, limit);
    handleResponse(res, result);
  } catch (error) {
    console.error('Erro na rota SearchFiguresInCollection:', error);
    handleError(res, error);
  }
});

router.post('/CreateCollection', auth, async (req, res) => {
  try {
    const result = await CreateCollection({
      userId: req.userId,
      name: req.body.name,
      icon: req.body.icon,
    });
    handleResponse(res, result);
  } catch (error) {
    console.error('Erro na rota CreateCollection:', error);
    return handleError(res, error);
  }
});

router.post('/:collectionId/addFigure', auth, async (req, res) => {
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

    return handleError(res, error);
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
