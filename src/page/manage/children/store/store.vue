<template>
  <div class="wh-manage-store">
    <transition name="fade" mode="out-in">
      <router-view>
      </router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'store'
  }
</script>
