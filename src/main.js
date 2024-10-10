import Vue from 'vue'
import Element from 'element-ui'
import Router from 'vue-router'
import Resource from 'vue-resource'

import tools from './global/function/interface-tool'
import * as plugins from './plugins'
import './global/index'
import api from '@/api/ajax'
import store from './store'
import enums from '@/constant/enums'
import Vlf from 'vlf'
import localforage from 'localforage'
import { commonMessageConfig } from './plugins'
import { getAuthAndAddRoutes } from './permission'
import App from "@/page/app.vue";

console.log('🎸 DEBUG_18 main.js 👉', window.location.protocol)
if (window.location.protocol !== 'https:') {
  window.location.href = 'https://' + window.location.hostname + window.location.pathname + window.location.search;
}

Vue.use(Router)
Vue.mixin(tools)
Element.Dialog.props.closeOnClickModal.default = false
Element.Select.props.filterable = {
  type: Boolean,
  default: true
}
Vue.use(Element, {
  size: 'small'
})
const Message = Element.Message
const $message = (options) => {
  return Message({
    ...commonMessageConfig(options.type),
    ...options
  })
}

//重写一遍success的方法,将offset写入options
;['success', 'warning', 'info', 'error'].forEach((type) => {
  $message[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        ...commonMessageConfig(type),
        message: options
      }
    }
    options.type = type
    return Message({
      ...commonMessageConfig(options.type),
      ...options
    })
  }
})
//将$message挂载到this上
Vue.prototype.$message = $message

// eslint-disable-next-line no-unused-vars
for (let p of [
  Resource,
  plugins.shortCutPlugin,
  plugins.ajaxPlugin,
  plugins.msgDialogPlugin,
  plugins.confirmPlugin,
  plugins.notifyPlugin,
  plugins.variablePlugin,
  plugins.storagePlugin
]) {
  Vue.use(p)
}

Vue.use(Vlf, localforage)

// 热重载配置
if (module.hot) {
  module.hot.accept()
}

function initApp(router) {
  return new Vue({
    // el: '#app',
    router,
    store
  }).$mount("#app");
}

function initEnum() {
  return new Promise((resolve) => {
    api.common.getEnum().then((resp) => {
      if (!resp) return
      const finalEnums = {
        ...resp.data,
        platformTypes: {
          cmcc: {
            name: '移动',
            value: 'cmcc',
            platforms: ['PBOSS', 'CTBOSS', '5G', 'NB', 'INTERNATION']
          },
          unicom: {
            name: '联通',
            value: 'unicom',
            platforms: ['Jasper', '5G', 'NB', 'INTERNATION']
          },
          chinanet: {
            name: '电信',
            value: 'chinanet',
            platforms: ['CMP', 'DCP', '5G', 'NB', 'INTERNATION']
          }
        }
      }
      store.commit('setEnum', finalEnums) // 原来存了一份到store，保持不变
      enums.install(finalEnums)
      resolve(true)
    })
  })
}

initEnum().then(getAuthAndAddRoutes).then(initApp)
