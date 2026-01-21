import { db } from '../../database/connection.js';

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
            'SELECT id, name, icon FROM ME_collections WHERE user_id = ? ORDER BY id ASC',
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

