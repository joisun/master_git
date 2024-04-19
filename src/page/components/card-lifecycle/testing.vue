<template>
  <div class="flex1 card-manage__detail--item import" :class="{'active': stage > 4, 'prior': stage === 4, 'over': stage < 4}">
    <div class="card-manage__detail--title">测试期</div>
    <template  v-if="stage > 3">
      <p>
        <span class="card-manage__detail--key">运营商侧开始时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.carrierTestingStart | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">运营商侧结束时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.carrierTestingExpire | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">客户侧开始时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.testingStartDate | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">客户侧实际结束时间</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.testingEndDate | dateFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">测试期流量</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.testingDataVolume | volumeFilter(true, true)}}</span>
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
