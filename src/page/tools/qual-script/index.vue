<script>
import { safeGet } from '@/global/function/safe-operations'
const DEFAULT_FORM_DATA = JSON.stringify({
  orgIds: ''
})
export default {
  name: 'qual-script',
  data() {
    return {
      formData: JSON.parse(DEFAULT_FORM_DATA),
      content: null,
      formRules: {
        orgIds: [{ required: true, message: '请输入orgIds', trigger: 'change' }]
      }
    }
  },
  methods: {
    reset() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    async submit() {
      await this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { orgIds } = this.formData
          const res = await this.jaxLib.tools.runQualRev({
            orgIds
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
        <h2 class="wh__header--title">资质审核脚本RUN</h2>
      </div>
      <el-form ref="form" label-width="80px" :model="formData" :rules="formRules">
        <el-form-item label="orgIds" prop="orgIds">
          <el-input v-model="formData.orgIds" type="textarea" rows="6" />
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
