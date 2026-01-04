import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { SearchFigures, SearchFiguresInCollection } from '../functions/SearchFigures.js';
import { addFigureToCollection, createCollection } from '../functions/Collections.js';

const router = Router();

router.post('/SearchFigures', async (req, res) => {
  const nameSearch = req.body.search;
  try {
    const result = await SearchFigures(nameSearch);
    handleResponse(res, result);
  } catch (error) {
    console.error('Erro na rota SearchFigures:', error);
    handleError(res, error);
  }
});

router.post('/SearchFiguresInCollection', async (req, res) => {
  const nameSearch = req.body.search;
  const collectionId = req.body.collectionId;
  try {
    const result = await SearchFiguresInCollection(nameSearch, collectionId);
    handleResponse(res, result);
  } catch (error) {
    console.error('Erro na rota SearchFiguresInCollection:', error);
    handleError(res, error);
  }
});



router.post('/createCollection', auth, async (req, res) => {
  try {
    const result = await createCollection({
      userId: req.userId,
      name: req.body.name,
    });
    handleResponse(res, result);
  } catch (error) {
    console.error('Erro na rota createCollection:', error);
    return handleError(res, error);
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
    console.log(result);
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
