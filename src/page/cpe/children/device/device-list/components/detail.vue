<script>
import NetworkQuality from './network-quality'
import TrafficUsage from './traffic-usage'
import DeviceLogs from '../../../tools/logs/logs'
import DomainRecord from './domain-record'
import apis from '@/api/ironman-api'

export default {
  props: {
    device: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: 'first',
      sysInfo: {}
    }
  },
  components: {
    NetworkQuality,
    TrafficUsage,
    DeviceLogs,
    DomainRecord
  },
  created() {
    this.getSysInfo()
  },
  methods: {
    async getSysInfo() {
      const { success, data } = await apis.getDeviceSysInfo({ macAddr: this.device.macAddr })
      if (!success) return false
      this.sysInfo = data || {}
    }
  }
}
</script>

<template>
  <div class="device-detail">
    <div class="device-detail-info">
      <div class="label">SSID：</div>
      <div class="value">{{ device.ssid.join('，') }}</div>
      <div class="label">IMEI：</div>
      <div class="value">{{ device.imei || '-' }}</div>
      <div class="label">IP：</div>
      <div class="value">{{ device.ip || '-' }}</div>
      <div class="label">ssh端口：</div>
      <div class="value">{{device.sshPort || '-'}}</div>
      <div class="label">有效期截止时间：</div>
      <div class="value">{{device.expireDate || '-'}}</div>
    </div>
    <div class="device-detail-info">
      <div class="label">uptime：</div>
      <div class="value">{{sysInfo.uptime || '-'}}</div>
      <div class="label">内存状态：</div>
      <div class="value">{{sysInfo.memInfo || '-'}}</div>
    </div>
    <div class="device-detail-tabs">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="4G网络质量" name="first">
          <network-quality v-if="activeName === 'first'" :mac-addr="device.macAddr"></network-quality>
        </el-tab-pane>
        <el-tab-pane label="流量使用量" name="second">
          <traffic-usage v-if="activeName === 'second'" :mac-addr="device.macAddr" :platform="device.platform">
          </traffic-usage>
        </el-tab-pane>
        <el-tab-pane label="域名统计" name="third">
          <domain-record v-if="activeName === 'third'" :mac-addr="device.macAddr" type="cpe"></domain-record>
        </el-tab-pane>
        <el-tab-pane label="设备日志" name="fourth">
          <device-logs v-if="activeName === 'fourth'" :mac-addr="device.macAddr"></device-logs>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.device-detail {
  &-info {
    margin: 15px;
    display: flex;

    .label {
      margin-right: 3px;
      color: #999;
    }

    .value {
      margin-right: 15px;
    }
  }

  &-tabs {
    border: 1px solid #efefef;
    padding: 10px;
  }
}
</style>
