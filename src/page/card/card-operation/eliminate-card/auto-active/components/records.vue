<template>
  <el-dialog title="记录明细" :visible.sync="visible" width="50%" :before-close="handleClose">
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableData">
          <el-table-column label="序号" width="50px" align="center">
            <template #default="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>
          <el-table-column label="时间">
            <template #default="{ row }">
              {{ row.gmtCreated | dateFilter }}
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="type">
            <template #default="{ row }">
              <span :style="{ color: row.type === '新增' ? 'green' : 'red' }">{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作用户" prop="operator" />
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      loading: false,
      tableData: []
    }
  },
  methods: {
    open(iccid) {
      this.getList(iccid)
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
    async getList(iccid) {
      this.loading = true
      let rst = await this.jaxLib.card.autoActive.history({
        iccid
      })
      this.loading = false
      if (!rst.success) return false
      this.tableData = rst.data || []
    }
  }
}
</script>
