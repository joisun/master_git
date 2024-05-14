<script>
/**
   * Create by zeter on 2017/8/3
   */
  export default {
    data() {
      return {
        loading: true
      }
    },
    computed: {
      src() {
        return this.$store.state.overall.toolHost
      }
    },
    mounted() {
      setTimeout(() => { this.loading = false }, 2000)
    }
  }
</script>

<template>
  <div class="tools"
    v-loading="loading"
    :element-loading-text="'正在进入'+src">
    <div class="tools__iframe--warp" v-show="!loading">
      <iframe class="tools__iframe" name="mainFrame" id="mainFrame" :src="src"></iframe>
    </div>
  </div>
</template>
