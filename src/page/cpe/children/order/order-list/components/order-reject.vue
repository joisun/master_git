<script>
/**
   * Create by zeter on 2018/11/20
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import apis from '@/api/ajax'
  export default {
    mixins: [DialogMixin],
    name: 'order-reject-dialog',
    data() {
      return {
        form: {
          remark: ''
        },
        rules: {
          remark: [
            { required: true, message: '请填写驳回理由', trigger: 'blur' }
          ]
        }
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
          const { success } = await apis.cpe.postOrderAuditReject({
            tradeNo: this.order.tradeNo,
            remark: this.form.remark
          })
          if (!success) return false
          this.$message.success('驳回订单成功')
          this.$emit('closeDialog', this.dialogName, true)
        })
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
        <el-form-item label="驳回理由" prop="remark">
          <el-input v-model="form.remark" type="textarea" style="width: 250px;"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="wh__dialog--footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </div>
</template>
