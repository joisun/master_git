<script type="text/jsx">
export default {
  data() {
    return {
      activeName: 'client-price-set-package'
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
        <h2 class="wh-title">客户报价</h2>
        <span class="level2__back">
          <el-tooltip content="返回一级组织列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backToCustomerList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div>客户名:{{ customerName }}</div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="套餐列表" name="client-price-set-package"></el-tab-pane>
          <el-tab-pane label="网络产品" name="client-price-set-network"></el-tab-pane>
          <el-tab-pane label="定位产品" name="client-price-set-lbs"></el-tab-pane>
          <el-tab-pane label="专属套餐" name="client-price-exclusive" />
          <el-tab-pane label="组合套餐" name="client-price-combine" />
          <el-tab-pane label="国际卡" name="international-client-price-set" />
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
