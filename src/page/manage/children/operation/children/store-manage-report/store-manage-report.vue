<script>
  import storeManageReportDetail from './components/store-manage-report-detail'
  import storeManageReportTotal from './components/store-manage-report-total'
  import carrierCard from './components/store-manage-report-carrier-card'
  import moment from 'moment'

  export default {
    components: {
      carrierCard,
      storeManageReportDetail,
      storeManageReportTotal
    },
    data() {
      return {
        tabsValue: 'MONTH',
        pickerOptions: {
          firstDayOfWeek: 1,
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        date: moment().format('YYYY-MM'),
        summary: null,
        drpRanking: {},
        isLoading: false
      }
    },
    mounted() {
      this.getReportData()
    },
    methods: {
      handleTabClick() {
        this.date = moment().format('YYYY-MM')
        this.getReportData()
      },
      async getReportData() {
        this.isLoading = true
        const res = await this.jaxLib.report.getStoreManageReportData({
          unit: this.tabsValue,
          date: moment(this.date).format(
            this.tabsValue === 'YEAR' ? 'YYYY-01-01' : 'YYYY-MM-01'
            )
        })
        this.isLoading = false
        if (!res.success) return false
        this.summary = res.data.summary
        this.drpRanking = res.data.drpRanking
      }
    }
  }
</script>

<template>
  <div class="operation-store-manage-report">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">库管报表</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="tabsValue" @tab-click="handleTabClick">
          <el-tab-pane label="月数据" name="MONTH">
          </el-tab-pane>
          <el-tab-pane label="年数据" name="YEAR">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="wh__tools--mix">
        <el-date-picker
          v-if="tabsValue==='MONTH'"
          v-model="date"
          align="right"
          :clearable="false"
          class="operation-report__input"
          type="month"
          :picker-options="pickerOptions"
          @change="getReportData"
          placeholder="选择月">
        </el-date-picker>
        <el-date-picker
          v-if="tabsValue==='YEAR'"
          v-model="date"
          align="right"
          :clearable="false"
          class="operation-report__input"
          type="year"
          :picker-options="pickerOptions"
          @change="getReportData"
          placeholder="选择年">
        </el-date-picker>
      </div>
      <div class="wh__body" v-loading="isLoading">
        <div class="flex mb10">
          <store-manage-report-detail v-if="summary" class="flex1" :content="summary"></store-manage-report-detail>
          <store-manage-report-total v-if="summary" :content="summary"></store-manage-report-total>
        </div>
        <div class="store-operation-report__list flex">
          <carrier-card :content="drpRanking.activated" title="运营商激活卡数据" class="mr15"></carrier-card>
          <carrier-card :content="drpRanking.deactivated" title="运营商未激活卡数据"></carrier-card>
        </div>
      </div>
    </div>
  </div>
</template>
