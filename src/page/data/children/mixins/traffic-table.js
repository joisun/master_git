import { CARRIER_COLUMNS } from './consts'
import _ from 'lodash'
import { getLastMonth } from '@/global/function/time-tool'

export default {
  data() {
    return {
      page: {
        pageIndex: 1,
        pageSize: 15,
        total: 0
      },
      dataSource: {
        list: [],
        loading: false
      },
      form: {
        month: this.month,
        orderBy: ''
      },
      pickerOptions: {
        disabledDate: (time) => {
          if (this.carrier === 'unicom') {
            const timeMonthFirstDay = new Date(time.getFullYear(), time.getMonth(), 1)
            return timeMonthFirstDay > getLastMonth()
          }
          else {
            const timeMonthFirstDay = new Date(time.getFullYear(), time.getMonth(), 1)
            let date = new Date()
            return timeMonthFirstDay > new Date(date.getFullYear(), date.getMonth(), 1)
          }
        }
      }
    }
  },
  props: {
    columns: {
      default: _ => CARRIER_COLUMNS
    },
    poolId: [String, Number],
    active: Boolean,
    month: [String, Date]
  },
  watch: {
    'form.month': function(current) {
      this.$emit('change-month', current)
    },
    month: function(current) {
      this.form.month = current
    },
    active: function(current) {
      if (!current) return
      if (this.prevMonth !== this.month) {
        this.prevMonth = this.month
        this.getList()
      }
    }
  },
  methods: {
    onSortChange(column) {
      const orderMap = {
        descending: 'desc',
        ascending: 'asc'
      }
      if (column.prop) {
        this.form.orderBy = [_.snakeCase(column.prop), orderMap[column.order]].join(' ')
      } else {
        this.form.orderBy = ''
      }
      this.getList()
    },
    redirect(index = 1) {
      this.page.pageIndex = index
      this.getList()
    }
  }
}
