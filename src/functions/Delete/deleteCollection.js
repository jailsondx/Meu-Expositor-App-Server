import { db } from '../../database/connection.js';

export async function deleteCollection(collectionId, userId) {
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


    // 2️⃣ Deleta a coleção
    await connection.query(
      `
      DELETE FROM ME_collections
      WHERE id = ?
      `,
      [collectionId]
    );

    await connection.commit();

    return {
      success: true,
      message: 'Coleção apagada com sucesso',
    };
  } catch (error) {
    await connection.rollback();

    console.error('Erro ao apagar coleção:', error);

    return {
      success: false,
      message: 'Erro ao apagar coleção',
      error,
    };
  } finally {
    connection.release();
  }
}
