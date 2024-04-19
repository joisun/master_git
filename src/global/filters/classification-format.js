import store from '@/store'

const classificationFormat = function(str) {
  let classificationList = store.state.planClassification.planClassificationList
  let classificationName = str
  classificationList.map(e => {
    if (str === e.id || str === e.name) classificationName = e.name
  })
  return classificationName
}

export default classificationFormat
