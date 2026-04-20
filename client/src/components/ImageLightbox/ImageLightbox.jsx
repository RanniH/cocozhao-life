import { useEffect, useCallback } from 'react';
import { imageUrl } from '../../api/index.js';
import styles from './ImageLightbox.module.css';

export default function ImageLightbox({ images, currentIndex, onClose, onNavigate }) {
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
  }, [onClose, onNavigate, currentIndex, images.length]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [handleKey]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>
        {currentIndex > 0 && (
          <button
            className={`${styles.nav} ${styles.prev}`}
            onClick={() => onNavigate(currentIndex - 1)}
          >
            ‹
          </button>
        )}
        <img
          className={styles.image}
          src={imageUrl(images[currentIndex].filename)}
          alt=""
        />
        {currentIndex < images.length - 1 && (
          <button
            className={`${styles.nav} ${styles.next}`}
            onClick={() => onNavigate(currentIndex + 1)}
          >
            ›
          </button>
        )}
        {images.length > 1 && (
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
