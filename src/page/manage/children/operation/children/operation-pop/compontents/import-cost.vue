<script>
/**
   * Create by zeter on 2019-08-15
   */
  export default {
    name: 'import-cost',
    data() {
      return {
        fileUploadLoading: false,
        fileMulti: []
      }
    },
    props: {
      dialogName: {
        default: String
      }
    },
    methods: {
      down() {
        window.location.href = '/template/pop-cost.xlsx'
      },
      async onInputClick(res) {
        let rst = await this.jaxLib.advertisement.costImport({
          fileUrl: res.data.filePosition
        })
        if (!rst.success) {
          this.fileMulti = []
          this.$message.error(`上传失败,${rst.message}`)
          return false
        }
        this.$message.success('上传成功')
        this.$emit('closeDialog', this.dialogName)
      }
    }
  }
</script>

<template>
  <div class="import-cost" v-loading="fileUploadLoading">
    <el-upload
      accept="xlsx"
      name="price-excel"
      :show-file-list="false"
      :multiple="false"
      :file-list="fileMulti"
      :on-success="onInputClick"
      action="/ajax/common/file/upload">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且应当与模板表格内容一致</div>
    </el-upload>
    <el-button type="text" @click="down">模板下载</el-button>
  </div>
</template>
