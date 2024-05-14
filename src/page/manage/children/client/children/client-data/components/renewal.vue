<script>
/**
 * Create by zeter on 2019-09-24
 */
import echarts from 'echarts'
import { planOptionCreate } from '../mixins/const'
import { separateWord } from '../mixins/tool'

export default {
  name: 'Renewal',
  props: {
    orgId: {
      required: false
    }
  },
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      let rst = await this.jaxLib.customer.statisticRenew({
        orgId: this.orgId
      })
      if (!rst.success) return false
      this.draw(rst.data)
      this.loading = false
    },
    draw(data) {
      data.sort((a, b) => a.money - b.money)
      let option = planOptionCreate(separateWord(data), '#f2303e')
      let myChart = echarts.init(document.getElementById('chart-renewal'))
      myChart.setOption(option)
      window.onresize = () => myChart.resize()
    }
  }
}
</script>

<template>
  <div class="renewal">
    <el-card class="box-card">
      <div slot="header">
        <span>续费数据</span>
      </div>
      <div id="chart-renewal" v-loading="loading" class="chart"></div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.renewal {
  .el-card {
    height: 100%;
  }
  .chart {
    min-height: 300px;
  }
}
</style>

