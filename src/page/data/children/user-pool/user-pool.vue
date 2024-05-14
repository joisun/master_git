<template>
  <div class="user-pool">
    <transition name="fade" mode="out-in">
      <keep-alive include="user-pool-show">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'user-pool'
  }
</script>
