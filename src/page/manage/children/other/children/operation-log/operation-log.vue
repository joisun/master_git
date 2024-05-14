<template>
  <div class="test-card wh__warp">
    <div class="wh__header">
      <h2 class="wh-title">操作日志</h2>
    </div>
    <div class="wh__tools--search">
      <el-form :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item>
              <el-input
                v-model.trim="searchForm.orgNameOrId"
                placeholder="客户名字/ID"
                :clearable="true"
                @change="onSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input
                v-model.trim="searchForm.operationContent"
                placeholder="请输入操作内容"
                :clearable="true"
                @change="onSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-select
                v-model="searchForm.operationFunction"
                placeholder="请选择操作功能"
                style="width: 100%"
                :clearable="true"
                @change="onSearch"
              >
                <el-option
                  v-for="item in operationTypeList"
                  :key="item.type"
                  :label="item.desc"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-date-picker
                v-model="searchForm.time"
                style="width: 400px"
                placeholder="选择订单时间"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="onSearch"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="wh__body" style="height: calc(100% - 130px)">
      <el-table v-loading="loading" :data="tableData" height="100%">
        <el-table-column prop="orgName" label="客户名称(ID)" />
        <el-table-column prop="operationTime" label="操作时间">
          <template slot-scope="scope">
            <span>{{ scope.row.operationTime.time | dateFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="操作人"></el-table-column>
        <el-table-column prop="operationFunction" label="操作功能">
          <template slot-scope="scope">
            <span>{{ operationTypeListMapper[scope.row.operationFunction] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operationContent" label="操作内容">
          <template slot-scope="scope">
            <span v-if="scope.row.operationFunction === 4">
              <a>{{ scope.row.operationContent | cutString }}</a>
              <el-button
                v-show="scope.row.operationContent.length > 10"
                type="text"
                @click="detailIccid(scope.row)"
                >显示全部</el-button
              >
            </span>
            <span v-else-if="[2, 5].includes(scope.row.operationFunction)">
              <a>{{ safeSplit(scope.row.operationContent)[0] }}</a>
              <el-button type="text" @click="showAll(scope.row)">显示流量池</el-button>
            </span>
            <span v-else>{{ scope.row.operationContent }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="客户端IP" />
      </el-table>
    </div>
    <div class="wh__body--page">
      <el-pagination
        :total="page.total"
        :current-page="page.pageNo"
        :page-size="page.pageSize"
        layout="total, prev, pager, next,jumper"
        @current-change="onPageChange"
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="iccidDialog.show" title="操作内容" size="tiny" width="600px">
      <p>{{ iccidDialog.title }}</p>
      <ul style="overflow-y: auto; max-height: 320px">
        <li v-for="item in iccidDialog.list" :key="item" class="margin-bottom-10">{{ item }}</li>
      </ul>
      <div style="margin-top: 20px; text-align: right">
        <el-button :loading="exportLoading" @click="handleCopy(iccidDialog.list)"
          >一键复制</el-button
        >
        <el-button
          v-if="iccidDialog.showExportBtn"
          :loading="exportLoading"
          type="primary"
          @click="handleExportIccid(iccidDialog.operationId)"
          >导出ICCID
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dateFormat from '@/global/filters/date-format'
import PalClipboard from '@/global/function/pal-clipboard'
import Download from '@/page/components/wh-download/wh-download'

export default {
  name: 'OperationLog',
  filters: {
    cutString(value) {
      if (!value) return ''
      const match = value.match(/([\u4e00-\u9fa5]+)([A-Za-z\d]+)/)
      return match ? match[0] : ''
    }
  },
  data() {
    return {
      exportLoading: false,
      iccidDialog: {
        show: false,
        operationId: '',
        list: [],
        title: '',
        showExportBtn: true
      },
      page: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      operationTypeListMapper: {},
      searchForm: {
        operationContent: '',
        operationFunction: '',
        time: '',
        orgNameOrId: ''
      },
      operationTypeList: [],
      tableData: [],
      loading: false
    }
  },
  created() {
    this.getOperationTypeList()
  },
  methods: {
    safeSplit(str, splitter = ';') {
      if (!str || !str.split) return ['']
      return str.split(splitter)
    },
    // 复制ICCID到剪贴板detailIccid
    handleCopy(list) {
      let string = list.join('\n')
      PalClipboard.getInstance(string)
        .execCopy()
        .then(() => {
          this.$message.success('复制成功')
        })
        .catch(() => {
          this.$message.error('复制失败，请手动Ctrl + C')
        })
    },
    async getUserInfo() {
      let rst = await this.jaxLib.customer.info({
        orgId: this.orgId
      })
    },
    // 导出ICCID
    async handleExportIccid(id) {
      this.exportLoading = true
      const { success, data } = await this.jaxLib.operationLog.exportIccids({ id })
      if (!success) return false
      try {
        await Download({ ...data })
      } finally {
        this.exportLoading = false
      }
    },
    showAll(row) {
      const { operationContent, id } = row
      this.iccidDialog.showExportBtn = false
      this.iccidDialog.show = true
      this.iccidDialog.title = '流量池列表'
      this.iccidDialog.operationId = id
      const listStr = this.safeSplit(operationContent)[1]
      this.iccidDialog.list = listStr ? listStr.split(',') : []
    },
    detailIccid(row) {
      const { operationContent, id } = row
      const match = operationContent.match(/([\u4e00-\u9fa5]+)([A-Za-z\d,]+)/)
      let ids = '',
        title = ''
      if (match) {
        ids = match[2] || ''
        title = match[1] || ''
      }
      this.iccidDialog.showExportBtn = true
      this.iccidDialog.show = true
      this.iccidDialog.title = title
      this.iccidDialog.operationId = id
      this.iccidDialog.list = ids.split(',')
    },
    async queryTableData() {
      this.loading = true
      let param = {
        pageIndex: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      for (const key in this.searchForm) {
        if (this.searchForm.hasOwnProperty(key)) {
          const element = this.searchForm[key]
          if (element) {
            param = {
              ...param,
              [key]: element
            }
          }
        }
      }
      const { time } = param
      if (time) {
        const [start, end] = time
        param = {
          ...param,
          startTime: dateFormat(start),
          endTime: dateFormat(end)
        }
        delete param.time
      }
      const res = await this.jaxLib.operationLog.userOperationLogList(param)
      this.loading = false
      if (!res.success) return
      this.tableData = res.data.list
      this.page.total = res.data.page.allCount
    },
    async getOperationTypeList() {
      this.loading = true
      const res = await this.jaxLib.operationLog.listOperationType()
      if (!res.success) return
      this.operationTypeList = res.data
      ;(res.data || []).forEach((item) => {
        this.operationTypeListMapper[item.type] = item.desc
      })
      await this.queryTableData()
    },
    onPageChange(value) {
      this.page.pageNo = value
      this.queryTableData()
    },
    onSearch() {
      this.page.pageNo = 1
      this.queryTableData()
    }
  }
}
</script>
