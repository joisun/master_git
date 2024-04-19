<script>
/**
   * Create by zeter on 2018/11/6
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    name: 'balance-control',
    props: {
      orgId: {
        default: String
      },
      dialogName: {
        default: String
      }
    },
    data() {
      return {
        debtThreshold: 500
      }
    },
    methods: {
      async open() {
        let rst = await this.jaxLib.customer.balance.get({
          orgId: this.orgId
        })
        if (!rst.success) return false
        this.debtThreshold = 0 - Number(rst.data.debtThreshold / 10000)
      },
      close() {
        this.$emit('closeDialog', this.dialogName, false)
        this.debtThreshold = 500
      },
      async submitForm() {
        let rst = await this.jaxLib.customer.balance.setThreshold({
          orgId: this.orgId,
          debtThreshold: 0 - this.debtThreshold
        })
        if (!rst.success) return false
        this.$message.success(`设置成功,orgId${this.orgId}成功设置余额提醒阈值为-${this.debtThreshold}`)
        this.$emit('closeDialog', this.dialogName, false)
      }
    }
  }
</script>

<template>
  <div class="banlance-control wh__dialog">
    <div class="wh__dialog--body">
      <el-form label-width="100px" ref="form" label-position="left">
        <el-form-item label="设置阈值">
          <el-input-number v-model="debtThreshold" placeholder="请输入余额阈值" :min="500" :max="20000"
            :debounce="1000">
          </el-input-number>
        </el-form-item>
        <div>
          * 系统将在客户余额低于-{{debtThreshold}}元时停卡，发送短信和企业微信通知
        </div>
      </el-form>
    </div>
    <div class="wh__dialog--footer">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>
