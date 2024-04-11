import request from '@/api';

export const getList = (params) =>
  request({
    url: '/spang-system/notice/list',
    method: 'get',
    params,
  });
