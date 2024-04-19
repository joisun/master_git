<script>
import apis from '@/api/ajax'

export default {
  name: 'cpe-goods-list',
  data() {
    return {
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      isLoading: false,
      search: {
        model: ''
      },
      isShowFlowRenew: false,
      flowRenewForm: {
        itemNo: '',
        price: '',
        productPrice: '',
        reservePrice: ''
      },
      flowRenewFormRule: {
        price: { required: true, message: '标准价不能为空', trigger: 'blur' },
        productPrice: { required: true, message: '平台价不能为空', trigger: 'blur' },
        reservePrice: { required: true, message: '销售底价不能为空', trigger: 'blur' }
      }
    }
  },
  created() {
    const model = this.$route.query.model
    if (model) {
      this.search.model = model
    }
    this.getList()
  },
  methods: {
    async getList() {
      const { pageIndex, pageSize } = this.page
      this.isLoading = true
      const params = { pageIndex, pageSize }
      if (this.search.model) {
        params.itemModel = this.search.model
      }
      const { success, data: { page, list } } = await apis.cpe.getItemList(params)
      this.isLoading = false
      if (!success) return false
      this.tableData = list
      this.page.total = page.allCount
    },
    changePageIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    async updateStatus({ itemNo, status, itemType }) {
      const data = { itemNo, status }
      const { success } = itemType === 'DEVICE'
        ? await apis.cpe.updateDeviceStatus(data)
        : (itemType === 'PACKAGE' ? await apis.cpe.updatePackageStatus(data) : await apis.cpe.overlayStatusUpdate(data))
      if (success) {
        this.$message({ type: 'success', message: '修改成功' })
      }
    },
    deleteItem({ itemNo, itemType }) {
      const data = { itemNo }
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { success } = itemType === 'DEVICE'
          ? await apis.cpe.deleteDevice(data)
          : await apis.cpe.deletePackage(data)
        if (success) {
          this.$message({ type: 'success', message: '删除成功' })
          this.getList()
        }
      })
    },
    editGoods(itemNo) {
      const query = itemNo ? { itemNo } : {}
      this.$router.push({ name: 'cpe-goods-edit', query })
    },
    editPackage(itemNo) {
      const query = itemNo ? { itemNo } : {}
      this.$router.push({ name: 'cpe-package-edit', query })
    },
    editOverlay({ itemNo, price, productPrice, reservePrice }) {
      this.flowRenewForm = {
        itemNo,
        price,
        productPrice,
        reservePrice
      }
      this.isShowFlowRenew = true
    },
    async handleSaveFlowRenew() {
      this.$refs.flowRenewRef.validate(async valid => {
        if (!valid) return false
        const { success } = await apis.cpe.overlayUpdate({ ...this.flowRenewForm })
        if (!success) return false
        this.getList()
      })
    }
  }
}
</script>

<template>
  <div class="wh-app-wrap goods-list">
    <div class="wh__header">
      <div class="wh__header--title">商品管理</div>
    </div>
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          placeholder="商品型号"
          name="searchField"
          v-model="search.model"
          @keyup.enter.native="getList()"
          class="wh__tools--search-input"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList()"></el-button>
        </el-input>
        <el-button class="float-right" type="primary" @click="editPackage(null)">新增套餐</el-button>
        <el-button class="float-right mr10" type="primary" @click="editGoods(null)">新增商品</el-button>
      </div>
    </div>
    <div class="wh__body">
      <div class="wh__body--table">
        <el-table :data="tableData" v-loading="isLoading">
          <el-table-column label="商品ID" prop="itemNo"></el-table-column>
          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <p>{{ scope.row.itemName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="商品型号" prop="itemModel"></el-table-column>
          <el-table-column label="归属">
            <template slot-scope="scope">
              <p v-cpe-enum-extract="{
                original: scope.row.itemType,
                category: 'itemType'
              }">
              </p>
            </template>
          </el-table-column>
          <el-table-column label="当前状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="on"
                inactive-value="off"
                @change="updateStatus(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="商品标准价" prop="productPrice"></el-table-column>
          <el-table-column label="商品报价" prop="price"></el-table-column>
          <el-table-column label="销售底价" prop="reservePrice"></el-table-column>
          <el-table-column label="续费底价" prop="reserveRenewPrice"></el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template slot-scope="scope">
              <el-button size="mini" @click="deleteItem(scope.row)">删除</el-button>
              <el-button size="mini" v-if="scope.row.itemType === 'DEVICE'" @click="editGoods(scope.row.itemNo)">
                编辑
              </el-button>
              <el-button size="mini" v-else-if="scope.row.itemType === 'OVERLAY'" @click="editOverlay(scope.row)">
                编辑
              </el-button>
              <el-button size="mini" v-else @click="editPackage(scope.row.itemNo)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          @current-change="changePageIndex"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total">
        </el-pagination>
      </div>
      <el-dialog
        :visible="isShowFlowRenew"
        title="加油包&流量池叠加包"
        width="360px"
        :show-close="false"
      >
        <el-form label-width="100px" ref="flowRenewRef" :model="flowRenewForm" :rules="flowRenewFormRule">
          <el-form-item label="标准价：" prop="productPrice">
            <el-input v-model="flowRenewForm.productPrice">
              <template slot="append">元/GB</template>
            </el-input>
          </el-form-item>
          <el-form-item label="平台价：" prop="price">
            <el-input v-model="flowRenewForm.price">
              <template slot="append">元/GB</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销售底价：" prop="reservePrice">
            <el-input v-model="flowRenewForm.reservePrice">
              <template slot="append">元/GB</template>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowFlowRenew = false">取 消</el-button>
          <el-button type="primary" @click="handleSaveFlowRenew">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
