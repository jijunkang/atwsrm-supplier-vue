import request from '@/router/axios';

//父列表
export const getParentList = (current, size, params) => {
    return request({
        url   :'/api/blade-node/craftctrl/parent-list',
        method:'get',
        params:{
            ...params,
            current,
            size,
        }
    })
}
//子列表
export const getChildList  = (current, size, parentId, params) => {
    return request({
        url   :'/api/blade-node/craftctrl/child-list',
        method:'get',
        params:{
            ...params,
            current,
            size,
            parentId_equal:parentId,
        }
    })
}

export const remove = (ids) => {
    return request({
        url   :'/api/blade-node/craftctrl/remove',
        method:'post',
        params:{
            ids,
        }
    })
}
//新增
export const add    = (row) => {
    return request({
        url   :'/api/blade-node/craftctrl/submit',
        method:'post',
        data  :row
    })
}
//编辑
export const update = (row) => {
    return request({
        url   :'/api/blade-node/craftctrl/update ',
        method:'post',
        data  :row
    })
}

//父编辑获取详情
export const getDict = (id) => {
    return request({
        url   :'/api/blade-node/craftctrl/detail',
        method:'get',
        params:{
            id,
        }
    })
}

export const allParent = (param) => {
    return request({
        url   :'/api/blade-node/craftctrl/allparent',
        method:'get',
        params:param
    })
}