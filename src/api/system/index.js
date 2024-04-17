import request from '@/api';

export const getDict = (params) =>
  request({
    url: '/spang-system/dict/dictionary',
    method: 'get',
    params,
  });
