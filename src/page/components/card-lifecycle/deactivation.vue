<template>
  <div class="flex1 card-manage__detail--item import" :class="{'active': stage > 7, 'prior': stage === 7, 'over': stage < 7}">
    <div class="card-manage__detail--title">停卡</div>
    <template  v-if="stage > 6">
      <p>
        <span class="card-manage__detail--key">停卡时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.lastDeactivatedDate | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">停卡原因</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.lastDeactivatedReason}}</span>
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
