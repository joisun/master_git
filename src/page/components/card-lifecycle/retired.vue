<template>
  <div class="flex1 card-manage__detail--item import" :class="{'active': stage > 8, 'prior': stage === 8, 'over': stage < 8}">
    <div class="card-manage__detail--title">销卡</div>
    <template v-if="stage > 7">
      <p>
        <span class="card-manage__detail--key">销卡时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.dateRetired | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">销卡原因</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.retiredReason}}</span>
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
