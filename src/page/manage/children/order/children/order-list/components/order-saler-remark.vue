<script>
export default {
  data() {
    return {
      content: {
        orderNo: '',
        remark: ''
      },
      visible: false,
      remark: ''
    }
  },
  created() {
    this.content = this.remark
  },
  methods: {
    open(content) {
      this.content = content
      this.remark = content.remark
      this.visible = true
    },
    onClose() {
      this.reset()
      this.visible = false
    },
    reset() {
      this.remark = ''
      this.content = {
        orderNo: '',
        remark: ''
      }
      this.$refs.form.resetFields()
    },
    async submit() {
      const { success } = await this.jaxLib.bill.remark.addSalerRemark({
        remark: this.remark,
        orderNo: this.content.orderNo
      })
      if (success) {
        this.$message({ type: 'success', message: '修改成功' })
        this.$emit('confirm')
        this.reset()
        this.visible = false
      }
    }
  }
}
</script>

<template>
  <el-dialog title="销售备注" :visible.sync="visible" width="500px" class="goods-list__dialog">
    <div class="order-modify-remark">
      <el-form ref="form" label-width="60px">
        <el-form-item label="备注：">
          <el-input v-model="remark" type="textarea" rows="4" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>
