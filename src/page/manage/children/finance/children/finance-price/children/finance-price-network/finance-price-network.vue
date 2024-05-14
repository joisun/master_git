<template>
  <div class="finance-price-network">
    <div class="wh__tools--mix">
      <div class="warning">
        <p>提示：</p>
        <p>1、用户能否订购网络产品依赖于套餐分类的【VPDN】专网标签。</p>
        <p>2、计费方式为按照套餐费用的百分比收费。</p>
      </div>
      <el-button
        type="primary"
        @click="savePlatformOffer"
        class="float-right"
        style="margin-bottom: 10px"
        >保存报价
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
          <el-table-column label="平台报价" width="400">
            <template slot-scope="scope">
              <div v-if="scope.row.offerType === 'ACL_POLICY_WHITE'">
                <span
                  >报价范围：<el-input-number
                    :controls="false"
                    v-model="scope.row.minPrice"
                    style="width: 80px"
                    :min="0"
                    :precision="2"
                    :max="scope.row.maxPrice - 0.01"
                  />
                  —
                  <el-input-number
                    :controls="false"
                    :precision="2"
                    v-model="scope.row.maxPrice"
                    style="width: 80px"
                    :min="scope.row.minPrice + 0.01"
                  />元</span
                >
                <span style="margin-left: 16px"
                  >比例
                  <el-input-number
                    :controls="false"
                    v-model="scope.row.price"
                    style="width: 60px"
                    :min="0"
                  />%</span
                >
              </div>
              <el-input
                v-else
                size="small"
                v-model="scope.row.price"
                type="number"
                :class="{ 'price_set__error--input': scope.row.priceErrMsg }"
                @change="changePrice(scope.row, scope.$index)"
              >
                <template slot="append">%</template>
              </el-input>
              <div
                v-if="scope.row.priceErrMsg"
                class="price-set__error"
                v-text="scope.row.priceErrMsg"
              ></div>
            </template>
          </el-table-column>
          <el-table-column label="销售底价" width="400">
            <template slot-scope="scope">
              <div v-if="scope.row.offerType === 'ACL_POLICY_WHITE'">
                <span
                  >报价范围：<el-input-number
                    :controls="false"
                    v-model="scope.row.minBottomPrice"
                    style="width: 80px"
                    :min="0"
                    :precision="2"
                    :max="scope.row.maxBottomPrice - 0.01"
                  />
                  —
                  <el-input-number
                    :controls="false"
                    :precision="2"
                    v-model="scope.row.maxBottomPrice"
                    style="width: 80px"
                    :min="scope.row.minBottomPrice + 0.01"
                  />元</span
                >
                <span style="margin-left: 16px"
                  >比例
                  <el-input-number
                    :controls="false"
                    v-model="scope.row.bottomPrice"
                    style="width: 60px"
                    :min="0"
                  />%</span
                >
              </div>
              <el-input
                v-else
                size="small"
                v-model="scope.row.bottomPrice"
                type="number"
                :class="{
                  'price_set__error--input': scope.row.bottomPriceErrMsg
                }"
                @change="changePrice(scope.row, scope.$index)"
              >
                <template slot="append">%</template>
              </el-input>
              <div
                v-if="scope.row.bottomPriceErrMsg"
                class="price-set__error"
                v-text="scope.row.bottomPriceErrMsg"
              ></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
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
        row.price <= 0
          ? (row.priceErrMsg = '平台报价不得低于0%的比例')
          : (row.priceErrMsg = '')
        row.bottomPrice <= 0
          ? (row.bottomPriceErrMsg = '销售底价不得低于0%的比例')
          : (row.bottomPriceErrMsg = '')
      },
      async getList() {
        this.loading = true
        let res = await this.jaxLib.financial.network.getPlatFormOfferList({
          category: 'NET'
        })
        this.loading = false
        if (!res.success) return false
        this.tableData = res.data.map((item) => {
          item.bottomPrice /= 100
          item.price /= 100
          if (item.offerType === 'ACL_POLICY_WHITE') {
            item.minBottomPrice /= 10000
            item.maxBottomPrice /= 10000
            item.minPrice /= 10000
            item.maxPrice /= 10000
          }
          return item
        })
      },
      async savePlatformOffer() {
        let hasError = false
        this.tableData.forEach((item) => {
          if (item.priceErrMsg || item.bottomPriceErrMsg) {
            hasError = true
            return false
          }
        })
        if (hasError) return false
        let postData = this.tableData.map((item) => {
          const {
            id,
            price,
            bottomPrice,
            minPrice,
            maxPrice,
            minBottomPrice,
            maxBottomPrice
          } = item
          return {
            id,
            price: (price * 100).toFixed(0) / 10000,
            bottomPrice: (bottomPrice * 100).toFixed(0) / 10000,
            minPrice: _.round(minPrice, 2),
            maxPrice: _.round(maxPrice, 2),
            minBottomPrice: _.round(minBottomPrice, 2),
            maxBottomPrice: _.round(maxBottomPrice, 2)
          }
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
