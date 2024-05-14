<template>
  <li @click="handleClick">
    <span>{{item.value}}</span> -
    <span>{{item.name}}</span>
  </li>
</template>

<script>
/**
   * 远程搜索助手下拉项
   */
  export default {
    name: 'tem-select-item',
    props: {
      item: { type: Object, required: true }
    },
    methods: {
      handleClick() {
        this.$emit('click')
      }
    }
  }
</script>
