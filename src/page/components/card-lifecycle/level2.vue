<template>
  <div class="flex1 card-manage__detail--item import" :class="{'active': stage > 5, 'prior': stage === 5, 'over': stage < 5}">
    <div class="card-manage__detail--title">沉默期</div>
    <template  v-if="stage > 4">
      <p>
        <span class="card-manage__detail--key">运营商开始时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.carrierSilenceStart | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">运营商预计结束时间</span>
        <span class="card-manage__detail--value">{{item.activationDeadline | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">运营商实际结束时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.carrierSilenceExpire | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">客户侧开始时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.quietPeriodStartDate | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">客户侧预期结束时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.expectSilenceExpireDate | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">客户侧实际结束时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.quietPeriodEndDate | dateFilter}}</span>
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
