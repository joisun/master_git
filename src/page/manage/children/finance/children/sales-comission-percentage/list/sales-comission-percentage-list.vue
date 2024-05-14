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
        <div class="wh__body--table" style="padding-left: 20px">
          <el-tabs v-model="search.type" pad lazy @tab-click="getList">
            <el-tab-pane label="新增订单" name="INCOME">
              <mind-map
                v-if="search.type === 'INCOME'"
                :month-date="search.monthDate"
                :list="tableData"
                :type="search.type"
                @save="getList"
                @refresh="getList"
              />
            </el-tab-pane>
            <el-tab-pane label="续费订单" name="RECHARGE">
              <mind-map
                v-if="search.type === 'RECHARGE'"
                :list="tableData"
                :month-date="search.monthDate"
                :type="search.type"
                @save="getList"
                @refresh="getList"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirstDayOfMonth } from '@/global/function/getFirstDayOfMonth'
import MindMap from '@/page/manage/children/finance/children/sales-comission-percentage/components/mind-map/mind-map.vue'

function getRangeKey(list, key) {
  const keyMap = {}
  list.forEach((item) => {
    keyMap[item[key]] = 1
  })
  return keyMap
}

export default {
  name: 'sales-comission-percentage-list',
  components: { MindMap },
  data() {
    return {
      search: {
        monthDate: getFirstDayOfMonth(),
        type: 'INCOME'
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
      activeName: 'first',
      loading: false,
      tableData: []
    }
  },
  created() {
    this.search.monthDate = getFirstDayOfMonth()
    // this.search.monthDate = '2024-03-01'
    this.getList()
  },
  methods: {
    onSearchChange() {
      this.getList()
    },
    onDelete(row) {},
    onAdd(type, row) {},
    async getList() {
      this.loading = true
      try {
        const res = await this.jaxLib.salesComission.getPercentageList({
          ...this.search
        })
        this.loading = false
        this.tableData = res.data.map((item) => {
          return {
            ...item,
            profitCommission: (item.profitCommission * 100).toFixed(2),
            incomeCommission: (item.incomeCommission * 100).toFixed(2),
            profitLimit: (item.profitLimit * 100).toFixed(2),
            rechargeLimit:
              item.orderType === 'GENERAL' && item.rechargeLimit === -1 ? 3 : item.rechargeLimit
          }
        })
      } catch (e) {
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
