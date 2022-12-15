import store from "../store";
import router from '../router/router';
import {mapGetters} from "vuex";

// vue文件computed中添加“...mapGetters(["tagList","tag"])”
export function menuTag(tagList, thisTag) {
  let tag, key;
  tagList.forEach((item, index) => {
    if (item.value === thisTag.value) {
      tag = item;
      key = index;
    }
  });
  store.commit("DEL_TAG", tag);
  if (tag.value === thisTag.value) {
    tag = tagList[key === 0 ? key : key - 1];
    router.push({
      path: router.$avueRouter.getPath({
        name: tag.label,
        src: tag.value
      }, tag.meta),
      query: tag.query
    });
  }
}
