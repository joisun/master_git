<script>
  /**
   * Create by zeter on 2019/12/2
   */
  import RenewTip from './renew-tip.vue'
  import OrderTip from './order-tip.vue'
  import FollowRecord from './follow-record.vue'
  import Notice from './notice.vue'
  import apis from '@/api/ajax'

  export default {
    name: 'home-index',
    data() {
      return {
        sellerList: []
      }
    },
    created() {
      this.getSubordinates()
    },
    computed: {
      user() {
        return this.$store.state.overall.user
      }
    },
    components: {
      'follow-record': FollowRecord,
      'order-tip': OrderTip,
      'renew-tip': RenewTip,
      'notice': Notice
    },
    methods: {
      async getSubordinates() {
        const { success, data } = await apis.crm.getSubordinates()
        if (!success) {
          return false
        }
        this.sellerList = data
      }
    }
  }
</script>

<template>
  <div class="home">
    <div class="wh__warp">
      <div class="flex over-page">
        <div class="flex3">
          <follow-record v-if="sellerList.length" :seller-list="sellerList"></follow-record>
        </div>
        <div class="flex1 flex flex-column">
          <notice class="flex1"></notice>
          <renew-tip class="flex1" :seller-list="sellerList"></renew-tip>
          <order-tip class="flex1"></order-tip>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
</style>
