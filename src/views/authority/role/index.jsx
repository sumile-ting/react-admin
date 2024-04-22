import TablePageLayout from "@/components/TablePageLayout";
import { Select, TreeSelect } from "antd";
import { getOwnerApply, getTenant } from "@/api/authority/role";
import { useEffect, useState } from "react";
export default function Role() {
  const { Option } = Select;

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
      )
    }
  ];

  function onQuery(values) {
    console.log("查询条件：：", values);
  }
  return <TablePageLayout search={true} columns={columns} onQuery={onQuery}></TablePageLayout>;
}
