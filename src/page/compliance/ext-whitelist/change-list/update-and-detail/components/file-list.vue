<template>
  <div>
    <p v-for="item in fileList" :key="item.fileKey">
      <el-link target="_blank" @click="downloadFile(item)">{{ item.fileKey }}</el-link>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    flowNo: {
      type: String,
      default: ''
    },
    content: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  watch: {
    flowNo() {
      this.getFlowFile()
    }
  },
  created() {
    this.getFlowFile()
  },
  methods: {
    async downloadFile(item) {
      // const { success, data } = await ajax.whitelist.workOrderGetFileUrl({ fileKey })
      // if (!success) return false
      window.open(item.url)
    },
    async getFlowFile() {
      const res = await this.jaxLib.whitelist.complianceGetFile({ flowNo: this.flowNo })
      if (res && res.success) {
        this.fileList = res.data
      }
    }
  }
}
</script>
