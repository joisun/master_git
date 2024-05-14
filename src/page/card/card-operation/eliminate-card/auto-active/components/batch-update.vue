<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'

export default {
  data() {
    return {
      formData: {
        iccids: ''
      },
      targetStatus: '',
      visible: false
    }
  },
  methods: {
    cancel() {
      this.formData = {
        iccids: ''
      }
      this.$refs.form.resetFields()
      this.visible = false
    },
    open(targetStatus) {
      this.visible = true
      this.targetStatus = targetStatus
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.jaxLib.card.autoActive.modifyStatus({
            iccids: iccidsTransfer(this.formData.iccids).filter((item) => !!item),
            targetStatus: this.targetStatus
          })
          if (res && res.success) {
            this.$message.success('操作成功')
            this.$emit('confirm')
            this.cancel()
            this.visible = false
          }
        }
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="visible"
    :title="targetStatus === 'ineffective' ? '批量移除' : '批量添加'"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="formData">
      <el-form-item
        prop="iccids"
        label="ICCID"
        :rules="[{ required: true, message: '请输入ICCID', trigger: 'change' }]"
      >
        <el-input
          v-model="formData.iccids"
          type="textarea"
          :rows="3"
          placeholder="可以直接复制excel中整列ICCID；手动输入多个ICCID，一行一个；最多10000个；"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.dialog-footer {
  text-align: right;
  margin-top: 15px;
}
</style>
