import { db } from '../../database/connection.js';

export async function removeFigureToCollection(collectionId, figureId, userId) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Verifica se a coleção pertence ao usuário
    const [collection] = await connection.query(
      `
      SELECT user_id
      FROM ME_collections
      WHERE id = ?
      LIMIT 1
      `,
      [collectionId]
    );

    if (collection.length === 0) {
      await connection.rollback();
      return {
        success: false,
        message: 'Coleção não encontrada',
      };
    }

    if (collection[0].user_id !== userId) {
      await connection.rollback();
      return {
        success: false,
        message: 'Usuário não autorizado a modificar esta coleção',
      };
    }

    // 2️⃣ Verifica se a figure existe na coleção
    const [exists] = await connection.query(
      `
      SELECT 1
      FROM ME_collection_items
      WHERE collection_id = ?
        AND figure_id = ?
      LIMIT 1
      `,
      [collectionId, figureId]
    );

    if (exists.length === 0) {
      await connection.rollback();
      return {
        success: false,
        message: 'Figure não encontrada nesta coleção',
      };
    }

    // 3️⃣ Remove a figure da coleção
    await connection.query(
      `
      DELETE FROM ME_collection_items
      WHERE collection_id = ?
        AND figure_id = ?
      `,
      [collectionId, figureId]
    );

    await connection.commit();

    return {
      success: true,
      message: 'Figure removida da coleção com sucesso',
    };
  } catch (error) {
    await connection.rollback();

    console.error('Erro ao remover figure da coleção:', error);

    return {
      success: false,
      message: 'Erro ao remover figure da coleção',
      error,
    };
  } finally {
    connection.release();
  }
}
