<script>
/**
   * Create by zeter on 2018/11/20
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import apis from '@/api/ajax'
  export default {
    mixins: [DialogMixin],
    name: 'order-close-dialog',
    data() {
      return {
        form: {
          remark: ''
        },
        rules: {
          remark: [
            { required: true, message: '请填写备注', trigger: 'blur' }
          ]
        },
        isBtnLoading: false
      }
    },
    props: {
      order: {
        default: String
      },
      dialogName: {
        default: String
      }
    },
    methods: {
      open() {
        this.form.remark = ''
        this.$refs.form.resetFields()
      },
      close() {
        this.$emit('closeDialog', this.dialogName)
      },
      async submit() {
        this.$refs.form.validate(async valid => {
          if (!valid) return false
          this.isBtnLoading = true
          const { success } = await apis.cpe.postOrderClose({
            tradeNo: this.order.tradeNo,
            remark: this.form.remark })
          this.isBtnLoading = false
          if (!success) return false
          this.$message.success('关闭订单成功')
          this.$emit('closeDialog', this.dialogName, true)
        })
      },
      async downFile() {
        const { data, success } = await apis.cpe.getOrderMacFile({
          tradeNo: this.order.tradeNo
        })
        if (!success) return false
        window.location.href = data.fileKey
      }
    }
  }
</script>

<template>
  <div class="industry-dialog wh__dialog">
    <div class="wh__dialog--body">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" label-position="right">
        <el-form-item label="订单号">
          {{order.tradeNo}}
        </el-form-item>
        <el-form-item label="客户名称">
          {{order.orgName}}
        </el-form-item>
        <el-form-item label="退款金额">
          <span v-if="order.status === 'PAYMENT'">无需退款</span>
          <span v-else>￥{{order.totalMoney}}</span>
        </el-form-item>
        <el-form-item label="设备回收">
          <span v-if="['PAYMENT', 'REVIEW','OUTPUTING', 'REVIEW-FAILD'].indexOf(order.status) >= 0">
            无需清除出库信息
          </span>
          <span v-else>
            设备数: {{order.buyCount}}
            <el-button type="text" @click="downFile">明细下载</el-button>
          </span>
        </el-form-item>
        <el-form-item label="闭单理由" prop="remark">
          <el-input v-model.trim="form.remark" type="textarea" style="width: 250px;"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="wh__dialog--footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit" v-loading="isBtnLoading">确认</el-button>
    </div>
  </div>
</template>
