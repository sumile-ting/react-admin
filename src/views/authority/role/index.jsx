import TablePageLayout from "@/components/TablePageLayout";
import { Select, TreeSelect, Space, Button, Tooltip, theme } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getOwnerApply, getTenant, getRoleList } from "@/api/authority/role";
import { useEffect, useState } from "react";
import request from "@/api";
export default function Role() {
  const { Option } = Select;
  const { useToken } = theme;
  const { token } = useToken();

  const [ownerApps, setOwnerApps] = useState([]);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    async function initData() {
      const { data } = await getOwnerApply();
      setOwnerApps(data.data);
    }
    async function initTenants() {
      const { data } = await getTenant();
      setTenants(data.data);
    }
    // 初始化字典
    initData();
    initTenants();
  }, []);

  const columns = [
    {
      name: "roleName",
      label: "角色名称",
      type: "input",
      search: true
    },
    {
      name: "tenantId",
      label: "所属租户",
      search: true,
      queryRender: (value, onChange) => (
        <TreeSelect
          showSearch
          allowClear
          fieldNames={{ label: "tenantName", value: "tenantId", children: "children" }}
          treeData={tenants}
          value={value}
          onChange={onChange}
          placeholder="请选择所属租户"
        ></TreeSelect>
      )
    },
    {
      name: "roleAlias",
      label: "角色别名",
      search: true,
      type: "input"
    },
    {
      name: "ownerApply",
      label: "绑定应用",
      search: true,
      queryRender: (value, onChange) => (
        <Select value={value} onChange={onChange} placeholder="请选择绑定应用">
          {ownerApps.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
      render: (_, record) => record.applyCount
    },
    {
      label: "操作",
      keyIndex: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              style={{ color: token.colorLink }}
            ></Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              style={{ color: token.colorLink }}
            ></Button>
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" danger icon={<DeleteOutlined />} size="small"></Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  const toolbarRender = (
    <Space>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
        新增
      </Button>
      <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDelete}>
        删除
      </Button>
    </Space>
  );

  // 新增
  function handleAddClick() {}

  // 删除
  function handleDelete() {}

  return (
    <TablePageLayout
      search={true}
      formProps={{ labelCol: { span: 5 }, wrapperCol: { span: 19 } }}
      columns={columns}
      toolbarRender={toolbarRender}
      tableProps={{
        showIndex: true,
        requestApi: getRoleList,
        rowKey: "id",
        showPagination: true,
        pageSize: 20
      }}
    ></TablePageLayout>
  );
}
