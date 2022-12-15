import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-supplier/supplier/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-supplier/supplier/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-supplier/supplier/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-supplier/supplier/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-supplier/supplier/submit',
    method: 'post',
    data: row
  })
}

//供应商中心/blade-supplier/supplier/info
export const info = (current, size, params) => {
  return request({
    url: '/api/blade-supplier/supplier/info ',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
//上传图片/blade-supplier/supplier/update

export const upload = (row) => {
  return request({
    url: '/api/blade-supplier/supplier/update',
    method: 'post',
    data: row
  })
}


export const getCaiGouSchedule = (current, size, params) => {
  return request({
    url: '/api/blade-supplier/supplier/caiGouSchedule',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

//批量保存数据
export const saveDataOfCaiGou = (row) => {
  return request({
    url: '/api/blade-supplier/supplier/saveDataOfCaiGou',
    method: 'post',
    data: row
  })
}
