import { useAuth } from '../../context/AuthContext.jsx';
import styles from './Header.module.css';

export default function Header({ onLoginClick }) {
  const { isAdmin, logout } = useAuth();

  return (
    <header className={styles.header}>
      <button
        className={styles.settingsBtn}
        onClick={isAdmin ? logout : onLoginClick}
        title={isAdmin ? '退出登录' : '管理员登录'}
      >
        {isAdmin ? '↩' : '⚙'}
      </button>
      <div className={styles.avatar}>CZ</div>
      <h1 className={styles.name}>CocoZhao</h1>
      <p className={styles.bio}>记录生活的点滴</p>
    </header>
  );
}
