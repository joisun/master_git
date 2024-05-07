<template>
  <span class="overview-item-span">
    {{ title }}
    <!--    <el-tooltip class="item" effect="dark" :content="tooltip" placement="top">-->
    <!--      <i class="el-icon-question" style="color: #909399" />-->
    <!--    </el-tooltip>-->
    <el-popover v-if="!hideTip" placement="top-start" trigger="hover">
      <div>
        <template v-if="tooltip">{{ tooltip }}</template>
        <slot v-else name="tooltip" />
      </div>
      <i slot="reference" class="el-icon-question" style="color: #909399" />
    </el-popover>
    <br />
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
    },
    hideTip: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" >
.overview-item-span {
  & > span {
    position: static !important;
    flex: none !important;
    border: none !important;
    padding: 0 !important;
    background-color: transparent !important;
    margin: 0 !important;
  }
}
</style>
