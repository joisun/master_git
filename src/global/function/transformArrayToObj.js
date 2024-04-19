// 将数组映射到一个对象里，每一个数组项为对象属性，属性值为true

export default function (array) {
  const params = {}
  array.forEach(element => {
    params[element] = true
  });
  return params
}