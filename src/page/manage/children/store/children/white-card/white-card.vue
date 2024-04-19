<script>
// 查询网络状态，进入别的页面再返回时，列表的状态丢失
// 所以使用keep-alive
export default {
  data() {
    return {}
  }
}
</script>

<template>
  <div class="white-card-manage">
    <transition name="fade" mode="out-in">
      <keep-alive include="store-card-list">
        <router-view> </router-view>
      </keep-alive>
    </transition>
  </div>
</template>
