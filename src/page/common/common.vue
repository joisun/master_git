<script>
  /**
   * Create by zeter on 2020/1/2
   */
  export default {
    name: 'common',
    data() {
      return {}
    }
  }
</script>

<template>
    <div class="common">
      <transition name="fade" mode="out-in">
        <router-view>
        </router-view>
      </transition>
    </div>
</template>

