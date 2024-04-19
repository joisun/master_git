<script>
import Overview from './overview'
import List from './list'
import DeviceFlow from './device-flow'
export default {
  components: {
    Overview,
    List,
    DeviceFlow
  },
  data() {
    return {
      visible: false,
      activeTab: 'overview',
      parentMacAddr: '',
      client: ''
    }
  },
  methods: {
    backList() {
      // window.history.go(-1)
      this.visible = false
    },
    open({ macAddr, client }) {
      this.client = client
      this.activeTab = client ? 'detail' : 'overview'
      this.parentMacAddr = macAddr
      this.visible = true
    }
  }
}
</script>

<template>
  <el-dialog
    v-if="visible"
    :visible.sync="visible"
    title="终端设备"
    fullscreen
    :show-close="false"
    :close-on-press-escape="false"
  >
    <template #title>
      <div class="wh__header">
        <div class="wh__header--title">终端设备</div>
        <span class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
    </template>
    <div class="cpe-device-terminal wh__warp">
      <div class="wh__body">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="概览" name="overview">
            <overview v-if="activeTab === 'overview'" :parent-mac-addr="parentMacAddr"></overview>
          </el-tab-pane>
          <el-tab-pane label="流量" name="flow">
            <device-flow v-if="activeTab === 'flow'" :parent-mac-addr="parentMacAddr"></device-flow>
          </el-tab-pane>
          <el-tab-pane label="明细" name="detail">
            <list v-if="activeTab === 'detail'" :parent-mac-addr="parentMacAddr" :client="client" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-dialog>
</template>
