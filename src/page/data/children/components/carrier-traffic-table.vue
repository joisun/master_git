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
        :row-class-name="rowClassName"
        class="wh__body--table">
        <el-table-column type="expand">
          <template>
            <el-table :data="otherList" :show-header="false">
              <el-table-column min-width="38"></el-table-column>
              <el-table-column min-width="120"></el-table-column>
              <el-table-column
                v-for="(item, index) in otherColumns"
                v-if="!(poolSpecification === -1 && item.key === 'diffVolume')"
                :key="index"
                :formatter="item.formatter"
                :sortable="item.sortable ? 'custom' : false"
                :prop="item.key"
                :label="item.name"
                row-key="id"
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
          row-key="id"
          :min-width="item.width">
        </el-table-column>
      </el-table>
      <div class="wh__body--page" v-if="!isSingleCard">
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
  import { CARRIER_COLUMNS, OTHERS_COLUMNS } from '../mixins/consts'
  import TrafficTableMixin from '../mixins/traffic-table'
  import moment from 'moment'

  export default {
    mixins: [TrafficTableMixin],
    data() {
      return {
        otherList: [],
        otherColumns: OTHERS_COLUMNS,
        isSingleCard: false
      }
    },
    props: {
      columns: {
        default: _ => CARRIER_COLUMNS
      },
      carrier: {
        type: String
      },
      poolSpecification: {
        type: Number,
        default: 0
      }
    },
    methods: {
      async getList() {
        if (!this.month) return false
        if (this.dataSource.loading) return false
        this.dataSource.loading = true
        let { month, ...rest } = this.form
        let rst = await this.jaxLib.pool.volumeOperationSupplier({
          poolId: this.poolId,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          month: moment(this.month).startOf('month').format('YYYY-MM-DD'),
          ...rest
        })
        this.dataSource.loading = false

        if (!rst.success) return false
        let list = rst.data.list.map((item, index) => {
          item.index = index + 1
          item.grossProfit = item.totalIncome - item.realCost
          item.grossProfitMargin = item.totalIncome ? item.grossProfit / item.totalIncome : '-'
          return item
        })
        let sum = rst.data.sum.map(item => {
          item.isSummary = true
          if (item.priceOfferName === '功能费') {
            item.totalVolume = '-'
            item.usedVolume = '-'
            item.diffVolume = '-'
            item.totalIncome = '-'
            item.expectCost = '-'
            item.grossProfit = '-'
            item.grossProfitMargin = '-'
          } else {
            item.grossProfit = item.totalIncome - item.realCost
            item.grossProfitMargin = item.totalIncome ? item.grossProfit / item.totalIncome : '-'
          }
          return item
        })
        list = sum.concat(list)

        this.page.total = rst.data.page.allCount
        rst = await this.jaxLib.pool.volumeOperationOthers({
          poolId: this.poolId,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          month: moment(this.month).startOf('month').format('YYYY-MM-DD'),
          ...rest
        })
        if (!rst.success) return false
        let otherList = rst.data.sum.map(item => {
          item.priceOfferName = '其他'
          item.usedVolume = '-'
          item.diffVolume = '-'
          item.totalIncome = '-'
          item.expectCost = '-'
          item.grossProfit = '-'
          item.grossProfitMargin = '-'
          return item
        })
        list = list.concat(otherList)
        this.dataSource.list = list
        this.otherList = rst.data.list
      },
      rowClassName({row}) {
        if (row.priceOfferName !== '其他') {
          return 'hidden-expand-icon'
        }
      }
    }
  }
</script>

<style lang="scss">
  .hidden-expand-icon {
    .el-table__expand-icon {
      display: none;
    }
  }
</style>
