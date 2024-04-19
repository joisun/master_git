<script>
import apis from '@/api/ajax'

export default {
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      sshLoading: false,
      timer: null
    }
  },
  methods: {
    toOperationPage(name, query = {}) {
      this.$router.push({ name, query: { from: 'device-list', ...query } })
    },
    async changeSsh(enable) {
      try {
        this.sshLoading = true
        const { success, message } = await apis.cpe.sshConfig({
          macAddr: this.selected[0].macAddr,
          enable
        })
        if (success) {
          this.$message({ type: 'success', message })
          this.$emit('updateList')
        }
      } catch (e) {
      } finally {
        this.sshLoading = false
      }
    },
    debounceClick(val) {
      this.changeSsh(val)
    },
    yunLogin(yunUrl) {
      window.open(yunUrl)
    }
  }
}
</script>

<template>
  <div class="device-operation">
    <p>
      <el-button :disabled="selected.length > 1" @click="toOperationPage('cpe-tool-self-check')"
        >自检</el-button
      >
      <el-button @click="toOperationPage('cpe-batch-restart-setting')">定时重启</el-button>
    </p>
    <p>
      <el-button @click="toOperationPage('cpe-tool-recovery')">回收清除</el-button>
      <el-button @click="toOperationPage('cpe-tool-upgrade')">设备升级</el-button>
    </p>
    <p>
      <el-button :disabled="selected.length > 1" @click="toOperationPage('cpe-tool-wan2lan')"
        >WAN/LAN切换</el-button
      >
      <el-button @click="toOperationPage('extend-expire')">延长测试期</el-button>
    </p>
    <!--    <p>-->
    <!--      <el-button-->
    <!--        :disabled="selected.length !== 1 || selected[0].platform !== 'JARVIS'"-->
    <!--        type="default"-->
    <!--        :loading="sshLoading"-->
    <!--        @click="debounceClick(true)"-->
    <!--        >开启SSH</el-button-->
    <!--      >-->
    <!--      <el-button-->
    <!--        :disabled="selected.length !== 1 || selected[0].platform !== 'JARVIS'"-->
    <!--        type="default"-->
    <!--        :loading="sshLoading"-->
    <!--        @click="debounceClick(false)"-->
    <!--        >关闭SSH</el-button-->
    <!--      >-->
    <!--    </p>-->
    <!--    <p>-->
    <!--      <el-button-->
    <!--        :disabled="selected.length !== 1 || !selected[0].yunUrl"-->
    <!--        @click="yunLogin(selected[0].yunUrl)"-->
    <!--        >云登录</el-button-->
    <!--      >-->
    <!--      <el-button-->
    <!--        :disabled="selected.length !== 1"-->
    <!--        @click="toOperationPage('cpe-tool-mqtt-topic', { tab: 'third' })"-->
    <!--        >Topic下发</el-button-->
    <!--      >-->
    <!--    </p>-->
  </div>
</template>

<style lang="scss">
.device-operation {
  p {
    margin-bottom: 15px;
  }

  button {
    width: 120px;
  }
}
</style>
