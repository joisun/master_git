<template>
  <el-dialog
    :visible.sync="visible"
    width="30%"
    title="菜单设置"
    :before-close="handleClose"
    :show-close="false"
    close-on-click-modal
  >
    <el-form ref="form" :model="formData" label-width="80px">
      <el-form-item label="更改部门">
        <el-select v-model="formData.userDep" placeholder="">
          <el-option label="研发部" value="dev"></el-option>
          <el-option label="销售部" value="salesDep"></el-option>
          <el-option label="客服部" value="serviceDep"></el-option>
          <el-option label="运营部" value="operationDep"></el-option>
          <el-option label="市场部" value="marketingDep"></el-option>
          <el-option label="供应链部" value="supplyChainDep"></el-option>
          <el-option label="人力行政部" value="HrDep"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      formData: {
        userDep: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.visible = false
    },
    open(content) {
      this.formData.userDep = content.userDep
      this.visible = true
    },
    onSubmit() {
      this.$emit('confirm', this.formData)
      this.visible = false
    }
  }
}
</script>
