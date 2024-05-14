<template>
  <div class="plan-transfer">
    <transition name="fade" mode="out-in">
      <router-view> </router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'plan-transfer'
}
</script>
