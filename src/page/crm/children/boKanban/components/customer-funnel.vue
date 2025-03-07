<script>
import echarts from 'echarts'

const dataMap = [
  { name: '总客户数', key: 'totalCustomerCount' },
  { name: '资质认证通过用户数', key: 'licensePassCount' },
  { name: '总计消费客户数', key: 'totallyConsumeCount' },
  { name: '测试卡申请客户数', key: 'applyTestCardCount' },
  { name: '最近消费客户数', key: 'recentlyConsumeCount' }
]

function getEchartsOptions(legendData, seriesData) {
  const totalData = seriesData && seriesData[0] ? seriesData[0].value : 0
  return {
    // color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'].reverse(),
    color: [
      '#dd6b66',
      '#759aa0',
      '#e69d87',
      '#8dc1a9',
      '#ea7e53',
      '#eedd78',
      '#73a373',
      '#73b9bc',
      '#7289ab',
      '#91ca8c',
      '#f49f42'
    ],
    title: {
      text: '',
      subtext: ''
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}'
    },
    legend: {
      orient: 'vertical',
      right: '30px',
      top: 'center',
      data: legendData
    },
    series: [
      {
        name: '漏斗图',
        type: 'funnel',
        left: 7,
        top: 15,
        bottom: 15,
        width: '75%',
        minSize: '20%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: (obj) => {
            return (
              obj.data.value +
              '，' +
              (totalData ? ((obj.data.value / totalData) * 100).toFixed(2) + '%' : '-')
            )
          }
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: seriesData
      }
    ]
  }
}

export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    baseInfo() {
      this.setCharts()
    }
  },
  methods: {
    setCharts() {
      const legendData = []
      const seriesData = []
      dataMap.forEach((item) => {
        legendData.push(item.name)
        seriesData.push({
          name: item.name,
          value:
            this.baseInfo[item.key] || this.baseInfo[item.key] === 0 ? this.baseInfo[item.key] : 0
        })
      })
      const myChart = echarts.init(document.getElementById('funnel'))
      myChart.setOption(getEchartsOptions(legendData, seriesData))
    }
  }
}
</script>

<template>
  <div class="customer-funnel">
    <div id="funnel"></div>
  </div>
</template>

<style lang="scss">
.customer-funnel {
  #funnel {
    height: 500px;
  }
}
</style>
