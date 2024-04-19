<script>
/**
   * Create by zeter on 2017/8/2
   */
  import moment from 'moment'
  import clientPanel from '@/page/components/panel/client-info-panel.vue'
import Download from '@/page/components/wh-download/wh-download'

  export default {
    name: 'operation-pop-user',
    data() {
      return {
        tableData: [],
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        searchData: '',
        loading: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    computed: {
      linkId() {
        return this.$route.query.id || ''
      },
      name() {
        return this.$route.query.name || ''
      },
      regDateRage() {
        return {
          regDateStart: this.searchData[0] ? moment(this.searchData[0]).format('YYYY-MM-DD') : '',
          regDateEnd: this.searchData[1] ? moment(this.searchData[1]).format('YYYY-MM-DD') : ''
        }
      }
    },
    methods: {
      async outTable() {
        const {success, data} = await this.jaxLib.advertisement.user.export({
          linkId: this.linkId,
          ...this.regDateRage
        })
        if (!success) return false
        await Download({...data})
      },
      async getList() {
        this.loading = true
        let rst = await this.jaxLib.advertisement.user.list({
          linkId: this.linkId,
          ...this.regDateRage,
          pageNo: this.pageIndex,
          pageSize: this.pageSize
        })
        this.loading = false
        if (!rst.success) return false
        this.total = rst.data.page.allCount
        this.tableData = rst.data.list
      },
      changeIndex(val) {
        this.pageIndex = val
        this.getList()
      },
      closeTag() {
        this.$router.push({ name: 'operation-pop-user' })
        this.getList()
      }
    },
    created() {
      this.getList()
    },
    components: {
      'client-panel': clientPanel
    }
  }
</script>

<template>
  <div class="user-tabs">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-date-picker
          v-model="searchData"
          type="daterange"
          :picker-options="pickerOptions"
          placeholder="选择注册日期范围"
          @change="getList">
        </el-date-picker>
        <el-tag v-if="name" closable @close="closeTag"> {{name}} 活动用户</el-tag>
        <el-button class="float-right"  @click="outTable">导出</el-button>
      </div>
    </div>
    <div class="wh__body" v-loading="loading">
      <el-table
        :data="tableData"
        height="calc(100vh - 260px)"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="注册时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.registerDate | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="userId"
          label="组织ID">
          <template slot-scope="scope">
            <client-panel :orgId="scope.row.userId" :key="scope.row.userId">
              <span>{{scope.row.userId}}</span>
            </client-panel>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="客户名称"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="link"
          label="链接"
          min-width="230">
        </el-table-column>
        <el-table-column
          prop="sale"
          label="对应销售">
        </el-table-column>
        <el-table-column
          prop="charge"
          label="充值金额">
        </el-table-column>
        <el-table-column
          prop="consume"
          label="消耗金额">
        </el-table-column>
      </el-table>
      <div class="wh__body--page">
        <el-pagination
          @current-change="changeIndex"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
