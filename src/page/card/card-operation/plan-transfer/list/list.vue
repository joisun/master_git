<script>
/**
 * Create by zeter on 2019/12/20
 */
import ajax from '@/api/ajax'
import filterQueryParams from '@/global/function/filterQueryParams'

export default {
  name: 'plan-transfer-list',
  data() {
    return {
      loading: false,
      iccid: '',
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    openDetail(row) {
      this.$router.push({ name: 'plan-transfer-detail', query: { id: row ? row.id : '' } })
    },
    search() {
      this.page.pageIndex = 1
      this.getList()
    },
    handlePageChange(val) {
      this.page.pageIndex = val
      this.getList()
    },
    async getList() {
      this.loading = true
      const {
        data: { page, list },
        success
      } = await ajax.card.transfer.list(
        filterQueryParams({
          iccid: this.iccid,
          currentPage: this.page.pageIndex,
          rowsPerPage: this.page.pageSize
        })
      )
      this.loading = false
      if (!success) return false
      this.tableData = list
      this.page.total = page.allCount
    }
  }
}
</script>

<template>
  <div class="plan-transfer-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">卡套餐转移 (仅限宇视的卡操作)</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-input
            v-model="iccid"
            placeholder="请输入ICCID"
            class="wh__tools--search-input"
            @keyup.native.enter="search"
          >
            <el-button slot="append" icon="el-icon-search" @click.native="search"> </el-button>
          </el-input>
          <el-button class="float-right" type="primary" @click="openDetail()">发起申请</el-button>
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 260px)">
            <el-table-column label="被转移卡ICCID" prop="origIccid" />
            <el-table-column label="接受卡ICCID" prop="targetIccid" />
            <el-table-column label="被转移套餐个数" prop="drpCount" />
            <el-table-column label="操作人" prop="operator" />
            <el-table-column label="操作时间">
              <template slot-scope="scope">
                {{ scope.row.gmtCreated | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <el-button size="mini" @click="openDetail(scope.row)">详情</el-button>
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
            @current-change="handlePageChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
