<script>
  /**
   * Create by zeter on 2017/12/11
   */
  import costAccountV2 from './components/account-setting-v2/cost-setting'

  export default {
    data() {
      return {
        activeName: 'cost-setting-base'
      }
    },
    components: {
      'cost-setting-account-v2': costAccountV2
    }
  }
</script>

<template>
  <div class="tool-cost">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">账号参数设置</h2>
      </div>
      <div class="wh__body">
        <cost-setting-account-v2></cost-setting-account-v2>
      </div>
    </div>
  </div>
</template>
