import { db } from '../database/connection.js';

// Criar nova coleção
export async function createCollection({ userId, name }) {
  if (!userId || !name) {
    return {
      success: false,
      message: 'Dados obrigatórios não informados',
      error: 'userId ou name ausente',
    };
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO ME_collections (user_id, name) VALUES (?, ?)',
      [userId, name]
    );

    return {
      success: true,
      message: 'Coleção criada com sucesso',
      data: {
        id: result.insertId,
        name,
      },
    };
  } catch (error) {
    
    return {
      success: false,
      message: 'Erro ao criar coleção',
      error,
    };
  }
}




// Listar coleções do usuário
export async function getUserCollections(userId) {
  if (!userId) {
    return {
      success: false,
      message: 'UserId não informado',
      error: 'Parâmetro ausente',
    };
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, name FROM ME_collections WHERE user_id = ? ORDER BY id ASC',
      [userId]
    );

    return {
      success: true,
      message: 'Coleções carregadas com sucesso',
      data: rows,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao buscar coleções',
      error,
    };
  }
}



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
        message: 'Figure já existe nesta coleção',
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

