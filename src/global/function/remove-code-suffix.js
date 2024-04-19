import {safeParse} from "@/global/function/safe-operations";

export default function removeCodeSuffix(list) {
  return list.map(item => {
    if (item.children) {
      item.children = removeCodeSuffix(item.children)
    }
    const matched = item.code.match(/(-cmcc|-chinanet|-unicom|-\d)/g)
    let code = item.code
    let value = {}
    if (item.value) {
      value = safeParse(item.value)
    }
    if (matched && matched.length) {
      code = item.code.replace(matched[0], '')
    }
    return {
      ...item,
      code,
      ...value,
    }
  })
}
