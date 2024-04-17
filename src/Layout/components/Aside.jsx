import styles from "./index.module.scss";
import { MailOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useMatches } from "react-router-dom";
export default function Aside() {
  const navigate = useNavigate();
  let matches = useMatches();
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    setOpenKeys(matches.slice(0, -1).map((item) => item.pathname));
    setSelectedKeys(matches.map((item) => item.pathname));
  }, [matches]);


  const items = [
    {
      label: "工作台",
      key: "/desk",
      icon: <MailOutlined />,
      children: [
        {
          label: "通知公告",
          key: "/desk/notice"
        }
      ]
    }
  ];

  const handleClick = ({ key }) => {
    navigate(key);
  };

  const handleOpenChange = (openKeys) => {
    setOpenKeys(openKeys);
  };

  return (
    <div className={styles.aside}>
      <Menu
        mode="inline"
        style={{ width: 240, borderInlineEnd: "none" }}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        items={items}
        onClick={handleClick}
        onOpenChange={handleOpenChange}
      />
    </div>
  );
}
