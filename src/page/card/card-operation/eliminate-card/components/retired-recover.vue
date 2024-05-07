<script>
import {iccidsTransfer} from "@/global/function/iccids-tool";

const DEFAULT_FORM_DATA = JSON.stringify({iccids: ''})
export default {
  data() {
    return {
      formData: JSON.parse(DEFAULT_FORM_DATA),
      visible: false
    }
  },
  methods: {
    cancel() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$refs.form.resetFields()
      this.visible = false
    },
    open() {
      this.visible = true
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const iccids = iccidsTransfer(this.formData.iccids)
              .filter((item) => !!item)
              .join(',')
          let res = await this.jaxLib.card.eliminateRules.cardRetiringRecover({
            iccids
          })
          if (res && res.success) {
            this.$message({ type: 'success', message: '操作成功' })
            this.cancel()
            this.visible = false
            this.$emit('confirm')
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
      title="已销卡恢复"
      width="600px"
      :close-on-click-modal="false"
      :before-close="cancel"
  >
    <el-alert
        type="info"
        :closable="false"
    >
      <template #title>
        <p>已销卡恢复，会订正所有销卡管理工具中的记录，并且没有明确的变更日志记录；</p>
        <p>恢复后，卡按当前时间点，确定当前卡状态、套餐状态；</p>
      </template>
    </el-alert>
    <el-divider />
    <el-form ref="form" :model="formData" label-width="100px">
      <el-form-item prop="iccids" label="ICCID" :rules="{ required: true, message: '请输入ICCID' }">
        <el-input
            v-model="formData.iccids"
            type="textarea"
            :rows="8"
            style="width: 400px"
            placeholder="可以直接复制excel中整列ICCID；手动输入多个ICCID，一行一个"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
