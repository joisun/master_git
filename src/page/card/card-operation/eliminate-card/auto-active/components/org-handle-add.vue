<script>
export default {
  data() {
    return {
      orgList: [],
      isSelectLoading: false,
      formRules: {
        orgId: [{ required: true, message: '请选择运营商', trigger: 'change' }]
      },
      formData: {
        orgId: ''
      },
      visible: false
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    cancel() {
      this.formData = {
        orgId: ''
      }
      this.$refs.form.resetFields()
      this.visible = false
    },
    handleOrgChange(value) {
      if (!value) {
        this.getOrgList('')
      }
    },
    async getOrgList(content) {
      if (!content) {
        this.orgList = []
        return false
      }
      this.isSelectLoading = true
      const res = await this.jaxLib.card.organizationSearch({ content })
      this.isSelectLoading = false
      if (!res.success) return false
      this.orgList = res.data
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.jaxLib.card.autoActive.insertRule({
            ...this.formData
          })
          if (res && res.success) {
            this.$message.success('操作成功')
            this.$emit('confirm')
            this.cancel()
            this.visible = false
          }
        }
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="visible"
    title="新增"
    width="500px"
    :close-on-click-modal="false"
    append-to-body
    :before-close="cancel"
  >
    <el-form ref="form" :model="formData" label-width="120px" :rules="formRules">
      <el-form-item label="客户" prop="orgId">
        <el-select
          v-model="formData.orgId"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="客户账号、ID、手机号"
          :remote-method="getOrgList"
          :loading="isSelectLoading"
          @change="handleOrgChange"
        >
          <el-option
            v-for="item in orgList"
            :key="item.orgId"
            :label="item.orgName + '(' + item.orgId + ')'"
            :value="item.orgId"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.dialog-footer {
  text-align: right;
  margin-top: 15px;
}
</style>
