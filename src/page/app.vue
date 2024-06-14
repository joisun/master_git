<template>
  <div class="app">
    <header class="app__header">
      <div class="app__logo">
        <router-link to="/customers">
          <img
            src="https://simboss-public.oss-cn-hangzhou.aliyuncs.com/pentagon/img/frame/simboss-logo-active.png"
            alt=""
            width="120px"
            height="30px"
          />
        </router-link>
        <router-link to="/customers" class="app__logo--font">
          <span>WhiteHouse</span>
        </router-link>
      </div>
      <wh-global-search v-if="navMenu.length" ref="whGlobalSearch" />
      <div>
        <el-button class="donwload-manage-btn" @click="() => $router.push({name: 'download'})">
          <wh-std-icon sign="xe635" />
        </el-button>
        <el-dropdown>
          <span v-loading="loadingUser" class="el-dropdown-link" style="cursor: pointer">
            {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-switch-button" @click.native="logout"
              >退出系统</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <section class="app__content">
      <side-bar v-if="navMenu.length" />
      <keep-alive>
        <transition name="fade" mode="out-in">
          <router-view :child-page-index="childPageIndex" class="wh__content"> </router-view>
        </transition>
      </keep-alive>
    </section>
    <services-selector v-if="showApiSelector" ref="servicesSelector" />
  </div>
</template>

<script type="text/ecmascript-6">
import WhGlobalSearch from '@/page/components/wh-global-search/wh-global-search'
import removeCodeSuffix from '@/global/function/remove-code-suffix'
import { MENUS } from '@/constant/constants'
import SideBar from '@/page/components/side-bar.vue'
import ServicesSelector from "@/global/components/services-selector.vue";
// TODO 分离相关
const isOnline = window.location.host === 'whitehouse.simboss.com' || window.location.host === 'whitehouse-new.simboss.com'
export default {
  components: {
    WhGlobalSearch,
    SideBar,
    ServicesSelector
  },
  data() {
    return {
      userName: '',
      childPageIndex: 1,
      navMenu: [],
      loadingUser: false,
      userDep: ''
    }
  },
  computed: {
    showApiSelector() {
      return process.env.NODE_ENV === 'development' || window.location.host.indexOf('test.simboss')!==-1
    }
  },
  created() {
    this.loadUser()
    this.$store.dispatch('getSales')
    this.$store.dispatch('changeAccountList')
    this.$store.dispatch('getUrl')
  },
  methods: {
    async getMenusFromAuthing() {
      const res = await this.jaxLib.common.auth.getMenus({ isOnline })
      this.navMenu = removeCodeSuffix(res.data)
      localStorage.setItem(MENUS, JSON.stringify(this.navMenu))
    },
    async loadUser() {
      this.loadingUser = true
      let rst = await this.$store.dispatch('loadUser')
      this.loadingUser = false
      if (!rst) return false
      this.userName = rst.realName
      await this.getMenusFromAuthing()
    },
    // 登出机制、node端登出后，跳转到登录页面
    logout() {
      localStorage.setItem(MENUS, '')
      window.location.href = '/logout'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "../sass/style-output.scss";
</style>

<style lang="scss">
.donwload-manage-btn {
  margin: 12px 20px 0 0;
  text-decoration: none;
  border: none !important;
  font-size: 16px;
  color: #303133 !important;
}
</style>
