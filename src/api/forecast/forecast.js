import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-forecast/forecast/list',
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
    url: '/api/blade-forecast/forecast/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-forecast/forecast/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-forecast/forecast/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-forecast/forecast/submit',
    method: 'post',
    data: row
  })
}

