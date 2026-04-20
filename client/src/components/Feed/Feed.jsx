import { useState, useCallback, useEffect } from 'react';
import { fetchPosts, deletePost as apiDelete } from '../../api/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll.js';
import PostCard from '../PostCard/PostCard.jsx';
import styles from './Feed.module.css';

export default function Feed({ posts, setPosts, onImageClick }) {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadPosts = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const data = await fetchPosts(pageNum);
      setPosts((prev) => pageNum === 1 ? data.posts : [...prev, ...data.posts]);
      setHasMore(data.hasMore);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [setPosts]);

  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  const loadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    loadPosts(next);
  }, [page, loadPosts]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  const handleDelete = async (id) => {
    try {
      await apiDelete(id, token);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  if (initialLoad) {
    return (
      <div className={styles.status}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (posts.length === 0) {
    return <div className={styles.status}>还没有动态</div>;
  }

  return (
    <div className={styles.feed}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={handleDelete}
          onImageClick={onImageClick}
        />
      ))}
      <div ref={sentinelRef} className={styles.sentinel}>
        {loading && <div className={styles.spinner} />}
        {!hasMore && posts.length > 0 && (
          <span className={styles.end}>没有更多了</span>
        )}
      </div>
    </div>
  );
}
