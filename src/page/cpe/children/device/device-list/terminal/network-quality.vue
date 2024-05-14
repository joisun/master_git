<script>
import echarts from 'echarts'
import moment from 'moment'
import apis from '@/api/ironman-api'

function getEchartsOptions(data) {
  const yDataMap = {}
  let downRateData = []
  let upRateData = []
  let avgData = []
  let lossData = []
  let markLanArea = []
  let markWifiArea = []
  const markWifiStyle = { itemStyle: { color: 'rgba(252, 252, 247, 0.8)' }, label: { color: '#999' } }
  const markLanStyle = { itemStyle: { color: 'rgba(221, 221, 221, 0.8)' }, label: { color: '#888' } }
  data.map(item => yDataMap[item.time] = item)

  let xData = []
  let markType = ''
  let startMark = ''
  let tmpEndMark = '' // 用来记录临时的标记结束标记，防止一直到结束没标记
  const xInterval = 5
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < (60 / xInterval); j++) {
      let hour = i < 10 ? `0${i}` : i
      let minute = (j * xInterval) < 10 ? `0${j * xInterval}` : (j * xInterval)
      const x = `${hour}:${minute}`
      xData.push(x)
      if (yDataMap[x]) {
        const { downRate, upRate, avg, loss } = yDataMap[x]
        downRateData.push(downRate ? downRate.toFixed(2) : downRate)
        upRateData.push(upRate ? upRate.toFixed(2) : upRate)
        avgData.push(avg)
        lossData.push(loss)
        if (startMark && yDataMap[x].linkType !== markType) {
          if (markType === 'LAN') {
            markLanArea.push([
              { name: 'LAN', xAxis: startMark, ...markLanStyle },
              { xAxis: x }
            ])
          } else {
            markWifiArea.push([
              { name: 'WiFi', xAxis: startMark, ...markWifiStyle },
              { xAxis: x }
            ])
          }
          markType = yDataMap[x].linkType
          startMark = x
          tmpEndMark = ''
        } else if (!startMark && yDataMap[x].linkType !== markType) {
          startMark = x
          markType = yDataMap[x].linkType
        }
        if (startMark && yDataMap[x].linkType === markType) {
          tmpEndMark = x
        }
      } else {
        downRateData.push(null)
        upRateData.push(null)
        avgData.push(null)
        lossData.push(null)
      }
    }
  }

  if (startMark && tmpEndMark) { // 一直到结尾全部是LAN的添加标记
    if (markType === 'LAN') {
      markLanArea.push([
        { name: 'LAN', xAxis: startMark, ...markLanStyle },
        { xAxis: tmpEndMark }
      ])
    } else {
      markWifiArea.push([
        { name: 'WiFi', xAxis: startMark, ...markWifiStyle },
        { xAxis: tmpEndMark }
      ])
    }
  }
  return {
    color: [ '#00b7c2', '#b83b5e', '#baa15e', '#393e46' ],
    xAxis: {
      name: '时间',
      type: 'category',
      data: xData
    },
    dataZoom: {
      show: true
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const unit = {
          '终端时延': 'ms',
          '上行网速': 'KB/s',
          '下行网速': 'KB/s',
          '丢包率': '%'
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
      data: [ '终端时延', '丢包率', '上行网速', '下行网速' ]
    },
    grid: {
      left: 60,
      bottom: 70,
      right: 160
    },
    yAxis: [
      {
        name: '终端时延（ms）',
        type: 'value',
        minInterval: 1,
        nameTextStyle: {
          lineHeight: 56
        }
      },
      {
        name: '终端网速（KB/s）',
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
        offset: 100,
        nameTextStyle: {
          lineHeight: 56
        },
        axisLine: {
          lineStyle: {
            color: '#222831'
          }
        }
      }
    ],
    series: [
      {
        name: '终端时延',
        data: avgData,
        type: 'line',
        markArea: {
          data: [...markLanArea, ...markWifiArea]
        }
      },
      {
        name: '上行网速',
        data: upRateData,
        type: 'line',
        yAxisIndex: 1
      },
      {
        name: '下行网速',
        data: downRateData,
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
      date: moment().format('YYYY-MM-DD')
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const { success, data } = await apis.deviceClientDetail({
        parentMacAddr: this.parentMacAddr,
        macAddr: this.macAddr,
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
  <div class="cpe-terminal-network-quality">
    <div>
      <el-date-picker v-model="date" placeholder="请选择日期" @change="getData" :clearable="false"></el-date-picker>
    </div>
    <div class="cpe-terminal-network-quality-chart" ref="chartRef"></div>
  </div>
</template>

<style lang="scss">
.cpe-terminal-network-quality {
  padding: 15px;
  border: 1px solid #efefef;

  &-chart {
    width: 100%;
    height: 400px;
  }
}
</style>
