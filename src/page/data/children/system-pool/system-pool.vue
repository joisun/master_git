<template>
  <div class="user-pool">
    <keep-alive include="system-pool-show">
      <router-view> </router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'system-pool'
}
</script>

