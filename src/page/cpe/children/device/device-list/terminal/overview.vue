<script>
import moment from 'moment'
import apis from '@/api/ironman-api'
import echarts from 'echarts'

function getEchartsOptions(data) {
  const yDataMap = {}
  let countData = []
  let followCountData = []
  let avgData = []
  let lossData = []
  data.map(item => {
    yDataMap[item.time] = item
  })


  let xData = []
  const xInterval = 10
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < (60 / xInterval); j++) {
      let hour = i < 10 ? `0${i}` : i
      let minute = (j * xInterval) < 10 ? `0${j * xInterval}` : (j * xInterval)
      const x = `${hour}:${minute}`
      xData.push(x)
      if (yDataMap[x]) {
        const { count, followCount, avg, loss } = yDataMap[x]
        countData.push(count)
        followCountData.push(followCount)
        avgData.push(avg)
        lossData.push(loss)
      } else {
        countData.push(0)
        followCountData.push(0)
        avgData.push(0)
        lossData.push(0)
      }
    }
  }

  return {
    color: [ '#f38181', '#aa96da', '#b83b5e', '#393e46' ],
    xAxis: {
      name: '时间',
      type: 'category',
      data: xData
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const unit = {
          '终端连接数': '',
          '星标终端连接数': '',
          '终端平均时延': 'ms',
          '丢包率': '%'
        }
        let relVal = params[0].name
        for (let i = 0; i < params.length; i++) {
          relVal += '<div class="circle" ><span style="background:' + params[i].color + '"></span>' +
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
      data: ['终端连接数', '星标终端连接数', '终端平均时延', '丢包率' ]
    },
    grid: {
      left: 60,
      bottom: 20,
      right: 160
    },
    yAxis: [
      {
        name: '连接数',
        type: 'value',
        minInterval: 1,
        nameTextStyle: {
          lineHeight: 56
        }
      },
      {
        name: '终端平均时延',
        type: 'value',
        nameTextStyle: {
          lineHeight: 56
        }
      },
      {
        name: '丢包率（%）',
        type: 'value',
        max: 100,
        min: 0,
        position: 'right',
        offset: 80,
        nameTextStyle: {
          lineHeight: 56
        },
        axisLine: {
          lineStyle: {
            color: '#222831'
          }
        },
      }
    ],
    series: [
      {
        name: '终端连接数',
        data: countData,
        type: 'line'
      },
      {
        name: '星标终端连接数',
        data: followCountData,
        type: 'line'
      },
      {
        name: '终端平均时延',
        data: avgData,
        type: 'line',
        yAxisIndex: 1
      },
      {
        name: '丢包率',
        data: lossData,
        type: 'line',
        yAxisIndex: 2
      }
    ]
  }
}

export default {
  props: {
    parentMacAddr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      date: moment().format('YYYY-MM-DD')
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const { success, data } = await apis.deviceClientData({
        parentMacAddr: this.parentMacAddr,
        date: moment(this.date).format('YYYY-MM-DD')
      })
      if (!success) return false
      this.myChart = echarts.init(this.$refs.chartRef)
      this.myChart.clear()
      this.myChart.setOption(getEchartsOptions(data || []))
    }
  }
}
</script>

<template>
  <div class="cpe-device-terminal-overview">
    <div>
      <el-date-picker v-model="date" placeholder="请选择日期" @change="getData" :clearable="false"></el-date-picker>
    </div>
    <div class="chart" ref="chartRef"></div>
  </div>
</template>

<style lang="scss" scoped>
.cpe-device-terminal-overview {
  width: 100%;
  & .chart {
    height: 500px;
  }
}
</style>

