import request from '@/router/axios';

//订单状态
export const PO_STATUS = {
    INIT           :10,   //下单成功 待供应商确认
    CANCEL         :20,   // 供应商取消
    SUPSURE        :30,   //供应商确认 待上传合同
    UPLOAD_CONTRACT:40,   //供应商已上传合同 合同待审核
    EXECUTING      :50,   //合同审核通过 执行中
    CONTRACT_REFUSE:60,   //合同拒绝
    CLOSE          :70,   //关闭 正常关闭 取消关闭
}

//合同状态
export const CON_STATUS     = {
    INIT   :10,   //待上传合同
    AUDIT  :20,   // 待审核
    SUCCESS:30,   //审核通过
    FAIL   :40,   //审核拒绝
}
export const PO_STATUS_PAIR = {
    10:'待确认',   //下单成功 待供应商确认
    20:'退回',   // 供应商取消
    30:'待上传',   //供应商确认 待上传合同
    40:'待审核',   //供应商已上传合同 合同待审核
    50:'执行中',   //合同审核通过 执行中
    60:'合同拒绝',   //合同拒绝
    70:'关闭',   //关闭 正常关闭 取消关闭
}

export const getList = (current, size, params) => {
    return request({
        url   :'/api/blade-po/po/page',
        method:'get',
        params:{
            ...params,
            current,
            size,
        }
    })
}


export const getVmiList = (current, size, params) => {
    return request({
        url   :'/api/blade-po/po/vmiPage',
        method:'get',
        params:{
            ...params,
            current,
            size,
        }
    })
}

export const getDetail = (id) => {
    return request({
        url   :'/api/blade-po/po/detail',
        method:'get',
        params:{
            id
        }
    })
}

export const remove = (ids) => {
    return request({
        url   :'/api/blade-po/po/remove',
        method:'post',
        params:{
            ids,
        }
    })
}

export const add = (row) => {
    return request({
        url   :'/api/blade-po/po/submit',
        method:'post',
        data  :row
    })
}

export const update         = (row) => {
    return request({
        url   :'/api/blade-po/po/submit',
        method:'post',
        data  :row
    })
}
export const getPoItem      = (current, size, poId) => {
    return request({
        url   :'/api/blade-po/poitem/page',
        method:'get',
        params:{
            ascs:'po_ln',
            current,
            size,
            poId,
        }
    })
}
//确认订单
export const accept         = (row) => {
    return request({
        url   :'/api/blade-po/po/accept',
        method:'post',
        data  :row
    })
}
//上传合同
export const uploadContract = (row) => {
    return request({
        url   :'/api/blade-po/po/uploadcontract',
        method:'post',
        data  :row
    })
}
//取消订单
export const cancel         = (row) => {
    return request({
        url   :'/api/blade-po/po/cancel',
        method:'post',
        data  :row
    })
}
//上传合同
export const updatecontract = (row) => {
    return request({
        url   :'/api/blade-po/po/updatecontract',
        method:'post',
        data  :row
    })
}

export const getVmiInfo      = (current, size, poCode) => {
    return request({
        url   :'/api/blade-po/poitem/vmiContractPage',
        method:'get',
        params:{
            current,
            size,
            poCode,
        }
    })
}

export const getPoStatus = () => {
    return request({
        url: '/api/blade-system/dict-biz/dictionary?code=po_status',
        method: 'get'
    })
}
