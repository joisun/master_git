<script>
export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dataMap: [
        { label: '总客户数', key: 'totalCustomerCount' },
        { label: '充值客户数', key: 'rechargeCustomerCount' },
        { label: '累计消费金额', key: 'totallyConsumeMoney' },
        { label: '本月新增客户', key: 'monthlyIncreaseCount' },
        { label: '新客户消费金额', key: 'monthlyConsumeMoney' }
      ]
    }
  }
}
</script>

<template>
  <div class="base-info flex">
    <div v-for="item in dataMap" :key="item.key" class="item">
      <div class="title">{{ item.label }}</div>
      <div v-if="baseInfo" class="value">
        {{
          baseInfo[item.key] || baseInfo[item.key] === 0
            ? Math.round(baseInfo[item.key] * 100) / 100
            : '-'
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.base-info {
  justify-content: space-between;

  .item {
    width: 200px;
    height: 100px;
    //border: 1px solid #efefef;
    padding: 10px;
    border-radius: 3px;
    .title {
      color: #666;
    }
    .value {
      margin-top: 10px;
      //text-align: center;
      font-size: 20px;
    }
  }
}
</style>
