<script>
import apis from '@/api/ajax'
import GoodsDesc from './good-desc.vue'

const form = {
  type: '',
  macAddr: '',
  reason: '',
  logisticsNo: '',
  refund: ''
}
export default {
  props: {
    order: {
      type: Object,
      default: {}
    }
  },
  components: {
    GoodsDesc
  },
  data() {
    return {
      macAddrStatus: '',
      form: { ...form },
      formRules: {
        macAddr: { required: true, message: 'Mac地址不能为空', trigger: 'blur' },
        refund: [
          { required: true, message: '退款金额不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^\d+$/.test(value)) {
                return callback('退款金额为正整数')
              }
              callback()
            }
          }
        ],
        logisticsNo: { required: true, message: '物流单号不能为空', trigger: 'blur' },
        reason: { required: true, message: '申请理由不能为空', trigger: 'blur' }
      }
    }
  },
  computed: {
    orderList() {
      return [...this.order.deviceOrders, ...this.order.packageOrders]
    }
  },
  methods: {
    handleTypeChange(val) {
      if (val === 'RETURN' && this.orderList.length) {
        this.form.refund = this.orderList[0].price
      }
    },
    async macAddrValidate() {
      if (!this.form.macAddr) {
        return
      }
      this.macAddrStatus = ''
      const { success, data } = await apis.cpe.deviceChangeValidate({
        tradeNo: this.order.tradeNo,
        type: 'submit',
        macAddr: this.form.macAddr
      })
      if (!success) return false
      this.macAddrStatus = data
    },
    apply() {
      if (!this.macAddrStatus) {
        return false
      }
      const params = { ...this.form, tradeNo: this.order.tradeNo, orgId: this.order.orgId }
      if (params.type === 'CHANGE') {
        params.refund = 0
      }
      this.$refs.formRef.validate(async valid => {
        if (!valid) return false
        const { success } = await apis.cpe.deviceChange(params)
        if (!success) return false
        this.$message({ type: 'success', message: '申请成功' })
        this.$emit('closeDialog', 'returnsDialog', true)
      })
    },
    cancel() {
      this.form = { ...form }
      this.macAddrStatus = ''
      this.$emit('closeDialog', 'returnsDialog')
    }
  }
}
</script>

<template>
  <div class="order-returns">
    <p>
      <span class="row-title">客户名称：</span>{{ order.orgName }}
    </p>
    <p>
      <span class="row-title">订单号：</span>{{ order.tradeNo }}
    </p>
    <div class="goods" v-if="order && orderList.length">
      <el-form label-width="100px" :model="form" :rules="formRules" ref="formRef">
        <el-form-item label="商品信息：">
          <div class="row flex">
            <div class="flex9 border-right">
              <goods-desc v-for="item in orderList" :key="item.id" :detail="item"></goods-desc>
            </div>
            <div class="flex2 content border-left">
              <div class="tac">
                <template v-if="order.logisticsType === 'EXPRESS'">
                  <p>{{ order.logisticsCompany }}</p>
                  <p v-if="order.freightCollect">(到付)</p>
                  <p v-else-if="!order.freightCollect && !order.logisticsFee">(包邮)</p>
                  <p v-else>(￥{{ order.logisticsFee }})</p>
                </template>
                <p v-else>自提</p>
              </div>
            </div>
            <div class="flex2 border-left content">
              <div>
                <p>￥{{ order.totalMoney }}</p>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="退换货：">
          <el-radio @change="handleTypeChange" v-model="form.type" label="RETURN">退货</el-radio>
          <el-radio @change="handleTypeChange" v-model="form.type" label="CHANGE">换货</el-radio>
        </el-form-item>
        <template v-if="form.type">
          <el-form-item label="Mac地址：" prop="macAddr">
            <el-input v-model="form.macAddr" placeholder="请输入Mac地址" @blur="macAddrValidate"></el-input>
            <span v-if="macAddrStatus" class="el-icon-success icon-success"></span>
            <template v-if="macAddrStatus === false">
              <span class="el-icon-error icon-error"></span>
              <span>请输入订单内设备Mac地址！</span>
            </template>
          </el-form-item>
          <el-form-item label="退款金额：" v-if="form.type === 'RETURN'" prop="refund">
            <el-input type="number" v-model="form.refund" placeholder="请输入退款金额" min="0"></el-input>
            元
          </el-form-item>
          <el-form-item label="物流单号：" prop="logisticsNo">
            <el-input placeholder="请输入物流单号" v-model="form.logisticsNo"></el-input>
          </el-form-item>
          <el-form-item label="申请理由：" prop="reason">
            <el-input type="textarea" placeholder="请输入申请理由" v-model="form.reason"></el-input>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div class="footer-btn">
      <el-button type="primary" @click="apply">确认申请</el-button>
      <el-button @click="cancel">我再想想</el-button>
    </div>
  </div>
</template>

<style lang="scss">
.order-returns {
  .row-title {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px;
  }

  .goods {
    margin-top: 10px;

    .el-input, textarea {
      width: 320px;
    }

    .icon-success {
      font-size: 20px;
      color: #00d449;
    }

    .icon-error {
      font-size: 20px;
      color: #d70000;
      margin-right: 3px;
    }

    .row {
      border: 1px solid #e8e8e8;

      .border-left {
        border-left: 1px solid #ddd;
      }

      .img {
        width: 80px;
        height: 60px;
        text-align: left;
        margin-right: 20px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .content {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .items-center {
      align-items: center;
    }
  }

  .footer-btn {
    padding-left: 100px;
  }
}
</style>
