<script>
  import NetworkQuality from './network-quality'
  import DomainRecord from '../components/domain-record'
  import ClientFlow from './client-flow'

  export default {
    props: {
      macAddr: {
        type: String,
        default: ''
      },
      parentMacAddr: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        activeName: 'network'
      }
    },
    components: {
      NetworkQuality,
      DomainRecord,
      ClientFlow
    }
  }
</script>

<template>
  <div class="terminal-device-detail">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="网络质量" name="network">
        <network-quality v-if="activeName === 'network'" :mac-addr="macAddr" :parent-mac-addr="parentMacAddr"></network-quality>
      </el-tab-pane>
      <el-tab-pane label="流量用量" name="flow">
        <client-flow v-if="activeName === 'flow'" :mac-addr="macAddr" :parent-mac-addr="parentMacAddr"></client-flow>
      </el-tab-pane>
      <el-tab-pane label="域名统计" name="domain">
        <domain-record v-if="activeName==='domain'" type="terminal" :mac-addr="macAddr" :parent-mac-addr="parentMacAddr"></domain-record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss">
  .terminal-device-detail {
    border: 1px solid #efefef;
    padding: 10px;
  }
</style>
