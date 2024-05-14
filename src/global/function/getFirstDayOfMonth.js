export const getFirstDayOfMonth = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  let currentMonth = currentDate.getMonth() + 1
  currentMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth
  return `${currentYear}-${currentMonth}-01`
}
