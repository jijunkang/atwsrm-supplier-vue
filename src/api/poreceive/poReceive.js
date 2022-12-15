import request from '@/router/axios';

export const DO_STATUS = {
    10:'初始化',
    20:'送货中',
    25:'待处理',
    30:'已关闭',
}

// 打印
export const poReceive = (param) => {
    return request({
        url: `/api/blade-poreceive/poReceive/create`,
        method: 'post',
        data: param
    })
}

// 补打
export const poReceiveUpdate = (param) => {
    return request({
        url: `/api/blade-poreceive/poReceive/reCreate`,
        method: 'post',
        data: param
    })
}

export const poReceivePage = (param,current = 1, size = 1000) => {
    return request({
        url: `/api/blade-poreceive/poReceive/rcvcodepage`,
        method: 'get',
        params: param,
        current,
        size
    })
}

export const page = (param,current = 1, size = 20) => {
    return request({
        url: `/api/blade-poreceive/poReceive/page`,
        method: 'get',
        params: {
            ...param,
            current,
            size
        },

    })
}

export const doPage = (current, size, param) => {
    return request({
        url: `/api/blade-poreceive/poReceive/doPage`,
        method: 'get',
        params: {
            ...param,
            current,
            size
        },
    })
}

export const doDetail = (current, size, param) => {
    return request({
        url: `/api/blade-poreceive/poReceive/doDetail`,
        method: 'get',
        params: {
            ...param,
            current,
            size
        },
    })
}

// 作废
export const doCancel = (param) => {
    return request({
        url: `/api/blade-poreceive/poReceive/doCancel`,
        method: 'post',
        data: param
    })
}

// 更改物流
export const doBusiness = (param) => {
    return request({
        url: `/api/blade-poreceive/poReceive/doBusiness`,
        method: 'post',
        data: param
    })
}