<script>
  import echarts from 'echarts'

  export default {
    props: {
      content: {
        type: Object
      }
    },
    data() {
      return {
        total: 0
      }
    },
    mounted() {
      this.renderCanvas()
    },
    watch: {
      content() {
        this.renderCanvas()
      }
    },
    methods: {
      renderCanvas() {
        let inventory = 0
        let activated = 0
        let deactivated = 0
        let testing = 0
        let retired = 0
        this.total = 0
        Object.keys(this.content).forEach(key => {
          const item = this.content[key]
          inventory += item.inventory
          activated += item.activated
          deactivated += item.deactivated
          testing += item.testing
          retired += item.retired
          this.total += item.total
        })
        const totalCountPic = echarts.init(document.getElementById('totalCount'))
        totalCountPic.setOption({
          title: {
            subtext: `总卡数 ${this.total}`,
            x: 'center',
            top: 20
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}张 ({d}%)'
          },
          legend: {
            data: ['库存卡卡数', '激活卡数', '停卡卡数', '测试期卡数', '销卡卡数']
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: inventory, name: '库存卡卡数' },
                { value: activated, name: '激活卡数' },
                { value: deactivated, name: '停卡卡数' },
                { value: testing, name: '测试期卡数' },
                { value: retired, name: '销卡卡数' }
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      }
    }
  }
</script>

<template>
  <div class="store-operation-report-total flex">
    <div class="store-operation-report-total__pic">
      <div id="totalCount" class="operation-report-total__canvas"></div>
    </div>
  </div>
</template>

<style lang="scss">
  .store-operation-report-total {
    &__pic {
      height: 340px !important;
      margin-bottom: 0 !important;
    }
  }
</style>
