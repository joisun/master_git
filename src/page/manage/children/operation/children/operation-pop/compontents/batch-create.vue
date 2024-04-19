<script>
/**
   * Create by zeter on 2018/7/25
   */
  export default {
    name: 'batch-create',
    data() {
      return {
        fileUploadLoading: false,
        fileMulti: [],
        email: ''
      }
    },
    computed: {
      canUpload() {
        return !this.email.trim().length
      }
    },
    props: {
      dialogName: {
        default: String
      }
    },
    methods: {
      down() {
        window.location.href = '/template/pop-batch.xlsx'
      },
      async onInputClick(res) {
        let rst = await this.jaxLib.advertisement.batchAdd({
          templateOssPath: res.data.filePosition,
          email: this.email.trim() + '@qipeng.com'
        })
        if (!rst.success) {
          this.fileMulti = []
          this.$message.error(`上传失败,${rst.message}`)
          return false
        }
        this.$message.success('上传成功')
        this.$emit('closeDialog', this.dialogName, true)
      }
    }
  }
</script>

<template>
  <div class="batch-create">
    <div v-loading="fileUploadLoading">
      <el-form>
        <el-form-item label="邮箱">
          <el-input v-model="email" style="width:300px">
            <template slot="append">@qipeng.com</template>
          </el-input>
          <div class="el-upload__tip" v-if="canUpload">点击上传前请先输入邮箱</div>
        </el-form-item>
        <el-form-item label="文件">
          <el-upload
            accept="xlsx"
            name="price-excel"
            :show-file-list="false"
            :multiple="false"
            :file-list="fileMulti"
            :on-success="onInputClick"
            action="/ajax/common/file/upload">
            <el-button size="small" type="primary" :disabled="canUpload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且应当与导出表格内容一致</div>
          </el-upload>
          <el-button type="text" @click="down">模板下载</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
