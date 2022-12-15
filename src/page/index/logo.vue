<template>
  <div class="avue-logo">
    <transition name="fade">
      <span v-if="keyCollapse"
            class="avue-logo_subtitle"
            key="0">
        {{website.logo}}
      </span>
    </transition>
    <transition-group name="fade">
      <template v-if="!keyCollapse">
        <span class="avue-logo_title"
              key="1">
          <div>
<!--            <img src="img/bg/img-logo.png"-->
<!--                 width="30"-->
<!--                 alt="">-->
<!--{{website.indexTitle}}-->
          </div>
        </span>
          <span key="1" class="avue-logo_userInfo">{{userInfo.tenant_id}}
<!--       <img class="top-bar__img"-->
<!--                         :src="userInfo.avatar">-->
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.userName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">{{$t('navbar.dashboard')}}</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">{{$t('navbar.userinfo')}}</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout"
                            divided>{{$t('navbar.logOut')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
          </span>
      </template>
    </transition-group>
  </div>
</template>

<script>
    import {resetRouter} from '@/router/router'
import { mapGetters } from "vuex";
export default {
  name: "logo",
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapGetters(["website", "keyCollapse","userInfo"])
  },
  methods: {
      logout() {
          this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
              confirmButtonText: this.$t("submitText"),
              cancelButtonText: this.$t("cancelText"),
              type: "warning"
          }).then(() => {
              this.$store.dispatch("LogOut").then(() => {
                  resetRouter();
                  this.$router.push({path: "/login"});
              });
          });
      }
  }
};
</script>

<style lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.avue-logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 190px;
  height: 60px; //64px
  line-height: 60px;
  background-color: #20222a;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;
  &_title {
    display: block;
    text-align: center;
    font-weight: 300;
    font-size: 16px;
    div {
      display: flex;
      align-items: center;
      justify-content: left;
      padding-left: 10px;
      width: 100%;
      img {
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
  }
    &_userInfo{
        display: block;
        text-align: center;
        font-weight: 300;
        font-size: 16px;
    }
  &_subtitle {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
}
</style>
