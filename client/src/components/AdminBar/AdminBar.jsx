import { useAuth } from '../../context/AuthContext.jsx';
import styles from './AdminBar.module.css';

export default function AdminBar() {
  const { isAdmin, logout } = useAuth();
  if (!isAdmin) return null;

  return (
    <div className={styles.bar}>
      <span>已登录为管理员</span>
      <button className={styles.logoutBtn} onClick={logout}>退出</button>
    </div>
  );
}
