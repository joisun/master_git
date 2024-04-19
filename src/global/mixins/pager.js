/**
 * 分页配置器
 */
export function Pager(pageNo, pageSize, allCount = 0) {
  this.pageSize = pageSize
  this.pageNo = pageNo
  this.allCount = allCount
}

/**
 * 分页公用逻辑
 * 注意：由外部提供getData
 */
export default {
  data() {
    return {
      dataSource: {
        fetching: false,
        error: '',
        list: []
      },
      pager: new Pager(1, 12)
    }
  },
  methods: {
    async fetch() {
      if (this.getData == null) {
        this.dataSource.error = '请配置用于获取数据的【getData】方法'
        return
      }
      this.dataSource.fetching = true

      let resp = await this.getData(this.pager)
      if (resp.success) {
        this.pager.allCount = resp.data.page.allCount
      }

      this.dataSource.fetching = false

      if (resp.success) {
        this.dataSource.list = this.parse(resp.data)
        this.dataSource.error = ''
      } else {
        this.dataSource.list = []
        this.dataSource.error = resp.message
      }
    },
    parse(data) {
      return data.list || []
    },
    redirect(pageIndex) {
      this.pager.pageNo = pageIndex
      this.fetch()
    },
    refresh() {
      this.fetch()
    }
  }
}
