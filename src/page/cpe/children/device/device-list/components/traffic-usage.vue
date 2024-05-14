<script>
import echarts from 'echarts'
import apis from '@/api/ironman-api'
import moment from 'moment'

const chartsOptions = (data, days = 7) => {
  const dateList = []
  for (let i = 0; i < days; i++) {
    dateList.unshift(moment().subtract(i, 'day').format('YYYY-MM-DD'))
  }
  const dataMap = {}
  data.forEach(item => (dataMap[item.date] = item))
  const cellularFlow = []
  const cardFlow = []
  const wanFlow = []
  dateList.forEach(date => {
    if (dataMap[date]) {
      cellularFlow.push(dataMap[date].lte)
      cardFlow.push(dataMap[date].card)
      wanFlow.push(dataMap[date].wan)
    } else {
      cellularFlow.push(0)
      cardFlow.push(0)
      wanFlow.push(0)
    }
  })
  return {
    color: [ '#006699', '#4cabce', '#e5323e' ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        let relVal = params[0].name
        for (let i = 0; i < params.length; i++) {
          relVal += '<div class="circle" ><span style="background:' + params[i].color + '"></span>' +
              params[i].seriesName +
              ' : ' +
            (params[i].value || '-') +
              'M' +
              '</div>'
        }
        return relVal
      }
    },
    legend: {
      data: [ '4G', '物联网卡', '宽带' ]
    },
    xAxis: [
      {
        name: '日期',
        type: 'category',
        axisTick: { show: false },
        data: dateList
      }
    ],
    yAxis: [
      {
        name: '用量(MB)',
        type: 'value'
      }
    ],
    series: [
      {
        name: '4G',
        type: 'bar',
        data: cellularFlow
      },
      {
        name: '物联网卡',
        type: 'bar',
        data: cardFlow
      },
      {
        name: '宽带',
        type: 'bar',
        data: wanFlow
      }
    ]
  }
}
export default {
  props: {
    macAddr: {
      type: String,
      default: ''
    },
    platform: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chartDays: 7,
      chartData: []
    }
  },
  mounted() {
    this.getFlow()
  },
  methods: {
    handleDayChange() {
      this.setChart()
    },
    setChart() {
      const chart = echarts.init(this.$refs.chartRef)
      chart.setOption(chartsOptions(this.chartData, this.chartDays))
    },
    async getFlow() {
      const { success, data } = await apis.getFlow({ macAddr: this.macAddr })
      if (!success) {
        return false
      }
      this.chartData = data
      this.setChart()
    }
  }
}
</script>

<template>
  <div class="traffic-usage">
    <el-radio-group v-model="chartDays" @change="handleDayChange">
      <el-radio-button :label="7">近7天</el-radio-button>
      <el-radio-button :label="30">近30天</el-radio-button>
    </el-radio-group>
    <div class="traffic-usage-chart" ref="chartRef"></div>
  </div>
</template>

<style lang="scss" scoped>
.traffic-usage {
  &-chart {
    height: 350px;
    width: 100%;
  }
}
</style>
