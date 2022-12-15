import request from '@/router/axios';

export const OUTPREORDER_STATUS = {
  WAIT_ACCEPT:10,//待接单
  RECEIVED:20,//已接单
  REJECT:30,//拒绝接单
  BUYER_CONFIRM:40,//采购员已确认
  CHECK1:41,//一级审核已阅
  BUYER_REJECT:50,//采购员已拒绝
  WAIT:60,//待下单
  ORDER_PLACED:70,//已下单

};

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-outpr/preorder/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const accept = (row) => {
  return request({
    url: '/api/blade-outpr/preorder/accept',
    method: 'post',
    data: row
  })
}

export const unaccept = (row) => {
  return request({
    url: '/api/blade-outpr/preorder/unaccept',
    method: 'post',
    data: row
  })
}


