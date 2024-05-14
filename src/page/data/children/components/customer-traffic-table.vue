<style lang="scss">
  .traffic-table {
    .el-table__row--summary {
      .el-table__expand-icon  {
        display: none;
      }
    }
    .el-table__expanded-cell {
      padding: 0;
      .el-table {
        width: 100%;
        border: none;
        margin-bottom: -1px;
      }
    }
  }
</style>

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
      <el-input
        v-if="!isSingleCard"
        placeholder="客户名称或ID"
        v-model="form.searchStr"
        @keyup.enter.native="redirect()"
        class="wh__tools--search-input"
        style="width:190px;">
        <el-button slot="append" icon="el-icon-search" @click.native="redirect()">
        </el-button>
      </el-input>
    </div>
    <div class="wh__body">
      <el-table
        v-loading="dataSource.loading"
        @sort-change="onSortChange"
        :row-class-name="rowClassName"
        @expand-change="tableRowExpandOpen"
        :data="dataSource.list"
        height="calc(100vh - 180px)"
        class="wh__body--table">
        <el-table-column v-if="!isSingleCard" type="expand" width="30">
          <template slot-scope="props">
            <el-table
              class="el-table--expand"
              :show-header="false"
              :data="props.row.sub">
              <el-table-column width="30"></el-table-column>
              <el-table-column
                v-for="(item, index) in columns"
                v-if="!(poolSpecification === -1 && item.key === 'diffVolume')"
                :key="index"
                :formatter="item.formatter"
                :prop="item.key"
                :label="item.name"
                :min-width="item.width">
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columns"
          v-if="!(poolSpecification === -1 && item.key === 'diffVolume')"
          :key="index"
          :formatter="item.formatter"
          :sortable="item.sortable ? 'custom' : false"
          :prop="item.key"
          :label="item.name"
          :min-width="item.width">
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
  import moment from 'moment'
  import { CUSTOMER_COLUMNS } from '../mixins/consts'
  import TrafficTableMixin from '../mixins/traffic-table'

  export default {
    mixins: [TrafficTableMixin],
    data() {
      return {
        form: {
          month: this.month,
          searchStr: '',
          orderBy: ''
        },
        isSingleCard: false
      }
    },
    props: {
      columns: {
        default: _ => CUSTOMER_COLUMNS
      },
      carrier: {
        type: String
      },
      poolSpecification: {
        type: Number,
        default: 0
      }
    },
    watch: {},
    methods: {
      rowClassName({row}) {
        return row.isSummary ? 'el-table__row--summary' : null
      },
      async tableRowExpandOpen(row, expanded) {
        if (expanded.length) {
          if (!row.loadedData) {
            let rst = await this.jaxLib.pool.volumeOperationCustomerDetail({
              poolId: this.poolId,
              orgId: row.orgId,
              month: moment(this.form.month).startOf('month').format('YYYY-MM-DD')
            })
            if (!rst.success) return false
            let list = rst.data.list.map(item => {
              item.isExpandDetail = true
              item.grossProfit = item.totalIncome - item.realCost
              item.grossProfitMargin = item.totalIncome ? item.grossProfit / item.totalIncome : '-'
              return item
            })
            this.$set(row, 'sub', list)
            this.$set(row, 'loadedData', true)
          }
        }
      },
      async getList() {
        if (!this.month) return false
        if (this.dataSource.loading) return false
        this.dataSource.loading = true
        let { month, ...rest } = this.form
        let rst = await this.jaxLib.pool.volumeOperationCustomer({
          poolId: this.poolId,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          month: moment(month).startOf('month').format('YYYY-MM-DD'),
          ...rest
        })
        this.dataSource.loading = false

        if (!rst.success) return false
        let list = rst.data.list.map((item, index) => {
          item.index = index + 1
          item.grossProfit = item.totalIncome - item.realCost
          item.grossProfitMargin = item.totalIncome ? item.grossProfit / item.totalIncome : '-'
          item.sub = []
          item.loadedData = false
          return item
        })
        let sum = rst.data.sum.map(item => {
          item.isSummary = true
          item.grossProfit = item.totalIncome - item.realCost
          item.grossProfitMargin = item.totalIncome ? item.grossProfit / item.totalIncome : '-'
          item.sub = []
          item.loadedData = false
          return item
        })
        list = sum.concat(list)
        this.dataSource.list = list
        this.page.total = rst.data.page.allCount
      }
    }
  }
</script>
