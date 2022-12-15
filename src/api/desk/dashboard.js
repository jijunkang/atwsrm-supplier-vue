import request from '@/router/axios';

export const taskstatistics = () => {
    return request({
        url: '/api/blade-desk/dashboard/taskstatistics',
        method: 'get',
    })
}
