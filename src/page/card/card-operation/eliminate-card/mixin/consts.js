const statusOptions = [
  {
    label: '生效',
    value: 'effective'
  },
  {
    label: '未生效',
    value: 'ineffective'
  }
]
const activatedMonthOptions = [
  {
    label: '是',
    value: 1
  },
  {
    label: '否',
    value: 0
  }
]

export default {
  filters: {
    statusFilter(val) {
      return (statusOptions.find((item) => item.value === val) || {}).label
    },
    activatedMonthFilter(val) {
      return (activatedMonthOptions.find((item) => item.value === val) || {}).label
    }
  },
  data() {
    return {
      statusOptions,
      activatedMonthOptions
    }
  }
}
