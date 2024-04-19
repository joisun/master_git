<template>
  <div class="cancel-plan">
    <transition name="fade" mode="out-in">
      <router-view>
      </router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'cancel-plan'
  }
</script>
