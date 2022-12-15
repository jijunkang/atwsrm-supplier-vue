import request from '@/router/axios';
import { openApiUrl } from '@/config/env';

export const POITEM_STATUS_PAIR = {
  10:'待下单',
  20:'已下单',
  30:'已关闭',
}

export const getList = (current, size, params) => {
  // params.status = STATUS_INIT;
  return request({
    url   :'/api/blade-po/poitem/page',
    method:'get',
    params:{
      ...params,
      current,
      size,
    }
  })
}
//交付中心
export const getDeliveryList = (current, size, params) => {
  // params.status = STATUS_INIT;
  return request({
    url   :'/api/blade-po/poitem/deliverypage',
    method:'get',
    params:{
      ...params,
      current,
      size,
    }
  })
}
//工艺卡控
export const craftCtrlPage = (current, size, params) => {
  return request({
    url   :'/api/blade-po/poitem/craftctrlpage',
    method:'get',
    params:{
      ...params,
      current,
      size,
    }
  })
}
//修改交期
export const poRemindUpdateDate = (param) => {
  return request({
    url: `${openApiUrl}/openapi/updateconfirmdate`,
    method: 'post',
    data: param
  })
}
//修改交期（更改）
export const submitUpdate = (param) => {
  return request({
    url: '/api/blade-po/poitem/submitupdate',
    method: 'post',
    data: param
  })
}
export const reqReport = (current, size, params) => {
  return request({
    url   :'/api/blade-po/poitem/reqreport',
    method:'get',
    params:{
      ...params,
      current,
      size,
    }
  })
}

export const reqReport2 = (current, size, params) => {
  return request({
    url   :'/api/blade-po/poitem/reqreport2',
    method:'get',
    async:false,
    params:{
      ...params,
      current,
      size,
    }
  })
}

//交付中心批量保存节点
export const savesCraftCtrl = (row) => {
  return request({
    url   :'/api/blade-po/poitem/savescraftctrl',
    method:'post',
    data  :row
  })
}
//维护卡控节点
export const updateCraftCtrl = (row) => {
  return request({
    url   :'/api/blade-po/poitem/updatecraftctrl',
    method:'post',
    data  :row
  })
}
