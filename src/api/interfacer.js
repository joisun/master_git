import Vue from 'vue'

function ajax(options) {
  // 用来模拟后一个接口比前一个接口先返回的测试，options.data.duration表示延时的时间
  // return new Promise(resolve => {
  //   Vue.http[options.method](options.url, options.data, options.headers).then(rst => {
  //     setTimeout(() => {
  //       resolve(rst);
  //     }, options.data.duration * 10 || 0);
  //   });
  // });
  return Vue.http[options.method](options.url, options.data, options.headers)
}

function generateInterfacerKey(url, method, headers = {}) {
  let keys = Object.keys(headers)
  keys.sort()
  let pair = keys.map((key) => {
    let value = headers[key]
    return key + '=' + value
  })
  return `${method}:${url}:${pair.join('&')}`
}

function generateExecuterKey(data = {}) {
  let keys = Object.keys(data)
  keys.sort()
  let pair = keys.map((key) => {
    let value = data[key]
    return key + '=' + value
  })
  return pair.join('&')
}

let uid = 0

class Executer {
  constructor(data) {
    this.data = data
    this.key = generateExecuterKey(data)
    this.done = false
    this.uid = uid
    uid += 1
  }
}

// 延迟response，测试接口用
// function deplay(cb, duration) {
//   return new Promise(resolve => {
//     cb().then(rst => {
//       setTimeout(() => {
//         resolve(rst);
//       }, duration);
//     });
//   });
// }

export class Interfacer {
  constructor(options) {
    let { url, method, headers } = options
    this.options = options
    this.key = generateInterfacerKey(url, method, headers)
    this.executerList = []
  }

  do(data) {
    let executer = new Executer(data)
    let latestSameExecuter = this.getLatestAkinExecuter(executer)
    let waitPromises = this.getWaitExecuter().map((e) => e.promise)

    if (latestSameExecuter) {
      executer.promise = latestSameExecuter.promise
    } else {
      executer.promise = ajax({
        ...this.options,
        data: executer.data
      })
    }

    executer.promise = executer.promise.then((rst) => {
      if (waitPromises.length > 0) {
        return Promise.all(waitPromises).then(() => rst)
      }
      return rst
    })

    this.add(executer)

    return executer.promise
      .then((rst) => {
        executer.done = true
        this.del(executer)
        return rst
      })
      .catch((err) => {
        executer.done = true
        this.del(executer)
        throw err
      })
  }

  getWaitExecuter() {
    let executerList = this.executerList

    if (executerList.length === 0) {
      return []
    }

    // return executerList

    return [executerList[executerList.length - 1]]
  }

  getLatestAkinExecuter(executer) {
    let index = -1
    let executerList = this.executerList
    for (let i = 0; i < executerList.length; i += 1) {
      let e = executerList[i]
      if (e.done || e.key !== executer.key) {
        continue
      }
      if (index === -1) {
        index = i
        continue
      }
      // 其实后面的uid一定比前面的大的
      if (executerList[i].uid > executerList[index].uid) {
        index = i
      }
    }
    return index !== -1 ? executerList[index] : null
  }

  add(executer) {
    this.executerList.push(executer)
  }

  del(executer) {
    let executerList = this.executerList
    for (let i = 0; i < executerList.length; i += 1) {
      if (executerList[i].uid === executer.uid) {
        executerList.splice(i, 1)
        return
      }
    }
  }
}

let store = {}

export function createInterfacerFactory(options) {
  let interfacer = new Interfacer(options)
  if (store[interfacer.key] == null) {
    store[interfacer.key] = interfacer
  }
  return store[interfacer.key]
}
