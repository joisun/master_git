<script>
export default {
  name: 'compliance-index'
}
</script>

<template>
  <div class="compliance">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
