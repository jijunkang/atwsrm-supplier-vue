import request from '@/router/axios';

export const SUPQUA_STATUS = {
    INIT  :10,
    AGREE :20,
    REFUSE:30,
}

export const SUPQUA_STATUS_PAIR = {
    10:'待审核',
    20:'审核通过',
    30:'审核失败',
}

export const list   = (current, size, params) => {
    return request({
        url   :'/api/blade-supplier/supplierQualification/list',
        method:'get',
        params:{
            ...params,
            current,
            size,
        }
    })
}
//提交
export const submit = (row) => {
    return request({
        url   :'/api/blade-supplier/supplierQualification/submit',
        method:'post',
        data  :row
    })
}
