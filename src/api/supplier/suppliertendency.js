import request from '@/router/axios';

export const chart = () => {
    return request({
        url: '/api/blade-supplier-tendency/suppliertendency/chart',
        method: 'get',
        params: {

        }
    })
}