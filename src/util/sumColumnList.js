//统计金额合计(返回需统计的字段与金额合计)
export function totalAmount(opColumn, selectionList){
    let aunColumnArr = opColumn.filter(item => {
        return item.sumprice == true
    })
    let prop         = ''
    let sumColumn    = []
    aunColumnArr.forEach(item => {
        let sum = 0
        prop    = item.prop//字段
        selectionList.forEach(value => {
            sum += Number(value[prop])//字段对应的数值加和
        })
        sumColumn.push({sumName:item.label, sumPrice:sum})
    })
    return sumColumn
}
