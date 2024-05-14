<template>
  <div class="finance-price-lbs">
    <div class="wh__tools--mix">
      <div class="warning">
        <p>提示：</p>
        <p>1、用户能否订购定位产品依赖于套餐分类的【定位功能】标签。</p>
        <p>2、计费方式按照X元/张/次计费。</p>
      </div>
      <el-button type="primary" @click="savePlatformOffer" class="float-right" style="margin-bottom: 10px;">保存报价
      </el-button>
    </div>
    <div class="wh__body" v-loading="loading">
      <div class="wh__body--table">
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
          <el-table-column label="平台报价">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.price" type="number"
                :class="{ 'price_set__error--input': scope.row.priceErrMsg }"
                @change="changePrice(scope.row, scope.$index)">
                <template slot="append">元/张/次</template>
              </el-input>
              <div v-if="scope.row.priceErrMsg" class="price-set__error" v-text="scope.row.priceErrMsg"></div>
            </template>
          </el-table-column>
          <el-table-column label="销售底价">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.bottomPrice" type="number"
                :class="{ 'price_set__error--input': scope.row.bottomPriceErrMsg }"
                @change="changePrice(scope.row, scope.$index)">
                <template slot="append">元/张/次</template>
              </el-input>
              <div v-if="scope.row.bottomPriceErrMsg" class="price-set__error"
                v-text="scope.row.bottomPriceErrMsg"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        loading: false,
        OFFER_TYPE_MAP: this.enums.offerType.maps()
      }
    },
    created() {
      this.getList()
    },
    methods: {
      changePrice(row) {
        !row.price ? row.priceErrMsg = '请输入平台报价' : row.priceErrMsg = ''
        !row.bottomPrice ? row.bottomPriceErrMsg = '请输入销售底价' : row.bottomPriceErrMsg = ''
        if (row.price) {
          let afterPoint = row.price.toString().split('.')[1]
          if (afterPoint && afterPoint.length > 2) {
            row.priceErrMsg = '小数点后最多输入两位'
          }
        }
        if (row.bottomPrice) {
          let afterPoint = row.bottomPrice.toString().split('.')[1]
          if (afterPoint && afterPoint.length > 2) {
            row.bottomPriceErrMsg = '小数点后最多输入两位'
          }
        }
      },
      async getList() {
        this.loading = true
        let res = await this.jaxLib.financial.network.getPlatFormOfferList({ category: 'LBS' })
        this.loading = false
        if (!res.success) return false
        this.tableData = res.data.map(item => {
          item.bottomPrice /= 10000
          item.price /= 10000
          return item
        })
      },
      async savePlatformOffer() {
        let hasError = false
        this.tableData.forEach(item => {
          if (item.priceErrMsg || item.bottomPriceErrMsg) {
            hasError = true
            return false
          }
        })
        if (hasError) return false
        let postData = this.tableData.map(item => {
          const { id, price, bottomPrice } = item
          return { id, price: price, bottomPrice: bottomPrice }
        })
        let res = await this.jaxLib.financial.network.savePlatformOffer({
          platformOffers: postData
        })
        if (!res.success) return false
        this.$message({ type: 'success', message: '保存成功' })
        this.getList()
      }
    }
  }
</script>
