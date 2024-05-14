<script>
  import apis from '@/api/ajax'

  export default {
    data() {
      return {
        activeName: 'client-price-set-package',
        tableData: [],
        loading: false,
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        }
      }
    },
    computed: {
      orgId() {
        return Number(this.$route.query.id) || 0
      },
      customerName() {
        return this.$route.query.orgName
      }
    },
    created() {
      this.activeName = this.$route.name
      this.getList()
    },
    methods: {
      async getList() {
        const { pageIndex, pageSize } = this.page
        this.loading = true
        const { success, data: { page, list } } = await apis.cpe.getCustomerPriceList({
          pageIndex,
          pageSize,
          orgId: this.orgId
        })
        this.loading = false
        if (!success) return false
        this.tableData = list
        this.page.total = page.allCount
      },
      changePageIndex(val) {
        this.page.pageIndex = val
        this.getList()
      },
      async updateOfferStatus({ id, status, itemNo, itemType }) {
        this.loading = true
        const { success, message } = await apis.cpe.updateOfferStatus({
          orgId: this.orgId,
          platformOfferId: id,
          status,
          itemNo,
          itemType
        })
        this.loading = false
        if (success) {
          this.$message({ type: 'success', message })
        }
      },
      backToCustomerList() {
        this.$router.push({ name: 'cpe-client-list' })
      },
      changePrice(row, type) {
        if (type === 'salePriceErrMsg') {
          if (!/^\d+(.\d{1,4})?$/.test(row.salePrice)) {
            row.salePriceErrMsg = '请输入正确的价格'
          } else {
            row.salePriceErrMsg = row.salePrice < row.reservePrice ? '销售报价不得低于销售底价' : ''
          }
        } else if (type === 'saleRenewPrice') {
          if (!/^\d+(.\d{1,4})?$/.test(row.saleRenewPrice)) {
            row.salePriceErrMsg = '请输入正确的价格'
          } else {
            row.saleRenewPriceErrMsg = row.saleRenewPrice < row.reserveRenewPrice ? '续费报价不得低于续费底价' : ''
          }
        } else {
          if (!/^\d+(.\d{1,4})?$/.test(row.saleServiceFee)) {
            row.saleServiceFeeErrMsg = '请输入正确的价格'
          } else {
            row.saleServiceFeeErrMsg = row.saleServiceFee < row.reserveServiceFee ? '销售报价不得低于销售底价' : ''
          }
        }
      },
      async saveOffer() {
        const updateSaleOfferPriceROList = this.tableData.map(item => ({
          orgId: this.orgId,
          platformOfferId: item.id,
          price: Math.round(item.salePrice * 10000) / 10000,
          serviceFee: Math.round(item.saleServiceFee * 10000) / 10000,
          renewPrice: Math.round(item.saleRenewPrice * 10000) / 10000,
          itemNo: item.itemNo,
          itemType: item.itemType
        }))
        const { success, message } = await apis.cpe.batchUpdatePrice({ updateSaleOfferPriceROList })
        if (success) {
          this.$message({ type: 'success', message })
          this.getList()
        }
      }
    }
  }
</script>
<template>
  <div class="plan-manager">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">客户报价</h2>
        <span class="level2__back">
          <el-tooltip content="返回一级组织列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backToCustomerList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div>
        客户名:{{ customerName }}
      </div>
      <br/>
      <div class="wh__tools">
        <el-button size="mini" class="float-right" type="primary" @click="saveOffer">保存报价</el-button>
      </div>
      <div class="wh__body">
        <div class="wh__body--table">
          <el-table :data="tableData" v-loading="loading">
            <el-table-column label="产品ID" prop="itemNo"></el-table-column>
            <el-table-column label="产品名称">
              <template slot-scope="scope">
                <p>{{scope.row.itemName}}</p>
                <p v-if="scope.row.itemType === 'DEVICE'">{{scope.row.serviceName}} 每台/每年</p>
              </template>
            </el-table-column>
            <el-table-column label="产品型号">
              <template slot-scope="scope">{{scope.row.itemModel || '-'}}</template>
            </el-table-column>
            <el-table-column label="当前状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="on"
                  inactive-value="off"
                  @change="updateOfferStatus(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="平台报价">
              <template slot-scope="scope">
                <p>{{scope.row.price}}</p>
                <p>{{scope.row.serviceFee}}</p>
              </template>
            </el-table-column>
            <el-table-column label="销售底价">
              <template slot-scope="scope">
                <p>{{scope.row.reservePrice}}</p>
                <p>{{scope.row.reserveServiceFee}}</p>
              </template>
            </el-table-column>
            <el-table-column label="销售报价">
              <template slot-scope="scope">
                <p>
                  <el-input
                    v-model="scope.row.salePrice"
                    size="mini"
                    @input="changePrice(scope.row, 'salePriceErrMsg')"
                    placeholder="产品销售报价"
                    type="number"
                  />
                </p>
                <div v-if="scope.row.salePriceErrMsg" class="price-set__error" v-text="scope.row.salePriceErrMsg"></div>
                <template v-if="scope.row.itemType === 'DEVICE'">
                  <p>
                    <el-input
                      v-model="scope.row.saleServiceFee"
                      size="mini"
                      @input="changePrice(scope.row, 'saleServiceFeeErrMsg')"
                      placeholder="服务费销售报价"
                      type="number"
                    />
                  </p>
                  <div
                    v-if="scope.row.saleServiceFeeErrMsg"
                    class="price-set__error"
                    v-text="scope.row.saleServiceFeeErrMsg">
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="续费底价" prop="reserveRenewPrice"></el-table-column>
            <el-table-column label="续费报价">
              <template slot-scope="scope">
                <p>
                  <el-input
                    v-model="scope.row.saleRenewPrice"
                    size="mini"
                    @input="changePrice(scope.row, 'saleRenewPrice')"
                    placeholder="续费报价"
                    type="number"
                  />
                </p>
                <div v-if="scope.row.saleRenewPriceErrMsg" class="price-set__error" v-text="scope.row.saleRenewPriceErrMsg"></div>
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .el-table {
    p {
      &:first-child {
        margin-bottom: 5px;
      }
    }
  }
</style>
