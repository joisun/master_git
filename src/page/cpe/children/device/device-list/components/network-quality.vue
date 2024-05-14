<script>
import apis from '@/api/ajax'
import moment from 'moment'
import echarts from 'echarts'
const COLOR_MAP = {
  CMCC: '#67C23A',
  CHINANET: '#409EFF',
  UNICOM: '#F56C6C'
}
function getEchartsOptions(data, signalQualityList) {
  const yDataMap = {}
  let lossDateMap = {}
  let signalQualityMap = {}
  let lossRateData = []
  let signalQuality = []
  let signalQuality2 = []
  let isShowSignalQuality2 = false
  data.map((item) => {
    yDataMap[item.time] = item.avg
    lossDateMap[item.time] = item.loss
  })
  signalQualityList.map((item) => {
    signalQualityMap[item.time] = item
    if (item.signalQuality2 !== -1) {
      isShowSignalQuality2 = true
    }
  })

  let xData = []
  let yData = []
  const xInterval = 10
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 6; j++) {
      let hour = i < 10 ? `0${i}` : i
      let minute = j * xInterval < 10 ? `0${j * xInterval}` : j * xInterval
      const x = `${hour}:${minute}`
      xData.push(x)
      yData.push(yDataMap[x] || '')
      lossRateData.push(lossDateMap[x] || 0)
      if (signalQualityMap[x]) {
        signalQuality.push(signalQualityMap[x].signalQuality || 0)
        signalQuality2.push(signalQualityMap[x].signalQuality2 || 0)
      } else {
        signalQuality.push('')
        signalQuality2.push('')
      }
    }
  }

  return {
    color: ['#e5323e', '#564242', '#59cf2a', ...(isShowSignalQuality2 ? ['#4cabce'] : [])],
    xAxis: {
      name: '时间',
      type: 'category',
      data: xData
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const unit = {
          平均延迟: 'ms',
          丢包率: '%',
          '4G信号强度': '%',
          '4G信号强度2': '%'
        }
        let relVal = params[0].name
        for (let i = 0; i < params.length; i++) {
          relVal +=
            '<div class="circle" ><span style="background:' +
            params[i].color +
            '"></span>' +
            params[i].seriesName +
            ' : ' +
            (params[i].value === '' ? '-' : params[i].value) +
            unit[params[i].seriesName] +
            '</div>'
        }
        return relVal
      }
    },
    legend: {
      left: 'center',
      data: ['平均延迟', '丢包率', '4G信号强度', ...(isShowSignalQuality2 ? ['4G信号强度2'] : [])]
    },
    grid: {
      left: 60,
      bottom: 20,
      right: 60
    },
    yAxis: [
      {
        name: '平均延迟（ms）',
        type: 'value',
        nameTextStyle: {
          lineHeight: 56
        }
      },
      {
        name: '丢包率（%）',
        type: 'value',
        max: 100,
        nameTextStyle: {
          lineHeight: 56
        }
      }
    ],
    series: [
      {
        name: '平均延迟',
        data: yData,
        type: 'line'
      },
      {
        name: '丢包率',
        data: lossRateData,
        type: 'bar',
        yAxisIndex: 1
      },
      {
        name: '4G信号强度',
        data: signalQuality,
        type: 'line',
        yAxisIndex: 1
      },
      ...(isShowSignalQuality2
        ? [{ name: '4G信号强度2', data: signalQuality2, type: 'line', yAxisIndex: 1 }]
        : [])
    ]
  }
}

export default {
  props: {
    macAddr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      COLOR_MAP,
      isLoading: false,
      linkType: 'USE_4G',
      date: moment().format('YYYY-MM-DD'),
      offlineList: [],
      icccidRecordList: [],
      myChart: null
    }
  },
  computed: {
    isToday() {
      return moment(this.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async handeDayStepChange(type) {
      const optionMap = {
        pre: 'subtract',
        next: 'add'
      }
      this.date = moment(this.date, 'YYYY-MM-DD')[optionMap[type]](1, 'day').format('YYYY-MM-DD')
      await this.getData()
    },
    async getData() {
      if (!this.macAddr.trim()) {
        return this.$message({ type: 'error', message: 'Mac地址不能为空' })
      }
      this.isLoading = true
      const { success, data } = await apis.cpe.monitorPingData({
        macAddr: this.macAddr,
        date: moment(this.date).format('YYYY-MM-DD'),
        linkType: this.linkType
      })
      this.isLoading = false
      if (!success) {
        return false
      }
      this.setOfflineChart(data.offlineRecordList || [])
      this.setCarrierStatus(data.icccidRecordList || [])
      this.myChart = echarts.init(this.$refs.chartRef)
      this.myChart.clear()
      this.myChart.setOption(getEchartsOptions(data.pingList || [], data.signalQualityList || []))
    },
    setOfflineChart(offlineList) {
      const offlineTotalWidth = 86400 // 一天的秒数
      const date = moment(this.date).format('YYYY-MM-DD')
      const startOfDay = moment(`${date} 00:00:00`).unix()
      this.offlineList = offlineList.map((item) => {
        const start = moment(`${date} ${item.offlineTime}`).unix()
        const end = moment(`${date} ${item.reonlineTime}`).unix()
        return {
          ...item,
          left: ((start - startOfDay) / offlineTotalWidth) * 100,
          width: ((end - start) / offlineTotalWidth) * 100
        }
      })
    },
    setCarrierStatus(icccidRecordList = []) {
      const offlineTotalWidth = 86400000
      const date = moment(this.date).format('YYYY-MM-DD')
      const startOfDay = moment(`${date} 00:00:00`).valueOf()
      this.icccidRecordList = icccidRecordList.map((item, index) => {
        const start = moment(`${date} ${item.time}`).valueOf()
        const offlineTime = icccidRecordList[index + 1]
          ? icccidRecordList[index + 1].time
          : this.isToday
          ? moment().format('HH:mm:ss')
          : '23:59:59'
        const end = moment(`${date} ${offlineTime}`).valueOf()
        return {
          ...item,
          left: ((start - startOfDay) / offlineTotalWidth) * 100,
          width: ((end - start) / offlineTotalWidth) * 100,
          color: COLOR_MAP[item.carrier],
          start: moment(start).format('HH:mm:ss'),
          end: moment(end).format('HH:mm:ss')
        }
      })
    }
  }
}
</script>

<template>
  <div class="network-quality">
    <div class="result">
      <template>
        <div class="search">
          <el-button title="前一天" icon="el-icon-arrow-left" @click="handeDayStepChange('pre')" />
          <el-date-picker
            v-model="date"
            placeholder="请选择日期"
            style="width: 140px"
            :clearable="false"
            :picker-options="{
              disabledDate(time) {
                return time.getTime() > Date.now()
              }
            }"
            @change="getData"
          />
          <el-button
            v-show="!isToday"
            title="后一天"
            icon="el-icon-arrow-right"
            @click="handeDayStepChange('next')"
          />
        </div>
        <div ref="chartRef" v-loading="isLoading" class="network-quality-chart"></div>
        <div class="offline">
          <div ref="offlineRef" class="offline-wrapper">
            <div
              v-for="(item, index) in offlineList"
              :key="index"
              class="offline-item"
              :style="{ width: item.width + '%', left: item.left + '%' }"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.offlineTime + ' - ' + item.reonlineTime"
                placement="top"
              >
                <div class="offline-item--tooltip"></div>
              </el-tooltip>
            </div>
            <div
              v-for="(item, index) in icccidRecordList"
              :key="`icccidRecordList-${index}`"
              class="carrier-item"
              :style="{ width: item.width + '%', left: item.left + '%', background: item.color }"
            >
              <el-tooltip class="item" effect="dark" placement="bottom">
                <div class="offline-item--tooltip" />
                <template #content>
                  <p>{{ item.start }} - {{ item.end }}</p>
                  <p>运营商: {{ item.carrier | carrierFilter }}</p>
                  <p>ICCID: {{ item.iccid }}</p>
                </template>
              </el-tooltip>
            </div>
          </div>
          <div class="offline-desc">
            <div>离线 <span></span></div>
            <div>移动 <span :style="{ background: COLOR_MAP.CMCC }"></span></div>
            <div>电信 <span :style="{ background: COLOR_MAP.CHINANET }"></span></div>
            <div>联通 <span :style="{ background: COLOR_MAP.UNICOM }"></span></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.network-quality {
  .result {
    .network-quality-chart {
      width: 100%;
      height: 350px;
      margin-top: 20px;
      border: 1px solid #efefef;
      background-color: #ffffff;
      padding: 20px 0;
    }

    .offline {
      width: 100%;
      height: 50px;
      background-color: #ffffff;
      padding: 0 60px;

      &-wrapper {
        width: 100%;
        height: 24px;
        background-color: #efefef;
        position: relative;

        .offline-item {
          background-color: #666;
          position: absolute;
          top: 0;
          height: 12px;
          cursor: pointer;

          &--tooltip {
            width: 100%;
            height: 100%;
          }
        }
        .carrier-item {
          background-color: #666;
          position: absolute;
          top: 12px;
          height: 12px;
          cursor: pointer;
          border-top: 1px solid #fff;

          &--tooltip {
            width: 100%;
            height: 100%;
          }
        }
      }

      &-desc {
        font-size: 12px;
        display: flex;
        align-items: center;
        padding-top: 6px;

        div {
          margin-right: 12px;
          display: flex;
          align-items: center;
          span {
            display: inline-block;
            width: 26px;
            height: 13px;
            background-color: #666;
            border-radius: 3px;
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style>
