<script>
  export default {}
</script>

<template>
  <transition name="fade" mode="out-in">
    <keep-alive include="cpe-stock-list">
      <router-view></router-view>
    </keep-alive>
  </transition>
</template>
