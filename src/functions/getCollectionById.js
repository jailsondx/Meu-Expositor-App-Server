import { db } from '../database/connection.js';

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
