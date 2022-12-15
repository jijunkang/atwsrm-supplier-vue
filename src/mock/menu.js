import Mock from 'mockjs'

const top = [{
  label: "我的中心",
  path: "/wel/index",
  icon: 'el-icon-menu',
  meta: {
    i18n: 'dashboard',
  },
  parentId: 0
},
  {
    label: "睿途科技官网",
    icon: 'el-icon-document',
    meta: {
      i18n: 'website',
    },
    path: "http://ruitukeji.com/#/",
    parentId: 1
  },
  {
    label: "睿途科技官网",
    icon: 'el-icon-document',
    meta: {
      i18n: 'avuexwebsite',
    },
    path: "http://ruitukeji.com/#/",
    parentId: 2
  },
  {
    label: "测试",
    icon: 'el-icon-document',
    path: "/test/index",
    meta: {
      i18n: 'test',
    },
    parentId: 3
  }]
export default ({mock}) => {
  if (!mock) return;
  Mock.mock('/user/getTopMenu', 'get', () => {
    return {
      data: top
    }
  })

}
