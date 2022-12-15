import request from '@/router/axios';

export const IO_STATUS = {
  INIT          :10,// 未报价
  UN_TENDER     :20,// 未投标
  QUOTED        :30,// 已报价
  LOSEBID       :40,// 未中标
  WINBID_UNCHECK:50,// 中标待审核
  WINBID_CHECK1 :51,// 中标一级审核通过
  WINBID_CHECK2 :52,// 中标一级审核已阅
  WINBID_WARNING:60,// 中标预警
  WINBID_REJECT :70,// 审核拒绝
  WAIT          :80,//待下单
  CLOSE         :90,//关闭
};

export const getInquiringPage = (current, size, params) => {
  return request({
    url: '/api/blade-io/io/inquiringPage',
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
    url: '/api/blade-io/io/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-io/io/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-io/io/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-io/io/submit',
    method: 'post',
    data: row
  })
}

export const subPrice = (row) => {
  return request({
    url: '/api/blade-io/io/submitPrice',
    method: 'post',
    data: row
  })
}
