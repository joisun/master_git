<template>
  <div class="announcement">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">销售提成</h2>
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
        <!--          :disabled="!roleInfo.superLeader"-->

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
        <!--        <wh-sales-select-->
        <!--          v-model="search.salesName"-->
        <!--          :disabled="!roleInfo.superLeader && !roleInfo.leader"-->
        <!--          @change="onSearchChange"-->
        <!--        />-->
      </div>
      <div class="wh__tools">
        <div class="collect-content">
          <p class="collect-content__box align-middle">
            <overview-item title="总收入" tooltip="常规订单收入+ 特殊订单收入">
              <div style="display: inline-block">
                <div>{{ sum.totalIncome | numberFilter }}</div>
                <div>CPE: {{ sum.cpeIncome | numberFilter }}</div>
              </div>
            </overview-item>
            <overview-item title="常规订单收入" tooltip="常规订单新增+常规订单续费">
              {{ sum.totalNormalIncome | numberFilter }}
            </overview-item>
            <overview-item title="特殊订单收入" tooltip="特殊订单新增1 + 特殊订单续费1">
              {{ sum.totalSpecialIncome | numberFilter }}
            </overview-item>
            <overview-item
              title="总新增"
              tooltip="常规订单新增 + 特殊订单新增2（不包含项目和企业专网）"
            >
              <div style="display: inline-block">
                <div>{{ sum.totalNewIncome | numberFilter }}</div>
                <div>CPE: {{ sum.totalCpeNewIncome | numberFilter }}</div>
              </div>
            </overview-item>
            <overview-item
              title="总续费"
              tooltip="常规订单续费 + 特殊订单续费2（不包含项目和企业专网）"
            >
              <div style="display: inline-block">
                <div>{{ sum.totalRechargeIncome | numberFilter }}</div>
                <div>CPE: {{ sum.totalCpeRechargeIncome | numberFilter }}</div>
              </div>
            </overview-item>
            <overview-item title="预估提成">
              <template #tooltip>
                - 普通销售： 应发个人提成 （个人原始提成 * 提成系数 - C类退款提成）<br />
                - 城市经理： 城市经理个人提成 + 城市经理区域收入提成（团队常规订单收入*
                收入提成百分比 - C类退款提成）<br />
              </template>
              {{ sum.totalEstimatedCommission | numberFilter }}</overview-item
            >
          </p>
          <p class="collect-content__box align-middle">
            <overview-item title="业绩目标(完成率)">
              <template #tooltip>
                - 普通销售：个人业绩目标 <br />
                - 城市经理： <br />
                &nbsp;&nbsp;- 没有指定销售：区域业绩目标 <br />
                &nbsp;&nbsp;- 选中销售：选中销售个人业绩目标 <br />
              </template>
              {{ sum.totalTarget }}({{ sum.completionRate || 0 | rateFilter }})</overview-item
            >
            <overview-item
              title="常规订单毛利率"
              tooltip="(常规订单收入 - 常规订单成本） / 常规订单收入"
            >
              {{ sum.normalProfitMargin }}</overview-item
            >
            <overview-item
              title="特殊订单毛利率"
              tooltip="(特殊订单收入 - 特殊订单成本）/ 特殊订单收入"
            >
              {{ sum.specialProfitMargin }}</overview-item
            >
            <overview-item
              title="常规订单新增"
              tooltip="运营资源订单，且售价 > 销售底价（不包含待确认订单， 项目，企业专网）新增 -  A类退款（新增部分） - B类退款（新增部分）"
            >
              {{ sum.totalNormalNewIncome | numberFilter }}</overview-item
            >
            <overview-item
              title="常规订单续费"
              tooltip="运营资源订单，且售价 > 销售底价（不包含待确认订单， 项目，企业专网）续费 - A类退款（续费部分） - B类退款（续费部分）"
            >
              {{ sum.totalNormalRechargeIncome | numberFilter }}</overview-item
            >
            <overview-item title="个人原始提成">
              <template #tooltip>
                - 普通销售：根据普通销售提成比例算出来的提成，没有乘以销售提成系数。<br />
                - 城市经理：城市经理归属的客户计算出来的提成，不包含城市总收入提成金额。<br />
              </template>
              {{ sum.totalOriginalCommission | numberFilter }}
            </overview-item>
          </p>
        </div>
        <div class="alert-container">
          <el-alert show-icon type="info" :closable="false">
            <template #title>
              1.
              当前预估收入不含基础工资和项目奖金，已扣除退款和返佣，退款订单的成本为预估成本，可能未发生，仅供参考<br />
              2. 以上统计数据具体定义，请参考该<a
                target="_blank"
                style="color: #ec407a"
                href="https://wiki.qipeng.com/pages/viewpage.action?pageId=51433464"
                >文档</a
              >
            </template>
          </el-alert>
        </div>
        <div class="wh__tools--search">
          <el-input
            v-model="search.orgIdOrName"
            clearable
            style="width: 250px"
            placeholder="请输入客户ID、名称"
            @change="onSearchChange"
          />
          <el-button
            icon="el-icon-download"
            class="float-right wh__tools--mix-btn"
            @click="onExport"
            >导出</el-button
          >
          <el-button icon="el-icon-upload" class="float-right wh__tools--mix-btn" @click="onImport"
            >导入</el-button
          >
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 420px)" @sort-change="onSortChange">
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
            <el-table-column
              label="备注"
              :show-overflow-tooltip="true"
              :min-width="140"
              prop="remark"
            />
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
import Regexps from '@/constant/regexps'
import DialogImportSalesComission from '../components/DialogImportSalesComission.vue'
import { calculateGPM } from '@/global/function/calculator'
import OverviewItem from '../components/OverviewItem'
import { mapState } from 'vuex'
const orderMap = {
  income: 'income',
  recharge: 'recharge',
  grossMargin: 'grossMargin',
  gross: 'gross',
  commission: 'commission'
}

export default {
  name: 'SalesComissionList',
  components: {
    DialogImportSalesComission,
    OverviewItem
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          const currentDate = new Date()
          return (
            time.getFullYear() >= currentDate.getFullYear() &&
            time.getMonth() > currentDate.getMonth()
          )
        }
      },
      butlerSale: {},
      roleInfo: {},
      areaOptions: {},
      COLUMNS,
      search: {
        area: '',
        monthDate: '',
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
    }
  },
  created() {
    this.search.monthDate = getFirstDayOfMonth()
    this.getArea()
    this.getRole()
  },
  methods: {
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
    getLeaderByArea(area) {
      return area ? this.butlerSale[area].find((item) => !!item.isSalesLeader) || {} : {}
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
      this.getList()
    },
    onSortChange(e) {
      if (!e.order) {
        this.search.orderBy = ''
        this.search.sort = ''
      } else {
        this.search.orderBy = orderMap[e.prop]
        this.search.sort = e.order === 'ascending' ? 'asc' : 'desc'
      }
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
        ...this.search
      }
      const { success, data } = await this.jaxLib.salesComission.export(filterQueryParams(params))
      if (!success) return false
      await Download({ ...data })
    },
    onImport() {
      this.DialogImportSalesComission.visible = true
    },
    async getList() {
      const params = {
        ...this.search,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      this.loading = true
      try {
        const rst = await this.jaxLib.salesComission.query(filterQueryParams(params))
        this.loading = false
        if (!rst.success) {
          this.$message.error('获取列表失败')
        } else {
          rst.data.list.forEach((item) => {
            item.salesId = item.saleName
            item.salesName = this.sellerMap[item.saleName]
          })
          this.tableData = rst.data.list
          this.sum = rst.data.sum
          this.sum.normalProfitMargin = this.sum.totalNormalIncome
            ? calculateGPM(this.sum.totalNormalIncome, this.sum.totalNormalCost)
            : 0
          this.sum.specialProfitMargin = this.sum.totalSpecialIncome
            ? calculateGPM(this.sum.totalSpecialIncome, this.sum.totalSpecialCost)
            : 0
          this.page.total = rst.data.page.allCount
        }
      } catch {
        this.loading = false
      }
    },
    enterDetail(row) {
      this.$router.push({
        name: 'sales-comission-detail',
        query: {
          orgId: row.orgId,
          orgName: row.orgName,
          salesId: row.salesId,
          salesName: row.saleName,
          monthDate: this.search.monthDate
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-container {
  margin-top: -10px;
}
</style>
