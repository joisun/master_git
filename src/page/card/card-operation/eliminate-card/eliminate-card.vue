<script>
/**
 * Create by zeter on 2017/12/21
 */
import apply from './components/eliminate-apply.vue'
import resultCustomer from './components/eliminate-result-customer.vue'
import wait from './components/eliminate-wait.vue'
import resultSupplier from './components/eliminate-result-supplier.vue'
import search from './components/eliminate-search.vue'

export default {
  components: {
    apply: apply,
    'result-customer': resultCustomer,
    wait: wait,
    'result-supplier': resultSupplier,
    search: search
  },
  data() {
    return {
      activeName: 'apply'
    }
  },
  async mounted() {
    this.$store.dispatch('getSales')
  },
  methods: {
    backList() {
      window.history.go(-1)
    }
  }
}
</script>

<template>
  <div class="eliminate-card">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">销卡管理</h2>
        <span v-if="!$route.query.enter" class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="activeName">
          <el-tab-pane label="申请" name="apply"> </el-tab-pane>
          <el-tab-pane label="我的申请" name="result-customer"> </el-tab-pane>
          <el-tab-pane label="待处理" name="wait"> </el-tab-pane>
          <el-tab-pane label="销卡查询" name="search"> </el-tab-pane>
          <el-tab-pane label="处理记录" name="result-supplier"> </el-tab-pane>
        </el-tabs>
      </div>
      <div class="wh__body">
        <component :is="activeName"> </component>
      </div>
    </div>
  </div>
</template>
