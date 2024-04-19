<template>
  <div class="flex1 card-manage__detail--item import"
       :class="{'active': stage > 6, 'prior': stage === 6, 'over': stage < 6}">
    <div class="card-manage__detail--title">使用</div>
    <template  v-if="stage > 5">
      <p>
        <span class="card-manage__detail--key">当前卡状态</span>
        <span v-if="item.runningCardInfoVO.retainNumber">已停卡（停机保号）</span>
        <span v-else class="card-manage__detail--value">{{item.runningCardInfoVO.status | cardStatusFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">当前卡设备状态</span>
        <span class="card-manage__detail--value">{{item.runningCardInfoVO.deviceStatus | deviceStatusFilter}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">当前套餐开始时间</span>
        <span class="card-manage__detail--value" v-if="item.runningCardInfoVO.currentRatePlan">
          {{item.runningCardInfoVO.currentRatePlan.effectiveDate | dateFilter}}
        </span>
      </p>
      <p>
        <span class="card-manage__detail--key">当前套餐结束时间</span>
        <span class="card-manage__detail--value" v-if="item.runningCardInfoVO.currentRatePlan">
          {{item.runningCardInfoVO.currentRatePlan.expirationDate | dateFilter}}
        </span>
      </p>
      <p>
        <span class="card-manage__detail--key">当前套餐使用量</span>
        <span class="card-manage__detail--value" v-if="item.runningCardInfoVO.currentRatePlan">
          {{item.runningCardInfoVO.currentRatePlan.usageDataVolume | volumeFilter}}
        </span>
      </p>
      <p>
        <span class="card-manage__detail--key">当前套餐</span>
        <span class="card-manage__detail--value" v-if="item.runningCardInfoVO.currentRatePlan">
              <span v-tag-extract="{
              volume: item.runningCardInfoVO.currentRatePlan.baseTotalDataVolume,
              validity: item.runningCardInfoVO.currentRatePlan.validity,
              validityUnit: item.runningCardInfoVO.currentRatePlan.validityUnit,
              useCountAsVolume: item.runningCardInfoVO.currentRatePlan.useCountAsVolume,
              offerType: item.runningCardInfoVO.currentRatePlan.offerType
              }"></span>
              ({{item.runningCardInfoVO.currentRatePlan.priceOfferId}})
        </span>
      </p>
      <p v-if="item.runningCardInfoVO.isAclPolicyApp && item.runningCardInfoVO.aclSwitchers && item.runningCardInfoVO.aclSwitchers[0]">
        <span class="card-manage__detail--key">子套餐A</span>
        <span class="card-manage__detail--value">
          <template v-if="item.useCountAsVolume">
            {{item.runningCardInfoVO.aclSwitchers[0].policyName}}-{{item.runningCardInfoVO.aclSwitchers[0].volumeThreshold}}次
          </template>
          <template v-else>
            {{item.runningCardInfoVO.aclSwitchers[0].policyName}}-{{item.runningCardInfoVO.aclSwitchers[0].volumeThreshold | volumeFilter}}
          </template>
        </span>
      </p>
      <p  v-if="item.runningCardInfoVO.isAclPolicyApp && item.runningCardInfoVO.aclSwitchers && item.runningCardInfoVO.aclSwitchers[1]">
        <span class="card-manage__detail--key">子套餐B规格</span>
        <span class="card-manage__detail--value">
          <template v-if="item.useCountAsVolume">
            {{item.runningCardInfoVO.aclSwitchers[1].policyName}}-{{item.runningCardInfoVO.aclSwitchers[1].volumeThreshold}}次
          </template>
          <template v-else>
            {{item.runningCardInfoVO.aclSwitchers[1].policyName}}-{{item.runningCardInfoVO.aclSwitchers[1].volumeThreshold | volumeFilter}}
          </template>
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
