import { db } from '../database/connection.js';

export async function getAllFigures(req, res) {
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
    `);

    return { success: true, data: figures };
  } catch (error) {
    console.error("Erro ao carregar All Figures:", error);
    return { success: false, message: "Erro ao buscar figuras", error };
  }
}
