<script>
import tabChangeMixins from '@/global/mixins/tab-changes-mixins'

export default {
  mixins: [tabChangeMixins],
  data() {
    return {}
  },
  computed: {
    isDetailPage() {
      return this.$route.name === 'ext-whitelist-update-and-detail'
    }
  }
}
</script>
<template>
  <div class="ext-whitelist">
    <div class="wh__warp">
      <div v-if="!isDetailPage" class="wh__header">
        <h2 class="wh-title">合规变更管理</h2>
      </div>
      <div v-if="!isDetailPage" class="wh__tabs">
        <el-tabs v-model="activeName" @tab-click="changeRoute">
          <el-tab-pane label="我的待办" name="my-todos" lazy />
          <el-tab-pane label="变更列表" name="compliance-change-list" lazy />
          <el-tab-pane label="公网白名单列表" name="ext-whitelist-list" />
          <el-tab-pane label="支持白名单运营商配置" name="ext-whitelist-carrier-config" />
        </el-tabs>
      </div>
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>
