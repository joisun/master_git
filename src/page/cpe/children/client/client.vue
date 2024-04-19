<script>
export default {}
</script>

<template>
  <transition name="fade" mode="out-in">
    <keep-alive include="CpeClientList">
      <router-view></router-view>
    </keep-alive>
  </transition>
</template>
