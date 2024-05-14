<template>
  <div class="cancel-retain-number">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">取消停机保号状态</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--mix">
          <el-input
            placeholder="请输入ICCID"
            v-model="search.iccid"
            @change="onSearch"
            class="wh__tools--search-input"
            clearable
          >
          </el-input>
          <el-input
            placeholder="客户id、客户名称"
            v-model="search.orgNameOrId"
            class="wh__tools--search-input"
            @change="onSearch"
            clearable
          />
          <wh-sales-select v-model="search.saleName" @change="onSearch"/>
          <el-button type="primary" @click="onAdd()" class="float-right"
            >新增</el-button
          >
        </div>
      </div>
      <div class="wh__body" v-loading="loading">
        <div class="wh__body--table">
          <el-table :data="tableData" height="calc(100vh - 210px)">
            <el-table-column label="客户ID" prop="orgId"/>
            <el-table-column label="客户名称" prop="orgName"/>
            <el-table-column label="所属销售">
              <template slot-scope="scope">
                {{sellmanList[scope.row.saleName]}}
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in COLUMNS"
              :key="index"
              :formatter="item.formatter"
              :prop="item.key"
              :label="item.label"
              :min-width="item.width"
              :class-name="item.className"
            />
          </el-table>
        </div>
        <div class="wh__body--page">
          <el-pagination
            @current-change="handlePageChange"
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            :total="page.total"
            layout="pager, total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <DialogCancelRetainNumber
      :visible.sync="DialogCancelRetainNumber.visible"
      @refresh="onRefresh"
    />
  </div>
</template>


<script>
  import whSalesSelect from '@/page/components/wh-sales-select.vue'
  import { COLUMNS } from './mixins/const'
  import DialogCancelRetainNumber from './components/DialogCancelRetainNumber.vue'

  let sellmanList = {}

  const today = new Date().getDate()

  export default {
    name: 'cancel-retain-number',
    data() {
      return {
        COLUMNS,
        search: {
          iccid: '',
          orgNameOrId: '',
          saleName: ''
        },
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        },
        tableData: [],
        loading: false,
        DialogCancelRetainNumber: {
          visible: false
        },
        sellmanList: {}
      }
    },
    computed: {
      addDisabled() {
        return today >= 25 // 每月25号0点以后不允许新增
      }
    },
    methods: {
      onSearch () {
        this.page.pageIndex = 1
        this.getList()
      },
      async getList() {
        const params = {
          ...this.search,
          pageNo: this.page.pageIndex,
          pageSize: this.page.pageSize
        }
        this.loading = true
        try {
          const res = await this.jaxLib.card.retainNumber.getList(params)
          const {success, data} = res
          if (!success) {
            this.$message.error('列表数据获取失败！')
          } else {
            this.tableData = data.list
            this.page.total = data.page.allCount
          }
          this.loading = false
        } catch {
          this.loading = false
        }
      },
      handlePageChange(e) {
        this.page.pageIndex = e
        this.getList()
      },
      onAdd () {
        if (this.addDisabled) {
          this.$message.error('每月25日0点后不允许执行该操作')
          return false
        }
        this.DialogCancelRetainNumber.visible = true
      },
      onRefresh () {
        this.page.pageIndex = 1
        this.page.pageSize = 20
        this.search.iccid = ''
        this.search.orgNameOrId = ''
        this.search.saleName = ''
        this.getList()
      }
    },
    async created () {
      const {success, data} = await this.jaxLib.customer.sell.sellerList()
      if (success) {
        data.forEach(e => {
          this.sellmanList[e.key] = e.name
        })
      }
      this.getList()
    },
    components: {
      whSalesSelect,
      DialogCancelRetainNumber
    }
  }
</script>

