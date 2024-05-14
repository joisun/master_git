<template>
  <div class="announcement">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">单个客户的订单明细</h2>
        <el-date-picker
          v-model="search.monthDate"
          format="yyyy-MM"
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="onSearchChange"
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
                - 业务总/运营：所有普通销售预估提成 + 所有城市经理预估提成 <br />
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
                - 业务总/运营：<br />
                &nbsp;&nbsp;- 没有选择区域：公司业绩目标 <br />
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
                - 业务总/运营：城市经理原始提成 + 普通销售原始提成 <br />
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
          <span class="wh__tools--search-text">
            <label>客户ID：</label>
            <span>{{ search.orgIdOrName }}</span>
          </span>
          <span class="wh__tools--search-text">
            <label>客户名称：</label>
            <span>{{ query.orgName }}</span>
          </span>
          <span class="wh__tools--search-text">
            <label>所属销售：</label>
            <span>{{ query.salesName | saleFilter }}</span>
          </span>
          <el-button class="float-right" @click="onExport">导出</el-button>
        </div>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__body--table">
          <el-table
            :data="tableData"
            height="calc(100vh - 335px)"
            @filter-change="onFilterChange"
            @sort-change="onSortChange"
          >
            <el-table-column
              column-key="orderType"
              :label="
                search.orderType ? enums.salesIncomeOrderType.get(search.orderType) : '订单类型'
              "
              :filters="orderTypeFilters"
              :filter-multiple="false"
            >
              <template slot-scope="scope">
                {{ enums.salesIncomeOrderType.get(scope.row.orderType) }}
              </template>
            </el-table-column>
            <el-table-column
              column-key="type"
              :label="search.type ? enums.salesIncomeType.get(search.type) : '收入类型'"
              :filters="typeFilters"
              :filter-multiple="false"
            >
              <template slot-scope="scope">
                {{ enums.salesIncomeType.get(scope.row.type) }}
              </template>
            </el-table-column>
            <template v-for="(item, index) in COLUMNS_DETAIL">
              <el-table-column
                v-if="item.key !== 'cost'"
                :key="index"
                :formatter="item.formatter"
                :prop="item.key"
                :label="item.name"
                :min-width="item.width"
                :align="item.align"
                :filters="item.filters"
                :class-name="item.style"
                :sortable="item.sortable"
              />
              <el-table-column v-else :key="index" label="成本" prop="cost" sortable="custom">
                <template slot-scope="scope">
                  <span
                    v-if="
                      !editting.map((e) => e.id).includes(scope.row.id) ||
                      scope.row.type === 'REFUND'
                    "
                    >{{ scope.row.cost | numberFilter }}</span
                  >
                  <span v-else
                    ><el-input-number
                      v-model="scope.row.cost"
                      :precision="2"
                      style="width: 80px"
                      :controls="false"
                  /></span>
                </template>
              </el-table-column>
            </template>
            <el-table-column label="备注" :show-overflow-tooltip="true" :min-width="140">
              <template slot-scope="scope">
                <p v-if="!editting.map((e) => e.id).includes(scope.row.id)">
                  {{ scope.row.remark }}
                </p>
                <p v-else>
                  <el-input v-model="scope.row.remark" type="textarea" />
                </p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="onEdit(scope.row)">
                  {{ editting.map((e) => e.id).includes(scope.row.id) ? '保存' : '修改' }}
                </el-button>
                <el-button
                  v-if="['FINANCE', 'OTHER'].includes(scope.row.type)"
                  type="text"
                  @click="onDelete(scope.row)"
                  >删除</el-button
                >
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
import { COLUMNS_DETAIL } from '../mixins/const'
import filterQueryParams from '@/global/function/filterQueryParams'
import Download from '@/page/components/wh-download/wh-download'
import OverviewItem from '@/page/manage/children/finance/children/sales-comission/components/OverviewItem'
import { calculateGPM } from '@/global/function/calculator'

const orderMap = {
  transactionDate: 'sales_com.transaction_date',
  grossMargin: 'sales_com.grossMargin',
  gross: 'sales_com.gross',
  cost: 'sales_com.cost',
  profit: 'sales_com.profit',
  comission: 'sales_com.commission',
  income: 'sales_com.incomeMoney'
}

export default {
  components: {
    OverviewItem
  },
  data() {
    return {
      COLUMNS_DETAIL,
      search: {
        monthDate: '',
        orgIdOrName: '',
        orderBy: '',
        type: '',
        sort: '',
        orderType: '',
        salesName: ''
      },
      query: {},
      loading: false,
      tableData: [],
      sum: {},
      currentEditId: '',
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      editting: [],
      orderTypeFilters: this.enums.salesIncomeOrderType.entries().map((e) => {
        return {
          text: e[1],
          value: e[0]
        }
      }),
      typeFilters: this.enums.salesIncomeType.entries().map((e) => {
        return {
          text: e[1],
          value: e[0]
        }
      })
    }
  },
  created() {
    this.search.orgIdOrName = this.$route.query.orgId
    this.query = this.$route.query
    this.search.monthDate = this.$route.query.monthDate
    this.search.salesName = this.$route.query.salesName
    this.getList()
  },
  methods: {
    async onDelete(row) {
      this.$confirm(`确定删除该记录吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { success } = await this.jaxLib.salesComission.deleteDetailItem({
          id: row.id
        })
        if (success) {
          this.$message({ type: 'success', message: '删除成功' })
          this.getList()
        }
      })
    },
    onFilterChange(v) {
      if (v.orderType) {
        this.search.orderType = v.orderType[0]
      }
      if (v.type) {
        this.search.type = v.type[0]
      }
      this.page.pageIndex = 1
      this.getList()
    },
    async onEdit(row) {
      const edittingIdList = this.editting.map((e) => e.id)
      const reset = () => {
        for (let i = 0; i < this.editting.length; i++) {
          if (this.editting[i].id === row.id) {
            row.cost = this.editting[i].cost
            row.remark = this.editting[i].remark
          }
        }
      }
      if (!edittingIdList.includes(row.id)) {
        this.editting.push({
          id: row.id,
          cost: row.cost,
          remark: row.remark
        })
      } else {
        // 保存
        const params = {
          id: row.id,
          cost: row.cost,
          remark: row.remark
        }
        try {
          const { success } = await this.jaxLib.salesComission.modifyCost(params)
          if (!success) {
            reset()
          }
        } catch {
          reset()
        }
        for (let i = 0; i < this.editting.length; i++) {
          if (this.editting[i].id === row.id) {
            this.editting.splice(i, 1)
            break
          }
        }
      }
    },
    handlePageChange(e) {
      this.page.currentPage = e
      this.getList()
    },
    backList() {
      this.$router.back(-1)
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
    onSearchChange() {
      this.page.currentPage = 1
      this.getList()
    },
    async onExport() {
      const params = {
        monthDate: this.search.monthDate,
        orgIdOrName: this.search.orgIdOrName,
        salesName: this.search.salesName
      }
      const { success, data } = await this.jaxLib.salesComission.detailExport(params)
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
        const rst = await this.jaxLib.salesComission.detailQuery(filterQueryParams(params))
        this.loading = false
        if (!rst.success) {
          this.$message.error('获取列表失败')
        } else {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-container {
  margin-top: -10px;
}
</style>
