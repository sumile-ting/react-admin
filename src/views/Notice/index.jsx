import { useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, message, Space } from 'antd';
import { getList } from '@/api/notice';
import { useSelector } from 'react-redux';
export default function Notice() {
  const userInfo = useSelector((state) => state.user.userInfo);
  function getData() {
    getList().then((res) => {
      console.log('--->', res);
    });
  }
  const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
  };
  const items = [
    {
      label: '1st menu item',
      key: '1',
    },
    {
      label: '2nd menu item',
      key: '2',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
  ];
  return (
    <div>
      通知公告<button onClick={getData}>查询</button>
      <Dropdown
        menu={{
          items,
          onClick,
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {userInfo.realName}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
}
