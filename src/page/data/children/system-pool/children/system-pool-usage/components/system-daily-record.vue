<script>
/**
   * Create by zeter on 2017/12/18
   */
  import echarts from 'echarts'
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import volumeFormat from '@/global/filters/volume-format'

  export default {
    mixins: [DialogMixin],
    props: {
      startDay: {
        required: true
      },
      endDay: {
        required: true
      },
      poolId: {
        required: true,
        type: [Number, String]
      }
    },
    data() {
      return {}
    },
    methods: {
      drawDetail(data) {
        let myChart = echarts.init(document.getElementById('dailyRecord'))
        myChart.setOption(
          {
            title: {
              text: '本月每日流量消耗详情'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: (e) => `${e[0].axisValueLabel}<br>${volumeFormat(e[0].data)}`
            },
            xAxis: [
              {
                type: 'category',
                data: data.map(i => i.day),
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                axisLabel: {
                  formatter: (value, index) => volumeFormat(value)
                }
              }
            ],
            series: [
              {
                name: '当日流量消耗',
                type: 'bar',
                barWidth: '60%',
                data: data.map(i => i.usage),
                label: {
                  normal: {
                    formatter: '{b}: {c}'
                  }
                }
              }
            ]
          })
      },
      async open() {
        let rst = await this.jaxLib.pool.dailyVolume({
          startDay: this.startDay,
          endDay: this.endDay,
          poolId: this.$route.query.id
        })
        if (!rst.success) return false
        let dataList = rst.data.list.map(e => ({ day: e.day, usage: (e.usage / 1024).toFixed(3) }))
        this.drawDetail(dataList)
      }
    }
  }
</script>

<template>
  <div>
    <div id="dailyRecord" style="width: 100%;height: 400px;">

    </div>
  </div>
</template>
