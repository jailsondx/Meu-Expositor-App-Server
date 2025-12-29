import { Router } from 'express';
import { SearchFigures } from '../functions/SearchFigures.js';

const router = Router();

router.get('/SearchFigures', async (req, res) => {
    const nameSearch = req.query.search || '';
  try {
    const result = await SearchFigures(nameSearch);
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
