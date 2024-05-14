<template>
  <el-dialog title="记录明细" :visible.sync="visible" width="50%" :before-close="handleClose">
    <div v-loading="loading" class="wh__body">
      <el-row style="margin-bottom: 30px">
        <el-col :span="8"> 订单类型: {{ content.orderType | commissionOrderTypeFilter }}</el-col>
        <el-col :span="8"> 收入类型: {{ content.type | commissionTypeFilter }}</el-col>
        <el-col :span="8"> 交易编号: {{ content.orderNo }}</el-col>
      </el-row>
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
              {{ row.type }}
            </template>
          </el-table-column>
          <el-table-column label="内容">
            <template #default="{ row }">
              {{ row.content }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="type">
            <template #default="{ row }">
              {{ row.remark }}
            </template>
          </el-table-column>
          <el-table-column label="操作用户" prop="operator" />
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          :total="page.total"
          layout="pager, total"
          @current-change="handlePageChange"
        />
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
      tableData: [],
      content: {},
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  methods: {
    handlePageChange(e) {
      this.page.currentPage = e
      this.getList()
    },
    open(content) {
      this.content = content
      this.getList()
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
    async getList() {
      this.loading = true
      let res = await this.jaxLib.salesComission.salesCommission2024.detailModifyRecord({
        id: this.content.id,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize
      })
      this.loading = false
      if (res.success) {
        this.tableData = res.data.list
        this.page.total = res.data.page.allCount
      }
    }
  }
}
</script>
