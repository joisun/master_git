<!--
 * @Author: SerkeyWu
 * @Date: 2021-02-19 16:55:12
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-26 15:57:52
-->
<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="销售考核成本导入"
    class="wh__dialog"
    width="400px"
    @close="closeDialog"
  >
    <el-form :inline="true">
      <el-form-item label="文件导入">
        <div>
          <el-upload
            class="upload-demo"
            accept=".xls, .xlsx"
            action="/ajax/common/file/upload"
            :on-success="onSuccess"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传XLS/XLSX文件，不能超过1W行</div>
          </el-upload>
        </div>
        <div>
          <el-button type="text" @click="onDownloadTemplate">下载模板</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onSubmit">提交</el-button>
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
    },
    // 列表日期
    monthDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fileLink: ''
    }
  },
  methods: {
    onDownloadTemplate() {
      window.open(
        'https://simboss-public.oss-cn-hangzhou.aliyuncs.com/template/commission/sale_cost_template.xlsx'
      )
    },
    async onSubmit() {
      const params = {
        monthDate: this.monthDate,
        ossFileUrl: this.fileLink
      }
      const rst = await this.jaxLib.salesComission.importCost(params)
      if (rst.success) {
        this.$message.success('上传成功！')
        this.closeDialog()
        this.$emit('refresh')
      }
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
    onSuccess(data) {
      this.fileLink = data.data.filePosition
    }
  }
}
</script>
