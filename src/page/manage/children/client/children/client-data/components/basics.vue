<script>
/**
 * Create by zeter on 2019-09-24
 */
import echarts from 'echarts'
import { baseLineOptionCreate } from '../mixins/const'
import { calcMonth } from '../mixins/tool'

export default {
  name: 'Basics',
  props: {
    orgId: {
      required: true
    }
  },
  data() {
    return {
      graphLoading: true
    }
  },
  mounted() {
    this.getLine()
  },
  methods: {
    async getLine() {
      let rst = await this.jaxLib.customer.summaryChart({
        orgId: this.orgId
      })
      if (!rst.success) return false
      this.graphLoading = false
      this.draw(rst.data)
    },
    draw({ renew, buyCard }) {
      let data = calcMonth(renew, buyCard)
      let option = baseLineOptionCreate(data)
      let myChart = echarts.init(document.getElementById('line'))
      myChart.setOption(option)
      window.onresize = () => myChart.resize()
    }
  }
}
</script>

<template>
  <div class="basics">
    <el-card class="box-card">
      <div slot="header">
        <span>概况</span>
      </div>
      <div v-loading="graphLoading" class="basics__graph">
        <div id="line"></div>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.basics {
  &__area {
    width: 100%;

    & > div {
      width: 100%;
      height: 100%;
    }
  }

  &__graph {
    width: 100%;
    height: 300px;

    & > div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

