<script>
export default {
  props: {
    columns: {
      type: Array,
      required: false,
      default: () => []
    }
  }
}
</script>

<template>
  <el-radio-group v-bind="$props" v-on="$listeners">
    <el-radio v-for="item in columns" :key="item.value" :label="item.label" />
  </el-radio-group>
</template>
