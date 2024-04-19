<script>
/**
   * Create by zeter on 2017/11/8
   */
  import regexps from '@/constant/regexps'
  import whIccidInput from '@/global/components/wh-iccid-input.vue'

  export default {
    data() {
      return {
        form: {
          orderNo: '',
          money: '',
          outMoney: '',
          remark: '',
          refundAll: true,
          refIccids: []
        },
        formRule: {
          orderNo: [
            { validator: (rule, value, callback) => {
                let trimValue = value.trim()
                let orderNoReg = /^\d{18}$/g
                if (!trimValue) {
                  callback(new Error('订单号不能为空'))
                } else if (!orderNoReg.test(trimValue)) {
                  callback(new Error('请填写正确的订单号'))
                } else {
                  callback()
                }
              },
              trigger: 'blur' }
          ],
          outMoney: [
            { validator: (rule, value, callback) => {
                let moneyReg = regexps.money
                if (!value) callback('请填写退款金额')
                else if (!moneyReg.test(value)) callback('请填写正确的退款金额')
                else if (+value > +this.form.money) callback('退款金额不能大于订单金额')
                else callback()
              },
              trigger: 'change' }
          ],
          remark: [
            { validator: (rule, value, callback) => {
                if (!value.trim()) return callback(new Error('请填写备注'))
                callback()
              },
              trigger: 'change' }
          ]
        },
        showMoney: false
      }
    },
    methods: {
      searchBill() {
        this.$refs.formRule.validateField('orderNo', async err => {
          this.showMoney = false
          if (!err) {
            let rst = await this.jaxLib.bill.query({
              orderNo: this.form.orderNo,
              pageSize: '1',
              pageIndex: '1',
              enableFilter: 'off',
              status: 'DONE'
            })
            if (!rst.success) return false
            if (rst.data.list.length === 0) {
              rst = await this.jaxLib.bill.query({
                orderNo: this.form.orderNo,
                pageSize: '1',
                pageIndex: '1',
                enableFilter: 'off',
                status: 'REFUND'
              })
              if (!rst.success) return false
              if (rst.data.list.length === 0) {
                this.$message.warning('没有找到订单或订单不是已完成或已退款状态')
                return
              }
            }
            let nowOrder = rst.data.list[0]
            this.form.money = (nowOrder.money / 10000).toFixed(2)
            this.showMoney = true
          }
        })
      },
      reset() {
        this.form = {
          orderNo: '',
          money: '',
          outMoney: '',
          remark: '',
          refundAll: true,
          refIccids: []
        }
        this.$refs.formRule.resetFields()
        this.showMoney = false
      },
      refundOrder() {
        this.$refs.formRule.validate(valid => {
          if (valid) {
            this.$confirm(`订单${this.form.orderNo}确认退款${this.form.outMoney}元, 该操作无法撤回, 确认要继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              const params = {
                orderNo: this.form.orderNo,
                remark: this.form.remark,
                refundMoney: (this.form.outMoney * 10000).toFixed(0)
              }
              if (this.form.refundAll) {
                params.refundAll = true
              } else {
                params.refIccids = this.form.refIccids.join(',')
              }
              let rst = await this.jaxLib.bill.refundBill(params)
              if (!rst.success) return false
              this.$message.success(`订单${this.form.orderNo}退款成功`)
              this.reset()
            }).catch()
          }
        })
      }
    },
    components: {
      whIccidInput
    }
  }
</script>

<template>
  <div class="order-refund">
    <div class="tool__info">
      <div class="tool__info--title">提示</div>
      本工具可以支持 "已完成"或"已退款" 状态的订单进行退款操作。<br>
      每笔订单仅支持操作一次，请谨慎操作
    </div>
    <el-form label-width="80px" :model="form" :rules="formRule" ref="formRule" class="tool__order--item">
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model.trim="form.orderNo" placeholder="请输入订单号" style="width: 250px;"></el-input>
        <el-button @click="searchBill">查询订单</el-button>
      </el-form-item>
      <el-form-item label="订单金额" v-if="showMoney">
        <span>{{form.money}}元</span>
      </el-form-item>
      <el-form-item label="退款金额" prop="outMoney">
        <el-input v-model.trim="form.outMoney" placeholder="退款金额"></el-input>
      </el-form-item>
      <el-form-item label="退款原因" prop="remark">
        <el-input v-model="form.remark" placeholder="请详细记录退款原因和其他信息" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="退款卡号" prop="iccid">
        <el-radio v-model="form.refundAll" :label="true">全量卡</el-radio>
        <el-radio v-model="form.refundAll" :label="false">部分卡</el-radio>
        <wh-iccid-input v-model="form.refIccids" v-if="!form.refundAll"/>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="refundOrder" :disabled="!showMoney">执行</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
