<template>
  <div id="international-container" class="international-container" />
</template>
<script>
import { loadMicroApp } from 'qiankun'
import { ajax } from '@/api/api-tool'
import whImgShow from '@/global/components/wh-preview/wh-preview.js'
import goSystem from "@/global/function/go-system";

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
      name: 'lady-liberty',
      // entry: '//localhost:8080',
      // entry:
      //   'http://simboss-avatar-lady-liberty-feature-international-simboss-test.test.simboss.com/#/price-manage/price-list',
      entry: '/international',
      container: '#international-container',
      props: {
        ajax,
        whImgShow,
        goSystem
      }
    })
  },
  beforeDestroy() {
    // this.microApp.unmount()
  },
  methods: {}
}
</script>
