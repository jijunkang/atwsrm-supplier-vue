export const calcDate = (date1, date2) => {
  let date3 = date2 - date1;

  let days = Math.floor(date3 / (24 * 3600 * 1000))

  let leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000))

  let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000))

  let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
  let seconds = Math.round(date3 / 1000)
  return {
    leave1,
    leave2,
    leave3,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  }
}

/**
 * 日期格式化
 */
export function dateFormat(date, format) {
  format = format || 'yyyy-MM-dd hh:mm:ss';
  if (date !== 'Invalid Date') {
    let o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      "S": date.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  return '';

}

export  function  Time(unixTime){
  if(unixTime<0){
    return ''
  }
  var date = new Date(unixTime * 1000);
  let Y    = date.getFullYear() + '-';
  let M    = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D    = (date.getDate()<10 ? '0'+date.getDate() :date.getDate()) + ' ';
  let h    = date.getHours() + ':';
  let m    = date.getMinutes() + ':';
  let s    = date.getSeconds();
  return Y + M + D ;
}


export function DateAdd(interval, number, date)
{
  switch (interval) {
    case "y ": {
      date.setFullYear(date.getFullYear() + number);
      return date;
      break;
    }
    case "q ": {
      date.setMonth(date.getMonth() + number * 3);
      return date;
      break;
    }
    case "m ": {
      date.setMonth(date.getMonth() + number);
      return date;
      break;
    }
    case "w ": {
      date.setDate(date.getDate() + number * 7);
      return date;
      break;
    }
    case "d ": {
      date.setDate(date.getDate() + number);
      return date;
      break;
    }
    case "h ": {
      date.setHours(date.getHours() + number);
      return date;
      break;
    }
    case "m ": {
      date.setMinutes(date.getMinutes() + number);
      return date;
      break;
    }
    case "s ": {
      date.setSeconds(date.getSeconds() + number);
      return date;
      break;
    }
    default: {
      date.setDate(d.getDate() + number);
      return date;
      break;
    }
  }
}

export function  mGetDate(){
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var d = new Date(year, month, 0);
  return d.getDate();
}

/**
 * 指定月份 有多少天
 * @param year
 * @param month
 * @returns {number}
 */
export function getMonthDays(year,month){
  var d     = new Date(year, month+1, 0);
  return d.getDate();
}

export function dateAdd(interval, number, date){
  switch(interval){
    case "y":{
      date.setFullYear(date.getFullYear() + number);
      return date;
      break;
    }
    case "q":{
      date.setMonth(date.getMonth() + number * 3);
      return date;
      break;
    }
    case "m":{
      date.setMonth(date.getMonth() + number);
      return date;
      break;
    }
    case "w":{
      date.setDate(date.getDate() + number * 7);
      return date;
      break;
    }
    case "d":{
      date.setDate(date.getDate() + number);
      return date;
      break;
    }
    case "h":{
      date.setHours(date.getHours() + number);
      return date;
      break;
    }
    case "m":{
      date.setMinutes(date.getMinutes() + number);
      return date;
      break;
    }
    case "s":{
      date.setSeconds(date.getSeconds() + number);
      return date;
      break;
    }
    default:{
      date.setDate(d.getDate() + number);
      return date;
      break;
    }
  }
}
