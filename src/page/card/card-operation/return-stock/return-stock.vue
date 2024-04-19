<script>
  /**
   * Create by zeter on 2020/2/3
   */
  export default {
    name: 'return-stock',
    data() {
      return {}
    }
  }
</script>

<template>
    <div class="return-stock">
      <transition name="fade" mode="out-in">
        <router-view>
        </router-view>
      </transition>
    </div>
</template>

