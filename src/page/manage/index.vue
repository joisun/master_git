<template>
  <div class="wh-manage">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'manage'
  }
</script>

<style lang="scss" scoped>
.wh-manage {
  height: 100%;
}
</style>
