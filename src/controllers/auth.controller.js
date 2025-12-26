import { db } from '../database/connection.js';
import jwt from 'jsonwebtoken';

export async function register(req, res) {
  const { nome, email, senha } = req.body;

  const [user] = await db.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senha]
  );

  res.json({ message: 'Usuário criado com sucesso' });
}

export async function login(req, res) {
  const { email, senha } = req.body;

  const [rows] = await db.query(
    'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha]
  );

  if (rows.length === 0) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }

  const user = rows[0];

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email
    }
  });
}
