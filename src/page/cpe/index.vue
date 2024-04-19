<script>
import ajax from '@/api/ajax'
import * as types from '@/store/types'
import CpeEnums from '@/constant/enums/cpe-enum'
export default {
  name: 'CpeIndex',
  async mounted() {
    await this.enumsSearch()
  },
  methods: {
    async enumsSearch() {
      if (CpeEnums.checkEnums()) return
      let rst = await ajax.cpe.getCpeEnumList()
      if (!rst.success) return
      await CpeEnums.setEnums(rst.data)
      await this.$store.dispatch(types.CPE_ENUM)
    }
  }
}
</script>

<template>
  <div class="cpe">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
