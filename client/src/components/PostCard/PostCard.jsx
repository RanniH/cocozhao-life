import { useAuth } from '../../context/AuthContext.jsx';
import ImageGrid from '../ImageGrid/ImageGrid.jsx';
import styles from './PostCard.module.css';

function formatTime(dateStr) {
  const date = new Date(dateStr + 'Z');
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}天前`;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}年${m}月${d}日`;
}

export default function PostCard({ post, onDelete, onImageClick }) {
  const { isAdmin } = useAuth();

  const handleDelete = () => {
    if (window.confirm('确定删除这条动态吗？')) {
      onDelete(post.id);
    }
  };

  return (
    <article className={styles.card}>
      <p className={styles.content}>{post.content}</p>
      {post.images?.length > 0 && (
        <ImageGrid images={post.images} onImageClick={onImageClick} />
      )}
      <div className={styles.footer}>
        <time className={styles.time}>{formatTime(post.created_at)}</time>
        {isAdmin && (
          <button className={styles.deleteBtn} onClick={handleDelete}>
            删除
          </button>
        )}
      </div>
    </article>
  );
}
