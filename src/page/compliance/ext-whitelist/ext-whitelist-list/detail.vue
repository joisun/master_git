<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="handleClose"
    destroy-on-close
    width="80%"
    close-on-click-modal
    close-on-press-escape
  >
    <el-row>
      <el-col v-if="content.carrier === 'cmcc'" :span="12">
        <span class="detail-modal-basic__label">白名单ID:</span>
        {{ content.poolId }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">白名单名称:</span>
        {{ content.poolName }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">销售:</span>
        {{ content.saleName | saleFilter }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">运营商:</span>
        {{ content.carrier | carrierFilter }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">运营商账号:</span>
        {{ content.signedCarrierName }}
      </el-col>
      <el-col v-if="content.carrier === 'cmcc'" :span="12">
        <span class="detail-modal-basic__label">业务名称:</span>
        {{ content.businessName }}
      </el-col>
      <el-col v-if="content.carrier === 'chinanet'" :span="12">
        <span class="detail-modal-basic__label">白名单业务名称/群组号:</span>
        {{ content.groupNo }}
      </el-col>
      <el-col :span="24">
        <div class="detail-modal-basic__label" style="margin: 15px 0">IP/域名</div>
        <el-table v-if="visible" :data="content.detail.addressList" style="width: 100%">
          <el-table-column prop="addressType" label="类型" width="180">
            <template #default="{ row }">
              {{ getTypeCn(row.addressType) }}
            </template>
          </el-table-column>
          <el-table-column prop="explanation" label="协议号" width="180" />
          <el-table-column prop="address" label="内容" />
          <el-table-column prop="effectTime" label="生效时间">
            <template #default="{ row }">
              {{ row.effectiveDate | dateFilter }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <div class="detail-modal-basic__label" style="margin: 15px 0">ICCID</div>
        <card-table
          v-if="visible"
          :id="content.poolCarrierId"
          :show-action="false"
          api="getIccidList"
          id-key="poolCarrierId"
        />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import CardTable from '@/page/compliance/ext-whitelist/components/card-table'
export default {
  components: {
    CardTable
  },
  data() {
    return {
      addMap: {
        ADD: '新增',
        DEL: '删除'
      },
      visible: false,
      id: '',
      content: {
        detail: {
          iccidList: [],
          addressList: []
        }
      }
    }
  },
  created() {
    this.getAddressTypeList()
  },
  methods: {
    handleClose() {
      this.content = {
        detail: {
          iccidList: [],
          addressList: []
        }
      }
      this.visible = false
    },
    async open(id) {
      this.id = id
      await this.getDetail(id)
      this.visible = true
    },
    getTypeCn(type) {
      return (this.typeOptions.find((item) => item.val === type) || {})[
        `${this.content.carrier}Desc`
      ]
    },
    async getAddressTypeList() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.listPoolAddressType({})
      this.loading = false
      if (!success) return false
      this.typeOptions = data
    },
    async getDetail(id) {
      const res = await this.jaxLib.whitelist.extWhiteListDetail({ poolCarrierId: id })
      if (res && res.success) {
        this.content = res.data
      }
    }
  }
}
</script>

<style scoped lang="scss">
.detail-modal-basic {
  font-size: 16px;
  &__label {
    margin-right: 10px;
  }
}
.detail-modal-row {
  border: 1px solid #ddd;
  padding: 30px;
  margin: 20px 0;
  &__title {
    font-size: 18px;
    margin-bottom: 15px;
    font-weight: 500;
  }
}
</style>
