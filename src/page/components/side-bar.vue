<template>
  <div class="sidebar">
    <div class="left-strip" @mouseenter="stripEnter" @mouseleave="stripLeave">
      <div
          style="
          color: #fff;
          font-size: 16px;
          text-align: center;
          line-height: 100%;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        "
      >
        <div v-for="topMenu in navMenu" :key="topMenu.code" class="left-strip-item">
          <wh-std-icon :sign="menuToIcon[topMenu.code]" />
        </div>
      </div>
    </div>
    <el-drawer
        :show-close="false"
        :with-header="false"
        :visible.sync="drawer"
        :modal="false"
        direction="ltr"
        class="menu-drawer"
        custom-class="menu-in"
    >
      <div>
        <div class="side-menu">
          <div
              v-for="(topMenu, index) in navMenu"
              :key="`${topMenu.code}${index}`"
              class="top-menu"
              @mouseenter="topMenuHover(topMenu)"
              @mouseleave="handleLeave"
          >
            <wh-std-icon :sign="menuToIcon[topMenu.code]" style="margin-right: 8px" />
            <a
                v-if="topMenu.name.indexOf('external-link') !== -1"
                :href="topMenu.value"
                style="height: 100%; width: 100%"
                target="_blank"
            >
              {{ topMenu.name }}</a
            >
            <router-link
                v-else-if="!topMenu.children || !topMenu.children.length"
                style="height: 100%; width: 100%"
                :to="{
                name: topMenu.code,
                params: topMenu.params,
                query: { enter: true, ...(topMenu.query || {}) }
              }"
            >
              {{ topMenu.name }}
            </router-link>
            <template v-else>
              <span> {{ topMenu.name }}</span>
            </template>
          </div>
        </div>
        <el-drawer
            :show-close="false"
            :with-header="false"
            :visible.sync="drawer2"
            :modal="false"
            direction="ltr"
            class="menu-drawer-2"
            custom-class="menu-in-2"
        >
          <div class="side-menu" @mouseleave="() => drawerLeave(200)">
            <div
                v-for="(subMenu, index) in currentTopMenu.children"
                :key="`${subMenu.name}${index}`"
            >
              <a
                  v-if="subMenu.code.indexOf('external-link') !== -1"
                  :href="subMenu.value"
                  class="sub-menu"
                  style="height: 100%; width: 100%"
                  target="_blank"
              >{{ subMenu.name }}</a
              >
              <router-link
                  v-else-if="!subMenu.children || !subMenu.children.length"
                  class="sub-menu"
                  :to="{
                  name: subMenu.code,
                  params: subMenu.params,
                  query: { enter: true, ...(subMenu.query || {}) }
                }"
                  :class="{ active: $route.name === subMenu.code }"
              >
                {{ subMenu.name }}
              </router-link>
              <div v-else>
                <div class="sub-menu-group-title">{{ subMenu.name }}</div>
                <div class="sub-menu-group-content">
                  <router-link
                      v-for="(i, index) in subMenu.children"
                      :key="`${i.code}${index}`"
                      class="sub-menu third-level"
                      :to="{
                      name: i.code,
                      params: i.params,
                      query: { enter: true, ...(i.query || {}) }
                    }"
                      :class="{ active: isThirdActive(i) }"
                  >
                    {{ i.name }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </el-drawer>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { MENUS } from '@/constant/constants'
import { safeParse } from '@/global/function/safe-operations'
const menuToIcon = {
  crm: 'xe606',
  client: 'xe6c2',
  order: 'xe789',
  store: 'xe88d',
  data: 'xe600',
  operation: 'xe6c5',
  compliance: 'xe6c3',
  finance: 'xe8ae',
  others: 'xe6c6',
  vpdn: 'xe746',
  cpe: 'xe6c8',
  international: 'xe6c7',
  monitor: 'xe6c1'
}
export default {
  data() {
    return {
      menuToIcon,
      timer: null,
      timer2: null,
      timer3: null,
      currentTopMenu: {},
      navMenu: [],
      drawer2: false,
      drawer: false
    }
  },
  watch: {
    drawer2(newValue) {
      this.drawer = newValue
    },
    $route() {
      this.drawerLeave()
    }
  },
  created() {
    const localMenus = localStorage.getItem(MENUS)
    this.navMenu = safeParse(localMenus)
  },
  methods: {
    isThirdActive(item) {
      if (!item.query && !item.params) {
        return item.code === this.$route.name
      }
      const query = { ...this.$route.query }
      const params = { ...this.$route.params }
      delete query.enter
      return (
          item.code === this.$route.name &&
          (JSON.stringify(query) === JSON.stringify(safeParse(item.value).query) ||
              JSON.stringify(params) === JSON.stringify(safeParse(item.value).params))
      )
    },
    drawerLeave(wait) {
      if (wait) {
        this.timer3 = setTimeout(() => {
          this.drawer = false
          this.drawer2 = false
        }, wait)
        return
      }
      this.drawer = false
      this.drawer2 = false
    },
    handleLeave() {
      clearTimeout(this.timer)
      this.timer = null
    },
    topMenuHover(item) {
      clearTimeout(this.timer3)
      this.timer3 = null
      this.timer = setTimeout(() => {
        this.drawer2 = true
        this.currentTopMenu = item
      }, 150)
    },
    stripEnter() {
      this.timer2 = setTimeout(() => {
        this.drawer = true
      }, 150)
    },
    stripLeave() {
      clearTimeout(this.timer2)
      this.timer2 = null
    }
  }
}
</script>

<style scoped lang="scss">
.top-menu {
  font-size: 14px;
  padding: 0 20px;
  height: 56px;
  line-height: 56px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: #fff;
  &:hover {
    background: #263445;
  }
}
.sub-menu {
  text-align: center;
  display: inline-block;
  padding: 0 20px;
  height: 56px;
  line-height: 56px;
  width: 100%;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  border-bottom: 1px solid #ebeef5;
  &:hover {
    background-color: #ec407a;
    color: #fff;
  }
  &.third-level {
    width: 50%;
    font-size: 12px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    border: none;
  }
  &.active {
    background-color: #ec407a;
    color: #fff;
  }
}
.sub-menu-group-title {
  //border-top: 2px solid #ebeef5;
  padding: 0 15px;
  height: 50px;
  font-size: 14px;
  line-height: 50px;
  text-align: left;
  opacity: 0.7;
  position: relative;
  //&:before {
  //  position: absolute;
  //  left: 10px;
  //  display: inline-block;
  //  content: ' ';
  //  height: 26px;
  //  width: 2px;
  //  margin-top: 12px;
  //  background-color: #999;
  //}
}
.sub-menu-group-content {
  border-bottom: 1px solid #ebeef5;
  background-color: #f6f6f6;
}
.sidebar {
  overflow: hidden;
  .left-strip {
    overflow: hidden;
    z-index: 99;
    display: block;
    position: absolute;
    width: 30px;
    left: 0;
    top: 62px;
    bottom: 0;
    background-color: rgba(48, 65, 86, 0.9);
    .left-strip-item {
      text-align: center;
      height: 56px;
      line-height: 56px;
      color: #fff;
    }
  }
  .side-menu {
    width: 100%;
    overflow-y: auto;
  }
}
</style>
<style lang="scss">
.menu-drawer {
  top: 62px !important;
  left: 0;
  .el-drawer__header {
    display: none;
  }
  .el-drawer__body {
    overflow-y: auto;
  }
}
.menu-drawer-2 {
  top: 62px !important;
  left: 125px !important;
  .el-drawer__header {
    display: none;
  }
}
.menu-in {
  background: rgb(48, 65, 86) !important;
  width: 125px !important;
}
.menu-in-2 {
  overflow-y: auto;
  width: 290px !important;
  .side-menu {
    color: #333;
    background-color: #fff;
  }
}
</style>
