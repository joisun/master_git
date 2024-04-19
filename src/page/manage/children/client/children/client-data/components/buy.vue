<script>
/**
 * Create by zeter on 2019-09-24
 */
import echarts from 'echarts'
import { planOptionCreate } from '../mixins/const'
import { separateWord } from '../mixins/tool'

export default {
  name: 'Buy',
  props: {
    orgId: {
      required: false
    }
  },
  data() {
    return {
      isLoading: true
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.isLoading = true
      let rst = await this.jaxLib.customer.statisticBuyCard({
        orgId: this.orgId
      })
      if (!rst.success) return false
      this.draw(rst.data)
      this.isLoading = false
    },
    draw(data) {
      data.sort((a, b) => a.money - b.money)
      let option = planOptionCreate(separateWord(data), '#39a2ee')
      let myChart = echarts.init(document.getElementById('chart'))
      myChart.setOption(option)
      window.onresize = () => myChart.resize()
    }
  }
}
</script>

<template>
  <div class="buy">
    <el-card class="box-card">
      <div slot="header">
        <span>购卡数据</span>
      </div>
      <div id="chart" v-loading="isLoading" class="chart"></div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.buy {
  .el-card {
    height: 100%;
  }
  .chart {
    min-height: 300px;
  }
}
</style>

