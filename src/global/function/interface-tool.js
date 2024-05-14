export default {
  methods: {
    throttle(fn, delay, immediate, debounce) {
      let curr = +new Date() // 当前事件
        let lastCall = 0
        let lastExec = 0
        let timer = null
        let diff // 时间差
        let context // 上下文
        let args
        let exec = function() {
          lastExec = curr
          fn.apply(context, args)
        }
      return function() {
        curr = +new Date()
        context = this
        args = arguments
        diff = curr - (debounce ? lastCall : lastExec) - delay
        clearTimeout(timer)
        if (debounce) {
          if (immediate) {
            timer = setTimeout(exec, delay)
          } else if (diff >= 0) {
            exec()
          }
        } else if (diff >= 0) {
          exec()
        } else if (immediate) {
          timer = setTimeout(exec, -diff)
        }
        lastCall = curr
      }
    }
  }
}
