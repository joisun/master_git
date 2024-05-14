export default class PalClipboard {
  constructor(text) {
    this.container = document.getElementsByTagName('body')[0]
    this.text = text
    this.handleResult = function handleResult() {}
  }
  static getInstance(text) {
    if (this instanceof PalClipboard) return false
    return new PalClipboard(text)
  }
  select(element) {
    let selectedText

    if (element.nodeName === 'SELECT') {
      element.focus()

      selectedText = element.value
    } else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
      let isReadOnly = element.hasAttribute('readonly')

      if (!isReadOnly) {
        element.setAttribute('readonly', '')
      }

      element.select()
      element.setSelectionRange(0, element.value.length)

      if (!isReadOnly) {
        element.removeAttribute('readonly')
      }

      selectedText = element.value
    } else {
      if (element.hasAttribute('contenteditable')) {
        element.focus()
      }

      let selection = window.getSelection()
      let range = document.createRange()

      range.selectNodeContents(element)
      selection.removeAllRanges()
      selection.addRange(range)

      selectedText = selection.toString()
    }
    return selectedText
  }

  copyText() {
    let succeeded

    try {
      succeeded = document.execCommand('copy')
    } catch (err) {
      succeeded = false
    }
    this.handleResult(succeeded)
  }

  removeFake() {
    if (this.fakeHandler) {
      this.container.removeEventListener('click', this.fakeHandlerCallback)
      this.fakeHandler = null
      this.fakeHandlerCallback = null
    }

    if (this.fakeElem) {
      this.container.removeChild(this.fakeElem)
      this.fakeElem = null
    }
  }

  selectFake(text, cb) {
    this.removeFake()

    this.fakeHandlerCallback = () => this.removeFake()
    this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true

    this.fakeElem = document.createElement('textarea')
    this.fakeElem.style.fontSize = '12pt'
    this.fakeElem.style.border = '0'
    this.fakeElem.style.padding = '0'
    this.fakeElem.style.margin = '0'
    // 将文本域丢到屏幕外
    this.fakeElem.style.position = 'absolute'
    this.fakeElem.style.left = '-9999px'
    // 保证滚动时 垂直方向
    let yPosition = window.pageYOffset || document.documentElement.scrollTop
    this.fakeElem.style.top = yPosition + 'px'

    this.fakeElem.setAttribute('readonly', '')
    this.fakeElem.value = text

    this.container.appendChild(this.fakeElem)

    this.selectedText = this.select(this.fakeElem)

    this.handleResult = cb
    this.copyText()
  }
  execCopy() {
    return new Promise((resolve, reject) => {
      this.selectFake(this.text, (success) => {
        if (success) resolve()
        else reject()
      })
    })
  }
}
