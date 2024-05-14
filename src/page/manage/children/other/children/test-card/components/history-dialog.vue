<script>
export default {
  data() {
    return {
      visible: false,
      tableData: [],
      loading: false
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
      this.reset()
    },
    async getData(iccid) {
      this.loading = true
      const res = await this.jaxLib.testCard.getHistory({ iccids: iccid })
      this.loading = false
      if (!res.success) return false
      this.tableData = res.data
    },
    open(id) {
      this.getData(id)
      this.visible = true
    }
  }
}
</script>
<template>
  <div class="test-card-apply-dialog">
    <el-dialog title="历史记录" :visible.sync="visible" :close-on-click-modal="true">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="user" label="卡归属人" width="180"> </el-table-column>
        <el-table-column prop="reason" label="申请理由" width="180"> </el-table-column>
        <el-table-column prop="applyTime" label="申请时间">
          <template #default="{ row }">
            {{ row.applyTime | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="returnTime" label="归还时间">
          <template #default="{ row }">
            {{ row.returnTime | dateFilter }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.test-card-apply-dialog {
  .el-button {
    width: 100px;
  }
}
</style>
