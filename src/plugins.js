/**
 * Created by gzj on 17/2/6.
 */

import ajaxHelpers from './api/ajax'
import { Message, MessageBox, Notification } from 'element-ui'
import carrier from './collect/carrier-map'
import plan from './collect/plan-map'
import specifiction from './collect/specification-map'
export const commonMessageConfig = (type) => {
  const durationByMessageType = {
    success: 2000,
    error: 3000,
    warning: 2000,
    info: 2000
  }
  return {
    duration: durationByMessageType[type] || 2000,
    showClose: true,
    offset: 70
  }
}
// 快捷方式服务插件
export const shortCutPlugin = {
  install(Vue, options) {
    Object.defineProperty(Vue.prototype, 'shortcuts', {
      configurable: false,
      value: {},
      writable: false
    })
    Object.defineProperty(Vue, 'shortcuts', {
      configurable: false,
      value: {},
      writable: false
    })

    /**
     * options选项：
     *      {
     *          global: <boolean: 是否设置为Vue全局属性，默认false>，
     *          local: <boolean: 是否设置为实例属性，默认为true>,
     *      }
     */
    Vue.installShortCut = (name, val, options) => {
      options = Object.assign(
        {
          global: false,
          local: true
        },
        options
      )

      if (options.global) {
        if (Vue.shortcuts.hasOwnProperty(name)) {
          throw new Error(`实例快捷方式${name}已经存在，请勿重复设置`)
        } else {
          Object.defineProperty(Vue.shortcuts, name, {
            configurable: false,
            value: val,
            writable: false
          })
        }
      }

      if (options.local) {
        if (Vue.prototype.shortcuts.hasOwnProperty(name)) {
          throw new Error(`全局快捷方式${name}已经存在，请勿重复设置`)
        } else {
          Object.defineProperty(Vue.prototype.shortcuts, name, {
            configurable: false,
            value: val,
            writable: false
          })
        }
      }
    }
  }
}

// 注入参数对象
export const variablePlugin = {
  install(Vue, options) {
    Vue.prototype.carrierObj = carrier
    Vue.prototype.planObj = plan
    Vue.prototype.specifictionObj = specifiction
  }
}

// 路由storage存储
export const storagePlugin = {
  install(Vue, options) {
    Vue.storage = {
      save: (name, obj) => {
        sessionStorage.setItem(name, JSON.stringify(obj))
        return true
      },
      get: (name) => {
        let value = sessionStorage.getItem(name)
        if (value) {
          return JSON.parse(value)
        }
        return false
      }
    }
    Vue.prototype.storage = Vue.storage
  }
}

// 请求完统一报错

// 请求插件
export const ajaxPlugin = {
  install(Vue, options) {
    const ajaxMethods = {
      // ajax请求的封装
      jaxLib: ajaxHelpers
    }

    Object.assign(Vue.prototype, ajaxMethods)
    Object.assign(Vue, ajaxMethods)
  }
}

// 全局msg调用
export const msgDialogPlugin = {
  install(Vue, options) {
    Vue.msg = (msg, type) => {
      Message({
        ...commonMessageConfig(type),
        message: msg,
        type: type
      })
    }
    Vue.prototype.msg = Vue.msg

    Vue.installShortCut(
      'msg',
      (message, type = 'error') => {
        Vue.msg(message, type)
      },
      {
        global: true
      }
    )
  }
}

// confirm 快捷方式插件
export const confirmPlugin = {
  install(Vue) {
    Vue.installShortCut(
      'confirm',
      (msg, confirmCB, cancelCB = () => {}, type = 'warning') => {
        MessageBox.confirm(msg, '提示', {
          confirmButtonText: '是',
          cancelButtonText: '我再看看',
          type
        })
          .then(confirmCB)
          .catch(cancelCB)
      },
      {
        global: true
      }
    )
  }
}

// notify 快捷方式插件
export const notifyPlugin = {
  install(Vue) {
    Vue.installShortCut('notify', (message, title = '提示', type = 'info', duration = 4.5) => {
      Notification({
        title,
        message,
        duration: parseInt(duration * 1000),
        type
      })
    })
  }
}
