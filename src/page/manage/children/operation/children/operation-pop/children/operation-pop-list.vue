<script>
/**
   * Create by zeter on 2017/8/2
   */
  import addLink from '../compontents/add-link.vue'
  import batchCreate from '../compontents/batch-create.vue'
  import importCost from '../compontents/import-cost.vue'
  import query from '@/global/function/query-params'
  import moment from 'moment'
  import Download from '@/page/components/wh-download/wh-download'

  export default {
    name: 'operation-pop-list',
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
        },
        exportDate: [],
        addLinkDialogStatus: false,
        createDialogStatus: false,
        exportDialogStatus: false,
        importDialogStatus: false
      }
    },
    methods: {
      async outTable() {
        const {success, data} = await this.jaxLib.advertisement.export({ keyword: this.searchData })
        if (!success) return false
        await Download({...data})
      },
      changeTabs(row) {
        this.$router.push({ name: 'operation-pop-user', query: { id: row.id, name: row.name } })
      },
      async getList() {
        this.loading = true
        let rst = await this.jaxLib.advertisement.list({
          keyword: this.searchData,
          pageNo: this.pageIndex,
          pageSize: this.pageSize
        })
        this.loading = false
        if (!rst.success) return false
        this.total = rst.data.page.allCount
        this.tableData = rst.data.list
      },
      simpleSearch() {
        this.pageIndex = 1
        this.getList()
      },
      changeIndex(val) {
        this.pageIndex = val
        this.getList()
      },
      closeDialog(name, flag) {
        this[name] = false
        if (flag) {
          this.pageIndex = 1
          this.getList()
        }
      },
      filtersRowUrl(row) {
        let urlParse = query.parseQueryString(row.url) || {}
        urlParse.utm_source = encodeURIComponent(row.source)
        urlParse.utm_campaign = encodeURIComponent(row.campaign)
        urlParse.utm_medium = encodeURIComponent(row.medium)
        return query.addQueryString(query.funcUrlDel(row.url), urlParse)
      },
      changeItem(row) {
        this.$prompt('请输入关键字ID', '修改', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(?!0)\d{1,20}$/,
          inputErrorMessage: 'ID格式不正确，请输入数字'
        }).then(({ value }) => {
          this.changeKeyId(row.id, value)
        }).catch(() => {})
      },
      async changeKeyId(id, keyId) {
        let rst = await this.jaxLib.advertisement.updata({
          id: id,
          keyId: keyId
        })
        if (!rst.success) return false
        this.getList()
      },
      async downCostExport() {
        if (!this.exportDate || !this.exportDate.length || !this.exportDate[0] || !this.exportDate[1]) {
          this.$message.warning('请选择导出范围')
          return false
        }
        const {success, data} = await this.jaxLib.advertisement.costExport({
          startDate: moment(this.exportDate[0]).format('YYYY-MM-DD'),
          endDate: moment(this.exportDate[1]).format('YYYY-MM-DD')
        })
        if (!success) return false
        this.exportDialogStatus = false
        this.exportDate = []
        await Download({...data})
      }
    },
    created() {
      this.getList()
    },
    components: {
      'add-link': addLink,
      'batch-create': batchCreate,
      'import-cost': importCost
    }
  }
</script>

<template>
  <div class="link-tabs">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-input
          placeholder="请输入关键字"
          v-model="searchData"
          class="wh__tools--search-input"
          @keyup.native.enter="simpleSearch">
          <el-button slot="append" icon="el-icon-search" @click.native="simpleSearch">
          </el-button>
        </el-input>
        <el-button class="float-right wh__tools--mix-btn" size="mini" @click="outTable">导出</el-button>
<!--        <el-button class="float-right wh__tools&#45;&#45;mix-btn" size="mini" @click="addLinkDialogStatus = true" type="primary">新建活动-->
<!--        </el-button>-->
<!--        <el-button class="float-right wh__tools&#45;&#45;mix-btn" size="mini" @click="createDialogStatus = true">批量新建</el-button>-->
        <el-button class="float-right wh__tools--mix-btn" size="mini" @click="importDialogStatus = true">导入成本</el-button>
        <el-button class="float-right wh__tools--mix-btn" size="mini" @click="exportDialogStatus = true">导出成本</el-button>
      </div>
    </div>
    <div class="wh__body" v-loading="loading">
      <el-table
        :data="tableData"
        height="calc(100vh - 260px)"
        style="width: 100%">
        <el-table-column
          prop="keyId"
          label="ID"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="date"
          label="时间"
          min-width="130">
          <template slot-scope="scope">
            {{scope.row.created | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          label="链接"
          min-width="250">
          <template slot-scope="scope">
            <div class="link__tabs--cell">
              {{filtersRowUrl(scope.row)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="source"
          label="渠道">
        </el-table-column>
        <el-table-column
          prop="campaign"
          label="计划">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单元">
        </el-table-column>
        <el-table-column
          label="注册量">
          <template slot-scope="scope">
            <span @click="changeTabs(scope.row)" class="wh__link">{{scope.row.registers}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="changeItem(scope.row)">修改</el-button>
          </template>
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
    <el-dialog :visible.sync="addLinkDialogStatus" class="wh__dialog" title="添加推广活动">
      <add-link
        dialogName="addLinkDialogStatus"
        @closeDialog="closeDialog">
      </add-link>
    </el-dialog>
    <el-dialog :visible.sync="createDialogStatus" class="wh__dialog" title="批量添加">
      <batch-create dialogName="createDialogStatus" @closeDialog="closeDialog">
      </batch-create>
    </el-dialog>
    <el-dialog :visible.sync="exportDialogStatus" class="wh__dialog"
      size="tiny" title="导出成本">
      <el-date-picker
        v-model="exportDate"
        type="daterange"
        :picker-options="pickerOptions"
        placeholder="选择日期范围">
      </el-date-picker>
      <div class="wh__dialog--footer">
        <el-button type="primary" @click="downCostExport">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="importDialogStatus" class="wh__dialog" title="导入成本">
      <import-cost dialogName="importDialogStatus" @closeDialog="closeDialog">
      </import-cost>
    </el-dialog>
  </div>
</template>
