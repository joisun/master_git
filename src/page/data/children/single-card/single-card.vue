<template>
  <div class="single-card">
    <keep-alive include="single-card-show">
      <router-view>
      </router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'single-card'
  }
</script>
