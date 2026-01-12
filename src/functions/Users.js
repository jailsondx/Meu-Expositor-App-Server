import { db } from '../database/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


//CRIAR CONTA NOVA
export async function registerUser({ nome, email, senha }) {
  try {
    if (!nome || !email || !senha) {
      return {
        success: false,
        message: 'Dados obrigatórios não informados',
      };
    }

    // Verifica se email já existe
    const [exists] = await db.execute(
      'SELECT id FROM ME_usuarios WHERE email = ?',
      [email]
    );

    if (exists.length) {
      return {
        success: false,
        message: 'Email já cadastrado',
      };
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    await db.execute(
      'INSERT INTO ME_usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, hashedPassword]
    );

    return {
      success: true,
      message: 'Usuário criado com sucesso',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao criar usuário',
      error,
    };
  }
}




//LOGIN
export async function loginUser({ email, senha }) {
  try {
    const [rows] = await db.execute(
      'SELECT id, nome, senha FROM ME_usuarios WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    const user = rows[0];

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) {
      return { success: false, message: 'Senha inválida' };
    }

    const token = jwt.sign(
      { userId: user.id,
        name: user.nome,
       },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return {
      success: true,
      message: 'Login realizado com sucesso',
      data: { token },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro no login',
      error,
    };
  }
}