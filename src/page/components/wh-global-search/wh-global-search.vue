<template>
  <div style="justify-self: center; z-index: 99">
    <el-input
      ref="searchInput"
      v-model.trim="search"
      class="search-input"
      placeholder="支持菜单名、ICCID、客户ID、订单ID等 输入 / 则搜索全部菜单"
      size="large"
      clearable
      type="text"
      @focus="open"
    />
    <div v-if="visible" class="global-search-wrap" @click.self="visible = false"></div>
    <div v-show="visible" class="list-content-wrap">
      <div class="list-content">
        <el-row>
          <template v-if="!search">
            <template
              v-if="
                !Object.keys(searchHistory || {}).length &&
                !favoriteList.length &&
                !commonAccessList.length
              "
            >
              <el-col style="text-align: center">暂无内容，尝试输入 / 查询所有菜单</el-col>
            </template>
            <div v-if="Object.keys(searchHistory || {}).length" style="margin-bottom: 10px">
              <el-tag
                v-for="item in computedHistory"
                :key="item.name"
                style="margin: 0 2px 2px 0; cursor: pointer"
                @click="jump(item)"
                >{{ item.name }}</el-tag
              >
            </div>
            <div
              v-for="(key, value) in {
                favoriteList: favoriteList,
                commonAccessList: commonAccessList
              }"
              :key="value"
            >
              <span v-if="Object.keys(key).length" class="card-item-title"
                >{{ value === 'favoriteList' ? '个人收藏' : '常用' }}
              </span>
              <el-col v-for="item in key" :key="item.key" :span="24" style="margin-bottom: 8px">
                <el-card style="cursor: pointer" shadow="hover" @click.native="jump(item)">
                  <div class="card-item-inner">
                    <span>
                      {{ item.name }}
                      <span style="font-size: 12px; color: #666; margin-left: 12px"
                        >{{ item.parent }}{{ item.parent2 ? ' / ' + item.parent2 : '' }} /
                        {{ item.name }}</span
                      >
                    </span>
                    <div class="icon-wrap">
                      <div class="icon-item" @click="favorite($event, item)">
                        <i v-if="favoriteData[item.code]" class="el-icon-star-on" />
                        <i v-else class="el-icon-star-off" />
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </div>
          </template>
          <template v-else-if="specialMatchesList.length">
            <el-col
              v-for="(item, index) in specialMatchesList"
              :key="index"
              :span="24"
              style="margin-bottom: 12px"
            >
              <el-card style="cursor: pointer" shadow="hover" @click.native="jump(item)">
                <div class="card-item-inner">
                  <span>
                    {{ item.name }}
                  </span>
                </div>
              </el-card>
            </el-col>
          </template>
          <template v-else-if="menuResultList.length">
            <el-col
              v-for="(item, index) in menuResultList"
              :key="item.key"
              :span="24"
              style="margin-bottom: 12px"
            >
              <span class="card-item-title">
                <template v-if="showMenuResultTitle(item, index)">
                  {{ item.parent }}
                </template>
              </span>
              <el-card style="cursor: pointer" shadow="hover" @click.native="jump(item)">
                <div class="card-item-inner">
                  <span>
                    {{ item.name }}
                    <span style="font-size: 12px; color: #666; margin-left: 12px"
                      >{{ item.parent }}{{ item.parent2 ? ' / ' + item.parent2 : '' }} /
                      {{ item.name }}</span
                    >
                  </span>
                  <div class="icon-wrap">
                    <div class="icon-item" @click="favorite($event, item)">
                      <i v-if="favoriteData[item.code]" class="el-icon-star-on" />
                      <i v-else class="el-icon-star-off" />
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </template>
          <template v-else>
            <el-col style="text-align: center">暂无内容，尝试输入 / 查询所有菜单</el-col>
          </template>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { MENUS } from '@/constant/constants'
import { safeParse } from '@/global/function/safe-operations'
import {
  isIp,
  isMSISDN,
  isOrgId,
  isPhoneNumber,
  isValidICCID,
  isValidIMSI,
  isValidIntlOrderNumber,
  isValidOrderNumber
} from '@/page/components/wh-global-search/helper'

const menuMapFlat = []
export const STORE_KEY = 'GOLBAL_SEARCH'

export default {
  data() {
    return {
      menuMapFlat,
      visible: false,
      search: '',
      commonAccess: {},
      favoriteData: {},
      searchHistory: {}
    }
  },
  computed: {
    computedHistory() {
      const { searchHistory } = this
      return Object.keys(searchHistory)
        .sort((a, b) => searchHistory[b].no - searchHistory[a].no)
        .slice(0, 10)
        .map((item) => searchHistory[item])
    },
    specialMatchesList() {
      return this.specialMatches()
    },
    menuResultList() {
      if (this.search === '/') return this.menuMapFlat

      return menuMapFlat.filter((item) => {
        const keyword = this.search.replace('/', '').toUpperCase()
        return (
          item.name.indexOf(keyword) > -1 ||
          (item.parent && item.parent.indexOf(keyword) > -1) ||
          (item.parent2 && item.parent2.indexOf(keyword) > -1)
        )
      })
    },
    commonAccessList() {
      return this.menuMapFlat
        .filter((item) => this.commonAccess[item.code] && !this.favoriteData[item.code])
        .sort((a, b) => this.commonAccess[b.code] - this.commonAccess[a.code])
        .slice(0, 5)
    },
    favoriteList() {
      return this.menuMapFlat.filter((item) => this.favoriteData[item.code])
    }
  },
  mounted() {
    document.onkeydown = (event) => {
      let key = window.event.keyCode
      if (key === 75 && event.ctrlKey) {
        this.open()
      }
      if (key === 27) {
        this.visible = false
      }
    }
  },
  methods: {
    showMenuResultTitle(item, index) {
      const { menuResultList } = this
      return (
        index === 0 ||
        (menuResultList[index - 1] && item.parent !== menuResultList[index - 1].parent)
      )
    },
    specialMatches() {
      if (isValidOrderNumber(this.search)) {
        return [
          {
            code: 'order-list',
            name: '国内卡订单列表搜索： ' + this.search,
            query: { order_no: this.search }
          },
          {
            code: 'cpe-order-list',
            name: 'CPE订单列表搜索： ' + this.search,
            query: { tradeNo: this.search }
          }
        ]
      }
      if (isOrgId(this.search)) {
        return [
          {
            code: 'client-list',
            name: '卡平台客户列表搜索： ' + this.search,
            query: { id: this.search }
          },
          {
            code: 'cpe-client-list',
            name: 'CPE客户列表搜索： ' + this.search,
            query: { searchInput: this.search }
          }
        ]
      }
      if (isValidICCID(this.search)) {
        return [
          {
            code: 'store-card-list',
            name: '卡片管理搜索ICCID： ' + this.search,
            query: { search: this.search }
          }
        ]
      }
      if (isValidIMSI(this.search)) {
        return [
          {
            code: 'store-card-list',
            name: '卡片管理搜索IMSI ' + this.search,
            query: { search: this.search }
          }
        ]
      }
      if (isPhoneNumber(this.search)) {
        return [
          {
            code: 'store-card-list',
            name: '卡片管理搜索卡号码： ' + this.search,
            query: { search: this.search }
          }
        ]
      }
      if (isIp(this.search)) {
        return [
          {
            code: 'store-card-list',
            name: '卡片管理搜索卡IP： ' + this.search,
            query: { search: this.search }
          }
        ]
      }
      // TODO
      // if (isValidIntlOrderNumber(this.search)) {
      //   return [
      //     {
      //       code: 'international-order-list',
      //       name: '国际卡订单列表搜索： ' + this.search
      //     }
      //   ]
      // }

      return []
    },
    initMenus() {
      if (menuMapFlat.length) {
        return
      }
      const menuMap = safeParse(localStorage.getItem(MENUS))
      menuMap.forEach((item) => {
        if (item.children && item.children.length) {
          item.children.forEach((c) => {
            if (c.children && c.children.length) {
              c.children.forEach((cmp) => {
                menuMapFlat.push({
                  name: cmp.name,
                  code: cmp.code,
                  parent: item.name,
                  parent2: c.name
                })
              })
            } else {
              menuMapFlat.push({
                name: c.name,
                code: c.code,
                parent: item.name
              })
            }
          })
        } else {
          menuMapFlat.push({
            name: item.name,
            code: item.code
          })
        }
      })
    },
    jump(item) {
      const { code, params, query } = item
      this.$router.push({ name: code, params, query })
      if (this.commonAccess[code]) {
        this.commonAccess[code]++
      } else {
        this.$set(this.commonAccess, code, 1)
      }
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          ...JSON.parse(localStorage.getItem(STORE_KEY)),
          commonAccess: this.commonAccess
        })
      )
      const currentHis = JSON.parse(localStorage.getItem(STORE_KEY)).searchHistory || {}
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          ...JSON.parse(localStorage.getItem(STORE_KEY)),
          searchHistory: {
            ...currentHis,
            [item.name]: {
              ...item,
              no: Date.now()
            }
          }
        })
      )
      this.visible = false
    },
    favorite(event, { code }) {
      event.stopPropagation()
      const isCancel = this.favoriteData[code]
      if (isCancel) {
        this.favoriteData[code] = false
      } else {
        this.$set(this.favoriteData, code, true)
      }
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          ...JSON.parse(localStorage.getItem(STORE_KEY)),
          favoriteData: this.favoriteData
        })
      )
    },
    handleClose() {
      this.visible = false
    },
    open() {
      this.initMenus()
      const { favoriteData, commonAccess, searchHistory } =
        JSON.parse(localStorage.getItem(STORE_KEY)) || {}
      this.favoriteData = favoriteData || {}
      this.commonAccess = commonAccess || {}
      this.searchHistory = searchHistory || {}
      this.visible = true
      this.$nextTick(() => {
        this.$refs.searchInput.focus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.global-search-wrap {
  padding: 30px 20px;
  position: fixed;

  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
  z-index: 98;
}
.search-input {
  position: relative;
  z-index: 99;
  margin-top: 10px;
  width: 600px;
}
.card-item-title {
  display: block;
  margin-bottom: 5px;
}
.list-content-wrap {
  margin-top: 3px;
  width: 600px;
  z-index: 99;
  position: relative;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
}
.list-content {
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  padding: 20px;
  z-index: 99;
  max-height: 600px;
  overflow-y: auto;
  background-color: #fff;

  @media (max-width: 1400px) {
    max-height: 400px;
  }
}
.card-item-inner {
  display: flex;
  justify-content: space-between;
  position: relative;
  .icon-wrap {
    position: absolute;
    z-index: 20;
    right: 0;
    top: -20px;
    height: 61px;
    line-height: 61px;
    font-size: 20px;
    pointer-events: auto;
    display: flex;
    .icon-item {
      pointer-events: auto;
      height: 100%;
      padding: 0 20px;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>

<style lang="scss">
.list-content {
  .el-card__body {
    padding: 15px !important;
  }
}
</style>
