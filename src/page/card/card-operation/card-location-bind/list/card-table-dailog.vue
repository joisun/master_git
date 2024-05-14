<template>
  <el-dialog title="卡号列表" :visible.sync="visible" width="30%">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="iccid" label="卡号" />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      isLoading: false,
      tableData: []
    }
  },
  methods: {
    open(iccids) {
      this.tableData = iccids.map((iccid) => ({ iccid }))
      console.log('🎸 DEBUG_21 card-table-dailog.vue 👉', this.tableData)
      this.visible = true
    }
  }
}
</script>

