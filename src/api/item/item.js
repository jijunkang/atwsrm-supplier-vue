import request from '@/router/axios';
import {openApiUrl} from '@/config/env';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-item/item/list',
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
    url: '/api/blade-item/item/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-item/item/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-item/item/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-item/item/submit',
    method: 'post',
    data: row
  })
}
//下载四图纸
export const getItemdDwg = (itemCode) => {
  return request({
    url    :openApiUrl + '/openapi/getitemdwg',
    method: 'get',
    params: {
      ...itemCode
    }
  })
}

export const getItemCraft = (itemCode) => {
  return request({
    url    :openApiUrl + '/openapi/getitemcraft',
    method: 'get',
    params: {
      ...itemCode
    }
  })
}
export const getItemCheck = (itemCode) => {
  return request({
    url    :openApiUrl + '/openapi/getitemcheck',
    method: 'get',
    params: {
      ...itemCode
    }
  })
}
export const getItemProcess = (itemCode) => {
  return request({
    url    :openApiUrl + '/openapi/getitemprocess',
    method: 'get',
    params: {
      ...itemCode
    }
  })
}

