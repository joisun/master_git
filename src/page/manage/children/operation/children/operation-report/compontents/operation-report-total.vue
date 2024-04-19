<script>
/**
   * Create by zeter on 2018/4/26
   */
  import echarts from 'echarts'

  export default {
    props: {
      content: {
        type: Object
      },
      total: {
        type: Number
      },
      loading: {
        type: Boolean
      }
    },
    data() {
      return {}
    },
    methods: {
      renderCanvas() {
        const totalCountPic = echarts.init(document.getElementById('totalCount'))
        totalCountPic.setOption({
          title: {
            subtext: '出卡量分布',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}张 ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['移动', '联通', '电信']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: this.content.cmcc.totalOut, name: '移动' },
                { value: this.content.unicom.totalOut, name: '联通' },
                { value: this.content.chinanet.totalOut, name: '电信' }
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          color: ['#d48265', '#e6c260', '#91c7ae']
        })
      }
    },
    watch: {
      total() {
        if (this.total) {
          this.$nextTick(() => {
            this.renderCanvas()
          })
        }
      }
    }
  }
</script>

<template>
  <div class="operation-report-total flex" v-loading="loading">
    <div class="operation-report-total__pic" v-if="total">
      <div id="totalCount" class="operation-report-total__canvas"></div>
    </div>
    <div class="operation-report-total__title" :class="{'node-card': !total}">
      三网发卡总量 {{total}}
    </div>
  </div>
</template>
