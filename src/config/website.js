/**
 * 全局配置文件
 */
export default {
  title: "管理平台",
  logo: "S",
  key: 'atvsrm_sup',//配置主键,目前用于存储
  indexTitle: ' 采购与供应商管理平台',
  clientId: 'atvsrm_sup', // 客户端id
  clientSecret: 'atvsrm_sup_secret', // 客户端密钥
  tenantMode: true, // 是否开启租户模式
  lockPage: '/lock',
  tokenTime: 3000,
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: true,
  fistPage: {
    label: "我的中心",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children'
    }
  },
  // 流程设计器地址
  flowDesignUrl: 'http://localhost:9999',
}
