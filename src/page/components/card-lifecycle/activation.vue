<template>
  <div class="flex1 card-manage__detail--item import" :class="{'active': stage > 6, 'prior': stage === 6, 'over': stage < 6}">
    <div class="card-manage__detail--title">激活</div>
    <template  v-if="stage > 5">
      <p>
        <span class="card-manage__detail--key">客户侧激活时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.startDate | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">供应商侧激活时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.dateActivated | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">首次激活套餐</span>
        <span class="card-manage__detail--value" v-if="item.runningCardInfoVO.firstRatePlan">
          <span v-tag-extract="{
                volume: item.runningCardInfoVO.firstRatePlan.baseTotalDataVolume,
                validity: item.runningCardInfoVO.firstRatePlan.validity,
                validityUnit: item.runningCardInfoVO.firstRatePlan.validityUnit,
                useCountAsVolume: item.runningCardInfoVO.firstRatePlan.useCountAsVolume,
                offerType: item.runningCardInfoVO.firstRatePlan.offerType
              }"></span>
          ({{item.runningCardInfoVO.firstRatePlan.priceOfferId}})
        </span>

      </p>
      <p>
        <span class="card-manage__detail--key">网络状态</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.gprsStatus | gprsStatusFilter}}</span>
      </p>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      stage: {
        type: Number
      },
      content: {
        default: {}
      },
      item: {
        default: {}
      }
    }
  }
</script>
