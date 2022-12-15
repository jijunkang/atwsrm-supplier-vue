// 配置编译环境和线上环境之间的切换

let baseUrl = '';
let openApiUrl = '';
let uploadUrl = '/api/blade-resource/oss/endpoint/put-file';
let iconfontVersion = ['567566_pwc3oottzol', '1066523_6bvkeuqao36'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`
const env = process.env

if (env.NODE_ENV == 'development') {
    baseUrl = ``; // 开发环境地址
    openApiUrl = `http://atwsrm.bizapi.test.antiwearvalve.com`;
} else if (env.VUE_APP_MODEL == 'prod') {//生产环境地址
    baseUrl = ``; //生产环境地址
    openApiUrl = `http://atwsrm.bizapi.antiwearvalve.com`;
} else if (env.VUE_APP_MODEL == 'test') {  //测试环境地址
    baseUrl = ``; //测试环境地址
    openApiUrl = `http://atwsrm.bizapi.test.antiwearvalve.com`;
} else if (env.VUE_APP_MODEL == 'dev') {  //测试环境地址
    baseUrl = ``; //测试环境地址
    openApiUrl = `http://atwsrm.bizapi.test.antiwearvalve.com`;
}

export {
    openApiUrl,
    baseUrl,
    uploadUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl,
    env
}
