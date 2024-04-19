<template>
  <div class="flex1 card-manage__detail--item import" :class="{'active': stage > 3, 'prior': stage === 3, 'over': stage < 3}">
    <div class="card-manage__detail--title">出库</div>
    <template v-if="stage > 2">
      <p>
        <span class="card-manage__detail--key">出库时间</span>
        <span class="card-manage__detail--value">{{item.exportDate | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">出库操作ID</span>
        <span class="card-manage__detail--value">
          <el-button type="text" @click="$emit('enterRouter', 'store-record-out', {id: item.exportRecordId})">{{item.exportRecordId}}</el-button>
        </span>
      </p>
      <p>
        <span class="card-manage__detail--key">出库套餐</span>
        <span class="card-manage__detail--value" v-if="item.buyCardSpecification">
          <span v-if="item.buyCardSpecification" v-tag-extract="{
            volume: item.buyCardSpecification.volume,
            validity: item.buyCardSpecification.ratePlanType === 'CUSTOM'
              ? item.buyCardSpecification.validity / item.buyCardSpecification.rechargeUnit
              : item.buyCardSpecification.validity,
            validityUnit: item.buyCardSpecification.validityUnit,
            offerType: item.buyCardSpecification.ratePlanType,
            cardPeriod: item.cardPeriod,
            useCountAsVolume: item.useCountAsVolume,
          }"></span>
          ({{item.buyCardSpecification.priceOfferId}})
        </span>
      </p>
      <p>
        <span class="card-manage__detail--key">标签</span>
        <span class="card-manage__detail--value">
          {{item.bcsTagNames ? item.bcsTagNames.join('、') : ''}}
        </span>
      </p>
      <p>
        <span class="card-manage__detail--key">激活宽限期</span>
        <span class="card-manage__detail--value">
          {{item.runningCardInfoVO.activeDuration}}天
        </span>
      </p>
      <p>
        <span class="card-manage__detail--key">测试期</span>
        <span class="card-manage__detail--value">
          {{item.runningCardInfoVO.testingDurationMonth}}月
        </span>
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
