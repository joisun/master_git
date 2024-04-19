<template>
  <div class="network">
    <div class="wh-tool">
      <span class="warning">提示：计费方式为按照X元/张/次收费</span>
      <el-button class="float-right" type="primary" @click="saveOffer">保存报价</el-button>
    </div>
    <div class="wh__body">
      <el-table :data="tableData">
        <el-table-column label="序号">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="产品名称">
          <template slot-scope="scope">
            <span v-text="OFFER_TYPE_MAP[scope.row.offerType]"></span>
          </template>
        </el-table-column>
        <el-table-column label="平台报价" prop="price"></el-table-column>
        <el-table-column label="销售底价" prop="bottomPrice"></el-table-column>
        <el-table-column label="销售报价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.salesPrice" size="small" @change="changePrice(scope.row, scope.$index)" type="number">
              <template slot="append">元/张/次</template>
            </el-input>
            <div v-if="scope.row.errMsg" class="price-set__error"
              v-text="scope.row.errMsg"></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        OFFER_TYPE_MAP: this.enums.offerType.maps()
      }
    },
    created() {
      this.getSalesOfferList()
    },
    methods: {
      async getSalesOfferList() {
        let res = await this.jaxLib.customer.priceTable.getSalesOfferList({
          category: 'LBS',
          orgId: this.$route.query.orgId
        })
        if (!res.success) return false
        this.tableData = res.data.map(item => {
          item.price = item.price / 10000 + '元/张/次'
          item.bottomPrice = item.bottomPrice / 10000 + '元/张/次'
          item.salesPrice /= 10000
          return item
        })
      },
      changePrice(row) {
        !row.salesPrice ? row.errMsg = '请输入销售报价' : row.errMsg = ''
        if (!row.errMsg) {
          let afterPoint = row.salesPrice.split('.')[1]
          if (afterPoint && afterPoint.length > 2) {
            row.errMsg = '小数点后最多输入两位'
          }
        }
      },
      async saveOffer() {
        let hasError = false
        this.tableData.forEach(item => {
          if (item.errMsg) {
            hasError = true
            return false
          }
        })
        if (hasError) return false

        let postData = this.tableData.map(item => {
          return {
            salePrice: item.salesPrice,
            orgId: this.$route.query.orgId,
            offerType: 'LBS'
          }
        })
        let res = await this.jaxLib.customer.priceTable.saveSalesOffer({
          salesOffers: postData
        })
        if (!res.success) return false
        this.$message({ type: 'success', message: '保存成功' })
        this.getSalesOfferList()
      }
    }
  }
</script>
