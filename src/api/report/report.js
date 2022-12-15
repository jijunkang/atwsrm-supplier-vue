import request from '@/router/axios';

export const postExample = (row) => {
  return request({
    url: '/api/sup-supplier/supplier/update',
    method: 'post',
    data: row
  })
}

export const getExample= (current, size, params) => {
  return request({
    url: '/api/sup-supplier/supplier/caiGouSchedule',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

// vmi物料消耗报表
export const getVmiConsumeReport = (current, size, params) => {
  return request({
    url: '/api/sup-report/report/vmiConsume',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}





