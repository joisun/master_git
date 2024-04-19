<template>
  <div class="wh-manage-order">
    <transition name="fade" mode="out-in">
      <keep-alive include="order-list">
        <router-view>
        </router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'order'
  }
</script>
