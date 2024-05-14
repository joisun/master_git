<script>
  /**
   * Create by zeter on 2019/11/19
   */
  import ajax from '@/api/ajax'
  import * as types from '@/store/types'
  import CrmEnums from '@/constant/enums/crm-enum'
  import IndustryEnums from '@/constant/enums/industry-enum'
  export default {
    name: 'crm',
    data() {
      return {
        loading: true,
      }
    },
    methods: {
      async enumsSearch() {
        if (CrmEnums.checkEnums()) return
        let rst = await ajax.crm.enumSearch()
        if(!rst.success) return
        await CrmEnums.setEnums(rst.data)
        await this.$store.dispatch(types.CRM_ENUM)
      },
      async industryGet() {
        if (IndustryEnums.checkEnums()) return
        await this.$store.dispatch(types.CRM_INDUSTRY)
      }
    },
    async mounted() {
      this.loading = true
      await Promise.all([this.enumsSearch(), this.industryGet()])
      this.loading = false
    }
  }
</script>

<template>
  <div class="crm" v-if="!loading">
    <router-view></router-view>
  </div>
</template>

