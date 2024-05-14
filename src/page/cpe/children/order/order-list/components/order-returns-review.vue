<script>
import GoodsDesc from './good-desc.vue'
import apis from '@/api/ajax'

const typeMap = {
  CHANGE: '换货',
  RETURN: '退货'
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
      typeMap,
      form: {
        remark: '',
        macAddr: ''
      },
      formRules: {
        remark: { required: true, message: '审批建议不能为空', trigger: 'blur' }
      },
      changeDeviceDetail: {}
    }
  },
  computed: {
    orderList() {
      return [...this.order.deviceOrders, ...this.order.packageOrders]
    }
  },
  watch: {
    order: {
      handler() {
        this.getDetail()
      },
      immediate: true
    }
  },
  methods: {
    async getDetail() {
      const { success, data } = await apis.cpe.deviceChangeDetail({ id: this.order.deviceChangeRecordId })
      if (!success) {
        return false
      }
      this.changeDeviceDetail = data
    },
    async macAddrValidate() {
      if (!this.form.macAddr) {
        return
      }
      this.macAddrStatus = ''
      const { success, data } = await apis.cpe.deviceChangeValidate({
        tradeNo: this.order.tradeNo,
        type: 'review',
        macAddr: this.form.macAddr
      })
      if (!success) return false
      this.macAddrStatus = data
    },
    apply(action) {
      if (action === 'DONE' && this.changeDeviceDetail.type === 'CHANGE') {
        if (!this.form.macAddr) {
          return this.$message({ type: 'warning', message: '新换的Mac地址不能为空' })
        }
        if (!this.macAddrStatus) {
          return false
        }
      }
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        const { success } = await apis.cpe.deviceChangeReview({
          id: this.order.deviceChangeRecordId,
          action,
          remark: this.form.remark,
          macAddr: this.form.macAddr
        })
        if (!success) return
        this.$message({ type: 'success', message: action === 'DONE' ? '通过成功' : '驳回成功' })
        this.$emit('closeDialog', 'returnsReviewDialog', true)
      })
    }
  }
}
</script>

<template>
  <div class="order-returns-view">
    <p>
      <span class="row-title">客户名称：</span>{{ order.orgName }}
    </p>
    <p>
      <span class="row-title">订单号：</span>{{ order.tradeNo }}
    </p>
    <div class="goods" v-if="order && orderList.length">
      <el-form label-width="120px" :model="form" :rules="formRules" ref="formRef">
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
        <el-form-item label="退换货：">{{ typeMap[changeDeviceDetail.type] }}</el-form-item>
        <el-form-item label="Mac地址：">{{ changeDeviceDetail.macAddr }}</el-form-item>
        <el-form-item v-if="changeDeviceDetail.type !== 'CHANGE'" label="退款金额：">{{changeDeviceDetail.refund}}</el-form-item>
        <el-form-item label="物流单号：">{{ changeDeviceDetail.logisticsNo }}</el-form-item>
        <el-form-item label="申请理由：">{{ changeDeviceDetail.reason }}</el-form-item>
        <el-form-item v-if="changeDeviceDetail.type === 'CHANGE'" label="换新Mac地址：">
          <el-input placeholder="请输入换新的Mac地址" @blur="macAddrValidate" v-model="form.macAddr"></el-input>
          <span v-if="macAddrStatus" class="el-icon-success icon-success"></span>
          <template v-if="macAddrStatus === false">
            <span class="el-icon-error icon-error"></span>
            <span>请输入相同型号且正确的Mac地址！</span>
          </template>
        </el-form-item>
        <el-form-item label="审批建议：" prop="remark">
          <el-input type="textarea" placeholder="请输入审批建议" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer-btn">
      <el-button type="primary" @click="apply('DONE')">通过</el-button>
      <el-button @click="apply('REJECT')">驳回</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-returns-view {
  .row-title {
    display: inline-block;
    width: 120px;
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
