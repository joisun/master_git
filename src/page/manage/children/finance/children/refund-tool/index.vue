<script>
import { safeGet } from '@/global/function/safe-operations'
const DEFAULT_FORM_DATA = JSON.stringify({
  spNo: ''
})
export default {
  name: 'refund-tool',
  props: {},
  data() {
    return {
      formData: JSON.parse(DEFAULT_FORM_DATA),
      content: null,
      formRules: {
        spNo: [{ required: true, message: '请输入SP单号', trigger: 'change' }]
      }
    }
  },
  created() {},
  methods: {
    handleClose() {
      this.reset()
    },
    reset() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    async submit() {
      await this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { spNo } = this.formData
          const res = await this.jaxLib.financial.tool.refundTool({
            spNo
          })
          if (safeGet(res, 'success', false)) {
            this.$message.success('操作成功')
            this.reset()
          }
        }
      })
    }
  }
}
</script>
<template>
  <div class="forcibly-activate" style="background-color: #fff">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">退款工具</h2>
      </div>
      <el-form ref="form" label-width="80px" :model="formData" :rules="formRules">
        <el-form-item label="SP单号" prop="spNo">
          <el-input v-model.trim="formData.spNo" style="width: 400px" />
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.search-form-inline {
  & > .el-form-item {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
