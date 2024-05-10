import request from '@/api';

export const getDict = (params) =>
  request({
    url: '/sumile-system/dict/dictionary',
    method: 'get',
    params,
  });
