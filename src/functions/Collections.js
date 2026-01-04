import { db } from '../database/connection.js';

export async function createCollection({ userId, name }) {
  if (!userId || !name) {
    return {
      success: false,
      message: 'Dados obrigatórios não informados',
      error: 'userId ou name ausente',
    };
  }

  // 🔹 Remove espaços extras no início e no fim
  const trimmedName = name.trim();

  // 🔹 Evita nomes vazios após o trim (ex: "   ")
  if (trimmedName.length === 0) {
    return {
      success: false,
      message: 'O nome da coleção não pode estar vazio',
    };
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO ME_collections (user_id, name) VALUES (?, ?)',
      [userId, trimmedName]
    );

    return {
      success: true,
      message: 'Coleção criada com sucesso',
      data: {
        id: result.insertId,
        name: trimmedName,
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



export async function getCollectionById(collectionId) {
  if (!collectionId) {
    return {
      success: false,
      message: 'CollectionId não informado',
      error: 'Parâmetro ausente',
    };
  }

  try {
    const [rows] = await db.query(
      `
      SELECT 
        f.id,
        f.name,
        f.brand_id,
        b.name AS brand_name,
        f.line_id,
        l.name AS line_name,
        f.price,
        f.coin,
        f.release_year,
        f.image_url,
        ci.quantity,
        ci.notes
      FROM ME_collection_items ci
      INNER JOIN ME_figures f ON f.id = ci.figure_id
      LEFT JOIN ME_brands b ON f.brand_id = b.id
      LEFT JOIN ME_lines l ON f.line_id = l.id
      WHERE ci.collection_id = ?
      `,
      [collectionId]
    );

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error('Erro ao carregar itens da coleção:', error);
    return {
      success: false,
      message: 'Erro ao buscar itens da coleção',
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



export async function getFigureCollectionStatus(userId, figureId) {
  try {
    const userCollections = await getUserCollections(userId);

    // Se não houver coleções
    if (!userCollections.success || userCollections.data.length === 0) {
      return {
        success: true,
        message: 'Não Há coleções',
        data: [],
      };
    }

    // Extrai apenas os IDs das coleções
    const collectionIds = userCollections.data.map(c => c.id);

    const [rows] = await db.query(
      `
      SELECT 
        c.id AS collection_id,
        c.name AS collection_name
      FROM ME_collection_items ci
      LEFT JOIN ME_collections c ON ci.collection_id = c.id
      WHERE ci.figure_id = ?
        AND ci.collection_id IN (?)
      `,
      [figureId, collectionIds]
    );

    return {
      success: true,
      message: 'Coleções Encontradas',
      data: rows,
    };
  } catch (error) {
    console.error('Erro ao verificar figure na coleção:', error);

    return {
      success: false,
      message: 'Erro ao verificar status da figure nas coleções',
      error: error.message,
    };
  }
}

