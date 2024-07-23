<script type="text/jsx">
export default {
  data() {
    return {
      activeName: 'ota-admin-platform-service-client-price-set'
    }
  },
  computed: {
    customerName() {
      return this.$route.query.orgName
    }
  },
  created() {
    this.activeName = this.$route.name
  },
  methods: {
    backToCustomerList() {
      this.$router.push({ path: `/manage/client/client-list?enter=true` })
    },
    changeRoute(tab) {
      this.$router.push({ name: tab.name.trim(), query: this.$route.query })
    }
  }
}
</script>
<template>
  <div class="plan-manager">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">国际卡客户报价</h2>
        <span class="level2__back">
          <el-tooltip content="返回一级组织列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backToCustomerList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div>客户名:{{ customerName }}</div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="普通国际卡" name="international-client-price-set" />
          <el-tab-pane label="OTA卡" name="ota-admin-client-price-set" />
          <el-tab-pane label="无正式期套餐" name="ota-admin-no-formal-client-price-set" />
          <el-tab-pane label="卡平台服务费" name="ota-admin-platform-service-client-price-set" />
        </el-tabs>
      </div>
      <transition name="fade" mode="out-in">
        <div class="wh__body">
          <router-view></router-view>
        </div>
      </transition>
    </div>
  </div>
</template>
