<script>
export default {
  data() {
    return {}
  }
}
</script>

<template>
  <div class="card-export-strategy">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>
