import { db } from '../database/connection.js';
import { getUserCollections } from './Collections.js';

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
