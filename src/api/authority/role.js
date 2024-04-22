import request from "@/api";

// 获取授权应用下拉列表
export const getOwnerApply = () =>
  request({
    url: "/spang-system/role/applyselect",
    method: "get"
  });

// 获取所有租户列表
export const getTenant = () =>
  request({
    url: "/spang-system/tenant/selectAll",
    method: "get"
  });
