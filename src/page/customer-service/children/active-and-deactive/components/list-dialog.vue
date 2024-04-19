<template>
  <el-dialog title="提示" :visible.sync="visible" width="70%" :before-close="handleClose">
    <el-form :model="searchForm" inline>
      <el-form-item label="">
        <el-input
          v-model="searchForm.empName"
          placeholder="操作人"
          @keydown.enter.native="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableData">
          <el-table-column label="操作成功卡片数量">
            <template #default="{ row }">
              <el-button
                v-if="row.successSize !== 0"
                type="text"
                @click="download(row, 'success')"
                >{{ row.successSize }}</el-button
              >
              <template v-else>{{ row.successSize }}</template>
            </template>
          </el-table-column>
          <el-table-column label="操作失败卡片数量">
            <template #default="{ row }">
              <el-button v-if="row.failSize !== 0" type="text" @click="download(row, 'fail')">{{
                row.failSize
              }}</el-button>
              <template v-else>{{ row.failSize }}</template>
            </template>
          </el-table-column>
          <el-table-column label="操作内容" prop="descriptions" />
          <el-table-column label="操作时间">
            <template #default="{ row }">
              {{ row.gmtCreated | dateFilter }}
            </template>
          </el-table-column>
          <el-table-column label="操作人" prop="empName" />
          <el-table-column label="备注" prop="remark" />
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :total="page.total"
          layout="pager, total"
          @current-change="changeIndex"
        >
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import dateFormat from '@/global/filters/date-format'
import Download from '@/page/components/wh-download/wh-download'

export default {
  data() {
    return {
      visible: false,
      loading: false,
      searchForm: {
        timeRange: [],
        empName: ''
      },
      columns: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      tableData: []
    }
  },
  methods: {
    open() {
      this.getList()
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
    async getList() {
      this.loading = true
      const { timeRange, empName } = this.searchForm
      let start, end
      if (timeRange && timeRange.length === 2) {
        start = dateFormat(timeRange[0])
        end = dateFormat(timeRange[1])
      }
      let rst = await this.jaxLib.customerServices.toolLog({
        business: '激活停卡',
        start,
        end,
        empName,
        currentPage: this.page.pageIndex,
        pageSize: this.page.pageSize
      })
      this.loading = false
      if (!rst.success) return false
      this.tableData = rst.data.list || []
      this.page.total = rst.data.page.allCount
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    async download(row, exportType) {
      const res = await this.jaxLib.customerServices.toolLogExport({
        exportType,
        id: row.id
      })
      await Download({ ...res.data })
    }
  }
}
</script>
