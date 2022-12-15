import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-ap/aprcv/page',
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
    url: '/api/blade-ap/aprcv/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-ap/aprcv/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-ap/aprcv/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-ap/aprcv/submit',
    method: 'post',
    data: row
  })
}

//到货对账列表（待对账）
export const getPageList = (current, size, params) => {
  return request({
    url: '/api/blade-ap/aprcv/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


//到货对账列表（待对账）[vmi]
export const getVmiPageList = (current, size, params) => {
  return request({
    url: '/api/blade-ap/aprcv/vmiList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const uploadContract = (row) => {
  return request({
    url: '/api/blade-ap/aprcv/uploadContract',
    method: 'post',
    data: row
  })
}

