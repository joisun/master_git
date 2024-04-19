import Vue from 'vue'
import Preview from './wh-preview.vue'

const PreviewConstructor = Vue.extend(Preview)

let toastPool = null

let getAnInstance = () => {
  if (toastPool) {
    return toastPool
  }
  return new PreviewConstructor({
    el: document.createElement('div')
  })
}

let removeDom = event => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target)
  }
}

PreviewConstructor.prototype.close = function() {
  this.visible = false
  this.$el.addEventListener('transitionend', removeDom)
}

let Toast = (options = {}) => {
  let instance = getAnInstance()
  instance.list = Array.isArray(options) ? options : options.list
  instance.index = options.index || 0
  instance.indicatorPosition = options.indicatorPosition || 'none'
  instance.title = options.title || '图片查看'
  instance.tools = options.tools || true
  instance.modal = options.modal || true

  document.body.appendChild(instance.$el)
  Vue.nextTick(function() {
    instance.pictureDialog = true
    instance.$el.removeEventListener('transitionend', removeDom)
  })
  return instance
}

export default Toast
