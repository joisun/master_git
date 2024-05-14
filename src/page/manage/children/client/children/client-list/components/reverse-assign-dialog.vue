# vue ```vue
<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'

const DEFAULT_FORM_DATA = JSON.stringify({ iccids: '', remark: '' })
export default {
  data() {
    return {
      formData: JSON.parse(DEFAULT_FORM_DATA),
      visible: false,
      content: {},
      transferCheckResult: null
    }
  },
  methods: {
    cancel() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$refs.form.resetFields()
      this.visible = false
    },
    open(content) {
      this.content = content
      this.visible = true
    },
    async handleIccidBlur() {
      const iccids = iccidsTransfer(this.formData.iccids)
        .filter((item) => !!item)
        .join(',')
      if (!iccids.length) {
        this.transferCheckResult = null
        return
      }
      let res = await this.jaxLib.customer.subordinate.transferReverseValidate({
        orgId: this.content.id,
        iccids
      })

      this.transferCheckResult = null
      if (!res.success) return false
      this.transferCheckResult = res.data
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const iccids = iccidsTransfer(this.formData.iccids)
            .filter((item) => !!item)
            .join(',')
          let res = await this.jaxLib.customer.subordinate.transferReverse({
            orgId: this.content.id,
            iccids: iccids,
            remark: this.formData.remark
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
    title="逆划拨工具"
    width="600px"
    :close-on-click-modal="false"
    :before-close="cancel"
    append-to-body
    modal-append-to-body
  >
    <el-form ref="form" :model="formData" label-width="160px">
      <el-form-item label="客户">{{ content.orgName }}</el-form-item>
      <el-form-item prop="iccids" label="ICCID" :rules="{ required: true, message: '请输入ICCID' }">
        <el-input
          v-model="formData.iccids"
          type="textarea"
          :rows="8"
          style="width: 400px"
          placeholder="可以直接复制excel中整列ICCID；手动输入多个ICCID，一行一个"
          @change="handleIccidBlur"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark" :rules="{ required: true, message: '请输入备注' }">
        <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注">
        </el-input>
      </el-form-item>
      <template v-if="transferCheckResult">
        <el-form-item label="总卡数">{{ transferCheckResult.allCount }}</el-form-item>
        <el-form-item label="有续费记录卡数">{{
          transferCheckResult.haveRechargeCount
        }}</el-form-item>
        <el-form-item label="无续费记录卡数">{{
          transferCheckResult.notHaveRechargeCount
        }}</el-form-item>
        <el-form-item
          v-if="transferCheckResult.mayExceedPoolId.length"
          label="可能会爆池的流量池ID"
          >{{ transferCheckResult.mayExceedPoolId.join(',') }}</el-form-item
        >
      </template>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :disabled="!transferCheckResult" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
