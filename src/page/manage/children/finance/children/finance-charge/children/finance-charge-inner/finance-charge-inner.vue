<script>
/**
   * Create by zeter on 2017/5/25
   */
  import clientPanel from '@/page/components/panel/client-info-panel.vue'

  export default {
    data() {
      return {
        status: 1,
        page: {
          pageNo: 1,
          pageSize: 20,
          totalCount: 1
        },
        isLoading: true,
        tableData: []
      }
    },
    methods: {
      viewImg(val) {
        this.$whImgShow([val])
      },
      // 获取列表
      async getData() {
        this.isLoading = true
        let rst = await this.jaxLib.financial.recharge.list({
          status: this.status,
          pageSize: this.page.pageSize,
          pageIndex: this.page.pageNo
        })
        this.isLoading = false
        if (!rst.success) return false
        this.tableData = rst.data.list
        this.page.totalCount = rst.data.page.allCount
      },
      stateChange(val) {
        this.page.pageNo = 1
        this.status = Number(val)
        this.getData()
      },
      onPageSizeChange(val) {
        this.page.pageNo = 1
        this.page.pageSize = val
        this.getData()
      },
      onPageIndexChange(val) {
        this.page.pageNo = val
        this.getData()
      },
      // 通过转账
      onBindClickOk(val) {
        this.$confirm('此操作将通过这笔转账, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let rst = await this.jaxLib.financial.recharge.pass(val)
          if (!rst.success) return false
          this.$message.success('操作成功!')
          this.getData()
        }).catch(() => {
        })
      },
      // 不通过转账
      onBindClickCancel(val) {
        this.$confirm('此操作将拒绝这笔转账, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let rst = await this.jaxLib.financial.recharge.reject(val)
          if (!rst.success) return false
          this.$message.success('操作成功!')
          this.getData()
        }).catch(() => {
        })
      }
    },
    mounted() {
      this.getData()
    },
    components: {
      'client-panel': clientPanel
    }
  }
</script>

<template>
    <div class="cashInTransfer">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">充值申请</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--search">
          <el-form :inline="true">
            <el-select v-model="status" @change="stateChange">
              <el-option v-for="(key, val) in enums.offlineRechargeStatus.maps()" :label="key" :value="Number(val)" :key="val">
              </el-option>
            </el-select>
          </el-form>
        </div>
      </div>
      <div class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" class="mini-table" v-loading="isLoading" height="calc(100vh - 260px)">
            <el-table-column
              prop="orgId"
              label="组织id"
              min-width="80">
              <template slot-scope="scope">
                <client-panel :orgId="scope.row.orgId" :key="scope.row.orgId">
                  <span>
                    {{scope.row.orgId}}
                  </span>
                </client-panel>
              </template>
            </el-table-column>
            <el-table-column
              prop="orgName"
              label="客户名称"
              min-width="120">
            </el-table-column>
            <el-table-column
              prop=""
              label="充值金额"
              min-width="80">
              <template slot-scope="scope">
                {{ scope.row.money / 10000 | numberFilter(2)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="accountName"
              label="充值户名"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="accountNumber"
              label="充值账号"
              min-width="120">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="支付凭证"
              min-width="100">
              <template slot-scope="scope">
                <img v-if="scope.row.payScreenshot"
                  :src="scope.row.payScreenshot"
                  class="table__inner--img"
                  @click="viewImg(scope.row.payScreenshot)">
                <div v-else>暂无图片</div>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              min-width="120">
              <template slot-scope="scope">
                {{scope.row.gmtCreated | dateFilter}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="120"
              v-if="status===1">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="onBindClickOk(scope.row.id)">通过
                </el-button>
                <el-button type="primary" size="mini" @click="onBindClickCancel(scope.row.id)">不通过
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            @size-change="onPageSizeChange"
            @current-change="onPageIndexChange"
            :current-page="page.pageNo"
            :page-sizes="[10, 15, 20, 25, 30]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
