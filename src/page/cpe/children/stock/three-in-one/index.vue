<script>
import apis from '@/api/ajax'
import CardImportor from './components/CardImportor.vue'

export default {
  components: {
    CardImportor
  },
  data() {
    return {
      overviewColumns: [
        {
          title: '总卡数',
          key: 'totalCount',
          param: 'total'
        },
        {
          title: '已出库',
          key: 'exportCount',
          param: 'export'
        },
        {
          title: '库存',
          key: 'inventoryCount',
          param: 'inventory'
        }
      ],
      overview: {},
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      search: '',
      loading: false,
      CardImportor: {
        visible: false
      }
    }
  },
  mounted() {
    this.list()
    this.getOverview()
  },
  methods: {
    async getOverview() {
      const res = await apis.cpe.threeInOneCardStatistics()
      if (res && res.success) {
        this.overview = res.data
      }
    },
    async exportData(type) {
      this.loading = true
      const { success, data } = await apis.cpe.threeInOneCardExport({ type })
      this.loading = false
      if (!success) return
      window.open(data)
    },
    async list() {
      const { pageIndex, pageSize } = this.page
      this.loading = true
      const params = { pageIndex, pageSize }
      if (this.search) {
        params.search = this.search
      }
      const {
        success,
        data: { page, list }
      } = await apis.cpe.threeInOneCardList(params)
      this.loading = false
      if (!success) return false
      this.tableData = list
      this.page.total = page.allCount
    },
    async onImport() {
      this.CardImportor.visible = true
    },
    pageSwitch(val) {
      this.page.pageIndex = val
      this.list()
    }
  }
}
</script>

<template>
  <div class="wh__warp three-in-one">
    <div class="wh__header">
      <div class="wh__header--title">三合一卡</div>
    </div>
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          v-model.trim="search"
          placeholder="请输入卡号/ICCID"
          name="searchField"
          class="wh__tools--search-input"
          style="width: 280px"
          @keyup.enter.native="list"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="list"> </el-button>
        </el-input>
        <div class="float-right">
          <div>
            <span
              v-for="item in overviewColumns"
              :key="item.key"
              style="color: #333; margin-right: 20px"
            >
              <span
                >{{ item.title }}:
                <span style="color: #1c8de0; cursor: pointer" @click="exportData(item.param)">{{
                  overview[item.key] || '0'
                }}</span>
              </span>
            </span>
            <el-button type="primary" @click="onImport"> 导入excel </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="wh__body--table">
      <el-table v-loading="loading" :data="tableData">
        <el-table-column label="序号" type="index" />
        <el-table-column label="三合一卡号" prop="cardId" />
        <el-table-column label="移动" prop="cmccIccid" />
        <el-table-column label="联通" prop="unicomIccid" />
        <el-table-column label="电信" prop="chinanetIccid" />
        <el-table-column label="归属客户" prop="orgName" />
        <el-table-column label="卡订单号" prop="cardOrderNo" />
        <el-table-column label="设备订单号" prop="deviceOrderNo" />
        <el-table-column label="出库时间" prop="exportDate" />
      </el-table>
    </div>
    <div class="wh__body--page">
      <el-pagination
        :current-page="page.pageIndex"
        :page-size="page.pageSize"
        layout="total, prev, pager, next"
        :total="page.total"
        @current-change="pageSwitch"
      >
      </el-pagination>
    </div>
    <CardImportor
      v-if="CardImportor.visible"
      :visible.sync="CardImportor.visible"
      @refresh="list"
    />
  </div>
</template>
