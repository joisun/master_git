<template>
  <el-dialog
    :visible="visible"
    title="批量查询"
    :before-close="onClose"
    :close-on-click-modal="false"
  >
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="fileKey" label="文件" />
      <el-table-column prop="gmtCreated" label="创健时间">
        <template #default="{ row }">
          {{ row.gmtCreated | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column prop="action" label="操作" width="100">
        <template #default="{ row }">
          <el-button :disabled="row.status !== '完成'" @click="handleDownload(row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.pageIndex"
      :page-size="page.pageSize"
      layout="total, prev, pager, next"
      :total="page.total"
      @current-change="handlePageChange"
    />
  </el-dialog>
</template>

<script>
import apis from '@/api/ajax'

export default {
  components: {},
  data() {
    return {
      page: {
        pageIndex: 1,
        pageSize: 30,
        total: 0
      },
      tableData: [],
      visible: false,
      loading: false
    }
  },
  methods: {
    handlePageChange(val) {
      this.page.pageIndex = val
      this.getList()
    },
    onClose() {
      this.visible = false
    },
    open() {
      this.visible = true
      this.getList()
    },
    async handleDownload(row) {
      const { success, data } = await apis.crm.customerDuplicateGetUrl({ fileKey: row.fileKey })
      if (!success) return false
      window.location.href = data
    },
    async getList() {
      this.loading = true
      const { success, data } = await apis.crm.customerDuplicateSearchPage({
        pageNo: this.page.pageIndex,
        pageSize: this.page.pageSize
      })
      this.loading = false
      if (!success) return false
      this.tableData = data.records
      this.page.total = data.pagin.totalCount
    }
  }
}
</script>
