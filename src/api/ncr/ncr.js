import request      from '@/router/axios';
import {openApiUrl} from '@/config/env';

export const NCR_STATUS = {
    NOT :10,//未结案
    INIT:30,//已结案
}

export const NCR_STATUS_PAIR = {
    10:'未结案',
    30:'已结案',
}
export const getList         = (current, size, params) => {
    return request({
        url   :'/api/ncr/page',
        method:'get',
        params:{
            ...params,
            current,
            size,
        }
    })
}

export const getDetail = (params) => {
    return request({
        url   :'/api/ncr/detail',
        method:'get',
        params:{
            ...params,
        }
    })
}

export const submit = (row) => {
    return request({
        url   :'/api/ncr/submit',
        method:'post',
        data  :row
    })
}
//ncr回复
export const reply  = (row) => {
    return request({
        url   :'/api/ncr/reply',
        method:'post',
        data  :row
    })
}

export const getCount = () => {
    return request({
        url   :'/api/ncr/getCount',
        method:'get',
    })
}