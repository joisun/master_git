<script>
/**
   * Create by zeter on 2019-06-04
   */
  import { wechatConfig } from '../../../mixins/const'

  export default {
    name: 'config-dialog',
    props: {
      dialogName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        wechatConfig
      }
    }
  }
</script>

<template>
  <div class="config-dialog">
    <div class="wh__dialog--body">
      <div v-for="item of wechatConfig">
        <span>{{item.name}}</span>:
        <span>{{item.key}}</span>
      </div>
    </div>
    <div class="wh__dialog--footer">
      <el-button @click="$emit('closeDialog', dialogName)" type="primary">
        确认
      </el-button>
    </div>
  </div>
</template>
