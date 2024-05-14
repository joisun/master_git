<script>
export default {
  name: 'inventory-reservation'
}
</script>

<template>
  <div class="inventory-reservation">
    <div class="wh__warp">
      <transition name="fade" mode="out-in"> <router-view /> </transition>
    </div>
  </div>
</template>
