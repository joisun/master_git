<template>
  <div class="announcement">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">提成比例</h2>
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
      </div>
      <div v-loading="loading" class="wh__body">
        <el-tabs v-model="saleType">
          <el-tab-pane label="普通销售" name="SELLER" />
          <el-tab-pane label="城市经理" name="CITY_TEAM_LEADER" />
        </el-tabs>
        <div class="wh__body--table" style="padding-left: 20px">
          <el-tabs v-model="activeName" pad>
            <el-tab-pane label="新增订单" name="first">
              <el-table
                :border="true"
                :data="tableDataAdd"
                :loading="loading"
                height="calc(100vh - 200px)"
                :span-method="tableAddSpanMethod"
              >
                <el-table-column
                  v-for="(item, index) in computedCols"
                  :key="index"
                  :formatter="item.formatter"
                  :prop="item.key"
                  :label="item.name"
                  :min-width="item.width"
                  :align="item.align"
                  :class-name="item.style"
                >
                </el-table-column>
                <el-table-column label="操作">
                  <template v-if="scope.row.orderType !== 'OVERSOLD'" slot-scope="scope">
                    <el-button
                      icon="el-icon-edit"
                      circle
                      @click="onEdit('INCOME', scope.row)"
                    ></el-button>
                    <el-button
                      icon="el-icon-plus"
                      circle
                      @click="onAdd('INCOME', scope.row)"
                    ></el-button>
                    <el-button
                      v-if="
                        scope.row.profitLimit &&
                        !(scope.row.profitLimit[0] === 0 && scope.row.profitLimit[1] === 100)
                      "
                      icon="el-icon-minus"
                      circle
                      @click="onDelete(scope.row)"
                    ></el-button>
                  </template>
                </el-table-column> </el-table
            ></el-tab-pane>
            <el-tab-pane label="续费订单" name="second">
              <el-table
                :border="true"
                :loading="loading"
                :data="tableDataRenew"
                height="calc(100vh - 200px)"
                :span-method="tableRenewSpanMethod"
              >
                <el-table-column
                  v-for="(item, index) in computedRenewCols"
                  :key="index"
                  :formatter="item.formatter"
                  :prop="item.key"
                  :label="item.name"
                  :min-width="item.width"
                  :align="item.align"
                  :class-name="item.style"
                >
                </el-table-column>
                <el-table-column label="操作">
                  <template v-if="scope.row.orderType !== 'OVERSOLD'" slot-scope="scope">
                    <el-button
                      icon="el-icon-edit"
                      circle
                      @click="onEdit('RECHARGE', scope.row)"
                    ></el-button>
                    <el-button
                      icon="el-icon-plus"
                      circle
                      @click="onAdd('RECHARGE', scope.row)"
                    ></el-button>
                    <el-button
                      v-if="
                        scope.row.profitLimit &&
                        !(scope.row.profitLimit[0] === 0 && scope.row.profitLimit[1] === 100)
                      "
                      icon="el-icon-minus"
                      circle
                      @click="onDelete(scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <DialogAddEditSalesComissionPercentage
      :visible.sync="DialogAddEditSalesComissionPercentage.visible"
      :data="DialogAddEditSalesComissionPercentage.data"
      :type="DialogAddEditSalesComissionPercentage.type"
      :sale-type="saleType"
      :month-date="search.monthDate"
      @refresh="getList"
    />
  </div>
</template>

<script>
import { COLUMNS, COLUMNS_RENEW } from '../mixins/const'
import DialogAddEditSalesComissionPercentage from '../components/DialogAddEditSalesComissionPercentage.vue'
import { getFirstDayOfMonth } from '@/global/function/getFirstDayOfMonth'

// 针对毛利率区间（profitLimit）进行数据处理。因为后端返回的是一个数字，前端展示的需要一个数组
const adjustment = (list) => {
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    if (
      !list[i - 1] ||
      (list[i - 1] &&
        (item.orderType !== list[i - 1].orderType ||
          item.rechargeLimit !== list[i - 1].rechargeLimit))
    ) {
      item.profitLimit = [0, item.profitLimit * 100]
    } else {
      item.profitLimit = [list[i - 1].profitLimit[1], item.profitLimit * 100]
    }
  }
  return list
}

export default {
  name: 'sales-comission-percentage-list',
  components: {
    DialogAddEditSalesComissionPercentage
  },
  data() {
    return {
      search: {
        monthDate: ''
      },
      pickerOptions: {
        disabledDate(time) {
          const currentDate = new Date()
          return (
            time.getFullYear() >= currentDate.getFullYear() &&
            time.getMonth() > currentDate.getMonth()
          )
        }
      },
      saleType: 'SELLER',
      COLUMNS,
      COLUMNS_RENEW,
      activeName: 'first',
      loading: false,
      tableDataAdd: [],
      tableDataRenew: [],
      DialogAddEditSalesComissionPercentage: {
        visible: false,
        data: undefined,
        type: undefined
      }
    }
  },
  computed: {
    computedCols() {
      return this.COLUMNS
    },
    computedRenewCols() {
      return this.COLUMNS_RENEW
    }
  },
  watch: {
    async 'search.carrier'() {
      await this.getSignedCarrierList()
    },
    saleType() {
      this.getList()
    }
  },
  created() {
    this.search.monthDate = getFirstDayOfMonth()
    this.getList()
  },
  methods: {
    onSearchChange() {
      this.getList()
    },
    onDelete(row) {
      this.$confirm('确定删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          id: row.id,
          monthDate: this.search.monthDate
        }
        const res = await this.jaxLib.salesComission.deletePercentageItem(params)
        if (res.success) {
          this.$message.success('操作成功')
          await this.getList()
        }
      })
    },
    tableAddSpanMethod({ row, columnIndex }) {
      const orderType = row.orderType
      const profitLimit = row.profitLimit
      if (columnIndex === 0) {
        let rowSpan = 0
        for (let i = 0; i < this.tableDataAdd.length; i++) {
          if (this.tableDataAdd[i].orderType === orderType) {
            rowSpan++
          }
        }
        if (profitLimit[0] === 0) {
          return [rowSpan, 1]
        } else {
          return [0, 0]
        }
      } else {
        return [1, 1]
      }
    },
    tableRenewSpanMethod({ row, columnIndex }) {
      const orderType = row.orderType
      const rechargeLimit = row.rechargeLimit
      const profitLimit = row.profitLimit
      if (columnIndex === 0) {
        let rowSpan = 0
        for (let i = 0; i < this.tableDataRenew.length; i++) {
          if (this.tableDataRenew[i].orderType === orderType) {
            rowSpan++
          }
        }
        if (profitLimit[0] === 0 && (row.rechargeLimit === 1 || row.rechargeLimit === -1)) {
          return [rowSpan, 1]
        } else {
          return [0, 0]
        }
      } else if (columnIndex === 1) {
        let rowSpan = 0
        for (let i = 0; i < this.tableDataRenew.length; i++) {
          if (
            this.tableDataRenew[i].rechargeLimit === rechargeLimit &&
            this.tableDataRenew[i].orderType === orderType
          ) {
            rowSpan++
          }
        }
        if (profitLimit[0] === 0) {
          return [rowSpan, 1]
        } else {
          return [0, 0]
        }
      } else {
        return [1, 1]
      }
    },
    onAdd(type, row) {
      this.DialogAddEditSalesComissionPercentage.visible = true
      this.DialogAddEditSalesComissionPercentage.data = {
        rechargeLimit: row.rechargeLimit,
        orderType: row.orderType
      }
      this.DialogAddEditSalesComissionPercentage.type = type
    },
    onEdit(type, row) {
      this.DialogAddEditSalesComissionPercentage.visible = true
      this.DialogAddEditSalesComissionPercentage.data = row
      this.DialogAddEditSalesComissionPercentage.type = type
    },
    async getList() {
      this.loading = true
      try {
        const rst = await this.jaxLib.salesComission.getPercentageList({
          saleType: this.saleType,
          ...this.search
        })
        this.loading = false
        if (!rst.success) {
          this.$message.error('获取列表失败')
        } else {
          this.tableDataAdd = adjustment(
            rst.data
              .filter((e) => e.type === 'INCOME')
              .sort((a, b) => {
                if (a.orderType === b.orderType) {
                  return a.profitLimit - b.profitLimit
                } else {
                  return a.orderType > b.orderType ? 1 : -1
                }
              })
          )
          this.tableDataRenew = adjustment(
            rst.data
              .filter((e) => e.type === 'RECHARGE')
              .sort((a, b) => {
                if (a.orderType === b.orderType) {
                  if (a.rechargeLimit === b.rechargeLimit) {
                    return a.profitLimit - b.profitLimit
                  } else {
                    if (a.rechargeLimit === 0) {
                      return 1
                    }
                    if (b.rechargeLimit === 0) {
                      return -1
                    }
                    return a.rechargeLimit - b.rechargeLimit
                  }
                } else {
                  return a.orderType > b.orderType ? 1 : -1
                }
              })
          )
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
  width: 600px;
  margin-top: -10px;
}
</style>
