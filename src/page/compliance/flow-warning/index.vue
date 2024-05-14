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
        <h2 class="wh-title">限额预警</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="告警列表" name="flow-warning-list" />
          <el-tab-pane label="下载处理记录" name="flow-warning-downloads" />
        </el-tabs>
      </div>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
