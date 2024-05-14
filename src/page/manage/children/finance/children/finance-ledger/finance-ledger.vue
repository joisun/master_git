<template>
  <div class="record-bill">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">财务对账</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @change="changeRoute">
          <el-tab-pane label="运营商账单" name="record-bill-bill"></el-tab-pane>
          <!--<el-tab-pane label="客户账单" name="record-bill-customer"></el-tab-pane>-->
        </el-tabs>
      </div>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'record-bill-bill'
      }
    },
    methods: {
      changeRoute(val) {
      }
    }
  }
</script>
