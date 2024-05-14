<script>
  import apis from '@/api/ajax'
  import { mapState } from 'vuex'
  import moment from 'moment'
  export default {
    name: 'cpe-stock-list',
    data() {
      return {
        search: {
          importTime: '',
          batchNo: '',
          model: '',
          itemModel: '',
          macAddr: ''
        },
        isLoading: false,
        tableData: [],
        page: {
          pageIndex: 1,
          pageSize: 30,
          total: 0
        }
      }
    },
    watch: {
      productCategory() {
        this.getList()
      }
    },
    created() {
      this.getList()
    },
    computed: {
      ...mapState({
        productCategory: state => state.overall.cpeEnum.productCategory
      })
    },
    methods: {
      stockIn() {
        this.$router.push({ name: 'cpe-stock-in' })
      },
      async getList(pageIndex = 1) {
        this.page.pageIndex = pageIndex
        const params = { pageIndex, pageSize: 30 }
        const { importTime, batchNo, model, itemModel, macAddr }  = this.search
        if (batchNo) {
          params.batchNo = batchNo
        }
        if (model) {
          params.model = model
        }
        if (itemModel) {
          params.itemModel = itemModel
        }
        if (macAddr) {
          params.macAddr = macAddr
        }
        if (importTime) {
          params.importTime = moment(importTime).format('YYYY-MM-DD')
        }
        this.isLoading = true
        const { success, data: { list, page } } = await apis.cpe.stockList(params)
        this.isLoading = false
        if (!success) {
          return false
        }
        this.tableData = list
        this.page.total = page.allCount
      },
      async inventoryExport({ batchNo, productId }) {
        const { success, data } = await apis.cpe.stockExport({ batchNo, productId })
        if (!success) return
        window.open(data)
      }
    }
  }
</script>

<template>
  <div class="wh-app-wrap goods-list">
    <div class="wh__header">
      <div class="wh__header--title">库存管理</div>
    </div>
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          v-model="search.itemModel"
          placeholder="请输入商品型号"
          style="width:220px;"
          @keyup.enter.native="getList()"
        >
        </el-input>
        <el-input
          v-model="search.model"
          placeholder="请输入供应商产品型号"
          style="width:220px;"
          @keyup.enter.native="getList()"
        >
        </el-input>
        <el-input
          v-model="search.batchNo"
          placeholder="请输入批次号"
          style="width:220px;"
          @keyup.enter.native="getList()"
        >
        </el-input>
        <el-date-picker
          type="date"
          v-model="search.importTime"
          placeholder="入库日期"
        >
        </el-date-picker>
        <el-input
          v-model="search.macAddr"
          placeholder="请输入Mac地址"
          style="width:220px;"
          @keyup.enter.native="getList()"
        >
        </el-input>
        <el-button @click="getList()">搜索</el-button>
        <el-button class="float-right" type="primary" @click="stockIn">入库</el-button>
      </div>
    </div>
    <div class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableData" v-loading="isLoading">
          <el-table-column label="批次号" prop="batchNo"></el-table-column>
          <el-table-column label="商品型号" prop="itemModel"></el-table-column>
<!--          <el-table-column label="产品种类">-->
<!--            <template slot-scope="scope">-->
<!--              <span v-cpe-enum-extract="{-->
<!--                original: scope.row.category,-->
<!--                category: 'productCategory'-->
<!--              }">-->
<!--              </span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="供应商产品类别">
            <template slot-scope="scope">
              <span v-cpe-enum-extract="{
                original: scope.row.sort,
                category: 'productSort'
              }">
              </span>
            </template>
          </el-table-column>
          <el-table-column label="供应商产品类型">
            <template slot-scope="scope">
              <span v-cpe-enum-extract="{
                original: scope.row.type,
                category: 'productType'
              }">
              </span>
            </template>
          </el-table-column>
          <el-table-column label="供应商产品型号" prop="model"></el-table-column>
          <el-table-column label="入库数量" prop="importCount" align="center" width="90"></el-table-column>
          <el-table-column label="库存数量" align="center" width="90">
            <template slot-scope="scope">
              <el-button v-if="scope.row.inventoryCount > 0" type="text" @click="inventoryExport(scope.row)">
                {{scope.row.inventoryCount}}
              </el-button>
              <span v-else>0</span>
            </template>
          </el-table-column>
          <el-table-column label="出库数量" prop="exportCount" align="center" width="90"></el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          @current-change="getList"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
