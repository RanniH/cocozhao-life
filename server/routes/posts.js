import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { getDb, saveDb } from '../db.js';
import config from '../config.js';
import auth from '../middleware/auth.js';

const router = Router();

const storage = multer.diskStorage({
  destination: config.UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

function queryAll(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function queryOne(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) {
    row = stmt.getAsObject();
  }
  stmt.free();
  return row;
}

router.get('/', async (req, res) => {
  const db = await getDb();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const posts = queryAll(
    db,
    'SELECT id, content, created_at FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit + 1, offset]
  );
  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();

  const result = posts.map((post) => ({
    ...post,
    images: queryAll(
      db,
      'SELECT id, filename, original_name FROM images WHERE post_id = ? ORDER BY sort_order',
      [post.id]
    ),
  }));

  res.json({ posts: result, hasMore });
});

router.post('/', auth, upload.array('images', config.MAX_IMAGES_PER_POST), async (req, res) => {
  const content = (req.body.content || '').trim();
  if (!content) {
    return res.status(400).json({ error: '内容不能为空' });
  }

  const db = await getDb();
  try {
    db.run('BEGIN TRANSACTION');
    db.run('INSERT INTO posts (content) VALUES (?)', [content]);
    const postId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];

    const files = req.files || [];
    for (let i = 0; i < files.length; i++) {
      db.run(
        'INSERT INTO images (post_id, filename, original_name, sort_order) VALUES (?, ?, ?, ?)',
        [postId, files[i].filename, files[i].originalname, i]
      );
    }
    db.run('COMMIT');
    saveDb();

    const post = queryOne(db, 'SELECT id, content, created_at FROM posts WHERE id = ?', [postId]);
    const images = queryAll(
      db,
      'SELECT id, filename, original_name FROM images WHERE post_id = ? ORDER BY sort_order',
      [postId]
    );

    res.status(201).json({ post: { ...post, images } });
  } catch (e) {
    db.run('ROLLBACK');
    throw e;
  }
});

router.delete('/:id', auth, async (req, res) => {
  const db = await getDb();
  const id = parseInt(req.params.id);
  const post = queryOne(db, 'SELECT id FROM posts WHERE id = ?', [id]);
  if (!post) return res.status(404).json({ error: '动态不存在' });

  const images = queryAll(db, 'SELECT filename FROM images WHERE post_id = ?', [id]);
  db.run('DELETE FROM posts WHERE id = ?', [id]);
  saveDb();

  for (const img of images) {
    const filepath = path.join(config.UPLOAD_DIR, img.filename);
    try { fs.unlinkSync(filepath); } catch {}
  }

  res.json({ success: true });
});

export default router;
