import request from '@/router/axios';

export const getList = (current, size, params) => {
    return request({
        url: '/api/blade-po/poSignFor/page',
        method: 'get',
        params: {
            ...params,
            current,
            size,
        }
    })
}

// 自动获取物料对应的供应商信息
export const signFor = (params) => {
    return request({
        url: '/api/blade-po/poSignFor/signFor',
        method: 'post',
        data: params
    })
}