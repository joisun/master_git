<!--
 * @Author: wushiji
 * @Date: 2021-03-09 17:08:33
 * @Description: 文件上传
 * @LastEditors: wushiji
 * @LastEditTime: 2021-03-10 10:51:30
-->
<template>
  <el-upload
    action="/ajax/common/file/upload"
    v-bind="$attrs"
    :limit="1"
    :on-success="onSuccess"
    class="wh-file-upload"
  >
    <el-button type="primary">点击上传</el-button>
    <slot name="tip"></slot>
  </el-upload>
</template>

<script>
  export default {
    methods: {
      onSuccess(data) {
        if (data && data.data) {
          this.$emit('input', data.data.filePosition)
        }
      }
    }
  }
</script>

<style lang="scss">
  .wh-file-upload {
    .el-upload {
      text-align: left !important;
    }
  }
</style>
