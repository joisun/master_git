<script>
  import apis from '@/api/ajax'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        isShowEditDialog: true,
        search: {
          model: ''
        },
        productList: [],
        isLoading: false,
        page: {
          total: 0,
          pageSize: 30
        }
      }
    },
    watch: {
      productCategory() {
        this.getList()
      }
    },
    created() {
      const model = this.$route.query.model
      if (model) {
        this.search.model = model
      }
      this.getList()
    },
    computed: {
      ...mapState({
        productCategory: state => state.overall.cpeEnum.productCategory
      })
    },
    methods: {
      async getList(pageIndex = 1) {
        this.isLoading = true
        const params = {}
        if (this.search.model) {
          params.model = this.search.model
        }
        const { success, data } = await apis.cpe.supplierProductList({ pageIndex, pageSize: 30, ...params })
        if (!success) {
          return false
        }
        this.isLoading = false
        this.productList = data.list
        this.page.pageIndex = data.page.currentPage
        this.page.total = data.page.allCount
      },
      editProduct(query = {}) {
        this.$router.push({ name: 'cpe-supplier-product-edit', query })
      },
      deleteProduct(row) {
        this.$confirm(`确定删除商品「${row.name}」吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { success } = await apis.cpe.supplierProductDelete({ id: row.id })
          if (!success) {
            return false
          }
          this.$message({ type: 'success', message: '删除成功' })
          await this.getList()
        })
      },
      toGoodsList(model) {
        this.$router.push({ name: 'cpe-goods-list', query: { model } })
      }
    }
  }
</script>

<template>
  <div class="wh__warp cpe-product-list">
    <div class="wh__header">
      <div class="wh__header--title">供应商产品</div>
    </div>
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          placeholder="产品型号"
          name="searchField"
          v-model="search.model"
          @keyup.enter.native="getList()"
          class="wh__tools--search-input"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList()">
          </el-button>
        </el-input>
        <el-button class="float-right" type="primary" @click="editProduct({})">新增</el-button>
      </div>
    </div>
    <div class="wh__body">
      <div class="wh__body--table">
        <el-table :data="productList" v-loading="isLoading">
          <el-table-column label="产品名称" prop="name"></el-table-column>
          <el-table-column label="产品类型">
            <template slot-scope="scope">
              <span v-cpe-enum-extract="{
                original: scope.row.type,
                category: 'productType'
              }">
              </span>
            </template>
          </el-table-column>
          <el-table-column label="产品型号" prop="model"></el-table-column>
          <el-table-column label="所属供应商" prop="supplierName"></el-table-column>
          <el-table-column label="关联商品">
            <template slot-scope="scope">
              <el-tag>
                <span @click="toGoodsList(scope.row.itemModel)" class="link">
                  {{scope.row.itemName}} {{scope.row.itemModel}} ({{scope.row.itemNo}})
                </span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="editProduct({ id: scope.row.id })">编辑</el-button>
              <el-button @click="deleteProduct(scope.row)">删除</el-button>
            </template>
          </el-table-column>
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

<style lang="scss">
  .cpe-product-list {
    .link {
      cursor: pointer;
    }
  }
</style>
