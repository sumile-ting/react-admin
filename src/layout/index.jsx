import { Outlet } from 'react-router-dom';
import Top from './components/Top';
import Aside from './components/Aside';
import styles from './index.module.scss';
export default function Layout() {
  return (
    <div style={{ height: '100%' }}>
      <Top></Top>
      <div className={styles.mainContainer}>
        <Aside></Aside>
        <div className={styles.mainSection}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
