<script>
import echarts from 'echarts'
import moment from 'moment'
import apis from '@/api/ironman-api'

function getEchartsOptions(data, startDate, endDate) {
  const yDataMap = {}
  data.map(item => yDataMap[item.date] = item)

  let xData = []
  let yData = []
  if (startDate === endDate) { // 一天的坐标轴间隔一小时
   Array.from({ length: 24 }).forEach((item, index) => {
     xData.push(index < 9 ? `0${index}:00` : `${index}:00`)
     if (yDataMap[startDate]) {
       yData.push(yDataMap[startDate][`hour${index}`])
     } else {
       yData.push(null)
     }
   })
  } else {
    const days = moment(endDate).diff(moment(startDate), 'days')
    for (let i = 0; i <= days; i++) {
      const date = moment(startDate).add(i, 'day').format('YYYY-MM-DD')
      xData.push(date.substring(5))
      if (yDataMap[date]) {
        yData.push(yDataMap[date].totalUsage)
      } else {
        yData.push(null)
      }
    }
  }
  return {
    color: [ '#00b7c2' ],
    xAxis: {
      name: '时间',
      type: 'category',
      data: xData
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const unit = {
          '流量使用量': 'MB'
        }
        let relVal = params[0].name
        for (let i = 0; i < params.length; i++) {
          relVal += '<div class="circle" ><span style="background:' + params[i].color + '"></span>' +
            params[i].seriesName +
            ' : ' +
            ((params[i].value === null || params[i].value === undefined) ? '- ' : params[i].value) +
            unit[params[i].seriesName] +
            '</div>'
        }
        return relVal
      }
    },
    legend: {
      left: 'center',
      data: [ '流量使用量' ]
    },
    grid: {
      left: 60,
      bottom: 30,
      right: 60
    },
    yAxis: [
      {
        name: '流量使用量（MB）',
        type: 'value'
      }
    ],
    series: [
      {
        name: '流量使用量',
        data: yData,
        type: 'bar'
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
    parentMacAddr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      date: [
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const params = {
        macAddr: this.macAddr,
        parentMacAddr: this.parentMacAddr,
        startDate: moment(this.date[0]).format('YYYY-MM-DD'),
        endDate: moment(this.date[1]).format('YYYY-MM-DD')
      }
      const { success, data } = await apis.clientUsageDetail(params)
      this.myChart = echarts.init(this.$refs.chartRef)
      this.myChart.clear()
      success && this.myChart.setOption(getEchartsOptions(data || [], params.startDate, params.endDate))
    }
  }
}
</script>

<template>
  <div class="cpe-terminal-client-flow">
    <div>
      <el-date-picker
        type="daterange"
        v-model="date"
        @change="getData"
        :clearable="false"
      >
      </el-date-picker>
    </div>
    <div class="cpe-terminal-client-flow-chart" ref="chartRef"></div>
  </div>
</template>

<style lang="scss" scoped>
.cpe-terminal-client-flow {
  &-chart {
    width: 100%;
    height: 400px;
  }
}
</style>
