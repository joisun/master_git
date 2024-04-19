<script>
/**
 * Create by zeter on 2017/7/4
 */
import DialogMixin from '@/global/mixins/dialog-mixin'

export default {
  mixins: [DialogMixin],
  props: {
    orderAllValue: {
      default: Object,
      require: true
    },
    billStatus: {
      default: String,
      require: true
    }
  },
  data() {
    return {
      // 关闭时的评论
      closeRemark: '',
      // 关闭按钮是否不可用
      disableCloseWinNextBtn: true,
      refund: undefined, // 退款金额
      isFullPayment: false, // 是否全款
      hintMessage: '关闭原因会通过短信发送给客户，请认真填写'
    }
  },
  watch: {
    isFullPayment(v) {
      if (v) {
        this.refund = Number(this.orderAllValue.totalMoney) / 10000
      }
    }
  },
  methods: {
    open() {
      this.closeRemark = ''
      this.disableCloseWinNextBtn = true
    },
    close(refresh) {
      this.refund = undefined
      this.isFullPayment = false
      this.$emit('close', refresh)
    },
    async onCloseBill() {
      const remark = this.closeRemark
      this.disableCloseWinNextBtn = true
      let rst = await this.jaxLib.bill.cancel(this.orderAllValue.id, remark, this.refund)
      if (rst.success) {
        this.closeRemark = ''
        this.close(true)
        this.msg(`订单${this.orderAllValue.orderNo}关闭成功！`, 'success')
      } else {
        this.msg(rst.message, 'error')
        this.disableCloseWinNextBtn = false
      }
    },
    // 原因填写回调
    onCloseRemarkChange(val) {
      this.disableCloseWinNextBtn = !this.closeRemark.length
    }
  }
}
</script>

<template>
  <div class="close-order">
    <p class="close__title">
      <el-alert :title="hintMessage" type="warning" :closable="false" show-icon />
    </p>
    <p class="close__title">
      即将关闭订单 {{ orderAllValue.orderNo }} ({{ enums.orderStatus.maps()[billStatus] }})
    </p>
    <el-form label-width="80px">
      <el-form-item label="退款金额">
        <div v-if="billStatus === 'PAYMENT'">无需退款</div>
        <div v-else-if="billStatus === 'PURCHASING'">
          全款金额({{ Number(orderAllValue.totalMoney) / 10000 }}元)
          <el-input-number
            v-model="refund"
            :disabled="isFullPayment"
            :controls="false"
            :min="0"
            :max="Number(orderAllValue.totalMoney) / 10000"
            :precision="2"
          />
          <el-checkbox v-model="isFullPayment">全额退款</el-checkbox>
        </div>
        <div v-else>全款退回({{ Number(orderAllValue.totalMoney) / 10000 }}元)</div>
      </el-form-item>
      <el-form-item label="卡回收">
        <div v-if="billStatus === 'DELIVERING' && orderAllValue.baseOperationId">
          共计{{ orderAllValue.buyCount }}张物联网卡即将被回收
        </div>
        <div v-else>无</div>
      </el-form-item>
      <el-form-item label="关闭原因">
        <el-input
          v-model="closeRemark"
          :placeholder="hintMessage"
          type="textarea"
          @input="onCloseRemarkChange"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="wh-dialog-footer">
      <el-button @click="close">我再想想</el-button>
      <el-button type="primary" :disabled="disableCloseWinNextBtn" @click="onCloseBill"
        >关闭订单
      </el-button>
    </span>
  </div>
</template>
