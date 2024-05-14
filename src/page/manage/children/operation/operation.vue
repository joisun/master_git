<template>
  <div class="wh-manage-operation">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'operation'
  }
</script>

<style lang="scss" scoped>
.wh-manage-operation {
  height: 100%;
}
</style>