<script>
import tabChangeMixins from '@/global/mixins/tab-changes-mixins'

export default {
  name: 'first-order',
  mixins: [tabChangeMixins]
}
</script>

<template>
  <div class="store-record">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">首单查询</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="卡订单" name="first-order-card" />
          <el-tab-pane label="设备订单" name="first-order-cpe" />
        </el-tabs>
      </div>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>
