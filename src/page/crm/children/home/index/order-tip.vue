<script>
  import apis from '@/api/ajax'

  /**
   * Create by zeter on 2019/12/2
   */
  export default {
    name: 'order-tips',
    data() {
      return {
        data: {}
      }
    },
    methods: {
      enterOrder(status) {
        this.$router.push({
          name: 'order-list',
          query: {status: status}
        })
      },
      async getContent() {
        let {success, data} = await apis.bill.getSaleOrderData()
        if(!success) return false
        this.data = data
      }
    },
    mounted() {
      this.getContent()
    }
  }
</script>

<template>
  <div class="order-tips">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单提醒</span>
      </div>
      <div class="item">
        <div class="flex">
          <div class="flex1">待出库订单</div>
          <el-button class="flex1" type="text" @click="enterOrder('OUTPUTING')">{{data.outputtingCount}}</el-button>
        </div>
      </div>
      <div class="item">
        <div class="flex">
          <div class="flex1">待采购订单</div>
          <el-button class="flex1" type="text" @click="enterOrder('WAITING-PURCHASE')">{{data.waitingPurchaseCount}}</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<style scoped lang="scss">
  .box-card{
    height: 100%;
  }
  .item{
    line-height: 50px;
    border-bottom: 1px #f4f4f4 solid;
  }
</style>


