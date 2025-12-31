import { db } from '../database/connection.js';

export async function SearchFigures(nameSearch) {
  try {
    const [figures] = await db.query(`
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
        f.image_url
      FROM ME_figures f
      LEFT JOIN ME_brands b ON f.brand_id = b.id
      LEFT JOIN ME_lines l ON f.line_id = l.id
      WHERE f.name LIKE ?
    `, [`%${nameSearch}%`]);

    return { success: true, data: figures };
  } catch (error) {
    console.error("Erro ao carregar Pesquisa de Figure:", error);
    return { success: false, message: "Erro ao buscar figuras", error };
  }
}

export async function SearchFiguresInCollection(nameSearch, collectionId) {
  try {
    const [figures] = await db.query(
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
      INNER JOIN ME_figures f ON ci.figure_id = f.id
      LEFT JOIN ME_brands b ON f.brand_id = b.id
      LEFT JOIN ME_lines l ON f.line_id = l.id
      WHERE 
        ci.collection_id = ?
        AND f.name LIKE ?
      ORDER BY f.name ASC
      `,
      [collectionId, `%${nameSearch}%`]
    );

    return { success: true, data: figures };
  } catch (error) {
    console.error("Erro ao carregar Pesquisa de Figure:", error);
    return { success: false, message: "Erro ao buscar figuras", error };
  }
}