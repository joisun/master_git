<template>
  <div class="network">
    <div class="wh-tool">
      <div class="warning">
        <p>提示：</p>
        <p>1、计费方式为按照流量套餐的百分比收费</p>
        <p>
          2、存在报价范围的产品，当按比例计算的增值服务费小于或大于报价范围时，则自动取报价范围的上下限。
        </p>
      </div>
      <el-button class="float-right" type="primary" @click="saveOffer"
        >保存报价</el-button
      >
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
        <el-table-column label="平台报价" prop="price" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.offerType === 'ACL_POLICY_WHITE'">
              <span
                >报价范围：{{ scope.row.minPrice }}
                ~
                {{ scope.row.maxPrice }}元</span
              >
              <span style="margin-left: 16px">比例 {{ scope.row.price }}%</span>
            </div>
            <span v-else>{{ scope.row.price }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="销售底价" prop="bottomPrice" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.offerType === 'ACL_POLICY_WHITE'">
              <span
                >报价范围：{{ scope.row.minBottomPrice }}
                ~
                {{ scope.row.maxBottomPrice }}元</span
              >
              <span style="margin-left: 16px"
                >比例 {{ scope.row.bottomPrice }}%</span
              >
            </div>
            <span v-else>{{ scope.row.bottomPrice }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="销售报价" width="400">
          <template slot-scope="scope">
            <div v-if="scope.row.offerType === 'ACL_POLICY_WHITE'">
              <span
                >报价范围：<el-input-number
                  :controls="false"
                  v-model="scope.row.minSalesPrice"
                  style="width: 80px"
                  :min="0"
                  :precision="2"
                  :max="scope.row.maxSalesPrice - 0.01"
                />
                —
                <el-input-number
                  :controls="false"
                  :precision="2"
                  v-model="scope.row.maxSalesPrice"
                  style="width: 80px"
                  :min="scope.row.minSalesPrice + 0.01"
                />元</span
              >
              <span style="margin-left: 16px"
                >比例
                <el-input-number
                  :controls="false"
                  v-model="scope.row.salesPrice"
                  style="width: 60px"
                  :min="0"
                />%</span
              >
            </div>
            <span v-else>
              <el-input-number
                style="width: 95%"
                :controls="false"
                v-model="scope.row.salesPrice"
                size="small"
                :min="0"
                @change="changePrice(scope.row, scope.$index)"
              >
              </el-input-number>
              %
            </span>
            <div
              v-if="scope.row.errMsg"
              class="price-set__error"
              v-text="scope.row.errMsg"
            ></div>
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
          category: 'NET',
          orgId: this.$route.query.orgId
        })
        if (!res.success) return false
        this.tableData = res.data.map((item) => {
          item.price /= 100
          item.bottomPrice /= 100
          item.salesPrice /= 100
          if (item.offerType === 'ACL_POLICY_WHITE') {
            item.minPrice /= 10000
            item.maxPrice /= 10000
            item.minBottomPrice /= 10000
            item.maxBottomPrice /= 10000
            item.minSalesPrice /= 10000
            item.maxSalesPrice /= 10000
          }
          return item
        })
      },
      changePrice(row) {
        row.salesPrice < 0
          ? (row.errMsg = '平台报价不能低于0%的比例')
          : (row.errMsg = '')
      },
      async saveOffer() {
        let hasError = false
        this.tableData.forEach((item) => {
          if (item.errMsg) {
            hasError = true
            return false
          }
        })
        if (hasError) return false

        let postData = this.tableData.map((item) => {
          return {
            salePrice: (item.salesPrice * 100).toFixed(0) / 10000,
            orgId: this.$route.query.orgId,
            offerType: item.offerType,
            minSalesPrice: _.round(item.minSalesPrice, 2),
            maxSalesPrice: _.round(item.maxSalesPrice, 2)
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
