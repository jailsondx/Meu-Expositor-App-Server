import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { removeFigureToCollection } from '../functions/Delete/deleteFigureToCollection.js';

const router = Router();

router.delete('/:collectionId/removeFigure', auth, async (req, res) => {
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

    const result = await removeFigureToCollection(collectionId, figureId, userId);
    handleResponse(res, result);
  } catch (error) {
    console.error('Erro na rota removeFigure:', error);

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
