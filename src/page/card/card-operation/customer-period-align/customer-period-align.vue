<script>
export default {
  name: 'customer-period-align',
  data() {
    return {}
  }
}
</script>

<template>
  <div class="customer-period-align">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

