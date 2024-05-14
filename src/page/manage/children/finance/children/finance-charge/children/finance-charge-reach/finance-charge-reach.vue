<script type="text/ecmascript-6">
/**
   * 到账管理
   * Create by gzj on 17/3/24
   */

  import moment from 'moment'
  import manualConfirmDialog from './components/manual-confirm-dialog.vue'

  export default {
    data() {
      return {
        form: {
          timeRange: [],
          status: 0
        },

        isLoading: true,

        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        },

        tableData: [],

        dialog: {
          manualConfirmDialog: false
        },
        nowId: ''
      }
    },
    components: {
      'manual-confirm-dialog': manualConfirmDialog
    },
    methods: {
      search() {
        this.page.pageIndex = 1
        this.getList()
      },
      async getList() {
        this.isLoading = true
        let rst = await this.jaxLib.financial.cashin.getAll({
          status: this.form.status,
          startTime: this.form.time ? moment(this.form.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: this.form.time ? moment(this.form.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
        if (!rst.success) return false
        this.page.pageSize = rst.data.page.rowsPerPage
        this.page.pageIndex = rst.data.page.currentPage
        this.page.total = rst.data.page.allCount
        this.tableData = rst.data.list
        this.isLoading = false
      },

      async onPageSizeChange(val) {
        this.page.pageSize = val
        this.page.pageIndex = 1
        await this.getList()
      },

      async onPageIndexChange(val) {
        this.page.pageIndex = val
        await this.getList()
      },

      onBindClick(mid) {
        this.dialog.manualConfirmDialog = true
        this.nowId = mid
      },
      closeDialog(name, flag) {
        this.dialog[name] = false
        if (flag) this.getList()
      }
    },

    async mounted() {
      await this.getList()
    }
  }
</script>

<template>
  <div class="cash-tool">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">到账记录</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--search">
          <el-form :inline="true">
            <el-date-picker
              v-model="form.time"
              type="daterange"
              @change="search"
              clearable
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-select v-model="form.status" @change="search">
              <el-option v-for="(key, val) in enums.mailChargeBillStatus.maps()"
                :label="key" :value="Number(val)" :key="val">
              </el-option>
            </el-select>
          </el-form>
        </div>
      </div>
      <div class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData"
            class="mini-table"
            height="calc(100vh - 260px)"
            v-loading="isLoading">
            <el-table-column
              prop="id"
              label="邮件ID"
              min-width="55">
            </el-table-column>
            <el-table-column
              label="收款时间"
              min-width="100">
              <template slot-scope="scope">
                {{ scope.row.rcvMoneyTime.time | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="收邮件时间"
              min-width="100">
              <template slot-scope="scope">
                {{ scope.row.rcvMailTime.time | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="fromAccountNum"
              label="打款账号"
              min-width="160">
            </el-table-column>
            <el-table-column
              prop="fromAccountName"
              label="打款账户名"
              min-width="130">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="金额"
              min-width="100">
            </el-table-column>
            <el-table-column
              label="创建时间"
              min-width="100">
              <template slot-scope="scope">
                {{ scope.row.generateBillTime.time | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column
              label="充值状态"
              prop="status"
              min-width="110">
              <template slot-scope="scope">
                {{scope.row.chargeStatus | mailChargeBillStatusFilter}}
              </template>
            </el-table-column>
            <el-table-column
              prop="cause"
              label="备注"
              min-width="100">
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="100">
              <template slot-scope="scope">
                <el-button
                  :disabled="!!scope.row.chargeStatus"
                  type="primary"
                  size="mini"
                  @click="onBindClick(scope.row.id)">手工对账
                </el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            @size-change="onPageSizeChange"
            @current-change="onPageIndexChange"
            :current-page="page.pageIndex"
            :page-sizes="[10, 15, 20, 25, 30]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
        title="手工对账"
        :visible.sync="dialog.manualConfirmDialog"
        :lock-scroll="true"
        width="30%">
        <manual-confirm-dialog
          dialogName="manualConfirmDialog"
          :id="nowId"
          @closeDialog="closeDialog">
        </manual-confirm-dialog>
      </el-dialog>
    </div>
  </div>
</template>
