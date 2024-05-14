<script>
  export default {
    props: {
      content: {
        type: Object
      }
    }
  }
</script>

<template>
  <div class="wh__card store-operation-report-detail">
    <div class="wh__card--body">
      <div class="store-operation-report-detail__content flex">
        <div class="store-operation-report-detail__column flex1" v-for="(key, val) in enums.carrier.maps()" :key="val">
          <div class="store-operation-report-detail__title">{{key}}</div>
          <div class="flex row">
            <div class="flex1">
              <p class="title">总卡数</p>
              <p class="value">{{content[val].total}}张</p>
            </div>
            <div class="flex1">
              <p class="title">库存卡卡数</p>
              <p class="value">{{content[val].inventory}}张</p>
            </div>
          </div>
          <div class="flex row">
            <div class="flex1">
              <p class="title">激活卡数</p>
              <p class="value">{{content[val].activated}}张</p>
            </div>
            <div class="flex1">
              <p class="title">停卡卡数</p>
              <p class="value">{{content[val].deactivated}}张</p>
            </div>
          </div>
          <div class="flex row">
            <div class="flex1">
              <p class="title">测试期卡数</p>
              <p class="value">{{content[val].testing}}张</p>
            </div>
            <div class="flex1">
              <p class="title">销卡卡数</p>
              <p class="value">{{content[val].retired}}张</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .store-operation-report-detail {
    &__title {
      text-align: left;
      font-weight: 700;
    }
    .row {
      margin-bottom: 20px;
      padding-left: 15px;
      .title {
        color: #666;
      }
      .value {
        font-size: 16px;
      }
    }
  }
</style>
