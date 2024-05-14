<script>
/**
 * Create by zeter on 2017/11/6
 */
export default {
  data() {
    return {
      activeName: 'order-tool-reset'
    }
  },
  methods: {
    changeRoute(tab, event) {
      this.$router.push({ name: tab.name.trim() })
    },
    routeChange() {
      this.activeName = this.$route.name
    }
  },
  watch: {
    $route: 'routeChange'
  },
  mounted() {
    this.routeChange()
  }
}
</script>

<template>
  <div class="tool-order">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">订单工具</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="订单重置" name="order-tool-reset"> </el-tab-pane>
          <!--          <el-tab-pane label="订单退款" name="order-tool-refund">-->
          <!--          </el-tab-pane>-->
        </el-tabs>
      </div>
      <transition name="fade" mode="out-in">
        <router-view> </router-view>
      </transition>
    </div>
  </div>
</template>
