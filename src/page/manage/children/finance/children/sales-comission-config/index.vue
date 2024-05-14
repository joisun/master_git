<template>
  <div class="sales-comission-config">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">提成配置</h2>
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
        <el-card style="margin-top: 30px">
          <template #header>
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col style="line-height: 32px"
                >业绩目标和提成下限{{ roleInfo.superLeader ? '设置' : '' }}</el-col
              >
              <el-col v-if="roleInfo.superLeader" style="text-align: right">
                <el-button v-if="!isEditing" type="primary" @click="handleEdit">修改</el-button>
                <template v-else>
                  <el-button type="primary" @click="onCommissionConfigSave">保存</el-button>
                  <el-button @click="onCancel">取消</el-button>
                </template>
              </el-col>
            </el-row>
          </template>
          <div class="wh__body--table">
            <el-form
              ref="form"
              :rules="rules"
              :model="formData"
              style="width: 100%"
              :inline="false"
            >
              <el-form-item prop="formTable" style="width: 100%">
                <el-table
                  :data="formData.formTable"
                  :span-method="objectSpanMethod"
                  :row-class-name="tableRowClassName"
                  :cell-class-name="cellClassName"
                >
                  <el-table-column label="区域" prop="area" width="80px" />
                  <el-table-column label="团队业绩目标(万元)" prop="teamTarget">
                    <template slot-scope="{ row }">{{
                      row.teamTarget | toLowerMoneyUnit
                    }}</template>
                  </el-table-column>
                  <el-table-column label="销售名字" prop="sellerName" width="80px" />
                  <el-table-column label="入职时间(年限)" prop="joinTime">
                    <template slot-scope="{ row }">
                      {{ row.joinTime | dateFilter('YYYY年MM月') }}
                      ({{
                        calJoinTimeYear(row.joinTime) >= 0
                          ? `${calJoinTimeYear(row.joinTime)}年`
                          : '未入职'
                      }})
                    </template>
                  </el-table-column>
                  <el-table-column label="销售底薪(元)" prop="basicSalary">
                    <template slot-scope="scope">
                      <el-input-number
                        v-if="isEditing"
                        v-model="formData.formTable[scope.$index].basicSalary"
                        :controls="false"
                        :min="0"
                        @change="basicSalaryChange(formData.formTable[scope.$index])"
                      />
                      <span v-else> {{ scope.row.basicSalary }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="提成下限(万元)" prop="commissionLowerLimit">
                    <template slot-scope="{ row }">{{
                      row.commissionLowerLimit | toLowerMoneyUnit
                    }}</template>
                  </el-table-column>
                  <el-table-column label="个人业绩目标(万元)" prop="personalTarget">
                    <template slot-scope="scope">
                      <el-input-number
                        v-if="isEditing"
                        v-model="formData.formTable[scope.$index].personalTarget"
                        :controls="false"
                        type="text"
                        :min="0"
                        @change="onPersonalTargetChange(scope.row)"
                      />
                      <span v-else> {{ scope.row.personalTarget }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="isEditing" label="销售类型" prop="isSalesLeader">
                    <template slot-scope="scope">
                      <el-select
                        v-model="formData.formTable[scope.$index].isSalesLeader"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in jobList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          :disabled="item.value && !!hasSaleLeader(scope.row)"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="销售状态" prop="status" align="center">
                    <template slot-scope="scope">
                      <span v-if="formData.formTable[scope.$index].isDelete">删除</span>
                      <el-switch
                        v-else-if="isEditing"
                        v-model="formData.formTable[scope.$index].status"
                        active-value="ENABLED"
                        inactive-value="DISABLED"
                        active-text=""
                        inactive-text=""
                      >
                      </el-switch>
                      <span v-else>{{ statusMap[formData.formTable[scope.$index].status] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="isEditing"
                    label="操作"
                    prop="action"
                    width="80px"
                    align="center"
                  >
                    <template slot-scope="{ row, $index }">
                      <el-button
                        size="mini"
                        :type="row.isDelete ? '' : 'primary'"
                        @click="handleDelete(row, $index)"
                        >{{ row.isDelete ? '撤销' : '删除' }}</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-row :gutter="20" style="margin: 20px 0 100px">
          <el-col :span="12">
            <personal-config-table :month-date="search.monthDate" :role-info="roleInfo" />
          </el-col>
          <el-col v-if="roleInfo.superLeader || roleInfo.leader" :span="12">
            <team-config-table :month-date="search.monthDate" :role-info="roleInfo" />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirstDayOfMonth } from '@/global/function/getFirstDayOfMonth'
import TeamConfigTable from './TeamConfigTable'
import PersonalConfigTable from './PersonalConfigTable'
import moment from 'moment'
import apis from '@/api/ironman-api'
const butlerListToArray = (list) => {
  let result = []
  for (const listKey in list) {
    const item = list[listKey].map((item, i) => ({
      groupStart: i === 0 ? list[listKey].length : 0,
      ...item,
      areaId: listKey
    }))
    result = result.concat(item)
  }
  return result
}
export default {
  name: 'SalesComissionConfig',
  components: {
    'team-config-table': TeamConfigTable,
    'personal-config-table': PersonalConfigTable
  },
  data() {
    return {
      jobList: [
        {
          label: '城市经理',
          value: true
        },
        {
          label: '普通销售',
          value: false
        }
      ],
      statusMap: {
        ENABLED: '启用',
        DISABLED: '禁用'
      },
      limits: [],
      areaEnum: {},
      pickerOptions: {
        disabledDate(time) {
          const currentDate = new Date()
          return (
            time.getFullYear() >= currentDate.getFullYear() &&
            time.getMonth() > currentDate.getMonth()
          )
        }
      },
      roleInfo: {
        superLeader: false,
        leader: false,
        seller: false
      },
      isSuperLeader: false,
      isEditing: false,
      formData: {
        formTable: []
      },
      rules: {
        formTable: {
          validator: (rule, value, callback) => {
            for (let i = 0; i < value.length; i++) {
              const item = value[i]
              if (!item.basicSalary || !item.personalTarget) {
                return callback(new Error(`列表第${i + 1}条（${item.sellerName}）输入有误，请检查`))
              }
            }
            return callback()
          },
          trigger: 'blur'
        }
      },
      search: {
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
      personalConfigList: [],
      teamConfig: []
    }
  },
  created() {
    this.search.monthDate = getFirstDayOfMonth()
    this.getArea()
    this.getRole()
    this.getLowerLimit()
  },
  methods: {
    hasSaleLeader(row) {
      return this.formData.formTable.filter(
        (item) => row.areaId === item.areaId && item.isSalesLeader
      ).length
    },
    handleDelete(row, index) {
      this.$set(this.formData.formTable[index], 'isDelete', !row.isDelete)
    },
    calJoinTimeYear(joinTime) {
      const rawDiff = moment(this.search.monthDate)
        .endOf('month')
        .diff(moment(joinTime), 'years', true)
      return Math.floor(rawDiff * 10) / 10
    },
    async getLowerLimit() {
      const res = await this.jaxLib.salesComission.salesCommissionConfigLowerLimit()
      this.limits = res.data
    },
    basicSalaryChange(row) {
      const { joinTime, basicSalary, isSalesLeader } = row
      if (isSalesLeader) {
        row.commissionLowerLimit = Math.max(...this.limits.map((item) => item.commissionLowerLimit))
        return
      }
      const limit = this.findBasicSalaryLimit(joinTime, basicSalary)
      row.commissionLowerLimit = limit.commissionLowerLimit
    },
    findBasicSalaryLimit(joinTime, basicSalary) {
      const basicSalaries = Array.from(new Set(this.limits.map((item) => item.basicSalary))).sort(
        (a, b) => b - a
      )
      const len = basicSalaries.length
      // 获取第一个底薪等级小于当前设置底薪的数据
      // 默认取最小底薪等级
      let bsLevel = basicSalaries[len - 1]
      for (let i = 0; i < len; i++) {
        const item = basicSalaries[i]
        if (item <= basicSalary) {
          bsLevel = basicSalaries[i]
          break
        }
      }
      const joinTimeDiff = this.calJoinTimeYear(joinTime)
      const yearLimits = this.limits.filter((item) => item.basicSalary === bsLevel)
      return yearLimits.find((item) => {
        const { entryYearUpperLimit, entryYearLowerLimit } = item
        if (joinTimeDiff <= 0) {
          return entryYearLowerLimit === 0
        }
        return !entryYearUpperLimit
          ? entryYearLowerLimit < joinTimeDiff
          : entryYearUpperLimit >= joinTimeDiff && entryYearLowerLimit < joinTimeDiff
      })
    },

    onCancel() {
      this.isEditing = false
      this.$refs.form.resetFields()
      this.getList()
    },
    handleEdit() {
      this.isEditing = true
    },
    tableRowClassName({ row }) {
      if (row.isNew) {
        return 'new-seller-row'
      }

      return ''
    },
    cellClassName({ row, columnIndex }) {
      if (row.isDelete && columnIndex !== 0 && columnIndex !== 1) {
        return 'warning-cell'
      }
      return ''
    },
    async getArea() {
      const res = await this.jaxLib.salesComission.getButlerSaleGroupId()
      if (res && res.success) {
        this.areaEnum = res.data
      }
    },
    onPersonalTargetChange({ area }) {
      const sum = this.formData.formTable
        .filter((item) => item.area === area)
        .map((item) => item.personalTarget)
        .reduce((x, y) => Number(x) + Number(y))
      if (sum) {
        const startIndex = this.formData.formTable.findIndex(
          (item) => item.area === area && !!item.groupStart
        )
        this.formData.formTable[startIndex].teamTarget = sum * 10000
      }
    },
    async onCommissionConfigSave() {
      try {
        const valid = await this.$refs.form.validate()
        if (!valid) return false
        const configs = this.formData.formTable.map((item) => {
          const {
            area,
            areaId,
            basicSalary,
            commissionLowerLimit,
            joinTime,
            gmtCreated,
            gmtModified,
            id,
            personalTarget,
            seller,
            sellerId,
            isSalesLeader,
            monthDate,
            status,
            isDelete
          } = item
          return {
            area,
            areaId,
            basicSalary,
            commissionLowerLimit,
            joinTime: moment(joinTime).format('YYYY-MM-DD HH:mm:ss'),
            gmtCreated,
            gmtModified,
            id,
            monthDate: monthDate || `${this.search.monthDate} 00:00:00`,
            personalTarget: personalTarget * 10000,
            seller,
            sellerId,
            isSalesLeader,
            status: isDelete ? 'DELETE' : status
          }
        })
        const res = await this.jaxLib.salesComission.salesCommissionConfigSave({
          configs
        })
        if (res && res.success) {
          this.$message.success('保存成功')
          this.isEditing = false
          await this.getList()
        }
      } catch (e) {
        console.log('🎸 DEBUG_347 index.vue 👉', e)
      }
    },
    async getRole() {
      const res = await this.jaxLib.salesComission.getCurrentUserAuthority({})
      if (res && res.success) {
        this.roleInfo = res.data
        await this.getList()
      }
    },
    markAsGroupStart(data) {
      let count = 1
      const array = [{}, ...data]
      array.reverse().reduce((pre, next) => {
        if (pre.area !== next.area) {
          pre.groupStart = count
          count = 1
        } else {
          count++
        }
        return next
      })
      return data
    },
    handlePageChange(e) {
      this.page.currentPage = e
      this.getList()
    },
    onSearchChange() {
      this.page.currentPage = 1
      this.getList()
    },
    async getList() {
      const params = {
        ...this.search,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      this.loading = true
      this.roleInfo.superLeader
        ? await this.superLeaderGetList(params)
        : await this.getNormalList(params)
    },
    async getNormalList(params) {
      try {
        const res = await this.jaxLib.salesComission.salesCommissionConfigList(params)
        if (res && res.success) {
          this.formData.formTable = this.markAsGroupStart(res.data)
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    async superLeaderGetList(params) {
      try {
        const list = this.jaxLib.salesComission.salesCommissionConfigList(params)
        const butler = this.jaxLib.salesComission.getSalesButlerConfig(params)
        const apis = [list, butler]
        const res = await Promise.all(apis)
        const [listRes, butlerRes] = res
        if (!listRes || !butlerRes || !listRes.success || !butlerRes.success) {
          this.$message.error('获取配置数据错误')
          return
        }
        this.formData.formTable = this.compareAndMergeList(listRes.data, butlerRes.data)
        this.loading = false
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    calTeamTarget(list) {
      let startItem = {}
      for (let i = 0; i < list.length; i++) {
        if (list[i].groupStart) {
          startItem = list[i]
          startItem.teamTarget = startItem.personalTarget
        } else {
          startItem.teamTarget += list[i].personalTarget
        }
      }
      return list
    },
    compareAndMergeList(list, butlerList) {
      const defaultListItem = {
        basicSalary: '',
        commissionLowerLimit: '',
        joinTime: '',
        personalTarget: '',
        isNew: true,
        isSalesLeader: false
      }
      return butlerListToArray(butlerList).map((item) => {
        const listItem = list.find((l) => +l.sellerId === +item.sellerId) || defaultListItem
        const { realName, areaId, sellerId, groupStart, joinTime, isSalesLeader, name, status } =
          item
        return {
          ...listItem,
          sellerId,
          seller: name,
          sellerName: realName,
          areaId,
          area: listItem.area || this.areaEnum[areaId],
          groupStart,
          joinTime,
          isSalesLeader,
          status,
          personalTarget: this.moneyUnitNumber(listItem.personalTarget)
        }
      })
    },
    moneyUnitNumber(value) {
      return value ? (value / 10000).toFixed(2) : value
    },
    objectSpanMethod({ row, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (row.groupStart) {
          return {
            rowspan: row.groupStart,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 1
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.sales-comission-config {
  .el-table {
    .new-seller-row {
      background-color: #f0f9eb;
    }
    .warning-cell {
      background: oldlace;
    }
  }
}
</style>
