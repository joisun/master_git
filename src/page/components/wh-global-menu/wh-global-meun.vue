<template>
  <div class="wh-global-menu">
    <div
      v-for="topMenu in navMenu"
      :key="topMenu.name"
      class="app__menu--item"
      @click="handleHover(topMenu)"
    >
      <span>{{ topMenu.name }}</span>
    </div>
    <div v-if="currentTop" class="wh-global-menu-drop">
      <div class="menu-drop-left"></div>
      <div class="menu-drop-right">
        <div v-for="btn in currentTop.children" :key="btn.name">
          <router-link
            v-if="btn.link"
            :to="{
              name: btn.link,
              params: btn.params,
              query: { enter: true, ...(btn.query || {}) }
            }"
            class="menu-drop-item"
            :class="{ active: $route.name === btn.link }"
          >
            {{ btn.name }}
          </router-link>
          <div v-else class="menu-drop-item-group">
            <span class="menu-drop-item">{{ btn.name }}</span>
            <template v-if="btn.complex">
              <span v-for="i in btn.complex" :key="i.key">
                <router-link
                  :to="{
                    name: i.link,
                    params: i.params,
                    query: { enter: true, ...(i.query || {}) }
                  }"
                  class="menu-drop-item-sub"
                >
                  {{ i.name }}
                </router-link>
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MENUS } from '@/constant/constants'
import { safeParse } from '@/global/function/safe-operations'
export default {
  data() {
    return {
      navMenu: [],
      currentTop: null
    }
  },
  computed: {},
  mounted() {
    const localMenus = localStorage.getItem(MENUS)
    this.navMenu = safeParse(localMenus)
  },
  methods: {
    handleHover(current) {
      this.currentTop = current
    }
  }
}
</script>

<style lang="scss" scoped>
.wh-global-menu {
  .wh-global-menu-drop {
    position: absolute;
    left: 0;
    top: 60px;
    width: 100%;
    height: auto;
    z-index: 999;
    background-color: #fff;
    box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.07);
    padding-left: 150px;
    .menu-drop-right {
      .menu-drop-item {
        display: inline-block;
        font-size: 16px;
        color: #333;
        margin-right: 20px;
        padding: 10px 10px 10px 0;
        &:hover {
          color: #ec407a;
        }
      }
      .menu-drop-item-group {
        position: relative;
        .menu-drop-item {
          position: relative;
          display: block;
          padding-left: 10px;
          &::before {
            position: absolute;
            display: inline-block;
            content: ' ';
            width: 5px;
            height: 20px;
            background-color: #ec407a;
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
          }
          &:hover {
            color: #333;
          }
        }
        .menu-drop-item-sub {
          display: inline-block;
          margin-right: 20px;
          font-size: 14px;
          color: #696969;
          padding: 10px;
          &:hover {
            color: #ec407a;
          }
        }
      }
    }
  }
}
</style>
