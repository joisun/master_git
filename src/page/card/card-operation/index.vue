<script>
  export default {
    data() {
      return {}
    }
  }
</script>

<template>
  <div className="card-operation">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view>
        </router-view>
      </keep-alive>
    </transition>
  </div>
</template>
