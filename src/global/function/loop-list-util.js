import { difference } from 'lodash'

export const structure = (arr) => {
  let level1 = arr.filter(item => item.parentId + '' === '-1')
  let left = difference(arr, level1)
  for (let i = 0; i < level1.length; i++) {
    let level1Item = level1[i]
    for (let j = 0; j < left.length; j++) {
      if (left[j].parentId === level1Item.id) {
        let children = level1Item.children || (level1Item.children = [])
        children.push(left[j])
      }
    }
  }
  return level1
}
