<template>
  <div class="carrier-account-modify-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">运营商账号修改</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-button @click="openDetail()">发起申请</el-button>
        </div>
      </div>
      <div class="wh__body" v-loading="loading">
        <div class="wh__body--table">
          <el-table :data="tableData.list" height="calc(100vh - 260px)">
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="卡数量" prop="iccidCount"></el-table-column>
            <el-table-column label="变更前运营商账号" prop="originCarrierAccount"></el-table-column>
            <el-table-column label="变更后运营商账号" prop="targetCarrierAccount"></el-table-column>
            <el-table-column label="套餐售价差额" prop="refund"></el-table-column>
            <el-table-column label="操作人" prop="operator"></el-table-column>
            <el-table-column label="操作时间">
              <template slot-scope="scope">
                {{scope.row.operationTime.time | dateFilter}}
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="enterDetail(scope.row.id)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            @current-change="handlePageChange"
            :current-page="tableData.page.currentPage"
            :page-size="tableData.page.rowsPerPage"
            :total="tableData.page.allCount"
            layout="pager, total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: {
          list: [],
          page: {
            currentPage: 1
          }
        },
        loading: false
      }
    },
    created() {
      this.query()
    },
    methods: {
      async query(pageNo = 1) {
        const res = await this.jaxLib.card.getCarrierAccountModifications({
          pageNo,
          pageSize: 20
        })
        if (!res.success) {
          return false
        }
        this.tableData = res.data
      },
      openDetail() {
        this.$router.push({ name: 'carrier-account-modify-detail' })
      },
      enterDetail(id) {
        this.$router.push({ name: 'carrier-account-modify-detail', query: { id } })
      },
      handlePageChange(page) {
        this.query(page)
      }
    }
  }
</script>
