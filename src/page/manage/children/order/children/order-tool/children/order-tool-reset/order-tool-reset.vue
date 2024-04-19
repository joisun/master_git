<script>
/**
 * Create by zeter on 2017/11/8
 */
export default {
  data() {
    return {
      form: {
        orderNo: '',
        remark: ''
      },
      formRule: {
        orderNo: [
          {
            validator: (rule, value, callback) => {
              let orderNoReg = /^\d{18}$/g
              if (!value) callback(new Error('快递公司不能为空'))
              else if (!orderNoReg.test(value)) callback(new Error('请填写正确的订单号'))
              else callback()
            },
            trigger: 'change'
          }
        ],
        remark: [
          {
            validator: (rule, value, callback) => {
              if (!value.trim()) return callback(new Error('请填写备注'))
              callback()
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    resetOrder() {
      this.$refs.formRule.validate(async (valid) => {
        if (valid) {
          let rst = await this.jaxLib.bill.resetBill({
            orderNo: this.form.orderNo.trim(),
            remark: this.form.remark
          })
          if (!rst.success) return false
          this.$message.success(`订单${this.form.orderNo}重置成功`)
        }
      })
    }
  }
}
</script>

<template>
  <div class="order-reset">
    <div class="tool__info">
      <div class="tool__info--title">提示</div>
      本工具可以将 “待采购”、“待出库”、“已出库”、“已发货”四类状态下的订单重置为 “待审核” 状态。<br />
      已出库订单订单重置后务必进行卡回收操作
    </div>
    <el-form
      ref="formRule"
      label-width="80px"
      :model="form"
      :rules="formRule"
      class="tool__order--item"
    >
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="form.orderNo" placeholder="请输入订单号"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="备注" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-button type="primary" @click="resetOrder">订单重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
