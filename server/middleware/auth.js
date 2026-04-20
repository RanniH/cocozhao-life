import jwt from 'jsonwebtoken';
import config from '../config.js';

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授权' });
  }
  try {
    jwt.verify(header.slice(7), config.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: '未授权' });
  }
}
