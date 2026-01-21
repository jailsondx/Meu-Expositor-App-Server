import { db } from '../../database/connection.js';

export async function CreateCollection({ userId, name, icon }) {
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
      'INSERT INTO ME_collections (user_id, name, icon) VALUES (?, ?, ?)',
      [userId, trimmedName, icon]
    );

    return {
      success: true,
      message: 'Coleção criada com sucesso',
      data: {
        id: result.insertId,
        name: trimmedName,
        icon: icon,
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
