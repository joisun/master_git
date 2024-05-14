<script>
export default {
  data() {
    return {
      formData: {
        orderNoList: [],
        autoRule: '1',
        delayMonth: 1,
        delayMonthLocal: 2
      },
      orderNo: '',
      visible: false
    }
  },
  watch: {
    'formData.autoRule'(newValue) {
      if (newValue === '1') {
        this.formData.delayMonth = 1
        this.formData.delayMonthLocal = 2
      } else {
        this.formData.delayMonth = this.formData.delayMonthLocal
      }
    },
    'formData.delayMonth'(newValue) {
      if (newValue === 1) {
        this.formData.autoRule = '1'
      } else {
        this.formData.autoRule = 'delay'
        this.formData.delayMonthLocal = newValue
      }
    }
  },
  methods: {
    cancel() {
      this.formData = {
        orderNoList: [],
        autoRule: '1',
        delayMonth: 1,
        delayMonthLocal: 2
      }
      this.orderNo = ''
      this.$refs.form.resetFields()
      this.visible = false
    },
    open(content) {
      this.visible = true
      const { orderNo, delayMonth } = content
      this.orderNo = Array.isArray(orderNo) ? orderNo.join() : orderNo
      if (delayMonth) {
        this.formData.delayMonth = delayMonth
        this.formData.delayMonthLocal = delayMonth
      }
      this.formData.orderNoList = Array.isArray(orderNo) ? orderNo : [orderNo]
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.jaxLib.card.eliminateRules.updateRetireRule({
            orgId: this.$route.query.orgId,
            delayMonth: this.formData.autoRule === '1' ? 1 : this.formData.delayMonthLocal,
            orderNoList: this.formData.orderNoList
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
    title="变更"
    width="600px"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form ref="form" :model="formData" label-width="130px">
      <el-form-item label="订单编号">{{ orderNo }}</el-form-item>
      <el-form-item label="自动销卡规则">
        <el-radio-group v-model="formData.autoRule">
          <el-radio label="1">次月销卡</el-radio>
          <el-radio label="delay">
            延迟
            <el-input-number
              v-model="formData.delayMonthLocal"
              :disabled="formData.autoRule === '1'"
              :min="2"
              :max="12"
              label=""
            />
            个月销卡
          </el-radio>
        </el-radio-group>
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
