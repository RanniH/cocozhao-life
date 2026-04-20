import { useState, useRef } from 'react';
import { createPost } from '../../api/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './CreatePost.module.css';

export default function CreatePost({ onPostCreated }) {
  const { token } = useAuth();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const addFiles = (newFiles) => {
    const remaining = 9 - files.length;
    const toAdd = Array.from(newFiles).slice(0, remaining);
    setFiles((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [
      ...prev,
      ...toAdd.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('content', content.trim());
      files.forEach((f) => fd.append('images', f));
      const { post } = await createPost(fd, token);
      onPostCreated(post);
      setContent('');
      previews.forEach((p) => URL.revokeObjectURL(p));
      setFiles([]);
      setPreviews([]);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <textarea
          className={styles.textarea}
          placeholder="分享新动态..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        {previews.length > 0 && (
          <div className={styles.previews}>
            {previews.map((src, i) => (
              <div key={i} className={styles.previewItem}>
                <img src={src} alt="" />
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFile(i)}
                >
                  ×
                </button>
              </div>
            ))}
            {files.length < 9 && (
              <button
                className={styles.addBtn}
                onClick={() => fileRef.current?.click()}
              >
                +
              </button>
            )}
          </div>
        )}
        <div className={styles.actions}>
          <button
            className={styles.imageBtn}
            onClick={() => fileRef.current?.click()}
          >
            🖼 图片
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
          >
            {loading ? '发布中...' : '发布'}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
