import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ⚠️ ESTA LINHA É CRÍTICA
    req.userId = decoded.userId;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
