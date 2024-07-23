<template>
  <div id="ota-admin-container" class="ota-admin-container" />
</template>
<script>
import { loadMicroApp } from 'qiankun'
import { ajax } from '@/api/api-tool'
import whImgShow from '@/global/components/wh-preview/wh-preview.js'

export default {
  async beforeRouteLeave(to, from, next) {
    await this.microApp.unmount()
    next()
  },
  data() {
    return {
      name: '',
      microApp: null
    }
  },
  watch: {
    $route(newValue) {
      this.name = newValue.name
    }
  },
  mounted() {
    this.microApp = loadMicroApp({
      name: 'gotham',
      entry: '/ota-admin',
      container: '#ota-admin-container',
      props: {
        ajax,
        whImgShow
      }
    })
  },
  beforeDestroy() {
    // this.microApp.unmount()
  },
  methods: {}
}
</script>
