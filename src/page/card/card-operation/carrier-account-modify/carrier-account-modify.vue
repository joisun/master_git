<template>
  <div class="carrier-account-modify">
    <transition name="fade" mode="out-in">
      <router-view>
      </router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'carrier-account-modify'
  }
</script>
