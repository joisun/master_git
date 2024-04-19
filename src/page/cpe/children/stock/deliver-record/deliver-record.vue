<script type="text/jsx">
import apis from '@/api/ajax'

export default {
  data() {
    return {
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        macAddr: '',
        tradeNo: ''
      },
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const { pageIndex, pageSize } = this.page
      this.loading = true
      const params = { pageIndex, pageSize }
      if (this.search.macAddr) {
        params.macAddr = this.search.macAddr
      }
      if (this.search.tradeNo) {
        params.tradeNo = this.search.tradeNo
      }
      const { success, data: { page, list } } = await apis.cpe.getStoreRecordList(params)
      this.loading = false
      if (!success) return false
      this.tableData = list
      this.page.total = page.allCount
    },
    async openDeviceList(item) {
      const messageNode = (h, i) => (
          <div class="cpe-agreement__content">
            {
              i.map(e => (
                  <p key={e}>{e}</p>
              ))
            }
          </div>)
      const { success, data } = await apis.cpe.getStoreRecordMacList({
        tradeNo: item.tradeNo,
        batchNo: item.batchNo
      })
      if (!success) return false
      this.$msgbox({
        title: 'Mac地址',
        message: messageNode(this.$createElement, data.macAdrList),
        showCancelButton: true
      })
    },
    changePageIndex(val) {
      this.page.pageIndex = val
      this.getList()
    }
  }
}
</script>
<template>
  <div class="wh__warp cpe-deliver-record">
    <div class="wh__header">
      <div class="wh__header--title">出库记录</div>
    </div>
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
            v-model="search.macAddr"
            placeholder="请输入mac地址"
            style="width:260px;"
            @keyup.enter.native="getList"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList">
          </el-button>
        </el-input>
        <el-input
            v-model="search.tradeNo"
            placeholder="请输入订单号"
            style="width:260px;margin-left: 10px;"
            @keyup.enter.native="getList"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList">
          </el-button>
        </el-input>
      </div>
    </div>
    <!-- list-->
    <div class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableData" v-loading="loading">
          <el-table-column label="出库时间">
            <template slot-scope="scope">
              {{ scope.row.deliverTime | dateFilter }}
            </template>
          </el-table-column>
          <el-table-column label="订单号" prop="tradeNo"></el-table-column>
          <el-table-column label="客户ID" prop="orgId"></el-table-column>
          <el-table-column label="客户名称" prop="orgName"></el-table-column>
          <el-table-column label="操作人" prop="operator"></el-table-column>
          <el-table-column label="出库类型">
            <template slot-scope="scope">
              {{ scope.row.deliverType === 'FORMAL_DEVICE' ? '正式设备' : '测试设备' }}
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="deviceCount">
            <template slot-scope="scope">
              <el-button type="text" @click="openDeviceList(scope.row)">{{ scope.row.deviceCount }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
            @current-change="changePageIndex"
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            layout="total, prev, pager, next"
            :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.cpe-agreement__content {
  max-height: 500px;
  overflow-y: scroll;
}
</style>
