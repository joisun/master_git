<script>
  export default {
    props: {
      content: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<template>
  <div class="store-manage-report-carrier wh__card flex1">
    <div class="wh__card--header">
      <span class="wh__card--title">{{title}}</span>
    </div>
    <div class="wh__card--body">
      <template v-if="content.length > 0">
        <div class="store-manage-report-carrier__item" v-for="(item, index) in content" :key="index">
          <span>{{index + 1}}、</span>
          <span class="store-manage-report-carrier__item--key">{{item.name}}</span>
          <span class="store-manage-report-carrier__item--value">{{item.count}}张</span>
        </div>
      </template>
      <div v-else align="center">暂无数据</div>
    </div>
  </div>
</template>

<style lang="scss">
  .store-manage-report-carrier {
    &__item {
      padding: 0 15px;
      &--value {
        float: right;
      }
    }
  }
</style>
