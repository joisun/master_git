<template>
  <el-dialog
    width="80%"
    :visible.sync="visible"
    :before-close="handleClose"
    destroy-on-close
    close-on-click-modal
    close-on-press-escape
  >
    <el-row :key="content.workOrderNo">
      <el-col :span="12">
        <span class="detail-modal-basic__label">工单号:</span>
        {{ content.workOrderNo }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">申请人:</span>{{ content.submitter }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">销售:</span>{{ content.saleName | saleFilter }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">工单提交时间:</span>
        {{ content.submitDate && content.submitDate.time | dateFilter }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">运营商:</span>
        {{ content.carrier | carrierFilter }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">运营商账号:</span>
        {{ content.signedCarrierName }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">白名单池操作</span>
        {{ operateTypeMap[content.operateType] }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">白名单业务名称/群组号:</span>
        {{ content.groupNo }}
      </el-col>
      <el-col :span="12">
        <span class="detail-modal-basic__label">目的(使用场景):</span>
        {{ content.purpose }}
      </el-col>
      <el-col :span="24">
        <div class="detail-modal-basic__label" style="margin: 15px 0">IP/域名</div>
        <el-table :data="content.detail.addressList" style="width: 100%">
          <el-table-column prop="addressType" label="类型" width="180">
            <template #default="{ row }">
              {{ getTypeCn(row.addressType) }}
            </template>
          </el-table-column>
          <el-table-column prop="explanation" label="协议号" width="180" />
          <el-table-column prop="address" label="内容" />
          <el-table-column prop="action" label="变更类型">
            <template #default="{ row }">
              {{ addMap[row.action] }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <div class="detail-modal-basic__label" style="margin: 15px 0">ICCID</div>
        <card-table v-if="visible" :id="content.id" api="getWorkOrderIccidList" id-key="id" />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import CardTable from './card-table'
export default {
  components: {
    CardTable
  },
  data() {
    return {
      operateTypeMap: {
        EXISTED: '已存在',
        NEW: '新增'
      },
      addMap: {
        ADD: '新增',
        DEL: '删除'
      },
      visible: false,
      id: '',
      content: {
        detail: {}
      }
    }
  },
  created() {
    this.getAddressTypeList()
  },
  methods: {
    handleClose() {
      this.content = {
        detail: {}
      }
      this.visible = false
    },
    getTypeCn(type) {
      return (this.typeOptions.find((item) => item.val === type) || {})[
        `${this.content.carrier}Desc`
      ]
    },
    async open(id) {
      this.id = id
      await this.getDetail(id)
      this.visible = true
    },
    async getAddressTypeList() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.listPoolAddressType({})
      this.loading = false
      if (!success) return false
      this.typeOptions = data
    },
    async getDetail(id) {
      const res = await this.jaxLib.whitelist.workOrderDetail({ id })
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
