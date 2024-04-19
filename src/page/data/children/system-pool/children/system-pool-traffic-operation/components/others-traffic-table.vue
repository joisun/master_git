<template>
  <div class="traffic-table">
    <div class="wh__tools--mix">
      <el-date-picker
        v-model="form.month"
        :picker-options="pickerOptions"
        @change="active ? redirect() : void 0"
        type="month"
        :clearable="false"
        class="wh__tools--search-input"
        placeholder="选择月份">
      </el-date-picker>
    </div>
    <div class="wh__body">
      <el-table
        v-loading="dataSource.loading"
        @sort-change="onSortChange"
        :data="dataSource.list"
        height="calc(100vh - 180px)"
        class="wh__body--table">
        <el-table-column  v-for="(item, index) in columns"
          :key="index"
          :formatter="item.formatter"
          :sortable="item.sortable ? 'custom' : false"
          :prop="item.key"
          :label="item.name"
          :width="item.width">
        </el-table-column>
      </el-table>
      <div class="wh__body--page">
        <el-pagination
          @current-change="redirect(arguments[0])"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          class="wh__body--page">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import dateFormat from '@/global/filters/date-format'
  import { OTHERS_COLUMNS } from '../../../../mixins/consts'
  import TrafficTableMixin from '../../../../mixins/traffic-table'

  export default {
    mixins: [TrafficTableMixin],
    data() {
      return {}
    },
    props: {
      columns: {
        default: _ => OTHERS_COLUMNS
      }
    },
    watch: {},
    methods: {
      async getList() {
        if (this.dataSource.loading) return false
        this.dataSource.loading = true
        let { month, ...rest } = this.form
        let rst = await this.jaxLib.pool.volumeOperationOthers({
          poolId: this.poolId,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          month: dateFormat(month, 'YYYY-MM') + '-01',
          ...rest
        })
        this.dataSource.loading = false

        if (!rst.success) return false
        let list = rst.data.list.map((item, index) => {
          item.index = index + 1
          return item
        })
        let sum = rst.data.sum.map(item => {
          item.isSummary = true
          return item
        })
        list = sum.concat(list)
        this.dataSource.list = list
        this.page.total = rst.data.page.allCount
      }
    }
  }
</script>
