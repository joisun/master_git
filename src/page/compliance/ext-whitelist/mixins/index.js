export default {
  data() {
    return {
      canClose: false
    }
  },
  created() {
    if (this.flowNo) {
      this.checkCanCLose()
    }
  },
  methods: {
    async checkCanCLose() {
      const { success, data } = await this.jaxLib.whitelist.complianceCanClose({
        flowNo: this.flowNo
      })
      if (success) {
        this.canClose = data
      }
    },
    async handleFlowClose() {
      this.$confirm('确认关闭此流程？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: true
      })
        .then(async () => {
          const res = await this.jaxLib.whitelist.forceClose({ flowNo: this.flowNo })
          if (res && res.success) {
            this.$message.success('关闭成功')
            this.$router.go(-1)
          }
        })
        .catch(() => {})

    },
  }
}
