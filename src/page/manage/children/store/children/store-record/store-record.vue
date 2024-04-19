<script>
import tabChangeMixins from '@/global/mixins/tab-changes-mixins'

export default {
  name: 'store-record',
  mixins: [tabChangeMixins]
}
</script>

<template>
  <div class="store-record">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">库存管理</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="入库记录" name="store-record-inner" />
          <el-tab-pane label="库存查看" name="store-inventory-list" />
          <el-tab-pane label="出库记录" name="store-record-out" />
        </el-tabs>
      </div>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>
