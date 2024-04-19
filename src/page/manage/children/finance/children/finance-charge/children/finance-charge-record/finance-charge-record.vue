<script>
  import moment from 'moment'
  import { columns } from './mixins/consts'
  import apis from '@/api/ajax'
  import enums from '@/constant/enums'
  import Download from '@/page/components/wh-download/wh-download'
  const convert = {
    'gmtCreated': 'gmt_created',
    'money': 'money'
  }
  export default {
    name: 'finance-charge-record',
    data() {
      return {
        enums,
        columns,
        isLoading: false,
        tableData: [],
        form: {
          time: [],
          type: [],
          input: ''
        },
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0,
          orderByClause: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      onPageIndexChange(val) {
        this.page.pageIndex = val
        this.getList()
      },
      async getList() {
        this.loading = true
        const { data, success } = await apis.financial.getCustomerBannerList({
          startDate: this.form.time[0] ? moment(this.form.time[0]).format('YYYY-MM-DD') : '',
          endDate: this.form.time[1] ? moment(this.form.time[1]).format('YYYY-MM-DD') : '',
          searchKey: this.form.input,
          types: this.form.type.join(','),
          currentPage: this.page.pageIndex,
          rowsPerPage: this.page.pageSize,
          orderByClause: this.page.orderByClause || 'gmt_created desc'
        })
        this.loading = false
        if (!success) return false
        this.tableData = data.list
        this.page.total = data.page.allCount
      },
      search() {
        this.page.pageIndex = 1
        this.getList()
      },
      async exportFile() {
        let { data, success } = await apis.financial.exportCustomerBannerList({
          startDate: this.form.time[0] ? moment(this.form.time[0]).format('YYYY-MM-DD') : '',
          endDate: this.form.time[1] ? moment(this.form.time[1]).format('YYYY-MM-DD') : '',
          searchKey: this.form.input,
          types: this.form.type.join(','),
          orderByClause: this.page.orderByClause || 'gmt_created desc'
        })
        if (!success) return false
        await Download({ ...data })
      },
      changeSorting(e) {
        if (e.prop) this.page.orderByClause = convert[e.prop] + ' ' + (e.order === 'descending' ? 'desc' : 'asc')
        else this.page.orderByClause = ''
        this.page.pageIndex = 1
        this.getList()
      }
    }
  }
</script>

<template>
  <div class="finance-charge-record">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">余额记录</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--search">
          <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            start-placeholder="变更开始日期"
            end-placeholder="变更结束日期">
          </el-date-picker>
          <el-select v-model="form.type" multiple collapse-tags class="wh__tools--search-input">
            <el-option v-for="(key, val) in enums.tradeType.maps()" :label="key" :value="Number(val)" :key="val">
            </el-option>
          </el-select>
          <el-input
            placeholder="组织ID、组织名称"
            name="searchField"
            v-model="form.input"
            @keyup.enter.native="search"
            class="wh__tools--search-input">
          </el-input>
          <el-button @click="search" icon="el-icon-search">
          </el-button>
          <el-button @click="exportFile" class="float-right">
            导出
          </el-button>
        </div>
      </div>
      <div class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" class="mini-table" @sort-change="changeSorting" v-loading="isLoading"
            height="calc(100vh - 260px)">
            <el-table-column v-for="(item, index) in columns"
              :key=index
              :formatter="item.formatter"
              :prop=item.key
              :label=item.name
              :min-width=item.width
              :align=item.align
              :sortable="item.sort"
              :class-name="item.style">
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            @current-change="onPageIndexChange"
            :current-page="page.pageIndex"
            :page-sizes="[10, 15, 20, 25, 30]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
