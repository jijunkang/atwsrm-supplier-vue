function getEffectiveDate(){
    const dateTime = new Date()
    const year     = dateTime.getFullYear()
    const month    = dateTime.getMonth() + 1
    const date     = dateTime.getDate()
    const hour     = dateTime.getHours()
    const minute   = dateTime.getMinutes()
    const second   = dateTime.getSeconds()
    return `${year}-${this.addZero(month)}-${this.addZero(date)}`
}

function addZero(v){
    return v < 10 ? '0' + v : v
}

/**
 * 时间戳转字符串
 */
function Time(unixTime){
    var date = new Date(unixTime * 1000);
    let Y    = date.getFullYear() + '-';
    let M    = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D    = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    let h    = date.getHours() + ':';
    let m    = date.getMinutes() + ':';
    let s    = date.getSeconds();
    return Y + M + D;
}

/**
 * 获取URL参数
 * 如果有中文参数：encodeURI(url)
 * @param name
 * @returns {null}
 * @constructor
 */
function getUrlParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r   = window.location.search.substr(1).match(reg);
    if(r != null) return decodeURIComponent(r[2]);
    return null;
}

/**
 *数字转大写
 */
function number_chinese(num){
    var strOutput = "",
        strUnit   = '仟佰拾亿仟佰拾万仟佰拾元角分';
    num += "00";
    var intPos    = num.indexOf('.');
    if(intPos >= 0){
        num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
    }
    strUnit = strUnit.substr(strUnit.length - num.length);
    for(var i = 0; i < num.length; i++){
        strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
    }
    return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元")

}

/**
 *保留两位小数点
 */
function formatMoney(num){
    if(!num || num < 0){
        return '0.00';
    }
    num = num.toString().replace(/\$|\,/g, '');
    if(isNaN(num))
        num = "0";
    let sign  = (num == (num = Math.abs(num)));
    num       = Math.floor(num * 100 + 0.50000000001);
    let cents = num % 100;
    num       = Math.floor(num / 100).toString();
    if(cents < 10)
        cents = "0" + cents;
    for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
          num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}
