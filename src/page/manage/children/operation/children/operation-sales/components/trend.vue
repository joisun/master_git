<template>
  <!--  <el-tooltip effect="dark" placement="left">-->
  <!--    <template slot="content">-->
  <!--      <slot name="content" />-->
  <!--    </template>-->
  <div v-if="showList.length !== 0" class="trend-wrap">
    <div v-if="showList.includes('yoy')" class="item">
      同比
      <i v-if="yoyRate < 0" class="el-icon-caret-bottom" style="color: #52c41a" />
      <i v-else class="el-icon-caret-top" style="color: #f5222d" />
      {{ yoyRate | rateFilter('0') }}
    </div>
    <div v-if="showList.includes('qoq')" class="item">
      环比
      <i v-if="qoqRate < 0" class="el-icon-caret-bottom" style="color: #52c41a" />
      <i v-else class="el-icon-caret-top" style="color: #f5222d" />
      {{ qoqRate | rateFilter('0') }}
    </div>
  </div>
  <!--  </el-tooltip>-->
</template>
<script>
export default {
  props: {
    current: {
      type: Number,
      default: 0
    },
    yoy: {
      type: Number,
      default: 0
    },
    qoq: {
      type: Number,
      default: 0
    },
    isMoney: {
      type: Boolean,
      default: false
    },
    showList: {
      type: Array,
      default: () => ['yoy', 'qoq']
    }
  },
  computed: {
    formatRatio() {
      return this.isMoney ? 10000 : 1
    },
    yoyRate() {
      return (
        (this.current / this.formatRatio - this.yoy / this.formatRatio) /
        (this.yoy / this.formatRatio || 1)
      )
    },
    qoqRate() {
      return (
        (this.current / this.formatRatio - this.qoq / this.formatRatio) /
        (this.qoq / this.formatRatio || 1)
      )
    }
  }
}
</script>
<style>
.trend-wrap {
  color: #999;
}
</style>
