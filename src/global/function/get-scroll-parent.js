const root = window
const getStyleComputedProperty = (element, property) => {
  // NOTE: 1 DOM access here
  let css = root.getComputedStyle(element, null)
  return css[property]
}

const getScrollParent = (element) => {
  let parent = element.parentNode
  
  if (!parent) {
    return element
  }
  
  if (parent === root.document) {
    // Firefox puts the scrollTOp value on `documentElement` instead of `body`, we then check which of them is
    // greater than 0 and return the proper element
    if (root.document.body.scrollTop) {
      return root.document.body
    } else {
      return root.document.documentElement
    }
  }
  
  // Firefox want us to check `-x` and `-y` variations as well
  if (
    ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 ||
    ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 ||
    ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1
  ) {
    // If the detected scrollParent is body, we perform an additional check on its parentNode
    // in this way we'll get body if the browser is Chrome-ish, or documentElement otherwise
    // fixes issue #65
    return parent
  }
  return getScrollParent(element.parentNode)
}

export default getScrollParent
