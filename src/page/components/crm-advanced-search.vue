<script type="text/jsx">
  /**
   * @description
   * 高级搜索 template版本
   */
  export default {
    data () {
      return {
        isAdvancedPanelShow: false
      }
    },
    mounted () {
      let el = this.$el
      let caret = el.querySelector('.advanced-caret')
      let elParent = el.parentNode
      elParent.insertBefore(caret, el)
      let c = window.getComputedStyle(elParent, null)
      let position = c.getPropertyValue('position')
      if (['relative', 'absolute', 'fixed'].indexOf(position) === -1) {
        elParent.style.cssText = `position: relative`
      }
    },
    methods: {
      handleBtnClick() {
        this.isAdvancedPanelShow = false
      }
    }
  }
</script>
<template>
  <div :class="['crm-advanced-search', isAdvancedPanelShow ? 'is-expand' : '']">
    <el-button title="展开搜索更多" size="mini" :class="['advanced-caret', isAdvancedPanelShow ? 'is-open' : '']" @click="isAdvancedPanelShow = !isAdvancedPanelShow">
      <wh-std-icon class="cursor-pointer" sign="&#xe6b0;"></wh-std-icon>
    </el-button>
    <el-collapse-transition>
      <slot :isAdvancedPanelShow="isAdvancedPanelShow"></slot>
    </el-collapse-transition>
  </div>
</template>
<style lang="scss">
  .advanced-caret{
    display: inline-block;
    vertical-align: top;
  }
  .crm-advanced-search{
    position: absolute;
    width: 100%;
    background: white;
    z-index: 10;
    transition: padding 0.2s;
    font-size: 12px;
    margin-top: 10px;
    &.is-expand{
      box-shadow: 10px 10px 15px 0 rgba(0,0,0,0.05);
      padding: 20px;
    }
  }
</style>
