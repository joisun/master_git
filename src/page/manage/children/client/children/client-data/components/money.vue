<script>
/**
 * Create by zeter on 2019-09-24
 */
import echarts from 'echarts'
import { incomeMoneyOptionCreate } from '../mixins/const'
import { separateWord } from '../mixins/tool'

export default {
  name: 'Money',
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
      let rst = await this.jaxLib.customer.statisticIncomeMoney({
        orgId: this.orgId
      })
      if (!rst.success) return false
      this.draw(rst.data)
      this.isLoading = false
    },
    draw(data) {
      let option = incomeMoneyOptionCreate(separateWord(data))
      let myChart = echarts.init(document.getElementById('chart-money'))
      myChart.setOption(option)
      window.onresize = () => myChart.resize()
    }
  }
}
</script>

<template>
  <div class="money">
    <el-card class="box-card">
      <div slot="header">
        <span>权责金额</span>
      </div>
      <div id="chart-money" v-loading="isLoading" class="chart"></div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.money {
  .el-card {
    height: 100%;
  }
  .chart {
    min-height: 300px;
  }
}
</style>
