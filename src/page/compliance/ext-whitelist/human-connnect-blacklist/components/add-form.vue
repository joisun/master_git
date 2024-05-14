<template>
  <el-dialog
    title="新增人联网黑名单"
    :visible.sync="visible"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
      <el-form-item label="人联网黑名单" prop="urlOrIp">
        <el-input v-model="formData.urlOrIp" type="textarea" rows="10" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" rows="6" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'

const DEFAULT_FORM = JSON.stringify({
  remark: '',
  urlOrIp: ''
})
export default {
  data() {
    return {
      visible: false,
      formData: JSON.parse(DEFAULT_FORM),
      content: {},
      rules: {
        urlOrIp: {
          required: true,
          message: '请输入人联网黑名单'
        }
      }
    }
  },
  methods: {
    onCancel() {
      this.visible = false
      this.resetForm()
    },
    onConfirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        const { remark, urlOrIp } = this.formData
        const params = {
          remark,
          carrier: this.content.carrier,
          urlOrIp: iccidsTransfer(urlOrIp)
            .filter((item) => !!item)
            .join()
        }
        const res = await this.jaxLib.whitelist.peopleInternetAdd(params)
        if (res && res.success) {
          this.$message.success('保存成功')
          this.resetForm()
          this.$emit('confirm')
          this.visible = false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.formData = JSON.parse(DEFAULT_FORM)
    },
    handleClose() {
      this.visible = false
      this.resetForm()
    },
    async open(content) {
      this.content = content
      this.visible = true
    }
  }
}
</script>
