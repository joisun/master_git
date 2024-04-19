<script>
export default {}
</script>

<template>
  <transition name="fade" mode="out-in">
    <keep-alive include="cpe-alarm">
      <router-view></router-view>
    </keep-alive>
  </transition>
</template>
