<script>
/**
 * Create by yuhao on 2020/7/2
 */

import apis from '@/api/ajax'
import moment from 'moment'
import { columns } from './mixins/fold-column'
import orderSettingForm from './order-setting-form'


  export default {
    data() {
      return {
        loading: false,
        form: {
          searchTime: ''
        },
        columnsOne: columns[0],
        columnsTwo: columns[1],
        list: [],
        page: {
          pageSize: 20,
          pageIndex: 1,
          total: 0
        },
        isShowDialog: false
      }
    },
    computed: {
    },
    mounted() {
      this.getList()
    },
    methods: {
      search() {
        this.getList()
      },
      async getList() {
        try {
          this.loading = true
          // 默认获取一周数据
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          const param = {
          from: this.form.searchTime ? moment(this.form.searchTime[0]).format('YYYY-MM-DD') : moment(start).format('YYYY-MM-DD'),
          to: this.form.searchTime ? moment(this.form.searchTime[1]).format('YYYY-MM-DD') : moment(end).format('YYYY-MM-DD')
          }
          const { success, data } = await apis.crm.orderSettingSearch(param)
          this.loading = false
          const newList = []
          if (!success) return
          data.forEach(element => {
            element = {
              ...element,
              'followedRate': element.followed
            }
            newList.push(element)
          });
          this.list = newList
          this.page.total = this.list.length
          } catch (error) {
            console.error(error)
            this.loading = false
        }
      },

      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === this.list.length) {
          if (columnIndex === 0) {
            return [1, 2]
          }
        }
      },

      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '汇总'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = index >= 4 ? (sums[index]*100/sums[2]).toFixed(2) + '%' : sums[index]
          } else {
            sums[index] = ''
          }
        });
        return sums
      },

      toSetting() {
        this.isShowDialog = true
      },

      closeDialog() {
        this.isShowDialog = false
      }
    },
    components: {
      'order-setting-form': orderSettingForm
    }
  }
</script>

<template>
  <div class="mission-list">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">销售转单统计</h2>
      </div>
      <div class="mission crm-container">
        <div class="wh__tools">
          <el-date-picker
            @change="search"
            v-model="form.searchTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <div class="float-right">
            <el-button @click="toSetting" type="primary" size="small">
              配置
            </el-button>
          </div>
        </div>

        <div class="wh__body" v-loading="loading">
          <el-table
            :data="list"
            stripe
            style="width: 100%"
            show-summary
            :summary-method="getSummaries"
            :span-method="arraySpanMethod"
            >
            <el-table-column
              v-for="(item, index) in columnsOne"
              :formatter="item.formatter"
              :prop="item.key.split('.')[0]"
              :key="index"
              :min-width="item.minWidth"
              :width="item.width"
              :sortable="item.sortable"
              :label="item.name"
            >
            </el-table-column>
            <el-table-column
              v-for="(item, index) in columnsTwo"
              :key="index"
              :min-width="item.minWidth"
              :width="item.width"
              :sortable="item.sortable"
              :label="item.label">
              <el-table-column
                v-for="(subItem, index) in item.items"
                :key="index"
                :prop="subItem.key.split('.')[0]"
                :formatter="subItem.formatter"
                :label="subItem.name">
              </el-table-column>
            </el-table-column>
          </el-table>
          <div class="wh__body--page">
            <el-pagination
              class="margin-top20 align-right"
              @current-change="handlePageChange"
              :current-page="page.pageNo"
              :page-size="page.pageSize"
              layout="total, prev, pager, next"
              :total="page.total"
            >
            </el-pagination>
          </div>
        </div>
        <el-dialog
          title="分配配置"
          width="80%"
          :close-on-click-modal="false"
          :visible.sync="isShowDialog"
        >
          <order-setting-form
            @onClose="closeDialog">
          </order-setting-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
