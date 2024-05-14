<template>
  <el-dialog title="上传" :visible.sync="visible" width="600px" :before-close="handleClose">
    请选择需要上传的 Excel 文件，格式详见模板：<el-button type="text" @click="downloadTemplate"
      >模板.xlsx</el-button
    >
    <el-upload
      v-model="fileUrl"
      v-loading="loading"
      accept=".xls,.xlsx"
      :limit="1"
      drag
      action="/ajax/common/file/upload"
      :on-success="onSuccess"
      class="wh-file-upload"
      :file-list="localFileList"
      :on-change="fileChange"
      :on-remove="fileRemove"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">
        <p>支持上传扩展名为：.xls xlsx的文件，最多支持 1000 条数据。</p>
      </div>
    </el-upload>
    <div style="margin-top: 30px">
      <el-form v-if="importSum">
        <el-form-item label="记录数" prop="before">{{ importSum.count }}</el-form-item>
        <el-form-item label="记录收录金额" prop="before">{{ importSum.income }}</el-form-item>
        <el-form-item label="记录成本金额" prop="before">{{ importSum.cost }}</el-form-item>
        <el-form-item label="记录提成金额" prop="before">{{ importSum.commission }}</el-form-item>
      </el-form>
      <el-table v-if="checkError && checkError.length" :data="checkError" style="width: 100%">
        <el-table-column prop="sortNo" label="序号" width="180" />
        <el-table-column prop="errorFiled" label="错误列" />
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="resetForm">取 消</el-button>
      <el-button :loading="loading" :disabled="!importSum" type="primary" @click="confirm"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
// const isExcel = (name) => {
//   return /.*\.(xlsx|xls|csv)/.test(name)
// }
export default {
  components: {},
  data() {
    return {
      importSum: null,
      checkError: null,
      visible: false,
      fileUrl: '',
      localFileList: [],
      content: {},
      loading: false
    }
  },
  methods: {
    downloadTemplate() {
      window.open(
        'https://simboss-public.oss-cn-hangzhou.aliyuncs.com/template/commission/batch_import_detail.xlsx'
      )
    },
    async confirm() {
      this.loading = true
      const res = await this.jaxLib.salesComission.salesCommission2024.batchImport({
        monthDate: this.content.monthDate,
        ossFileUrl: this.fileUrl
      })
      this.loading = false
      if (res && res.success) {
        this.$message.success('批量导入成功')
        this.$emit('confirm', res)
        this.resetForm()
      }
    },
    async check() {
      this.loading = true
      const res = await this.jaxLib.salesComission.salesCommission2024.batchImportCheck({
        monthDate: this.content.monthDate,
        ossFileUrl: this.fileUrl
      })
      this.loading = false
      if (res && res.success) {
        this.checkError = res.data.check
        this.importSum = res.data.importSum
      }
    },
    fileChange(file, fileList) {
      this.loading = true
      this.localFileList = fileList
    },
    fileRemove() {
      this.localFileList = []
      this.fileUrl = ''
      this.importSum = null
      this.checkError = null
    },
    onSuccess(data) {
      this.loading = false
      if (data && data.data) {
        this.fileUrl = data.data.filePosition
        this.check()
      }
    },
    handleClose() {
      this.resetForm()
    },
    resetForm() {
      this.fileUrl = ''
      this.localFileList = []
      this.content = {}
      this.importSum = null
      this.checkError = null
      this.visible = false
    },
    open(content) {
      this.content = content
      this.visible = true
    }
  }
}
</script>
