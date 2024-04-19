<script>
/**
 * Create by zeter on 2018/1/22
 */
export default {
  data() {
    return {}
  }
}
</script>

<template>
  <div class="inventory-manage">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view> </router-view>
      </keep-alive>
    </transition>
  </div>
</template>
