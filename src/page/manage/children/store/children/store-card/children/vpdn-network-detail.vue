<script>
  import CardDetail from './components/card-detail.vue'
  import NetworkDetail from './components/network-detail.vue'
  export default {
    name: 'vpdn-network-detail',
    data() {
      return {
        activeName: 'cardDetail'
      }
    },
    components: {
      CardDetail,
      NetworkDetail
    }
  }
</script>

<template>
  <div class="vpdn-network-detail">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">网络详情</h2>
        <span class="float-right ">
          <el-tooltip content="返回卡片管理" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="$router.go(-1)" class="font28">
            </wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__body vpdn-network-body">
        <el-tabs v-model="activeName" class="width100">
          <el-tab-pane label="卡详情v1" name="cardDetail">
            <card-detail></card-detail>
          </el-tab-pane>
          <el-tab-pane label="网络拓扑图" name="networkDetail">
            <network-detail></network-detail>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
