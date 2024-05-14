<script>
/**
 * Create by zeter on 2020/1/3
 */
import ajax from '@/api/ajax'

export default {
  name: 'WhDownload',
  props: {
    title: {
      default: '',
      type: String
    },
    postData: {
      type: Object
    },
    loop: {
      default: false,
      type: Boolean
    },
    time: {
      type: Number
    },
    callback: {
      type: Function
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    async downFile() {
      const {
        success,
        data: { fileUrl, status }
      } = await ajax.common.checkExportStatus(this.postData)
      if (!success) return false
      if (status === 'exporting') {
        if (this.loop) {
          setTimeout(() => {
            this.downFile()
          }, this.time)
        } else {
          this.$message.success('文件正在生成中,需要的时间较长,请您前往下载中心查看')
          this.close()
          this.callback('sure', this)
        }
      } else if (status === 'failed') {
        this.$message.error('文件生成失败')
        this.close()
        this.callback('cancel', this)
      } else {
        window.location.href = fileUrl
        this.close()
        this.callback('sure', this)
      }
    }
  }
}
</script>

<template>
  <div class="wh-download">
    <el-dialog
      :visible.sync="visible"
      width="250px"
      top="40vh"
      title=""
      :modal="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
    >
      <div
        v-loading="true"
        :element-loading-text="title"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="margin-bottom: 20px"
      ></div>
    </el-dialog>
  </div>
</template>

