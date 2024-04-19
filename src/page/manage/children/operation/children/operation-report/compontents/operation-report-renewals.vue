<script>
/**
   * Create by zeter on 2018/4/26
   */
  export default {
    props: {
      type: {
        type: String
      },
      times: {
        type: Array
      },
      carrier: {
        type: String
      }
    },
    data() {
      return {
        orgTableData: [],
        typeTableData: [],
        loading: false
      }
    },
    methods: {
      async getData() {
        this.loading = true
        let rst = await this.jaxLib.report.getRenewalData({
          startDate: this.times[0],
          endDate: this.times[1],
          carrier: this.carrier,
          topN: 10
        })
        this.loading = false
        if (!rst.success) return false
        this.orgTableData = rst.data.org
        this.typeTableData = rst.data.volume
        this.loading = false
      }
    },
    mounted() {
      this.getData()
    },
    watch: {
      times() {
        this.getData()
      },
      carrier() {
        this.getData()
      }
    }
  }
</script>

<template>
  <div class="operation-report-recharge wh__card flex1">
    <div class="wh__card--header">
      <span class="wh__card--title">
        <wh-carrier-icon :carrier="carrier">
        </wh-carrier-icon>
        客户续费套餐数据</span>
    </div>
    <div class="wh__card--body" v-loading="loading">
      <div>
        <ul class="operation-report__list--item" :class="{'only-one': type==='date'}">
          <div class="operation-report__list--title">续费规格榜单</div>
          <template v-if="typeTableData.length > 0">
            <li class="operation-report__list--index flex"
              v-for="(item, index) in typeTableData"
              :key="index">
              <span class="order">{{index + 1}}</span>
              <span class="name flex1">{{item.name}}</span>
              <span class="count">{{item.count}}张</span>
            </li>
          </template>
          <div v-else class="tac">暂无数据</div>
        </ul>
        <ul class="operation-report__list--item operation-report__list--long" v-if="type!=='date'">
          <div class="operation-report__list--title">客户榜单</div>
          <template v-if="orgTableData.length > 0">
            <li class="operation-report__list--index flex"
              v-for="(item, index) in orgTableData"
              :key="index">
              <span class="order">{{index + 1}}</span>
              <span class="name flex1">{{item.name}}</span>
              <span class="count">{{item.count}}张</span>
            </li>
          </template>
          <div v-else class="tac">暂无数据</div>
        </ul>
      </div>
    </div>
  </div>
</template>
