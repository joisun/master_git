<script>
  /**
   * Create by zeter on 2018/10/15
   */
  import moment from 'moment'
  import { columns } from './mixins/const'
  import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
  import volumeFormat from '@/global/filters/volume-format'
  import Download from '@/page/components/wh-download/wh-download'

  export default {
    name: 'store-manage-report',
    components: {
      'wh-carrier-account-select': whCarrierAccountSelect
    },
    data() {
      // eslint-disable-next-line new-cap
      const nowTime = new moment().subtract(1, 'days').toDate()
      return {
        columns: columns,
        pickerOptions: {
          firstDayOfWeek: 1,
          disabledDate: (time) => time.getTime() > Date.now()
        },
        time: {
          dateTime: nowTime,
          weekTime: nowTime,
          monthTime: nowTime
        },
        searchData: {
          carrier: '',
          carrierAccountId: '',
          type: '',
          supportTesting: '',
          material: '',
          specification: '',
          ratePlanVolume: '',
          validity: '',
          validityUnit: '',
          volumeType: '',
          packageName: ''
        },
        tabsValue: 'date',
        loading: false,
        tableData: [],
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        },
        countData: 0,
        listRatePlan: []
      }
    },
    computed: {
      timeComputed() {
        let nowTime = []
        const dueToTime = (t, v) => [moment(v).startOf(t).format('YYYY-MM-DD HH:mm:ss'), moment(v).endOf(t).format('YYYY-MM-DD HH:mm:ss')]
        if (this.tabsValue === 'date') nowTime = dueToTime('day', this.time.dateTime)
        if (this.tabsValue === 'week') nowTime = dueToTime('week', this.time.weekTime)
        if (this.tabsValue === 'month') nowTime = dueToTime('month', this.time.monthTime)
        return nowTime
      },

      computedPost() {
        if (!this.searchData.carrier) this.searchData.carrierAccountId = ''
        let obj = {
          ...this.searchData,
          startDate: this.timeComputed[0],
          endDate: this.timeComputed[1]
        }
        let clearKeys = ['volumeType', 'validity', 'validityUnit', 'ratePlanVolume']
        clearKeys.forEach(key => {
          if (!obj[key]) {
            delete obj[key]
          }
        })
        if (obj.volumeType === 'COUNT') {
          obj.useCountAsVolume = true
        } else if (obj.volumeType === 'AMOUNT') {
          obj.useCountAsVolume = false
        }
        obj.carrier = obj.carrier.toLocaleUpperCase()
        Object.keys(obj).forEach(key => {
          if (!obj[key]) delete obj[key]
        })
        return obj
      }
    },
    methods: {
      volumeFormat(value) {
        return volumeFormat(value)
      },
      // 切换周期
      onTabChange(tab, event) {
        this.$router.push({ name: this.$route.name, query: { type: tab.name } })
        this.changeFilter()
      },
      // 切换筛选条件
      changeFilter() {
        this.getData()
        this.getStatisticsData()
      },
      // 修复错误
      changePage(val) {
        this.page.pageIndex = val
        this.getData()
      },
      // 获取统计数
      async getStatisticsData() {
        this.countData = ''
        let rst = await this.jaxLib.store.countManageReport(this.computedPost)
        if (!rst.success) return false
        this.countData = rst.data.count
      },
      // 获取列表
      async getData() {
        if (this.loading) return false
        this.loading = true
        let params = {
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          ...this.computedPost
        }
        let rst = await this.jaxLib.store.manageReport(params)
        this.loading = false
        if (!rst.success) return false
        this.tableData = rst.data.list
        this.page.total = rst.data.page.allCount
      },
      // 下载数据
      async downloadTables() {
        const { success, data } = await this.jaxLib.store.downManageReport(this.computedPost)
        if (!success) return false
        await Download({ ...data })
      },
      async getListRatePlan() {
        let rst = await this.jaxLib.store.listRatePlan()
        if (!rst.success) {
          return false
        }
        this.listRatePlan = rst.data.list
      }
    },
    created() {
      this.tabsValue = this.$route.query.type || 'date'
      this.getData()
      this.getStatisticsData()
      this.getListRatePlan()
    }
  }
</script>

<template>
  <div class="store-manage-report">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">库管报表</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="tabsValue" @tab-click="onTabChange">
          <el-tab-pane label="日数据" name="date">
          </el-tab-pane>
          <el-tab-pane label="周数据" name="week">
          </el-tab-pane>
          <el-tab-pane label="月数据" name="month">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="wh__tools--mix">
        <el-date-picker
          v-if="tabsValue==='date'"
          v-model="time.dateTime"
          type="date"
          @change="changeFilter"
          :clearable="false"
          class="wh__tools--search-input"
          :picker-options="pickerOptions"
          placeholder="选择日期">
        </el-date-picker>
        <el-date-picker
          v-if="tabsValue==='week'"
          v-model="time.weekTime"
          type="week"
          @change="changeFilter"
          :clearable="false"
          class="wh__tools--search-input"
          :picker-options="pickerOptions"
          format="yyyy 第 WW 周"
          placeholder="选择周">
        </el-date-picker>
        <el-date-picker
          v-if="tabsValue==='month'"
          v-model="time.monthTime"
          align="right"
          @change="changeFilter"
          :clearable="false"
          class="wh__tools--search-input"
          type="month"
          :picker-options="pickerOptions"
          placeholder="选择月">
        </el-date-picker>
        <el-select
          v-model="searchData.carrier"
          placeholder="请选择运营商"
          clearable
          @change="changeFilter"
          class="wh__tools--search-filter">
          <el-option
            v-for="(label, value) in enums.carrier.maps()"
            :key="value"
            :label="label"
            :value="value">
          </el-option>
        </el-select>
        <wh-carrier-account-select
          style="width:150px;"
          v-if="searchData.carrier!==''"
          v-model="searchData.carrierAccountId"
          placeholder="供应商账号"
          :carrier="searchData.carrier"
          @change="changeFilter">
        </wh-carrier-account-select>

        <el-select
          v-model="searchData.type"
          placeholder="套餐类型"
          clearable
          @change="changeFilter"
          class="wh__tools--search-filter">
          <el-option
            v-for="(label, value) in enums.ratePlanType.maps()"
            :key="value"
            :label="label"
            :value="value"
            clearable>
          </el-option>
        </el-select>
        <el-select
          v-model="searchData.packageName"
          placeholder="套餐档位"
          style="width: 120px;"
          @change="changeFilter"
          value-key="label"
          clearable>
          <template v-if="searchData.type !== 'POOL'">
            <el-option
              v-for="item in listRatePlan"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </template>
        </el-select>
        <el-select
          v-model="searchData.supportTesting"
          placeholder="测试期"
          clearable
          @change="changeFilter"
          class="wh__tools--search-simple">
          <el-option label="有" :value="true">
          </el-option>
          <el-option label="无" :value="false">
          </el-option>
        </el-select>
        <el-select
          v-model="searchData.material"
          placeholder="材质"
          clearable
          @change="changeFilter"
          class="wh__tools--search-simple">
          <el-option
            v-for="(label, value) in enums.materialType.maps()"
            :key="value"
            :label="label"
            :value="value">
          </el-option>
        </el-select>
        <el-select
          v-model="searchData.specification"
          placeholder="规格"
          clearable
          @change="changeFilter"
          class="wh__tools--search-simple">
          <el-option
            v-for="(label, value) in enums.specificationType.maps()"
            :key="value"
            :label="label"
            :value="value">
          </el-option>
        </el-select>
        <el-button size="mini" class="float-right ml10" @click="downloadTables()">
          <wh-std-icon sign="&#xe635;">
          </wh-std-icon>
        </el-button>
      </div>
      <div class="wh__body">
        <div class="wh__body--table">
          <el-table
            v-loading="loading"
            :data="tableData"
            height="calc(100vh - 250px)"
            class="wh__body--table">
            <el-table-column
              v-for="(item, index) in columns"
              :key=index
              :formatter="item.formatter"
              :prop=item.key
              :label=item.name
              :min-width=item.width
              :align=item.align
              :class-name="item.style">
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <div class="wh__body--page-other">
            总计出库 {{countData}}
          </div>
          <el-pagination
            @current-change="changePage"
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            layout="total, prev, pager, next"
            :total="page.total"
            class="wh__body--page">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
