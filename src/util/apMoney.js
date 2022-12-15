
export function apmoney(row) {
    if(row.type=='KK'){
        row.recThisQty = -1
        let taxSubTotal = row.taxSubTotal //价税合计
        row.taxSubTotal = taxSubTotal.toFixed(2)
        let noTaxAmount = taxSubTotal / (1 + row.taxRate) //未税金额
        row.noTaxAmount = noTaxAmount.toFixed(2)
        let taxAmount = taxSubTotal - noTaxAmount //税额
        row.taxAmount = taxAmount.toFixed(2)
        return row
    }else{
        if(!row.recThisQty){
            row.recThisQty = row.rcvActualQty - row.accumRecQty
        }
        let taxSubTotal = row.recThisQty * row.taxPrice //价税合计
        row.taxSubTotal = taxSubTotal.toFixed(2)
        let noTaxAmount = taxSubTotal / (1 + row.taxRate) //未税金额
        row.noTaxAmount = noTaxAmount.toFixed(2)
        let taxAmount = taxSubTotal - noTaxAmount //税额
        row.taxAmount = taxAmount.toFixed(2)
        return row;
    }
}