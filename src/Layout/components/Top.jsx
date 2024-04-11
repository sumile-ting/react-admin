import { useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, ConfigProvider, Modal, Space } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import { loadUserInfo } from '@/store/modules/user';
import { logout } from '@/api/user';
import { removeToken } from '@/utils/auth';
import { clearStore } from '@/utils/store';
import styles from './index.module.scss';
export default function Top() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  // const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const dropdownMenus = [
    {
      key: '1',
      label: '退出登录',
    },
  ];

  const onClick = async ({ key }) => {
    if (key === '1') {
      const confirmed = await modal.confirm({
        title: '退出系统，是否继续？',
      });
      if (confirmed) {
        await logout();
        removeToken();
        clearStore();
        // navigate('/login');
        location.reload();
      }
    }
  };

  useEffect(() => {
    dispatch(loadUserInfo());
  }, [dispatch]);
  return (
    <header className={styles.topHeader}>
      <div>管理系统</div>
      <div>
        <Dropdown
          menu={{
            items: dropdownMenus,
            onClick,
          }}
        >
          <a className={styles.dropdownA} onClick={(e) => e.preventDefault()}>
            <Space>
              <span>{userInfo.realName}</span>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
      <ConfigProvider locale={zhCN}>{contextHolder}</ConfigProvider>
    </header>
  );
}
