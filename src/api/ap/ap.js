import request from '@/router/axios';

export const AP_STATUS = {
  WAIT       : 0, //待对账
  WAITCHECK  :10, //待审核
  PASS       :20, //已对账
  REFUSE     :30, //已退回
  CHECK1     :40, //一级审核
  CHECK2     :50,//二级审核
  CHECK3     :60,//财务审核
  SUCCESS    :70,//审批通过
  REJECT     :80,//审批被拒
}
export const AP_STATUS_PAIR = {
  10:'待审核',
  20:'已对账',
  30:'已退回',
  40:'一级审核',
  50:'二级审核',
  60:'财务审核',
  70:'审批通过',
  80:'审批被拒',
}

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-ap/ap/page',
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
    url: '/api/blade-ap/ap/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-ap/ap/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-ap/ap/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-ap/ap/submit',
    method: 'post',
    data: row
  })
}
//对账提交
export const dzSubmit = (row) => {
  return request({
    url: '/api/blade-ap/ap/dzsubmit',
    method: 'post',
    data: row
  })
}

//对账提交  -VMI
export const dzSubmitVmi = (row) => {
  return request({
    url: '/api/blade-ap/ap/dzSubmitVmi',
    method: 'post',
    data: row
  })
}




// 到货对账-已对账
export const getApList = (current, size, params) => {
  return request({
    url: '/api/blade-ap/ap/aplist',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

// 到货对账-已对账
export const getVmiApList = (current, size, params) => {
  return request({
    url: '/api/blade-ap/ap/apVmilist',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


//到货对账-已对账详情
export const apDetail = (param) => {
  return request({
    url: `/api/blade-ap/ap/apdetail`,
    method: 'get',
    params: param
  })
}

//到货对账-已对账详情 - vmi
export const apDetailVmi = (param) => {
  return request({
    url: `/api/blade-ap/ap/apdetailVmi`,
    method: 'get',
    params: param
  })
}

//页面标签
export const getStatistics = () => {
  return request({
    url   :'/api/blade-ap/ap/countlist',
    method:'get',
  })
}

//页面标签
export const getVmiStatistics = () => {
  return request({
    url   :'/api/blade-ap/ap/countVmiList',
    method:'get',
  })
}

//待审核、已退回新增提交
export const dtSubmit = (row) => {
  return request({
    url: '/api/blade-ap/ap/dtsubmit',
    method: 'post',
    data: row
  })
}

// 待审核、已退回保存发票
export const subInvoice = (row) => {
  return request({
    url: '/api/blade-ap/ap/subinvoice',
    method: 'post',
    data: row
  })
}
// 待审核、已退回详情删除行
export const dtRemove = (row) => {
  return request({
    url: '/api/blade-ap/ap/dtremove',
    method: 'post',
    data: row
  })
}

//批量生成应付单
export const saveAps = (row) => {
  return request({
    url: '/api/blade-ap/ap/saveaps',
    method: 'post',
    data: row
  })
}
