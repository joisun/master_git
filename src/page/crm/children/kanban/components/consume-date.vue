<script>
  import echarts from 'echarts'
  import apis from '@/api/ajax'
  import { mapState } from 'vuex'

  function getEchartsOptions(data) {
    return {
      xAxis: {
        type: 'category',
        data: data.map(item => item.day)
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['购卡金额', '续费金额']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '购卡金额',
          data: data.map(item => item.avgBuyMoney.toFixed(2)),
          type: 'line'
        },
        {
          name: '续费金额',
          data: data.map(item => item.avgRechargeMoney.toFixed(2)),
          type: 'line'
        }
      ]
    }
  }

  export default {
    props: {
      saleId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        month: 6,
        ranks: []
      }
    },
    watch: {
      saleId() {
        this.getAverageDaily()
      }
    },
    computed: {
      ...mapState({
        customerRank: state => state.overall.crmEnum.customerRank
      })
    },
    mounted() {
      this.getAverageDaily()
    },
    methods: {
      async getAverageDaily() {
        const { success, data } = await apis.crm.customerReportAverageDaily({
          saleId: this.saleId,
          calDimension: this.month,
          ranks: this.ranks.join(',')
        })
        if (!success) {
          return false
        }
        const myChart = echarts.init(document.getElementById('chart'))
        myChart.setOption(getEchartsOptions(data || []))
      }
    }
  }
</script>

<template>
  <div class="consume-date">
    <el-select v-model="month" @change="getAverageDaily">
      <el-option :value="1" label="1个月">1个月</el-option>
      <el-option :value="3" label="3个月">3个月</el-option>
      <el-option :value="6" label="6个月">6个月</el-option>
      <el-option :value="12" label="12个月">12个月</el-option>
    </el-select>
    <el-select v-model="ranks" multiple @change="getAverageDaily" clearable placeholder="选择客户等级">
      <el-option v-for="item in customerRank" :key="item.id" :label="item.id" :value="item.id">{{item.id}}</el-option>
    </el-select>
    <div id="chart"></div>
  </div>
</template>

<style lang="scss">
  .consume-date {
    #chart {
      height: 400px;
    }
  }
</style>
