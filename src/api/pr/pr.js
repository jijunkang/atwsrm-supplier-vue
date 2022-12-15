import request from '@/router/axios';
import {openApiUrl} from '@/config/env';

export const INQUIRY_WAY = {
    ASSIGN              : 'assign',               //指定供应商
    COMPETE             : 'compete',              //供应商询价
    EXCLUSIVE           : 'exclusive',            //独家采购
    HAVE_PRICE1DATE     : 'have_price1date',      //有价格询交期
    HAVE_PRICE          : 'have_price',           //有价格
    HAVE_MODEL          : 'have_model',           //数字模型
    HAVE_PROTOCOL       : 'have_protocol',        // 框架协议
    NO_SUP              : 'no_sup',               // 无供应商
}

