import { db } from '../database/connection.js';

// Criar nova coleção
export async function createCollection({ userId, name }) {
  console.log('Criando coleção para userId:', userId, 'com nome:', name);
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
      'SELECT id, name FROM ME_collections WHERE user_id = ? ORDER BY id DESC',
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