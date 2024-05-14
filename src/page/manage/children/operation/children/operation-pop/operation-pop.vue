<script>
/**
   * Create by zeter on 2017/8/2
   */
  import tabChangeMixins from '@/global/mixins/tab-changes-mixins'

  export default {
    mixins: [tabChangeMixins],
    name: 'finance-charge'
  }
</script>

<template>
  <div class="advertisement">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">推广营销</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="推广链接" name="operation-pop-list">
          </el-tab-pane>
          <el-tab-pane label="注册用户" name="operation-pop-user">
          </el-tab-pane>
        </el-tabs>
      </div>
      <keep-alive include="operation-pop-list">
        <router-view>
        </router-view>
      </keep-alive>
    </div>
  </div>
</template>
