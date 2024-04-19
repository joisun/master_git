<template>
  <el-dialog
      :visible="visible"
      @close="closeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="三合一卡导入"
      class="wh__dialog"
      width="400px"
  >
    <el-form :inline="true">
      <el-form-item label="文件导入">
        <div>
          <el-upload
              class="upload-demo"
              accept=".xls, .xlsx"
              :on-remove="handleRemove"
              action="/ajax/common/file/upload"
              :on-success="onSuccess"
              :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传XLS/XLSX文件，不能超过1W行
              <br>
              表头字段为CardID、ICCID1、ICCID2、ICCID3
            </div>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onSubmit" :disabled="disable">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 是否显示弹框
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      fileUrl: '',
      disable: true
    }
  },
  methods: {
    async onSubmit() {
      const params = {
        fileUrl: this.fileUrl
      }
      const rst = await this.jaxLib.cpe.threeInOneCardImport(params)
      if (rst.success) {
        this.$message.success('上传成功！')
        this.closeDialog()
        this.$emit('refresh')
      }
    },
    closeDialog() {
      this.$emit('update:visible', false)
      this.disable = true
    },
    onSuccess(data) {
      this.fileUrl = data.data.filePosition
      this.disable = false
    },
    handleRemove(file, fileList) {
      if(fileList.length === 0){
        this.disable = true
      }
    }
  }
}
</script>
