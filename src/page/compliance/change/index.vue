<script>
export default {
  name: 'compliance-change-index'
}
</script>

<template>
  <div class="compliance">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">合规变更</h2>
      </div>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
