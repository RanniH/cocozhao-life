import { imageUrl } from '../../api/index.js';
import styles from './ImageGrid.module.css';

export default function ImageGrid({ images, onImageClick }) {
  const count = images.length;
  const cols = count === 1 ? 1 : count === 2 || count === 4 ? 2 : 3;

  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {images.map((img, i) => (
        <div
          key={img.id || i}
          className={`${styles.item} ${count === 1 ? styles.single : ''}`}
          onClick={() => onImageClick(images, i)}
        >
          <img
            src={imageUrl(img.filename)}
            alt=""
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
