<script>
import { typeMap } from './mixins/const'
import AddDialog from './components/add/add'
import CardTableDialog from '@/page/card/card-operation/components/card-table-dialog/card-table-dialog'
export default {
  name: 'customer-period-align-list',
  components: {
    'add-dialog': AddDialog,
    'card-table-dialog': CardTableDialog
  },
  data() {
    return {
      typeMap,
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        iccid: ''
      },
      tableData: [],
      loading: false,
      cardListData: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handelOpenCardDetail(row) {
      this.$refs.cardTableDialog.open(row.id)
    },
    async getCardDetail({ id, pageNo = 1, pageSize = 10, iccid = '' }) {
      const { data, success } = await this.jaxLib.store.userRatePlanAlignRecordCardList({
        id,
        iccid,
        pageNo,
        pageSize
      })
      this.loading = false
      if (!success) return false
      this.cardListData = data
    },
    onAddConfirm() {
      this.onSearch()
    },
    openAdd() {
      this.$refs.addDialog.open()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
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
      } = await this.jaxLib.store.userRatePlanAlignRecordList({
        iccid: this.search.iccid,
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
    <add-dialog ref="addDialog" @confirm="onAddConfirm" />
    <card-table-dialog ref="cardTableDialog" :data="cardListData" :get-data="getCardDetail" />
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">客户侧套餐周期对齐工具</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-input
            v-model="search.iccid"
            placeholder="请输入iccid"
            style="width: 160px"
            @change="onSearch"
          />
          <el-button type="primary" size="mini" style="float: right" @click="openAdd()"
            >新增</el-button
          >
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 210px)">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="id" label="对齐卡数">
              <template slot-scope="{ row }">
                <el-button type="text" @click="handelOpenCardDetail(row)">{{
                  row.alignedCardsCount
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="对齐方式">
              <template slot-scope="{ row }">
                {{ typeMap[row.type] }}
              </template>
            </el-table-column>
            <el-table-column prop="specifyTime" label="指定激活时间">
              <template slot-scope="{ row }">
                {{ row.specifyTime | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreated" label="操作时间">
              <template slot-scope="{ row }">
                {{ row.gmtCreated | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="operator" label="操作人">
              <template slot-scope="{ row }">
                {{ row.operator }}
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
