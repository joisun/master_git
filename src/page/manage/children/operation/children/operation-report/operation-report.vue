\<script>
/**
   * Create by zeter on 2018/4/24
   */
  import operationReportDetail from './compontents/operation-report-detail.vue'
  import operationReportTotal from './compontents/operation-report-total.vue'
  import operationReportRecharge from './compontents/operation-report-recharge.vue'
  import operationReportRenewals from './compontents/operation-report-renewals.vue'
  import moment from 'moment'

  export default {
    components: {
      'operation-report-detail': operationReportDetail,
      'operation-report-total': operationReportTotal,
      'operation-report-recharge': operationReportRecharge,
      'operation-report-renewals': operationReportRenewals
    },
    data() {
      // eslint-disable-next-line new-cap
      const nowTime = new moment().subtract(1, 'days').toDate()
      return {
        pickerOptions: {
          firstDayOfWeek: 1,
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        time: {
          dateTime: nowTime,
          weekTime: nowTime,
          monthTime: nowTime
        },
        tabsValue: 'date',
        cardNumber: {
          carrier: 'cmcc',
          total: 0,
          unicom: {},
          cmcc: {},
          chinanet: {}
        },
        loading: false,
        loadingIndex: [0, 0, 0],
        carrier: 'cmcc'
      }
    },
    computed: {
      timeComputed() {
        let nowTime = []
        const dueToTime = (t, v) => [moment(v).startOf(t).format('YYYY-MM-DD HH:mm:ss'), moment(v).endOf(t).format('YYYY-MM-DD HH:mm:ss')]
        switch (this.tabsValue) {
        case 'date':
          nowTime = dueToTime('day', this.time.dateTime)
          break
        case 'week':
          nowTime = dueToTime('week', this.time.weekTime)
          break
        case 'month':
          nowTime = dueToTime('month', this.time.monthTime)
          break
        }
        return nowTime
      }
    },
    methods: {
      onTabChange(tab, event) {
        this.$router.push({ name: this.$route.name, query: { type: tab.name } })
      },
      async initiateRequest() {
        this.loading = true
        this.loadingIndex = [1, 1, 1];
        ['cmcc', 'unicom', 'chinanet'].map(e => this.getPostData(e))
      },
      async getPostData(carrier) {
        let rst = await this.jaxLib.report.getDetailData({
          startDate: this.timeComputed[0],
          endDate: this.timeComputed[1],
          carrier: carrier
        })
        if (!rst.success) return false
        this.cardNumber[carrier] = rst.data
        this.loadingIndex[carrier === 'cmcc' ? 0 : carrier === 'unicom' ? 1 : 2] = 0
        if (this.loadingIndex.indexOf(1) < 0) this.computedTotal()
      },
      computedTotal() {
        this.cardNumber.total = this.cardNumber.cmcc.totalOut + this.cardNumber.unicom.totalOut + this.cardNumber.chinanet.totalOut
        this.loading = false
      }
    },
    created() {
      this.tabsValue = this.$route.query.type || 'date'
      this.initiateRequest()
    },
    watch: {
      timeComputed() {
        this.initiateRequest()
      }
    }
  }
</script>

<template>
  <div class="operation-report">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">运营报表</h2>
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
          :clearable="false"
          class="operation-report__input"
          :picker-options="pickerOptions"
          placeholder="选择日期">
        </el-date-picker>
        <el-date-picker
          v-if="tabsValue==='week'"
          v-model="time.weekTime"
          type="week"
          :clearable="false"
          class="operation-report__input"
          :picker-options="pickerOptions"
          format="yyyy 第 WW 周"
          placeholder="选择周">
        </el-date-picker>
        <el-date-picker
          v-if="tabsValue==='month'"
          v-model="time.monthTime"
          align="right"
          :clearable="false"
          class="operation-report__input"
          type="month"
          :picker-options="pickerOptions"
          placeholder="选择月">
        </el-date-picker>
        <el-select v-model="carrier" placeholder="请选择运营商">
          <el-option :label="key" :value="val" v-for="(key, val) in enums.carrier.maps()" :key="val">
          </el-option>
        </el-select>
      </div>
      <div class="wh__body">
        <div class="flex">
          <operation-report-detail
            class="flex1"
            :content="cardNumber"
            :carrier="carrier"
            :loading="loading">
          </operation-report-detail>
          <operation-report-total
            :content="cardNumber"
            :total="cardNumber.total"
            :loading="loading">
          </operation-report-total>
        </div>
        <div class="operation-report__list flex">
          <operation-report-recharge
            :type="tabsValue"
            :carrier="carrier"
            :times="timeComputed">
          </operation-report-recharge>
          <operation-report-renewals
            :type="tabsValue"
            :carrier="carrier"
            :times="timeComputed">
          </operation-report-renewals>
        </div>
      </div>
    </div>
  </div>
</template>
