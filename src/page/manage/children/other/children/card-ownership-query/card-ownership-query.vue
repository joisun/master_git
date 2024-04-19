<script>
import whVolumeInputSelect from '@/page/components/wh-volume-input-select'
import { safeGet } from '@/global/function/safe-operations'
import batchCardInfoInput from '@/page/components/batch-card-info-input'
const clearObjectEmptyItem = (obj) => {
  const newObj = { ...obj }
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === '') {
      delete newObj[key]
    }
  })
  return newObj
}
export default {
  components: {
    whVolumeInputSelect,
    batchCardInfoInput
  },
  data() {
    return {
      signedCarrierList: [], // 所属运营商
      pageConfig: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
      },
      form: {
        isBatchSearch: true,
        carrierIds: [],
        search: '',
        type: 0,
        carrier: '',
        ossKey: '',
        volumeSize: '',
        orgName: ''
      },
      cardList: [],
      loading: false
    }
  },
  computed: {
    envMap() {
      return this.$store.state.overall.enum.env || []
    },
    cardCarrierType() {
      return this.$store.state.overall.enum.cardCarrierType || []
    },
    carrierMap() {
      return this.enums.carrier.maps()
    }
  },
  methods: {
    bathInputChange(data) {
      this.form = {
        ...this.form,
        ...data
      }
      this.onSearch()
    },
    onSearch() {
      this.pageConfig.pageIndex = 1
      if (this.form.isBatchSearch) {
        const data = this.$refs.batchCardInfoInput.getData()
        this.form = {
          ...this.form,
          ...data
        }
      }
      this.getCardList()
    },
    carrierChange() {
      this.getSignedCarrierList()
      this.form.carrierIds = []
      this.onSearch()
    },
    async getSignedCarrierList() {
      if (!this.form.carrier) {
        this.signedCarrierList = []
        return false
      }
      let res = await this.jaxLib.store.signedCarrierListGet({ carrier: this.form.carrier })
      if (!res.success) return false
      this.signedCarrierList = res.data
    },
    // 切页面
    onPageSizeChange(val) {
      this.pageConfig.pageSize = val
      this.getCardList()
    },
    handleCurrPage(val) {
      this.pageConfig.pageIndex = val
      this.getCardList(true)
    },
    async handleExport() {
      this.onSearch()
      const res = await this.jaxLib.cardOwnershipQuery.export(
        clearObjectEmptyItem(this.getParams())
      )
      if (safeGet(res, 'success', false)) {
        this.$message.success('操作成功，请到下载管理页面查看')
      }
    },
    async getCardList() {
      this.loading = true
      const params = this.getParams()
      const { carrierIds, iccids, msisdns, imsis, ips, ossKey, orgName } = params
      if (
        (!carrierIds || carrierIds.length === 0) &&
        !iccids &&
        !msisdns &&
        !imsis &&
        !ips &&
        !ossKey &&
        !params.hasOwnProperty('minVolume') &&
        !orgName
      ) {
        this.cardList = []
        this.pageConfig.totalCount = 0
        this.loading = false
        return
      }
      try {
        const res = await this.jaxLib.cardOwnershipQuery.getList(
          clearObjectEmptyItem({
            ...params,
            pageIndex: this.pageConfig.pageIndex,
            pageSize: this.pageConfig.pageSize
          })
        )
        this.loading = false

        if (!res.success) {
          this.cardList = []
          this.pageConfig.totalCount = 0
          this.loading = false
          return
        }
        this.cardList = safeGet(res, 'data.list', [])
        this.pageConfig.totalCount = safeGet(res, 'data.page.allCount', 0)
      } catch (e) {}
    },
    getParams() {
      const { type, carrierIds, ossKey, orgName, iccids, msisdns, imsis, ips } = this.form
      const params = {
        type,
        ossKey,
        orgName,
        iccids,
        msisdns,
        imsis,
        ips,
        carrierIds: (carrierIds || []).join()
      }
      if (this.form.volumeSize) {
        const pattern = /([0-9]+)(C|MB)/
        const rst = pattern.exec(this.form.volumeSize)
        const volume = parseFloat(rst[1])
        const unit = rst[2]
        params.minVolume = volume
        params.maxVolume = volume
        params.useCountAsVolume = unit === 'C'
      }
      return params
    }
    // onBatchInputChange(data) {
    //   this.form = {
    //     ...this.form,
    //     ...data
    //   }
    //   this.getCardList()
    // }
  }
}
</script>
<template>
  <div v-loading="loading" class="wh__warp" style="background-color: #fff">
    <div class="wh__header">
      <h2 class="wh-title">卡归属查询</h2>
    </div>
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-form :model="form" class="search-form-inline">
          <el-form-item prop="isBatchSearch">
            <el-radio v-model="form.isBatchSearch" :label="true">批量查询</el-radio>
            <el-radio v-model="form.isBatchSearch" :label="false">条件查询</el-radio>
          </el-form-item>
          <div v-if="!form.isBatchSearch" class="search-form-inline">
            <el-form-item>
              <el-select
                v-model="form.carrier"
                placeholder="选择运营商"
                clearable
                @change="carrierChange"
              >
                <el-option v-for="(val, key) in carrierMap" :key="key" :label="val" :value="key" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="form.carrierIds"
                style="width: 300px"
                placeholder="请选择运营商主账号"
                clearable
                collapse-tags
                multiple
                :loading="loading"
                @change="onSearch"
              >
                <el-option
                  v-for="item in signedCarrierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="form.orgName"
                placeholder="客户账号或ID"
                class="wh__tools--search-input"
                style="width: 120px"
                @keyup.enter.native="onSearch"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <wh-volume-input-select v-model="form.volumeSize" @input="onSearch" />
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item>
              <!--            <dialog-batch-iccid-input-search-v2-->
              <!--              ref="dialogBatchIccidInputSearch"-->
              <!--              v-model="form.search"-->
              <!--              temp-file-url="https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/iccid-ip-temp.xlsx"-->
              <!--              @change="onBatchInputChange"-->
              <!--            />-->
              <batchCardInfoInput
                ref="batchCardInfoInput"
                temp-file-url="https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/iccid-ip-temp.xlsx"
                @change="bathInputChange"
              />
            </el-form-item>
          </div>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
            <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--      <div class="wh__tools&#45;&#45;operate">-->
      <!--        <el-button class="float-right" @click="handleExport">导出</el-button>-->
      <!--      </div>-->
    </div>
    <div class="wh__body">
      <el-table :data="cardList" height="calc(100vh - 260px)">
        <el-table-column label="iccid" prop="iccid" width="200px" />
        <el-table-column label="MSISDN" prop="msisdn" min-width="140px" />
        <el-table-column label="imsis" prop="imsis" min-width="120px" />
        <el-table-column label="APN" prop="apn" min-width="120px" />
        <el-table-column label="IP" prop="ip" min-width="120px" />
        <el-table-column label="运营商侧类型" prop="dbType" width="200px">
          <template #default="{ row }">
            {{ row.dbType }}
          </template>
        </el-table-column>
        <el-table-column label="运营商" min-width="95px">
          <template #default="scope">
            {{ carrierMap[scope.row.carrier] }}
          </template>
        </el-table-column>
        <el-table-column label="运营商账号" prop="carrierUsername" min-width="135px" />
        <el-table-column label="入库时间" width="140px" align="center">
          <template #default="scope">
            <span>{{ scope.row.importDate | dateFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户(ID)" width="200px" align="center">
          <template #default="{ row }">
            <span>{{ row.orgId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户侧类型" width="140px">
          <template #default="{ row }">
            {{ row.type }}
          </template>
        </el-table-column>
        <el-table-column label="客户侧套餐ID" min-width="100px">
          <template #default="{ row }">
            {{ row.priceOfferId }}
          </template>
        </el-table-column>
        <el-table-column label="客户侧套餐" align="center">
          <template #default="{ row }">
            {{ row.userPlanName }}
            <!--            <span v-if="scope.row.ratePlan" v-tag-extract="{ volume: scope.row.ratePlan }"></span>-->
            <!--            <span v-else>-</span>-->
          </template>
        </el-table-column>
        <el-table-column label="设备状态" min-width="100px" align="center">
          <template #default="{ row }">
            {{ row.deviceStatus }}
          </template>
        </el-table-column>
        <el-table-column label="运营商状态" prop="user">
          <template #default="{ row }">
            {{ row.status }}
          </template>
        </el-table-column>
        <el-table-column label="出库时间" width="140px" align="center">
          <template #default="scope">
            <span>{{ scope.row.exportDate | dateFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" width="140px" align="center">
          <template #default="scope">
            <span>{{ scope.row.expireDate | dateFilter }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageConfig.pageIndex"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageConfig.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="pageConfig.totalCount"
        class="wh__body--page"
        @size-change="onPageSizeChange"
        @current-change="handleCurrPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-form-inline {
  & > .el-form-item {
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
