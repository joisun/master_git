<script>
import { columns } from './mixins/const'

/**
 * Create by zeter on 2019/12/25
 */
export default {
  name: 'inventory-modify-list',
  data() {
    return {
      columns: columns,
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    enterDetail(id) {
      this.$router.push({ name: 'return-stock-detail', query: { id: id } })
    },
    openDetail() {
      this.$router.push({ name: 'return-stock-detail' })
    },
    async getList() {
      this.loading = true
      const { pageIndex, pageSize } = this.page
      const {
        data: {
          page: { allCount },
          list
        },
        success
      } = await this.jaxLib.store.activeToInventoryList({
        pageNo: pageIndex,
        pageSize: pageSize
      })
      this.loading = false
      if (!success) return false
      this.tableData = list
      this.page.total = allCount
    },
    changeIndex(val) {
      this.page.pageIndex = val
      this.getList()
    }
  }
}
</script>

<template>
  <div class="inventory-modify-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">激活卡恢复库存</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-button size="mini" type="primary" @click="openDetail()">发起申请</el-button>
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 260px)">
            <el-table-column
              v-for="(item, index) in columns"
              :key="index"
              :formatter="item.formatter"
              :prop="item.key"
              :label="item.name"
              :min-width="item.width"
              :align="item.align"
              :class-name="item.style"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="enterDetail(scope.row.id)"
                  >查看详情</el-button
                >
              </template>
            </el-table-column>
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
    </div>
  </div>
</template>

