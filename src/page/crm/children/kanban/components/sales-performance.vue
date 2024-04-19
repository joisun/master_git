<script>
import apis from '@/api/ajax'
import moment from 'moment'

export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getSalePerformance()
  },
  methods: {
    async getSalePerformance() {
      const { success, data } = await apis.crm.customerReportSalePerformance({
        queryDate: moment().format('YYYY-MM-DD')
      })
      if (!success) return false
      this.tableData = data || []
    }
  }
}
</script>

<template>
  <div class="sales-performance">
    <div class="flex list-head">
      <div class="flex2">姓名</div>
      <div class="flex2">业绩金额</div>
      <div class="flex1 tac">卡数</div>
    </div>
    <div class="list-content">
      <div v-for="(item, index) in tableData" :key="index" class="flex list-item">
        <div class="flex2">{{ item.ranking }}、{{ item.saleName }}</div>
        <div class="flex2">{{ item.performance }}</div>
        <div class="flex1 tac">{{ item.cardCount }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sales-performance {
  .list-head {
    margin-bottom: 15px;
  }

  .list-content {
    .list-item {
      line-height: 35px;
      color: #444;
      font-size: 16px;
    }

    .list-item:nth-child(1) {
      font-size: 18px;
      margin-bottom: 8px;
      color: #f54545;
    }

    .list-item:nth-child(2) {
      font-size: 17px;
      margin-bottom: 5px;
      color: #ff8547;
    }

    .list-item:nth-child(3) {
      font-size: 16px;
      margin-bottom: 3px;
      color: #ffac38;
    }
  }
}
</style>
