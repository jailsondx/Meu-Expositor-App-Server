import { db } from '../../database/connection.js';

export async function getFilters() {
  try {
    const [brands] = await db.query(`
      SELECT 
        id,
        name
      FROM ME_brands
      ORDER BY name
    `);

    const [lines] = await db.query(`
      SELECT 
        id,
        name
      FROM ME_lines
      ORDER BY name
    `);

    return {
      success: true,
      message: 'Filtros carregados com sucesso',
      data: {
        brands,
        lines,
      },
    };
  } catch (error) {
    console.error('Erro ao carregar os filtros:', error);

    return {
      success: false,
      message: 'Erro ao buscar filtros',
      data: null,
    };
  }
}


export async function SearchFigures(nameSearch, brandId, lineId, page = 1, limit = 20) {
  try {
    if (!nameSearch && !brandId && !lineId) {
      return {
        success: false,
        message: 'Informe ao menos um filtro',
        data: [],
      };
    }

    const where = [];
    const params = [];

    if (nameSearch) {
      where.push('LOWER(f.name) LIKE LOWER(?)');
      params.push(`%${nameSearch}%`);
    }

    if (brandId) {
      where.push('f.brand_id = ?');
      params.push(Number(brandId));
    }

    if (lineId) {
      where.push('f.line_id = ?');
      params.push(Number(lineId));
    }

    const offset = (page - 1) * limit;

    const whereClause = where.length
      ? `WHERE ${where.join(' AND ')}`
      : '';

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
          f.image_url
        FROM ME_figures f
        LEFT JOIN ME_brands b ON f.brand_id = b.id
        LEFT JOIN ME_lines l ON f.line_id = l.id
        ${whereClause}
        ORDER BY f.name ASC
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    return {
      success: true,
      data: figures,
    };
  } catch (error) {
    console.error('Erro SearchFigures:', error);
    return {
      success: false,
      message: 'Erro interno',
      data: [],
    };
  }
}


export async function SearchFiguresInCollection(nameSearch, collectionId, brandId, lineId) {
  try {
    // collection é obrigatória
    if (!collectionId) {
      return {
        success: false,
        message: 'Collection não informada',
        data: [],
      };
    }

    // ao menos um filtro deve existir
    if (!nameSearch && !brandId && !lineId) {
      return {
        success: false,
        message: 'Informe ao menos um filtro para realizar a busca',
        data: [],
      };
    }

    const where = ['ci.collection_id = ?'];
    const params = [collectionId];

    // filtros dinâmicos
    if (nameSearch) {
      where.push('f.name LIKE ?');
      params.push(`%${nameSearch}%`);
    }

    if (brandId) {
      where.push('f.brand_id = ?');
      params.push(brandId);
    }

    if (lineId) {
      where.push('f.line_id = ?');
      params.push(lineId);
    }

    const whereClause = `WHERE ${where.join(' AND ')}`;

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
        ${whereClause}
        ORDER BY f.name ASC
      `,
      params
    );

    return {
      success: true,
      message: 'Pesquisa realizada com sucesso',
      data: figures,
    };
  } catch (error) {
    console.error('Erro ao carregar Pesquisa de Figure:', error);

    return {
      success: false,
      message: 'Erro ao buscar figuras',
      data: [],
    };
  }
}