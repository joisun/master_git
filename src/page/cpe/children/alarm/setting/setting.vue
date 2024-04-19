<script>
import apis from '@/api/ironman-api'
import SettingCard from './components/setting-card'

export default {
  components: {
    SettingCard
  },
  data() {
    return {
      cpeSettingList: [],
      terminalSettingList: [],
      isLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    backList() {
      window.history.go(-1)
    },
    async getList() {
      const { success, data } = await apis.alertRuleList()
      this.isLoading = false
      if (!success) return false
      const settingList = data.map(item => {
        if (!item.param) {
          return item
        }
        item.param = JSON.parse(item.param)
        return item
      })
      this.cpeSettingList = settingList.filter(item => ([ 'CPE_OFFLINE', '', 'CPE_PING', 'NETWORK_SWITCH' ].indexOf(item.type) > -1))
      this.terminalSettingList = settingList.filter(item => ([ 'CLIENT_OFFLINE', '', 'CLIENT_PING' ].indexOf(item.type) > -1))
    }
  }
}
</script>

<template>
  <div class="cpe-alarm-setting wh__warp">
    <div class="wh__header">
      <div class="wh__header--title">告警设置</div>
      <span class="wh__header--close">
        <el-tooltip content="返回列表" placement="left" effect="dark">
          <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
        </el-tooltip>
      </span>
    </div>
    <div class="wh__body" v-loading="isLoading">
      <div class="title">CPE</div>
      <div class="card-wrapper">
        <setting-card class="card" v-for="item in cpeSettingList" :key="item.id" :config="item"></setting-card>
        <div class="card"></div>
        <div class="card"></div>
      </div>
      <div class="title">终端</div>
      <div class="card-wrapper">
        <setting-card class="card" v-for="item in terminalSettingList" :key="item.id" :config="item"></setting-card>
        <div class="card"></div>
        <div class="card"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cpe-alarm-setting {
  .title {
    font-weight: bold;
    margin-top: 20px;
  }

  .card-wrapper {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .card {
      width: 430px;
      margin-bottom: 5px;
    }
  }
}
</style>
