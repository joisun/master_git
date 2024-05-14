import ajaxHelpers from '@/api/ajax'
const desensitization = {
  bind: function (el, binding) {
    if (!binding.value) return
    el.style.cursor = 'pointer'
    el.addEventListener('click', async () => {
      if (el.getAttribute('clicked')) return
      const { id, showField, system, idType } = binding.value
      const res = await ajaxHelpers.common.desensitizationShow(
        { id, showField: [showField], idType },
        system
      )
      if (!res || !res.success) return
      if (res.data[showField]) el.innerText = res.data[showField]
      el.style.cursor = 'auto'
      el.setAttribute('clicked', true)
    })
  },
  unbind(el, binding) {
    el.removeEventListener('click', binding.value)
  }
}

export default desensitization
