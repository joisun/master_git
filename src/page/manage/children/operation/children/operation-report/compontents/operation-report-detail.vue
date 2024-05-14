<script>
/**
   * Create by zeter on 2018/4/25
   */
  import { customerColumn, carrierColumn, otherColumn } from '../mixins/const'

  export default {
    props: {
      content: {
        type: Object
      },
      loading: {
        type: Boolean
      },
      carrier: {
        type: String
      }
    },
    data() {
      return {
        customerColumn: customerColumn,
        carrierColumn: carrierColumn,
        otherColumn: otherColumn
      }
    }
  }
</script>

<template>
  <div class="wh__card operation-report-detail">
    <div class="wh__card--header">
      <span class="wh__card--title">
        <wh-carrier-icon :carrier="carrier">
        </wh-carrier-icon>
        {{enums.carrier.get(carrier)}}综合卡量信息
        <span>
          总数: {{content[carrier].totalOut}}张
        </span>
      </span>
    </div>
    <div class="wh__card--body" v-loading="loading">
      <div class="operation-report-detail__content flex">
        <div class="operation-report-detail__column flex1">
          <div class="operation-report-detail__title">客户侧出卡量统计</div>
          <div class="operation-report-detail__item" v-for="item in customerColumn" :key="item.name">
            <span class="operation-report-detail__item--key">{{item.name}}</span>
            <span class="operation-report-detail__item--value">{{content[carrier][item.value]}}</span>
          </div>
        </div>
        <div class="operation-report-detail__column flex1">
          <div class="operation-report-detail__title">运营侧出卡量统计</div>
          <div class="operation-report-detail__item" v-for="item in carrierColumn" :key="item.name">
            <span class="operation-report-detail__item--key">{{item.name}}</span>
            <span class="operation-report-detail__item--value">{{content[carrier][item.value]}}</span>
          </div>
        </div>
        <div class="operation-report-detail__column flex1">
          <div class="operation-report-detail__title">其他卡量统计</div>
          <div class="operation-report-detail__item" v-for="item in otherColumn" :key="item.name" v-if="content[carrier].msMap[item.value]">
            <span class="operation-report-detail__item--key">{{item.name}}</span>
            <span class="operation-report-detail__item--value">{{content[carrier].msMap[item.value]}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
