import {setStore, getStore} from '@/util/store'
import {diff} from '@/util/util'
import website from '@/config/website'

const isFirstPage = website.isFirstPage;
const tagWel = website.fistPage;
const tagObj = {
  label: '', //标题名称
  value: '', //标题的路径
  params: '', //标题的路径参数
  query: '', //标题的参数
  meta: {},//额外参数
  group: [], //模型
}

//处理首个标签
function setFistTag(list) {
  if (list.length == 1) {
    list[0].close = false;
  } else {
    list.forEach(ele => {
      if (ele.value === tagWel.value && isFirstPage === false) {
        ele.close = false
      } else {
        ele.close = true
      }
    })
  }
}


const navs = {
  state: {
    tagList: getStore({name: 'tagList'}) || [],
    tag: getStore({name: 'tag'}) || tagObj,
    tagWel: tagWel
  },
  actions: {},
  mutations: {
    ADD_TAG: (state, action) => {
      state.tag = action;
      setStore({name: 'tag', content: state.tag, type: 'session'})
      //新路由或已经存在tag的路由参数不同自动添加tagList
      // if (state.tagList.some(ele => diff(ele, action))) return
      //判断有多个相同路由但参数不同时自动合并相同路由的tag
      if (state.tagList.some((ele, index) => {
        if (ele.value.lastIndexOf("?") !== -1 || action.value.lastIndexOf("?") !== -1) {
          let listItem = ele.value.substring(0, ele.value.lastIndexOf("?"));
          let item = action.value.substring(0, action.value.lastIndexOf("?"));
          if (listItem === item || listItem === action.value || item === ele.value) {
            state.tagList.splice(index, 1, action);
            return true;
          }
        }else if (ele.value === action.value) {
          return true;
        }
      })) return
      state.tagList.push(action);
      setFistTag(state.tagList);
      setStore({name: 'tagList', content: state.tagList, type: 'session'})
    },
    DEL_TAG: (state, action) => {
      state.tagList = state.tagList.filter(item => {
        return !diff(item, action);
      })
      setFistTag(state.tagList);
      setStore({name: 'tagList', content: state.tagList, type: 'session'})
    },
    DEL_ALL_TAG: (state) => {
      state.tagList = [state.tagWel];
      setStore({name: 'tagList', content: state.tagList, type: 'session'})
    },
    DEL_TAG_OTHER: (state) => {
      state.tagList = state.tagList.filter(item => {
        if (item.value === state.tag.value) {
          return true;
        } else if (!website.isFirstPage && item.value === website.fistPage.value) {
          return true;
        }
      })
      setFistTag(state.tagList);
      setStore({name: 'tagList', content: state.tagList, type: 'session'})
    },
  }
}
export default navs
