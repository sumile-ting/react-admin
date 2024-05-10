import request from "@/api";

// 获取授权应用下拉列表
export const getOwnerApply = () =>
  request({
    url: "/sumile-system/role/applyselect",
    method: "get"
  });

// 获取所有租户列表
export const getTenant = () =>
  request({
    url: "/sumile-system/tenant/selectAll",
    method: "get"
  });

// 获取角色管理列表数据
export const getRoleList = (params) => {
  return request({
    url: "/sumile-system/role/list-apply",
    method: "get",
    params: {
      ...params
    }
  });
};
