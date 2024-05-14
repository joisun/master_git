<template>
  <div class="flex1 card-manage__detail--item import"
    :class="{'active': stage > 2, 'prior': stage === 2, 'over': stage < 2}">
    <div class="card-manage__detail--title">{{content.status === 'locked' ? '库存(锁卡)' : '库存'}}</div>
    <div  v-if="stage > 1">
      <p>
        <span class="card-manage__detail--key">库存档位</span>
        <span class="card-manage__detail--value" v-tag-extract="{
          volume: item.totalDataVolume,
          validity: item.validity,
          validityUnit: item.validityUnit,
          ratePlanType: item.type,
          useCountAsVolume: item.useCountAsVolume
        }">
        </span>
      </p>
      <p>
        <span class="card-manage__detail--key">卡类型</span>
        <span class="card-manage__detail--value">{{content.typeName}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">MSISDN</span>
        <span class="card-manage__detail--value">{{item.msisdn}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">IMSI</span>
        <span class="card-manage__detail--value">{{item.imsi}}</span>
      </p>
      <p>
        <span class="card-manage__detail--key">IP</span>
        <span class="card-manage__detail--value">{{item.ip}}</span>
      </p>
    </div>
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
