<template>
  <div class="record-bill">
    <transition name="fade" mode="out-in">
      <router-view>
      </router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'finance-charge'
  }
</script>
