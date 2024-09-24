<template>
  <el-dialog
      :visible.sync="visible"
      destroy-on-close
      title="提示"
  >

    <p v-if="!content.carrierUpperLimitCheck">
      卡片运营商阈值不符合客户要求，建议修改阈值，是否需要导出不符合要求的卡片？
      <el-button type="text" @click="handleDownload(3)">导出</el-button>
    </p>
    <p v-if="!content.colorCheck">
      出库失败，卡片颜色不符合客户要求，是否需要导出不符合要求的卡片？
      <el-button type="text" @click="handleDownload(1)">导出</el-button>

    </p>
    <p v-if="!content.imsiCheck">
      出库失败，卡片imsi号段不符合客户要求，请选择其他卡片出库！
      <el-button type="text" @click="handleDownload(2)">导出</el-button>
    </p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onReset">去修改</el-button>
      <el-button type="primary" @click="onSubmit" v-if="canSkip">跳过</el-button>
    </span>
  </el-dialog>
</template>
<script>

export default {
  data() {
    return {
      visible: false,
      content: {},
      postData: {}
    }
  },
  computed: {
    canSkip() {
      const {imsiCheck, colorCheck, carrierUpperLimitCheck} = this.content
      return !carrierUpperLimitCheck && imsiCheck && colorCheck
    }
  },
  methods: {
    async handleDownload(failureType) {
      const {
        success,
        data
      } = await this.jaxLib.card.exportDeviceOutputFailureCard({
        ...this.postData,
        failureType
      })
      if (!success) return false
      window.open(data)
    },
    async open(content, postData) {
      this.content = content
      this.postData = postData
      this.visible = true
    },
    onSubmit() {
      this.$emit('ok', this.postData)
    },
    onReset() {
      this.visible = false
    },

  }
}
</script>

<style lang="scss">
.compliance-detail-modal {
  .el-transfer-panel__body {
    height: 170px;
  }
}
</style>
