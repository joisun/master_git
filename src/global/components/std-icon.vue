<script type="text/ecmascript-6">
  export default {
    props: {
      // icon序号，如icon实体为 &#xe642; 时，此处应填xe642
      sign: {
        default: ''
      }
    },

    computed: {
      wholeSign() {
        return this.sign.indexOf('&') !== -1 ? this.sign : `&#${this.sign};`
      }
    },

    methods: {
      handleClick(e) { this.$emit('click', e) }
    }
  }
</script>

<template>
  <i
    class="std-icon iconfont"
    v-html="wholeSign"
    @click="handleClick"
  ></i>
</template>
