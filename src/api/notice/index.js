import request from '@/api';

export const getList = (params) =>
  request({
    url: "/sumile-system/notice/list",
    method: "get",
    params
  });

export const remove = (ids) => {
  return request({
    url: "/sumile-system/notice/remove",
    method: "post",
    params: {
      ids
    }
  });
};

export const add = (row) => {
  return request({
    url: "/sumile-system/notice/submit",
    method: "post",
    data: row
  });
};

export const update = (row) => {
  return request({
    url: "/sumile-system/notice/submit",
    method: "post",
    data: row
  });
};

export const getNotice = (id) => {
  return request({
    url: "/sumile-system/notice/detail",
    method: "get",
    params: {
      id
    }
  });
};