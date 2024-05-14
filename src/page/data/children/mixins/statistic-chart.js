import echarts from 'echarts'
import dateFormat from '@/global/filters/date-format'

export default {
  methods: {
    drawSystemPoolDetail(data) {
      let myChart = echarts.init(document.getElementById('poolDetail'))
      myChart.setOption(
        {
          color: ['#5793f3', '#d14a61', '#675bba', '#de7a66'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['收入', '实际成本', '毛利', '运营指数']
          },
          xAxis: [
            {
              type: 'category',
              data: data.map(item => item.month),
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额',
              position: 'left',
              axisLabel: {
                formatter: '{value} 元'
              }
            },
            {
              type: 'value',
              name: '运营指数',
              position: 'right',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '收入',
              type: 'bar',
              data: data.map(item => item.income.toFixed(2))
            },
            {
              name: '实际成本',
              type: 'bar',
              data: data.map(item => item.realCost.toFixed(2))
            },
            {
              name: '毛利',
              type: 'bar',
              data: data.map(item => item.grossProfit.toFixed(2))
            },
            {
              name: '运营指数',
              type: 'line',
              yAxisIndex: 1,
              data: data.map(item => (item.expectCost / item.realCost).toFixed(2))
            }
          ]
        })
    },
    drawSingleCardDetail(data) {
      let myChart = echarts.init(document.getElementById('poolDetail'))
      myChart.setOption(
        {
          color: ['#5793f3', '#d14a61', '#675bba'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['收入', '实际成本', '毛利']
          },
          xAxis: [
            {
              type: 'category',
              data: data.map(item => dateFormat(item.month, 'YYYY-MM-DD')),
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额',
              position: 'left',
              axisLabel: {
                formatter: '{value} 元'
              }
            }
          ],
          series: [
            {
              name: '收入',
              type: 'bar',
              data: data.map(item => item.totalIncome.toFixed(2))
            },
            {
              name: '实际成本',
              type: 'bar',
              data: data.map(item => item.realCost.toFixed(2))
            },
            {
              name: '毛利',
              type: 'bar',
              data: data.map(item => (item.totalIncome - item.realCost).toFixed(2))
            }
          ]
        })
    }
  }
}
