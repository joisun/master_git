import moment from 'moment'
export const getLastMonth = () => {
  return moment().subtract(1, 'months').startOf('month').toDate()
}
