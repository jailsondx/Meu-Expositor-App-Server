import { db } from '../../database/connection.js';

export async function addFigureToCollection(collectionId, figureId, userId) {
  try {
    // 1️⃣ Verifica se a coleção pertence ao usuário
    const [collection] = await db.query(
      `
      SELECT user_id
      FROM ME_collections
      WHERE id = ?
      LIMIT 1
      `,
      [collectionId]
    );

    if (collection.length === 0) {
      return {
        success: false,
        message: 'Coleção não encontrada',
      };
    }

    if (collection[0].user_id !== userId) {
      return {
        success: false,
        message: 'Usuário não autorizado a modificar esta coleção',
      };
    }

    // 2️⃣ Verifica se a figure já existe na coleção
    const [exists] = await db.query(
      `
      SELECT 1
      FROM ME_collection_items
      WHERE collection_id = ?
        AND figure_id = ?
      LIMIT 1
      `,
      [collectionId, figureId]
    );

    if (exists.length > 0) {
      return {
        success: false,
        message: 'Figure já registrada nesta coleção',
      };
    }

    // 3️⃣ Insere a figure na coleção
    await db.query(
      `
      INSERT INTO ME_collection_items (collection_id, figure_id)
      VALUES (?, ?)
      `,
      [collectionId, figureId]
    );

    return {
      success: true,
      message: 'Figure adicionada à coleção com sucesso',
    };
  } catch (error) {
    console.error('Erro ao adicionar figure à coleção:', error);

    return {
      success: false,
      message: 'Erro ao adicionar figure à coleção',
      error,
    };
  }
}