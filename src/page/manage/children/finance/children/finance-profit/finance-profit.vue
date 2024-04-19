<script>
/**
   * Create by zeter on 2019-06-03
   */
  import tabChangeMixins from '@/global/mixins/tab-changes-mixins'

  export default {
    name: 'finance-profit',
    mixins: [tabChangeMixins]
  }
</script>

<template>
  <div class="finance-profit">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">佣金管理</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="佣金结算" name="finance-profit-settlement"></el-tab-pane>
          <el-tab-pane label="佣金明细" name="finance-profit-list"></el-tab-pane>
        </el-tabs>
      </div>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
