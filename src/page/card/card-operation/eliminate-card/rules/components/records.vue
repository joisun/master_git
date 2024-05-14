<template>
  <el-dialog title="记录明细" :visible.sync="visible" width="70%" :before-close="handleClose">
    <el-card :header="`订单编号： ${orderNo}`" shadow="none">
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
            <el-table-column label="规则">
              <template #default="{ row }">{{
                row.delayMonth === 1 ? '次月销卡' : `延迟 ${row.delayMonth} 个月`
              }}</template>
            </el-table-column>
            <el-table-column label="操作用户" prop="operator" />
          </el-table>
        </div>
      </div>
    </el-card>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      loading: false,
      tableData: [],
      orderNo: ''
    }
  },
  methods: {
    open(value) {
      this.getList(value)
      this.orderNo = value
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
    async getList(value) {
      this.loading = true
      let rst = await this.jaxLib.card.eliminateRules.getHistory({
        orderNo: value
      })
      this.loading = false
      if (!rst.success) return false
      this.tableData = rst.data || []
    }
  }
}
</script>
