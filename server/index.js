import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import { getDb } from './db.js';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });

app.use(cors({
  origin: config.CORS_ORIGIN === '*' ? true : config.CORS_ORIGIN.split(','),
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(config.UPLOAD_DIR));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

async function start() {
  await getDb();
  app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}`);
  });
}

start();
