<template>
  <div class="wh-manage-client">
    <transition name="fade" mode="out-in">
      <keep-alive include="client-list">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'client'
  }
</script>
