import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config.js';

const router = Router();

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password !== config.ADMIN_PASSWORD) {
    return res.status(401).json({ error: '密码错误' });
  }
  const token = jwt.sign({ role: 'admin' }, config.JWT_SECRET, {
    expiresIn: config.TOKEN_EXPIRY,
  });
  res.json({ token });
});

export default router;
