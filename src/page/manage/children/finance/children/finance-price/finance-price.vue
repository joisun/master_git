<script type="text/jsx">
import tabChangeMixins from '@/global/mixins/tab-changes-mixins'

export default {
  mixins: [tabChangeMixins]
}
</script>
<template>
  <div class="plan-manager">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">报价管理</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="套餐列表" name="finance-price-list" />
          <el-tab-pane label="卡功能分类" name="finance-price-function" />
          <el-tab-pane label="续费分类" name="finance-price-renew" />
          <el-tab-pane label="套餐规格" name="finance-price-specs" />
          <el-tab-pane label="网络产品" name="finance-price-network" />
          <el-tab-pane label="定位产品" name="finance-price-lbs" />
          <el-tab-pane label="组合套餐" name="finance-price-combine" />
        </el-tabs>
      </div>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
