import Vue from 'vue'
import DownloadComponent from './wh-download.vue'

const DownloadConstructor = Vue.extend(DownloadComponent)

let currentMsg

let getAnInstance = () => {
  return new DownloadConstructor({
    el: document.createElement('div')
  })
}

let removeDom = event => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target)
  }
}

DownloadConstructor.prototype.close = function() {
  this.visible = false
  this.$el.addEventListener('transitionend', removeDom)
}

const defaultCallback = action => {
  if (currentMsg.resolve) {
    if (action === 'sure') {
      currentMsg.resolve(true)
    } else if (action === 'cancel' && currentMsg.reject) {
      currentMsg.resolve(false)
    }
  }
}

let Download = (options = {}, callback = defaultCallback) => {
  return new Promise((resolve, reject) => {
    let instance = getAnInstance()
    instance.callback = callback
    instance.time = options.delay || 2000
    instance.loop = options.loop || false
    instance.postData = { ...options }
    instance.title = options.title || '文件正在努力生成中...'
    document.body.appendChild(instance.$el)
    currentMsg = { instance, resolve, reject }
    Vue.nextTick(function() {
      instance.visible = true
      setTimeout(function() {
        instance.downFile()
      }, options.delay || 2000)
    })
  })
}

export default Download
