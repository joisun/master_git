<template>
  <el-dialog title="上传" :visible.sync="visible" width="400px" :before-close="handleClose">
    <el-upload
      v-model="fileUrl"
      accept=".pdf,.xlsx,.docx"
      :limit="1"
      drag
      action="/ajax/common/file/upload"
      :data="uploadExtraData"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      class="wh-file-upload"
      :file-list="localFileList"
      :on-change="fileChange"
      :on-remove="fileRemove"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">
        <p>导入必须是pdf, docx, excel文件, 文件大小最大为10MB</p>
        <p>如果导入excel 文件，则会替换原有excel文件</p>
      </div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button :disabled="!fileUrl" type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
const isExcel = (name) => {
  return /.*\.(xlsx|xls|csv)/.test(name)
}
export default {
  components: {},
  data() {
    return {
      visible: false,
      fileUrl: '',
      localFileList: [],
      isExcel: false,
      content: {},
      filename: '',
      uploadExtraData: {
        isRename: false,
        filename: ''
      }
    }
  },
  methods: {
    async confirm() {
      const res = await this.jaxLib.whitelist.workOrderConfigFileUpdate({
        id: this.content.id,
        [this.isExcel ? 'fileKeyExcel' : 'fileKeyDocument']: this.fileUrl
      })
      if (res && res.success) {
        this.$message.success('操作成功')
        this.resetForm()
        this.visible = false
        this.$emit('confirm', res)
      }
    },
    beforeUpload() {
      // this.uploadExtraData.isRename = true
      // if (isExcel(file.name)) {
      //   this.uploadExtraData.isRename = false
      // }
      return true
    },
    fileChange(file, fileList) {
      if (file.status === 'ready') {
        const { fileKeyDocument, fileKeyExcel } = this.content || {}
        this.isExcel = false
        if (isExcel(file.name)) {
          this.isExcel = true
          this.uploadExtraData.filename = fileKeyExcel.replace(/^wh\//, '') || file.name
        } else {
          this.uploadExtraData.filename = fileKeyDocument
            ? fileKeyDocument.replace(/^wh\//, '')
            : file.name.replace(/(\.\w+$)/, `-${Date.now()}$1`)
        }
      }
      this.localFileList = fileList
    },
    fileRemove() {
      this.localFileList = []
      this.fileUrl = ''
      this.uploadExtraData.filename = ''
      this.isExcel = false
    },
    onSuccess(data) {
      if (data && data.data) {
        this.fileUrl = data.data.filePosition
      }
    },
    handleClose() {
      this.resetForm()
      this.visible = false
    },
    resetForm() {
      this.fileUrl = ''
      this.localFileList = []
      this.content = {}
      this.uploadExtraData.filename = ''
      this.isExcel = false
    },
    open(content) {
      this.content = content
      this.visible = true
    }
  }
}
</script>
