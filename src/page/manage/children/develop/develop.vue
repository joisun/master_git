<template>
  <div class="wh-manege-develop">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'develop'
  }
</script>
