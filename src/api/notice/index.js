import request from '@/api';

export const getList = (params) =>
  request({
    url: '/spang-system/notice/list',
    method: 'get',
    params,
  });

  export const remove = (ids) => {
    return request({
      url: "/spang-system/notice/remove",
      method: "post",
      params: {
        ids
      }
    });
  };

  export const add = (row) => {
    return request({
      url: "/spang-system/notice/submit",
      method: "post",
      data: row
    });
  };

  export const update = (row) => {
    return request({
      url: "/spang-system/notice/submit",
      method: "post",
      data: row
    });
  };

  export const getNotice = (id) => {
    return request({
      url: "/spang-system/notice/detail",
      method: "get",
      params: {
        id
      }
    });
  };