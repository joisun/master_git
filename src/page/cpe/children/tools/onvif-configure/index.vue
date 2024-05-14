<script>
import apis from '@/api/ajax'

export default {
  data() {
    return {
      macAddr: '',
      tableData: [],
      selectedIp: [],
      buttonStatus: {
        getConnected: false,
        startIpcConfig: false,
        closeIpcConfig: false,
        ipcInfo: false,
        getHls: false
      }
    }
  },
  watch: {
    tableData(val) {
      if (val.length && this.selectedIp) {
        val.filter(item => this.selectedIp.indexOf(item.ipAddr) > -1).forEach(item => {
          this.$nextTick(() => {
            this.$refs.tableRef.toggleRowSelection(item, true)
          })
        })
      }
    }
  },
  methods: {
    async getConnected() {
      if (!this.macAddr.trim()) {
        return this.$message.warning('Mac地址不能为空')
      }
      this.buttonStatus.getConnected = true
      const { success, data } = await apis.cpe.getConnectedClients({ macAddr: this.macAddr })
      this.buttonStatus.getConnected = false
      if (!success) {
        return false
      }
      this.tableData = data
    },
    handleSelectionChange(selected) {
      this.selectedIp = selected.map(item => item.ipAddr)
    },
    async configIpcWeb(command) {
      if (!this.macAddr.trim()) {
        return this.$message.warning('Mac地址不能为空')
      }
      if (!this.selectedIp.length) {
        return this.$message.warning('请选择要配置的终端')
      }
      command ? this.buttonStatus.startIpcConfig = true : this.buttonStatus.closeIpcConfig = true
      const { success, data } = await apis.cpe.configIpcWeb({
        macAddr: this.macAddr,
        enable: command,
        ipAddrs: this.selectedIp
      })
      command ? this.buttonStatus.startIpcConfig = false : this.buttonStatus.closeIpcConfig = false
      if (!success) {
        return false
      }
      if (command) {
        this.tableData = this.tableData.map(item => {
          const device = data.find(_item => _item.ipAddr === item.ipAddr)
          if (device) {
            item.remoteUrl = device.remoteUrl
          }
          return item
        })
      } else {
        this.tableData = this.tableData.map(item => {
          const device = this.selectedIp.find(ipAddr => ipAddr === item.ipAddr)
          if (device) {
            item.remoteUrl = ''
          }
          return item
        })
      }
    },
    async getIpcInfo() {
      if (!this.macAddr.trim()) {
        return this.$message.warning('Mac地址不能为空')
      }
      this.buttonStatus.ipcInfo = true
      const { success, data } = await apis.cpe.getIpcInfo({ macAddr: this.macAddr })
      this.buttonStatus.ipcInfo = false
      if (!success) {
        return false
      }
      let list = [...this.tableData]
      data.forEach(item => {
        const device = list.find(_item => _item.ipAddr === item.ipAddr)
        if (device) {
          device.isSupportOnvif = true
        } else {
          device.isSupportOnvif = false
          list.push(item)
        }
      })
      this.tableData = list
    },
    async getRtspList() {
      if (!this.macAddr.trim()) {
        return this.$message.warning('Mac地址不能为空')
      }
      if (!this.selectedIp.length) {
        return this.$message.warning('请选择要配置的终端')
      }
      this.buttonStatus.getHls = true
      const { success, data } = await apis.cpe.getRtspList({ macAddr: this.macAddr, ipAddrs: this.selectedIp })
      this.buttonStatus.getHls = false
      if (!success) {
        return false
      }
      this.tableData = this.tableData.map(item => {
        const device = data.find(_item => _item.ipAddr === item.ipAddr)
        if (device) {
          item.hls = device.hls
          item.rtsp = device.rtsp
        }
        return item
      })
    }
  }
}
</script>

<template>
  <div class="cpe-onvif-configure">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">ONVIF配置</h2>
      </div>
      <div class="wh__body">
        <el-form label-width="100px" class="mt15">
          <el-form-item label="Mac地址">
            <el-input style="width: 260px" placeholder="请输入设备Mac地址" v-model="macAddr"></el-input>
            <el-button type="primary" @click="getConnected" style="margin-left: 10px" :loading="buttonStatus.getConnected">获取</el-button>
            <el-button type="primary" @click="configIpcWeb(true)" :loading="buttonStatus.startIpcConfig">开启配置IPC Web</el-button>
            <el-button type="primary" @click="configIpcWeb(false)" :loading="buttonStatus.closeIpcConfig">关闭配置IPC Web</el-button>
            <el-button type="primary" @click="getIpcInfo" :loading="buttonStatus.ipcInfo">发现</el-button>
            <el-button type="primary" @click="getRtspList" :loading="buttonStatus.getHls">配置HLS</el-button>
          </el-form-item>
        </el-form>
        <div class="result">
          <el-table :data="tableData" @selection-change="handleSelectionChange" ref="tableRef">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="IP" prop="ipAddr" width="130px"></el-table-column>
            <el-table-column label="主机名称(hostname)" prop="hostName" width="180px"></el-table-column>
            <el-table-column label="远程后台地址">
              <template slot-scope="scope">
                <a target="_blank" style="color: #1c8de0;" :href="scope.row.remoteUrl">{{scope.row.remoteUrl}}</a>
              </template>
            </el-table-column>
            <el-table-column label="是否支持ONVIF" align="center" width="110">
              <template slot-scope="scope">
                {{scope.row.isSupportOnvif === true ? '是' : scope.row.isSupportOnvif === false ? '否' : '' }}
              </template>
            </el-table-column>
            <el-table-column label="RTSP/HLS">
              <template slot-scope="scope">
                <div v-if="scope.row.rtsp">RTSP: {{scope.row.rtsp}}</div>
                <div v-if="scope.row.hls">HLS: {{scope.row.hls}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
