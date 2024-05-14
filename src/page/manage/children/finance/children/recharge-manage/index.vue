<script>
import Download from '@/page/components/wh-download/wh-download'
import { iccidsTransfer } from '@/global/function/iccids-tool'
export default {
  data() {
    return {
      iccids: '',
      isLoading: false,
      tableData: []
    }
  },
  methods: {
    async search() {
      if (!this.iccids && !this.iccids.trim()) {
        return this.$message({ type: 'warning', message: 'ICCID不能为空' })
      }
      const iccids = iccidsTransfer(this.iccids)
      this.isLoading = true
      const { success, data } = await this.jaxLib.financial.getRechargePriceCost({ iccids })
      this.isLoading = false
      if (!success) return false
      const list = data || []
      // 对运营商、套餐ID、规格、渠道、续费成本进行表格相同行的单元格合并
      let carrierPos = 0
      let priceOfferIdPos = 0
      let offerTotalCost = 0 // 一个套餐的总续费成本
      let offerTotalCardCount = 0 // 一个套餐的总卡数
      for (let i = 0; i < list.length - 1; i++) {
        // 合并运营商
        if (list[i].carrier !== list[i + 1].carrier) {
          list[carrierPos].carrierRowspan = i + 1 - carrierPos
          carrierPos = i + 1
        } else {
          list[i].carrierRowspan = 0
        }
        // 合并套餐ID和计算总续费成本
        if (list[i].priceOfferId !== list[i + 1].priceOfferId) {
          offerTotalCost += Number(list[i].count) * Number(list[i].cost)
          offerTotalCardCount += list[i].count
          list[priceOfferIdPos].offerTotalCost = offerTotalCost
          list[priceOfferIdPos].priceOfferIdRowspan = i + 1 - priceOfferIdPos
          list[priceOfferIdPos].offerTotalCardCount = offerTotalCardCount
          priceOfferIdPos = i + 1
          offerTotalCost = 0
          offerTotalCardCount = 0
        } else {
          list[i].priceOfferIdRowspan = 0
          offerTotalCost += Number(list[i].count) * Number(list[i].cost)
          offerTotalCardCount += list[i].count
        }
      }
      list[carrierPos].carrierRowspan = list.length - carrierPos
      list[priceOfferIdPos].priceOfferIdRowspan = list.length - priceOfferIdPos
      list[priceOfferIdPos].offerTotalCost =
        offerTotalCost + Number(list[list.length - 1].count) * Number(list[list.length - 1].cost)
      list[priceOfferIdPos].offerTotalCardCount = offerTotalCardCount + list[list.length - 1].count
      this.tableData = list
    },
    async exportDetail() {
      if (!this.iccids && !this.iccids.trim()) {
        return this.$message({ type: 'warning', message: 'ICCID不能为空' })
      }
      const iccids = iccidsTransfer(this.iccids)
      const { data, success } = await this.jaxLib.financial.exportRechargePriceCost({ iccids })
      if (!success) return false
      await Download({ ...data })
    },
    handleSpanMerge({ row, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: row.carrierRowspan,
          colspan: 1
        }
      }
      if (columnIndex === 1 || columnIndex === 2 || columnIndex === 7) {
        return {
          rowspan: row.priceOfferIdRowspan,
          colspan: 1
        }
      }
    }
  }
}
</script>

<template>
  <div class="recharge-manage">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">续费管理</h2>
      </div>
      <div class="wh__body">
        <el-form label-width="80px">
          <el-form-item label="ICCID">
            <el-input
              v-model="iccids"
              type="textarea"
              placeholder="请输入ICCID"
              :rows="4"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="result">
          <div class="result-title">明细结果：</div>
          <p class="recharge-manage-warning">后台续费价格：拆分到每一个资源的成本卡量</p>
          <el-button class="mb10" @click="exportDetail">导出明细</el-button>
          <el-table v-loading="isLoading" :data="tableData" :span-method="handleSpanMerge" border>
            <el-table-column label="运营商" align="center">
              <template slot-scope="scope">{{ scope.row.carrier | carrierFilter }}</template>
            </el-table-column>
            <el-table-column label="套餐ID" prop="priceOfferId" align="center" />
            <el-table-column label="套餐规格" prop="volume" align="center" />
            <el-table-column label="出卡渠道" prop="carrierAccount" align="center" />
            <el-table-column label="卡片数量" prop="count" align="center" />
            <el-table-column label="渠道续费成本" align="center" prop="cost" />
            <el-table-column label="后台续费价格" align="center" prop="price" />
            <el-table-column label="套餐汇总续费成本" align="center">
              <template slot-scope="scope">
                {{
                  scope.row.offerTotalCardCount
                    ? (scope.row.offerTotalCost / scope.row.offerTotalCardCount).toFixed(2)
                    : '-'
                }}
              </template>
            </el-table-column>
            <el-table-column label="资源有效期" align="center">
              <template slot-scope="{ row }">
                <template v-if="row.cardChargeEndList">
                  <div v-for="item in row.cardChargeEndList" :key="item.resourceTimeEnd">
                    <el-popover placement="top" width="w300" trigger="click">
                      <template v-if="item.iccids && item.iccids.length !== 0">
                        <p v-for="iccid in item.iccids" :key="iccid">
                          {{ iccid }}
                        </p>
                      </template>
                      <p v-else>暂无数据</p>
                      <el-button slot="reference" type="text">{{
                        item.resourceTimeEnd | dateFilter
                      }}</el-button>
                    </el-popover>
                  </div>
                </template>
                <template v-else>无</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.recharge-manage {
  &-warning {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .el-form {
    margin-top: 20px;

    & .el-textarea {
      width: 400px;
    }
  }

  .result {
    &-title {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
