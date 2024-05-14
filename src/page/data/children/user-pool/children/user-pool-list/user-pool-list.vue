<script>
/**
   * Create by zeter on 2019/1/22
   */
  export default {
    name: 'user-pool-list',
    data() {
      return {}
    }
  }
</script>

<template>
  <div class="user-pool-list">
    <keep-alive include="user-pool-detail">
      <router-view>
      </router-view>
    </keep-alive>
  </div>
</template>
