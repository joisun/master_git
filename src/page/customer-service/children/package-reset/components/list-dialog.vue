<template>
  <div>
    <el-alert
      v-if="disabledAll"
      type="error"
      effect="dark"
      style="margin-bottom: 20px"
      :closable="false"
    >
      <template #title>
        <template v-if="tableData.length === 1">只有一条记录，请确认是否已经续费</template>
        <template v-if="tableData.length > 2"
          >当前无法更改套餐，请联系客户确认或联系技术解决</template
        >
      </template>
    </el-alert>
    <el-form :model="searchForm" inline>
      <el-form-item label="">
        <el-input
          style="width: 200px"
          v-model="searchForm.iccid"
          placeholder="ICCID"
          @keydown.enter.native="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div v-loading="loading" class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableData">
          <el-table-column label="id" prop="id" />
          <el-table-column label="套餐名称" prop="irpName" />
          <el-table-column label="套餐用量" prop="totalDataVolume">
            <template #default="{ row }">
              {{ row.totalDataVolume | volumeFilter }}
            </template>
          </el-table-column>
          <el-table-column label="套餐状态" prop="status">
            <template #default="{ row }">
              {{ statusMap[row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="套餐开始时间" prop="effectiveDate">
            <template #default="{ row, $index }">
              <template v-if="$index !== tableData.length - 1 || disabledAll">
                {{ row.effectiveDate | dateFilter }}
              </template>
              <template v-else>
                <el-date-picker
                  v-model="row.effectiveDate.time"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                  @change="(e) => effectiveDateChange(e, $index)"
                />
                <div v-if="errors.includes(3)" style="color: red">不能为空</div>
                <div v-if="errors.includes(5)" style="color: red">不能晚于当前时间</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="套餐结束时间" prop="expirationDate">
            <template #default="{ row, $index }">
              <template v-if="$index !== tableData.length - 1 || disabledAll">
                {{ row.expirationDate | dateFilter }}
                <div
                  v-if="errors.includes(1) && $index === tableData.length - 2"
                  style="color: red"
                >
                  不能早于套餐开始时间
                </div>
              </template>
              <template v-else>
                <el-date-picker
                  v-model="row.expirationDate.time"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                  @change="(v) => expirationDateChange(v, $index)"
                />
                <div v-if="errors.includes(4)" style="color: red">不能为空</div>
                <div v-else-if="errors.includes(6)" style="color: red">不能早于当前时间</div>
                <div v-else-if="errors.includes(2)" style="color: red">不能早于套餐开始时间</div>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right; margin-top: 15px">
          <el-button
            v-if="tableData.length"
            type="primary"
            :disabled="disabledAll"
            @click="saveTimeModify"
            >保存</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { safeGet } from '@/global/function/safe-operations'
import moment from 'moment'
import dateFormat from '@/global/filters/date-format'
const mockData = [
  {
    iccid: '89860445101941192701',
    usageDataVolume: 0,
    irpName: '1.0G/月',
    id: 1312313,
    totalDataVolume: 1024,
    effectiveDate: {
      date: 22,
      hours: 18,
      seconds: 15,
      month: 5,
      timezoneOffset: -480,
      year: 121,
      minutes: 59,
      time: 1624359555000,
      day: 2
    },
    expirationDate: {
      date: 28,
      hours: 9,
      seconds: 36,
      month: 8,
      timezoneOffset: -480,
      year: 121,
      minutes: 59,
      time: 1632794376000,
      day: 2
    },
    // status: 'active'
    status: 'finished'
  },
  {
    iccid: '89860445101941192701',
    usageDataVolume: 0,
    irpName: '1.0G/月',
    id: 1312313,
    totalDataVolume: 1024,
    effectiveDate: {
      date: 22,
      hours: 18,
      seconds: 15,
      month: 5,
      timezoneOffset: -480,
      year: 121,
      minutes: 59,
      time: 1624359555000,
      day: 2
    },
    expirationDate: {
      date: 28,
      hours: 9,
      seconds: 36,
      month: 8,
      timezoneOffset: -480,
      year: 121,
      minutes: 59,
      time: 1632794376000,
      day: 2
    },
    status: 'active'
    // status: 'finished'
  },
  {
    iccid: '89860445101941192701',
    usageDataVolume: 0,
    irpName: '1.0G/月',
    id: 52392085,
    totalDataVolume: 1024,
    effectiveDate: {
      date: 22,
      hours: 18,
      seconds: 15,
      month: 5,
      timezoneOffset: -480,
      year: 121,
      minutes: 59,
      time: 1624359555000,
      day: 2
    },
    expirationDate: {
      date: 28,
      hours: 9,
      seconds: 36,
      month: 8,
      timezoneOffset: -480,
      year: 121,
      minutes: 59,
      time: 1632794376000,
      day: 2
    },
    status: 'plan'
    // status: 'active'
  }
]
export default {
  data() {
    return {
      visible: false,
      loading: false,
      searchForm: {
        iccid: ''
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // tableData: mockData.slice(1),
      tableData: [],
      errors: [],
      statusMap: {
        finished: '历史套餐',
        active: '当前套餐',
        plan: '计划套餐',
        pause: '暂停套餐',
        ineffective: '待生效套餐'
      }
    }
  },
  computed: {
    disabledAll() {
      // return this.tableData.length > 2 || this.tableData.length === 1
      return false
    }
  },
  methods: {
    expirationDateChange(v, index) {
      this.errors = this.errors.filter((item) => item !== 2 && item !== 4 && item !== 6)
      const plan = this.tableData[index]
      const planEnd = moment(v)
      this.tableData[index].expirationDate = {
        time: planEnd
      }
      if (!v) {
        this.errors.push(4)
        return
      }
      if (this.tableData[index].status === 'plan' && planEnd.isSameOrBefore(new Date())) {
        this.errors.push(6)
        return
      }
      const planEff = moment(plan.effectiveDate.time)

      if (planEff.isSameOrAfter(planEnd)) {
        this.errors.push(2)
        return
      }
    },
    effectiveDateChange(v, index) {
      this.errors = this.errors.filter((item) => item !== 1 && item !== 3 && item !== 5)
      const planEff = moment(v)
      const activeEnd = moment(v).subtract(1, 'second')
      if (this.tableData[index].status === 'active' && planEff.isAfter(new Date())) {
        this.errors.push(5)
        return
      }
      if (!v) {
        this.errors.push(3)
        return
      }
      this.tableData[index].effectiveDate = {
        time: planEff
      }
      if (this.tableData.length === 1) {
        return
      }
      const active = this.tableData[index - 1]
      const activeEff = moment(active.effectiveDate.time)
      this.tableData[index - 1].expirationDate = {
        time: activeEnd
      }
      if (activeEff.isSameOrAfter(activeEnd)) {
        this.errors.push(1)
      }
    },
    async saveTimeModify() {
      if (this.errors.length) {
        this.$message.error('请检查表单错误内容')
        return
      }
      let rst = await this.jaxLib.customerServices.updateDeviceRatePlan({
        drpDTOList: this.tableData.map((item) => {
          return {
            ...item,
            effectiveDate: dateFormat(item.effectiveDate),
            expirationDate: dateFormat(item.expirationDate)
          }
        })
      })
      if (safeGet(rst, 'success', false)) {
        this.$message.success('保存成功')
        this.tableData = []
        this.errors = []
        this.searchForm.iccid = ''
        // await this.getList()
      }
    },
    async getList() {
      this.loading = true
      const { iccid } = this.searchForm
      let rst = await this.jaxLib.customerServices.listByIccid({
        iccid
      })
      this.loading = false
      if (!rst.success) return false
      this.tableData = rst.data
    },
    onSearch() {
      this.getList()
    }
  }
}
</script>
