<template>
  <div class="announcement">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">
          销售提成
          <span style="font-size: 14px; font-weight: normal; margin-left: 20px"
            >最近更新时间： {{ lastModifyTime.time | dateFilter }}</span
          >
        </h2>
      </div>
      <div class="search-wrap">
        <el-date-picker
          v-model="search.monthDate"
          format="yyyy-MM"
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="onSearchChange"
        />
        <el-select
          v-model="search.area"
          placeholder="选择地区"
          clearable
          :disabled="Object.keys(areaOptions).length <= 1"
          @change="onAreaChange"
        >
          <el-option
            v-for="(item, index) in areaOptions"
            :key="index"
            :value="index"
            :label="item"
          />
        </el-select>
        <el-select
          v-model="search.salesName"
          placeholder="选择销售"
          clearable
          :disabled="!roleInfo.superLeader && !roleInfo.leader"
          @change="onSaleChange"
        >
          <el-option-group
            v-for="group in Object.keys(computedSaleList)"
            :key="group"
            :label="areaOptions[group]"
          >
            <el-option
              v-for="item in butlerSale[group]"
              :key="item.name"
              :value="item.name"
              :label="item.realName"
            />
          </el-option-group>
        </el-select>
        <el-select
          v-model="search.orgIdOrName"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="输入客户ID搜索"
          :remote-method="queryOrgAsync"
        >
          <el-option
            v-for="item in orgNameList"
            :key="item.id"
            :label="`${item.id} (${item.orgName})`"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="search.orderNo"
          clearable
          style="width: 250px"
          placeholder="请输入客户订单编号（精确匹配）"
        />
        <el-input
          v-model="search.id"
          clearable
          style="width: 250px"
          placeholder="请输入客户明细编号（精确匹配）"
        />
      </div>
      <div class="wh__tools">
        <div class="collect-content">
          <p class="collect-content__box align-middle">
            <overview-item title="总业绩" tooltip="所有提成记录明细收入总和">
              <div style="display: inline-block">
                <div>{{ sum.totalIncome | numberFilter }}</div>
              </div>
            </overview-item>
            <overview-item title="常规订单收入" tooltip="【订单类型为：常规订单】的收入总和">
              {{ sum.totalNormalIncome | numberFilter }}
            </overview-item>
            <overview-item
              title="其他收入"
              tooltip="所有提成记录明细中【订单类型不为：常规订单】的收入总和"
            >
              {{ sum.totalOtherIncome | numberFilter }}
            </overview-item>
            <overview-item
              title="总新增"
              tooltip="所有提成记录明细中【收入类型为：购卡、购卡退款、三合一卡、语音卡】的收入总和"
            >
              <div style="display: inline-block">
                <div>{{ sum.totalNewIncome | numberFilter }}</div>
              </div>
            </overview-item>
            <overview-item
              title="总续费"
              tooltip="所有提成记录明细中【收入类型为：续费、续费退款、流量池叠加包、改套餐、其他】的收入总和"
            >
              <div style="display: inline-block">
                <div>{{ sum.totalRecharge | numberFilter }}</div>
              </div>
            </overview-item>
            <overview-item
              title="预估提成"
              tooltip="个人原始提成*提成系数；如在3、6、9、12月完成季度或年度目标加上暂缓发放金额"
            >
              <template v-if="isInOrg"> - </template>
              <template v-else>
                {{ sum.totalEstimatedCommission | numberFilter }}
              </template>
            </overview-item>
          </p>
          <p class="collect-content__box align-middle">
            <overview-item
              title="业绩目标(完成率)"
              tooltip="所选记录明细总收入/所选销售目标；（当选择单客户时，此字段为【-】）"
            >
              <template v-if="isInOrg"> - </template>
              <template v-else>
                {{ sum.target }}({{ sum.completionRate || 0 | rateFilter }})
              </template>
            </overview-item>
            <overview-item
              title="常规订单新增"
              tooltip="所有提成记录明细中【订单类型为：常规订单；收入类型为：购卡、购卡退款】的收入总和"
            >
              {{ sum.normalNewIncome }}
            </overview-item>
            <overview-item
              title="常规订单续费"
              tooltip="所有提成记录明细中【订单类型为：常规订单；收入类型为：续费、续费退款、改套餐、流量池叠加包】的收入总和"
            >
              {{ sum.normalNewRecharge }}
            </overview-item>
            <overview-item
              title="常规订单毛利率"
              tooltip="（所有提成记录明细中【订单类型为：常规订单】的收入总和-（所有提成记录明细中【订单类型为：常规订单】的成本总和））/（所有提成记录明细中【订单类型为：常规订单】的收入总和）"
            >
              {{ sum.normalProfitMargin | rateFilter }}
            </overview-item>
            <overview-item
              title="其他订单毛利率"
              tooltip="（所有提成记录明细中【订单类型不为：常规订单】的收入总和-（所有提成记录明细中【订单类型不为：常规订单】的成本总和））/（所有提成记录明细中【订单类型不为：常规订单】的收入总和）"
            >
              {{ sum.otherProfitMargin | rateFilter }}
            </overview-item>
            <overview-item title="个人原始提成" tooltip="所有提成记录明细中提成金额总和">
              {{ sum.totalOriginalCommission | numberFilter }}
            </overview-item>
          </p>
        </div>
        <div class="wh__tools--search">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <el-button type="primary">
                补录
                <i class="el-icon-arrow-down" />
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onImport">单条</el-dropdown-item>
              <el-dropdown-item @click.native="onImportBatch">批量</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            icon="el-icon-download"
            class="float-right wh__tools--mix-btn"
            @click="onExport"
            >导出
          </el-button>
          <el-button type="primary" class="float-right wh__tools--mix-btn" @click="allDetail"
            >全量明细
          </el-button>
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table
            v-if="listType === LIST_TYPE.ALL"
            :data="tableData"
            height="calc(100vh - 420px)"
            @sort-change="onSortChange"
          >
            <el-table-column label="序号" width="50">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="销售" width="80">
              <template #default="{ row }">
                {{ row.saleName | saleFilter }}
              </template>
            </el-table-column>
            <el-table-column label="客户名称">
              <template #default="{ row }">
                {{ row.orgName }}
              </template>
            </el-table-column>
            <el-table-column label="常规订单新增金额" prop="generalIncome" sortable="custom">
              <template #default="{ row }">
                {{ row.generalIncome | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="常规订单续费金额" prop="generalRecharge" sortable="custom">
              <template #default="{ row }">
                {{ row.generalRecharge | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="转售订单" prop="resaleSum" sortable="custom">
              <template #default="{ row }">
                {{ row.resaleSum | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="超卖订单" prop="oversoldSum" sortable="custom">
              <template #default="{ row }">
                {{ row.oversoldSum | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="项目订单" prop="bonusSum" sortable="custom">
              <template #default="{ row }">
                {{ row.bonusSum | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="NB订单" prop="nbSum" sortable="custom">
              <template #default="{ row }">
                {{ row.nbSum | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="企业专网服务" prop="epnetSum" sortable="custom">
              <template #default="{ row }">
                {{ row.epnetSum | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="CPE" prop="cpeSum" sortable="custom">
              <template #default="{ row }">
                {{ row.cpeSum | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="物料积分" prop="materialSum" sortable="custom">
              <template #default="{ row }">
                {{ row.materialSum | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="待结算" prop="pendingSum" sortable="custom">
              <template #default="{ row }">
                {{ row.pendingSum | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="原始提成" prop="commissionSum" sortable="custom">
              <template #default="{ row }">
                {{ row.commissionSum | numberFilter }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="enterDetail(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <org-order-list
            v-else
            :key="search.orgIdOrName"
            :search="search"
            :table-data="detailList"
            :month-date="search.monthDate"
            :org-infos="currentOrgInfos"
            @sortChange="onSortChange"
            @filterChange="onFilterChange"
          />
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
    <single-import ref="singleImport" @confirm="onSearchChange" />
    <batch-import ref="batchImport" @confirm="onSearchChange" />
    <DialogImportSalesComission
      :month-date="search.monthDate"
      :visible.sync="DialogImportSalesComission.visible"
      @refresh="getList"
    />
  </div>
</template>

<script>
import { COLUMNS } from '../mixins/const'
import filterQueryParams from '@/global/function/filterQueryParams'
import Download from '@/page/components/wh-download/wh-download'
import { getFirstDayOfMonth } from '../functions/index'
import DialogImportSalesComission from '../components/DialogImportSalesComission.vue'
import OverviewItem from '../components/OverviewItem'
import { mapState } from 'vuex'
import numberFilter from '@/global/filters/number-fixed'
import OrgOrderList from '@/page/manage/children/finance/children/sales-comission-2024/list/org-order-list.vue'
import SingleImport from '@/page/manage/children/finance/children/sales-comission-2024/components/single-import.vue'
import BatchImport from '@/page/manage/children/finance/children/sales-comission-2024/components/batch-import.vue'
import moment from 'moment'
const ALL_KEY = '所有客户'
const orderMap = {
  income: 'income',
  recharge: 'recharge',
  grossMargin: 'grossMargin',
  gross: 'gross',
  commission: 'commission'
}

const LIST_TYPE = {
  ALL: 'ALL',
  DETAIL: 'DETAIL'
}
export default {
  name: 'SalesComissionList',
  components: {
    BatchImport,
    OrgOrderList,
    DialogImportSalesComission,
    OverviewItem,
    SingleImport
  },
  data() {
    return {
      lastModifyTime: {},
      orgNameList: [],
      currentOrgInfos: {},
      detailList: [],
      listType: LIST_TYPE.ALL,
      LIST_TYPE,
      pickerOptions: {
        disabledDate(time) {
          const currentDate = new Date()
          return (
            (time.getFullYear() >= currentDate.getFullYear() &&
              time.getMonth() > currentDate.getMonth()) ||
            moment(time).isBefore(moment('2024-03-01'))
          )
        }
      },
      butlerSale: {},
      roleInfo: {},
      areaOptions: {},
      COLUMNS,
      search: {
        orderType: '',
        type: '',
        id: '', // 明细编号
        area: '',
        monthDate: getFirstDayOfMonth(),
        orgIdOrName: '',
        salesName: '',
        orderBy: '',
        sort: ''
      },
      loading: false,
      tableData: [],
      sum: {},
      sellerList: [],
      sellerMap: {},
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      DialogImportSalesComission: {
        visible: false
      },
      currentSale: {}
    }
  },
  computed: {
    isInOrg() {
      const { orgIdOrName, id, orderNo } = this.search
      return orgIdOrName || id || orderNo
    },
    ...mapState({
      userName: (state) => (state.overall.user ? state.overall.user.name : '')
    }),
    computedSaleList() {
      const saleList = {}
      Object.keys(this.areaOptions).forEach((key) => {
        saleList[key] = this.butlerSale[key]
      })
      const { area } = this.search
      return area
        ? {
            [area]: saleList[area]
          }
        : saleList
    }
  },
  watch: {
    userName(pre, next) {
      if (pre !== next) {
        this.getRole()
      }
    },
    listType(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.search = {
          ...this.search,
          orderBy: '',
          sort: ''
        }
      }
    },
    search: {
      handler(value) {
        if (!value.orgIdOrName && !value.orderNo && !value.id) {
          this.listType = LIST_TYPE.ALL
          // this.getList()
          this.$nextTick(() => {
            this.getRole()
          })
        } else {
          this.listType = LIST_TYPE.DETAIL
          this.$nextTick(() => {
            this.getDetailList()
          })
        }
      },
      deep: true
    }
  },
  created() {
    // this.search.monthDate = '2022-01-01'
    // this.search.monthDate = getFirstDayOfMonth()
    this.getArea()
    this.getRole()
  },
  methods: {
    allDetail() {
      this.search.orgIdOrName = ALL_KEY
    },
    async fetchLastModifyTime(params) {
      const { success, data } =
        await this.jaxLib.salesComission.salesCommission2024.getLastModifyTime(params)
      if (success) {
        this.lastModifyTime = data || {}
      }
    },
    onFilterChange(v) {
      if (v.orderType) {
        this.search.orderType = v.orderType[0]
      }
      if (v.type) {
        this.search.type = v.type[0]
      }
      this.page.pageIndex = 1
    },
    async queryOrgAsync(queryString) {
      const res = await this.jaxLib.customer.list.get(
        {
          pageIndex: 1,
          pageSize: 100,
          orgName: queryString,
          saler: ''
        },
        false
      )
      if (!res.success) return false
      this.orgNameList = res.data.list.map((e) => ({
        id: e.id,
        orgName: e.orgName,
        saleName: e.saleName
      }))
    },
    numberFilter,
    onImport() {
      this.$refs.singleImport.open({ monthDate: this.search.monthDate })
    },
    onSaleChange(name) {
      this.search = {
        ...this.search,
        name
      }
      this.onSearchChange()
    },
    onAreaChange() {
      this.search.salesName = ''
      this.onSearchChange()
    },
    async getRole() {
      const res = await this.jaxLib.salesComission.getCurrentUserAuthority({})
      if (res && res.success) {
        this.roleInfo = res.data
        if (!this.roleInfo.superLeader) {
          // 如果是非超级管理，需要设置默认值
          await this.getCurrentSale()
          return
        }
        await this.getList()
        await this.getButlerSale()
      }
    },
    async getArea() {
      const res = await this.jaxLib.salesComission.getButlerSaleGroupId()
      if (res && res.success) {
        this.areaOptions = res.data
      }
    },
    async getButlerSale() {
      const res = await this.jaxLib.salesComission.getSalesButlerConfig()
      if (res && res.success) {
        this.butlerSale = res.data
      }
      return res
    },
    getButlerSaleDetailByName(butlerSales, name) {
      for (const butlerSalesKey in butlerSales) {
        const sales = butlerSales[butlerSalesKey]
        const sale = sales.find((item) => item.name === name)
        if (sale) {
          return { area: butlerSalesKey, name: sale.name }
        }
      }
      return {
        area: '',
        name: ''
      }
    },
    async getCurrentSale() {
      const res = await this.getButlerSale()
      if (res && res.success) {
        this.currentSale = this.getButlerSaleDetailByName(res.data, this.userName)
        const { name, area } = this.currentSale
        this.search.area = area
        const { superLeader, leader } = this.roleInfo
        if (!superLeader && !leader) {
          this.search.salesName = name
        }
        await this.getList()
      }
    },
    handlePageChange(e) {
      this.page.currentPage = e
      if (this.listType === LIST_TYPE.DETAIL) {
        this.getDetailList()
      } else {
        this.getList()
      }
    },
    onSortChange(e) {
      if (!e.order) {
        this.search.orderBy = ''
        this.search.sort = ''
      } else {
        this.search.orderBy = e.prop
        this.search.sort = e.order === 'ascending' ? 'asc' : 'desc'
      }
      this.page.currentPage = 1
    },
    onSearchChange() {
      // this.page.currentPage = 1
      // this.getList()
    },
    async onExport() {
      const params = {
        ...this.search
      }
      const { success, data } = await this.jaxLib.salesComission.salesCommission2024.export(
        filterQueryParams(params)
      )
      if (!success) return false
      await Download({ ...data })
    },
    onImportBatch() {
      this.$refs.batchImport.open({ monthDate: this.search.monthDate })
    },
    async getDetailList() {
      const params = {
        ...this.search,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      if (params.orgIdOrName === ALL_KEY) {
        params.orgIdOrName = undefined
      }
      this.loading = true
      const res = await this.jaxLib.salesComission.salesCommission2024.detail(
        filterQueryParams(params)
      )
      this.listType = LIST_TYPE.DETAIL
      this.loading = false
      if (res.success) {
        this.detailList = res.data.list
        this.sum = res.data.sum
        this.page.total = res.data.page.allCount
        this.search.orgIdOrName = !params.orgIdOrName ? ALL_KEY : res.data.sum.orgId
      }
    },
    async getList() {
      const params = {
        ...this.search,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      this.loading = true
      try {
        const res = await this.jaxLib.salesComission.salesCommission2024.summary(
          filterQueryParams(params)
        )
        this.fetchLastModifyTime(filterQueryParams(params))
        this.loading = false
        this.listType = LIST_TYPE.ALL
        if (res.success) {
          this.tableData = res.data.list
          this.sum = res.data.sum
          this.page.total = res.data.page.allCount
        }
      } catch {
        this.loading = false
      }
    },
    enterDetail(row) {
      this.currentOrgInfos = row
      this.search.orgIdOrName = row.orgId
    }
  }
}
</script>

<style lang="scss" scoped>
.search-wrap {
  & > div {
    margin-bottom: 10px;
  }
}
</style>
