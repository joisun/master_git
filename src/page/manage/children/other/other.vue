<template>
  <div class="wh-manage-other">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'other'
  }
</script>

<style lang="scss" scoped>
  .wh-manage-other {
    height: 100%;
  }
</style>
