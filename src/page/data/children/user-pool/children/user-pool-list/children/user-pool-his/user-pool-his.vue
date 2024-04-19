<script type="text/ecmascript-6">
/**
   * Create by zeter on 2017/4/5
   */
  import b from '@/page/bus'

  export default {
    data() {
      return {
        page: {
          pageIndex: 1,
          pageSize: 15,
          total: 0
        },
        carrier: '',
        poolSpecification: '',
        tableData: [],
        loading: false
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      }
    },
    methods: {
      async getList() {
        this.loading = true
        let rst = await this.jaxLib.pool.history({
          poolId: this.id,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        })
        if (rst.success) {
          this.tableData = rst.data.list
          this.poolSpecification = rst.data.pool.poolSpecification
          this.carrier = rst.data.pool.carrier
          this.page.total = rst.data.page.allCount
        }
        this.loading = false
      },
      // 切换页面
      handleCurrentChange(val) {
        this.page.pageIndex = val
        this.getList()
      },
      closePage() {
        this.$router.push({ name: 'user-pool-detail', query: { id: this.id } })
      }
    },
    mounted() {
      b.$emit('barIndent')
      this.page.pageIndex = 1
      this.getList()
    }
  }
</script>

<template>
  <div class="userPoolHis">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">用户流量池 -<span>
          {{carrier | carrierFilter}}
        </span>
          <span v-tag-extract="{volume: poolSpecification}">
          </span></h2>
        <span class="wh__header--close">
          <wh-std-icon sign="xe6aa" @click="closePage">
          </wh-std-icon>
        </span>
      </div>
      <div class="wh__body">
        <el-table
          :data="tableData"
          v-loading="loading"
          height="calc(100vh - 180px)"
          class="wh__body--table">
          <el-table-column
            prop="iccid"
            label="时间"
            min-width="120">
            <template slot-scope="scope">
              <div>{{scope.row.month | dateFilter(`YYYY-MM`)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="流量池总量"
            prop="totalVolume"
            min-width="150">
            <template slot-scope="scope">
              <div>{{scope.row.totalVolume | volumeFilter}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="已使用量"
            prop="useVolume"
            min-width="140"
            v-if="carrier==='cmcc'">
            <template slot-scope="scope">
              <div>{{scope.row.useVolume | volumeFilter}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="剩余流量"
            prop="leftVolume"
            min-width="140"
            v-if="carrier==='cmcc'">
            <template slot-scope="scope">
              <div>{{scope.row.leftVolume | volumeFilter}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="useRate"
            label="流量使用占比"
            min-width="140"
            v-if="carrier==='cmcc'">
            <template slot-scope="scope">
              <div>{{ scope.row.useRate | rateFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="userTotalCount"
            label="流量池卡总量"
            min-width="130">
          </el-table-column>
          <el-table-column
            prop="userActivationCount"
            label="已激活卡量"
            min-width="130">
          </el-table-column>
          <el-table-column
            prop="userInventoryCount"
            label="库存卡量"
            min-width="130">
          </el-table-column>
          <el-table-column
            prop="userDeactivatoinCount"
            label="已停卡卡量"
            min-width="130">
          </el-table-column>
          <el-table-column
            prop="userTestingCount"
            label="测试期"
            min-width="130">
          </el-table-column>
          <el-table-column
            prop="userRetiredCount"
            label="已销卡"
            min-width="130">
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          class="wh__body--page"
          layout="prev, pager, next, jumper, total"
          :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
