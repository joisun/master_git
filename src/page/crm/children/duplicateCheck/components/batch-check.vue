<template>
  <el-dialog
    :visible="visible"
    title="批量查询"
    width="500px"
    :before-close="onClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      v-loading="loading"
      element-loading-text="处理中，请耐心等待"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="批量上传" prop="fileUrl">
        <whFileUpload v-model="form.fileUrl" accept=".xls,.xlsx" />
        <el-link
          href="https://simboss-public.oss-cn-hangzhou.aliyuncs.com/template/crm/CRM%E6%89%B9%E9%87%8F%E6%9F%A5%E9%87%8D%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF%20.xlsx"
          type="info"
          style="position: absolute; left: 172px; top: 0"
          >下载模板</el-link
        >
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button :loading="loading" @click="onClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import whFileUpload from '@/global/components/wh-file-upload.vue'
import apis from '@/api/ajax'

export default {
  components: {
    whFileUpload
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        fileUrl: ''
      },
      rules: {
        fileUrl: [
          {
            required: true,
            message: '请上传文件',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    onClose() {
      this.$refs.form.resetFields()
      this.form = {
        fileUrl: ''
      }
      this.visible = false
    },
    onIsFileUploadChange() {
      this.$refs.form.clearValidate()
    },
    open() {
      this.visible = true
    },
    onConfirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.loading = true
        const res = await apis.crm.customerDuplicateCheckSearchBatch({
          fileKey: this.form.fileUrl
        })
        this.loading = false
        if (res && res.success) {
          this.$message.success('操作成功，请到查询记录下载')
          this.visible = false
        }
      })
    }
  }
}
</script>
