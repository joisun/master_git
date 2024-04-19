<script>
  export default {
    props: {
      remark: {
        type: String,
        default: ''
      },
      orderNo: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        content: ''
      }
    },
    created() {
      this.content = this.remark
    },
    methods: {
      async submit() {
        if (!this.content) {
          return this.$message({ type: 'error', message: '备注不能为空' })
        }
        const { success } = await this.jaxLib.bill.updateOrderRemark({ remark: this.content, orderNo: this.orderNo })
        if (success) {
          this.$message({ type: 'success', message: '修改成功' })
          this.$emit('close', { refresh: true })
        }
      }
    }
  }
</script>

<template>
  <div class="order-modify-remark">
    <el-form label-width="60px">
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="content" rows="4"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
