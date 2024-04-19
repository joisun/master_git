<script>
  export default {
    data() {
      return {}
    }
  }
</script>

<template>
  <div class="wh-data">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
