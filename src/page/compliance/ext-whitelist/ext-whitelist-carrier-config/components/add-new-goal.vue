<template>
  <el-dialog title="新增目的" :visible.sync="visible" :before-close="handleClose" destroy-on-close>
    <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
      <el-form-item label="已存在的目的">
        {{ content.purpose }}
      </el-form-item>
      <el-form-item label="新增目的" prop="purpose">
        <el-select
          v-model="formData.purpose"
          multiple
          allow-create
          default-first-option
          style="width: 300px"
        >
          <el-option
            v-for="item in purposeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      content: {},
      purposeOptions: [],
      visible: false,
      formData: {
        purpose: []
      },
      rules: {
        purpose: {
          required: true,
          message: '请选择目的'
        }
      }
    }
  },
  created() {
    this.getPurposeList()
  },
  methods: {
    async getPurposeList() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.workOrderCarrierConfigPuerposeList({})
      this.loading = false
      if (!success) return false
      this.purposeOptions = data.filter(
        (item) => !content.purpose.split(',').includes(item.purpose)
      )
    },
    extractNewPurpose(pur) {
      return pur.filter((item) => !this.purposeOptions.map((item) => item.purpose).includes(item))
    },
    async addPurpose(purpose) {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.workOrderCarrierConfigPuerposeInsert({
        purpose: this.extractNewPurpose(purpose).join()
      })
      this.loading = false
      if (!success) return false
      this.purposeOptions = data
    },
    onCancel() {
      this.visible = false
    },
    onConfirm() {
      this.visible = false
    },
    handleClose() {
      this.visible = false
    },
    onCarrierChange(value) {},
    open(content) {
      this.content = content
      this.visible = true
    }
  }
}
</script>
