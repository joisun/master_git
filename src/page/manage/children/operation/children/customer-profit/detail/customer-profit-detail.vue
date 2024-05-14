<template>
  <div class="announcement">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">单客户盈亏情况</h2>
        <el-date-picker
          v-model="search.month"
          format="yyyy-MM"
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM-dd"
          @change="onSearchChange"
          :clearable="false"
        />
        <span class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__tools">
        <div class="collect-content">
          <p class="collect-content__box align-middle">
            <span>
              总卡数 <br />
              {{ this.summary.totalCards }}
            </span>
            <span>
              总收入 <br />
              {{ this.summary.totalIncome | numberFilter }}
            </span>
            <span>
              总成本 <br />
              {{ this.summary.totalCost | numberFilter }}
            </span>
            <span>
              盈亏金额 <br />
              {{ this.summary.profitMoney | numberFilter }}
            </span>
          </p>
        </div>
        <div class="wh__tools--search">
          <span class="wh__tools--search-text">
            <label>客户ID：</label>
            <span>{{ this.search.orgId }}</span>
          </span>
          <span class="wh__tools--search-text">
            <label>客户名称：</label>
            <span>{{ this.query.orgName }}</span>
          </span>
          <span class="wh__tools--search-text">
            <label>所属销售：</label>
            <span>{{ this.query.sales }}</span>
          </span>
          <el-button class="float-right" @click="onExport">导出</el-button>
        </div>
      </div>
      <div class="wh__body" v-loading="loading">
        <div class="wh__body--table">
          <el-table
            :data="tableData"
            height="calc(100vh - 310px)"
            @sort-change="onSortChange"
          >
            <el-table-column
              v-for="(item, index) in COLUMNS_DETAIL"
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
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            @current-change="handlePageChange"
            :current-page="page.currentPage"
            :page-size="page.pageSize"
            :total="page.total"
            layout="pager, total"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import whSalesSelect from '@/page/components/wh-sales-select.vue'
  import { COLUMNS_DETAIL } from '../mixins/const'
  import filterQueryParams from '@/global/function/filterQueryParams'
  import Download from '@/page/components/wh-download/wh-download'

  const orderMap = {
    cardCount: 'card_count',
    income: 'income',
    cost: 'cost',
    profit_money: 'income-cost'
  }

  export default {
    data() {
      return {
        COLUMNS_DETAIL,
        search: {
          month: '',
          orgId: '',
          orderBy: ''
        },
        query: {},
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
      this.search.orgId = this.$route.query.orgId
      this.query = this.$route.query
      this.search.month = this.$route.query.month
      this.getList()
    },
    methods: {
      handlePageChange(e) {
        this.page.currentPage = e
        this.getList()
      },
      backList() {
        this.$router.back(-1)
      },
      onSortChange(e) {
        let orderBy = orderMap[e.prop]
        switch (e.order) {
          case 'descending':
            orderBy += ' desc'
            break
          case null:
            orderBy = ''
            break
          default:
            orderBy += ' asc'
            break
        }
        this.search.orderBy = orderBy
        this.page.currentPage = 1
        this.getList()
      },
      onSearchChange() {
        this.page.currentPage = 1
        this.getList()
      },
      async onExport() {
        const params = {
          month: this.search.month,
          orgId: JSON.parse(this.search.orgId)
        }
        const { success, data } = await this.jaxLib.customerProfit.detailExport(
          params
        )
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
          const rst = await this.jaxLib.customerProfit.detailQuery(
            filterQueryParams(params)
          )
          this.loading = false
          if (!rst.success) {
            this.$message.error('获取列表失败')
          } else {
            this.tableData = rst.data.data
            this.summary = rst.data.summaryVO
            this.page.total = rst.data.page.allCount
          }
        } catch {
          this.loading = false
        }
      }
    },
    components: {
      whSalesSelect
    }
  }
</script>