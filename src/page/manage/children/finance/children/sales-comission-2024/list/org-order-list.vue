<template>
  <div>
    <el-table
      :data="tableData"
      height="calc(100vh - 420px)"
      @sort-change="onSortChange"
      @filter-change="onFilterChange"
    >
      <el-table-column label="明细编号">
        <template #default="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column
        column-key="orderType"
        :label="search.orderType ? enums.salesIncomeOrderType.get(search.orderType) : '订单类型'"
        :filters="orderTypeFilters"
        :filter-multiple="false"
      >
        <template #default="{ row }">
          {{ row.orderType | commissionOrderTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column
        column-key="type"
        :label="search.type ? enums.salesIncomeType.get(search.type) : '收入类型'"
        :filters="typeFilters"
        :filter-multiple="false"
      >
        <template #default="{ row }">
          {{ row.type | commissionTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="交易编号">
        <template #default="{ row }">
          {{ row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column label="套餐ID">
        <template #default="{ row }">
          {{ row.priceOfferId }}
        </template>
      </el-table-column>
      <el-table-column label="交易时间" prop="transactionDate" sortable="custom">
        <template #default="{ row }">
          {{ row.transactionDate | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="income" sortable="custom">
        <template #default="{ row }">
          {{ row.income | numberFilter }}
        </template>
      </el-table-column>
      <el-table-column label="成本" prop="cost" sortable="custom">
        <template #default="{ row }">
          {{ row.cost | numberFilter }}
        </template>
      </el-table-column>
      <el-table-column label="毛利额" prop="gross" sortable="custom">
        <template #default="{ row }">
          {{ row.gross | numberFilter }}
        </template>
      </el-table-column>
      <el-table-column label="毛利率(%)" prop="grossMargin" sortable="custom">
        <template #default="{ row }">
          {{ row.grossMargin | rateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="原始提成" prop="commission" sortable="custom">
        <template #default="{ row }">
          {{ row.commission | numberFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="handleModify(row)">修改</el-button>
          <el-button type="text" @click="openRecord(row)">记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <org-order-modify ref="orgOrderModify" />
    <org-order-modify-record ref="orgOrderModifyRecord" />
  </div>
</template>
<script>
import OrgOrderModify from '@/page/manage/children/finance/children/sales-comission-2024/components/org-order-modify.vue'
import orgOrderModifyRecord from '@/page/manage/children/finance/children/sales-comission-2024/components/org-order-modify-record.vue'

export default {
  components: { OrgOrderModify, orgOrderModifyRecord },
  props: {
    search: Object,
    tableData: {
      type: Array,
      default: () => []
    },
    monthDate: String,
    orgInfos: Object
  },
  data() {
    return {
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
  methods: {
    handleModify(row) {
      this.$refs.orgOrderModify.open({
        ...row,
        monthDate: this.monthDate,
        orgInfos: this.orgInfos
      })
    },
    openRecord(row) {
      this.$refs.orgOrderModifyRecord.open(row)
    },
    onFilterChange(sort) {
      this.$emit('filterChange', sort)
    },
    onSortChange(sort) {
      this.$emit('sortChange', sort)
    }
  }
}
</script>
