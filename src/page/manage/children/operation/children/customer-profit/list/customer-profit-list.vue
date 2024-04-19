<template>
  <div class="announcement">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">客户盈亏</h2>
        <el-date-picker
          v-model="search.month"
          format="yyyy-MM"
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="onSearchChange"
        />
      </div>
      <div class="wh__tools">
        <div class="collect-content">
          <p class="collect-content__box align-middle">
            <span>
              总客户数 <br />
              {{ summary.totalCustomer }}
            </span>
            <span>
              总收入 <br />
              {{ summary.totalIncome | numberFilter }}
            </span>
            <span>
              总成本 <br />
              {{ summary.totalCost | numberFilter }}
            </span>
            <span>
              盈利客户数 <br />
              {{ summary.profitCustomer }}
            </span>
            <span>
              亏损客户数 <br />
              {{ summary.lossCustomer }}
            </span>
          </p>
        </div>
        <div class="wh__tools--search">
          <el-input
            v-model="search.priceOfferId"
            clearable
            style="width: 180px"
            placeholder="请输入套餐ID"
            @change="onSearchChange('priceOfferId')"
          />
          <el-input
            v-model="search.orgKey"
            clearable
            style="width: 250px"
            placeholder="请输入客户ID、名称、联系方式"
            @change="onSearchChange"
          />
          <wh-sales-select
            v-model="search.sales"
            placeholder="选择所属销售"
            style="width: 180px"
            clearable
            @change="onSearchChange"
          >
          </wh-sales-select>
          <el-select
            v-model="search.profit"
            clearable
            placeholder="是否盈利"
            @change="onSearchChange"
          >
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
          <el-button class="float-right" @click="onExport">导出</el-button>
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 310px)" @sort-change="onSortChange">
            <el-table-column
              v-for="(item, index) in COLUMNS"
              :key="index"
              :formatter="item.formatter"
              :prop="item.key"
              :label="item.name"
              :min-width="item.width"
              :align="item.align"
              :class-name="item.style"
              :sortable="item.sortable"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="enterDetail(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
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
    </div>
  </div>
</template>

<script>
import whSalesSelect from '@/page/components/wh-sales-select.vue'
import { COLUMNS } from '../mixins/const'
import filterQueryParams from '@/global/function/filterQueryParams'
import Download from '@/page/components/wh-download/wh-download'
import { getFirstDayOfMonth } from '../functions/index'
import Regexps from '@/constant/regexps'

const orderMap = {
  rank: 'pls.rank',
  totalCards: 'pls.total_cards',
  profitMoney: 'pls.profitMoney',
  sales: 'org.sale_name'
}

export default {
  name: 'CustomerProfitList',
  components: {
    whSalesSelect
  },
  data() {
    return {
      COLUMNS,
      search: {
        month: '',
        priceOfferId: '',
        orgKey: '',
        sales: '',
        profit: undefined,
        orderBy: '',
        sort: ''
      },
      loading: false,
      tableData: [],
      summary: {},
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  created() {
    this.search.month = getFirstDayOfMonth()
    this.getList()
  },
  methods: {
    handlePageChange(e) {
      this.page.currentPage = e
      this.getList()
    },
    onSortChange(e) {
      this.search.orderBy = e.order ? orderMap[e.prop] : ''
      this.search.sort = e.order ? (e.order === 'descending' ? 'desc' : 'asc') : ''
      this.page.currentPage = 1
      this.getList()
    },
    onSearchChange(type) {
      if (type === 'priceOfferId' && this.search.priceOfferId) {
        if (!Regexps.number.test(this.search.priceOfferId)) {
          this.search.priceOfferId = ''
          return
        }
      }
      this.page.currentPage = 1
      this.getList()
    },
    async onExport() {
      const params = {
        month: this.search.month
      }
      const { success, data } = await this.jaxLib.customerProfit.export(params)
      if (!success) return false
      await Download({ ...data })
    },
    async getList() {
      const params = {
        ...this.search,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      this.loading = true
      try {
        const rst = await this.jaxLib.customerProfit.query(filterQueryParams(params))
        this.loading = false
        if (!rst.success) {
          this.$message.error('获取列表失败')
        } else {
          this.tableData = rst.data.data
          this.summary = rst.data.summary
          this.page.total = rst.data.page.allCount
        }
      } catch {
        this.loading = false
      }
    },
    enterDetail(row) {
      this.$router.push({
        name: 'customer-profit-detail',
        query: {
          orgId: row.orgId,
          orgName: row.orgName,
          sales: row.sales,
          month: this.search.month
        }
      })
    }
  }
}
</script>
