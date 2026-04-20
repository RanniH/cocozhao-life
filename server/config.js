import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'cocozhao2024',
  JWT_SECRET: process.env.JWT_SECRET || 'cocozhao-secret-key-change-me',
  TOKEN_EXPIRY: '7d',
  PORT: parseInt(process.env.PORT) || 3001,
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, 'uploads'),
  DB_PATH: process.env.DB_PATH || path.resolve(__dirname, 'data', 'cocozhao.db'),
  MAX_IMAGES_PER_POST: 9,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};
