<script>
/**
 * Create by zeter on 2019/12/20
 */
import ajax from '@/api/ajax'

export default {
  name: 'cancel-plan-list',
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
    openDetail() {
      this.$router.push({ name: 'cancel-plan-detail' })
    },
    async downDetail(row) {
      const { id } = row
      const { success, data } = await ajax.card.cancelPlanApplyDetailDown({ id })
      if (!success) return false
      window.location.href = data
    },
    async restart(row) {
      const { id } = row
      const { success } = await ajax.card.cancelPlanApplyRestart({ id })
      if (!success) return false
      this.$message.success('重新生成成功')
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
      } = await ajax.card.cancelPlanApplyList({
        iccids: this.iccid,
        currentPage: this.page.pageIndex,
        rowsPerPage: this.page.pageSize
      })
      this.loading = false
      if (!success) return false
      this.tableData = list
      this.page.total = page.allCount
    }
  }
}
</script>

<template>
  <div class="cancel-plan-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">取消计划套餐</h2>
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
            <el-table-column label="ID" prop="id"> </el-table-column>
            <el-table-column label="卡数量" prop="cardNum"> </el-table-column>
            <el-table-column label="删除的计划套餐个数" prop="deleteDrpNum"> </el-table-column>
            <el-table-column label="配额金额" prop="money">
              <template slot-scope="scope">
                {{ (scope.row.money / 10000) | numberFilter() }}
              </template>
            </el-table-column>
            <el-table-column label="操作人" prop="operator"> </el-table-column>
            <el-table-column label="操作时间">
              <template slot-scope="scope">
                {{ scope.row.gmtCreated | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  :disabled="!scope.row.downLoadUrl"
                  @click="downDetail(scope.row)"
                >
                  {{ !!scope.row.downLoadUrl ? '下载详情' : '生成中' }}
                </el-button>
                <el-button size="mini" @click="restart(scope.row)"> 重新生成 </el-button>
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
