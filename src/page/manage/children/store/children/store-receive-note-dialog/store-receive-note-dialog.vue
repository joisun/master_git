<script>
/**
 * 入库单填写弹窗
 * @ author: szy
 * @ date: 2022/5/16 15:41
 */
import baseReceiveTemplate from './components/base-receive-template.vue'
const DEFAULT_CONFIG = {
  carrier: '',
  carrierAccountId: '',
  carrierChargeId: '',
  isNBIoTAccount: false,
  batchPrefix: '',
  carrierRealName: false,
  carrierType: '',
  isExtWhitelistEnable: false
}
export default {
  name: 'store-receive-note',
  components: {
    'base-receive-template': baseReceiveTemplate
  },
  data() {
    return {
      carrierAccountList: [],
      config: {
        ...DEFAULT_CONFIG
      },
      visible: false,
      loading: false,
      options: {}
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
      this.resetConfig()
    },
    genCarrierAccountListByCarrier() {
      this.carrierAccountList =
        this.$store.state.carrierAccount[`${this.config.carrier}AccountList`]
      this.carrierAccountList = this.carrierAccountList || []
    },
    onCarrierChange(v) {
      // 重置config 防止复制的情况影响
      this.config = {
        ...DEFAULT_CONFIG,
        carrier: v
      }
      this.genCarrierAccountListByCarrier()
      if (this.carrierAccountList && this.carrierAccountList.length) {
        this.config.carrierAccountId = this.carrierAccountList[0].id
      } else {
        this.config.carrierAccountId = ''
      }
      this.changeCarrierAccount(this.config.carrierAccountId)
    },
    handleClose() {
      this.resetConfig()
      this.visible = false
    },
    resetConfig() {
      this.config = {
        ...DEFAULT_CONFIG
      }
    },
    async open(config, options) {
      this.options = options || {}
      await this.$store.dispatch('changeAccountList')
      await this.$store.dispatch('changeClassificationList')
      if (config) {
        this.config = { ...config, importId: config.id, noDb: true }
        this.genCarrierAccountListByCarrier()
        this.updateConfigWhenCarrierAccountChange(config.carrierAccountId)
      }
      this.visible = true
    },
    // onCloseMainPage() {
    //   this.shortcuts.confirm('确定要退出？当前填写的入库清单单会被清空。', () =>
    //     this.enterRouter('store-card')
    //   )
    // },
    updateConfigWhenCarrierAccountChange(v) {
      const item = this.carrierAccountList.find((item) => item.id === v)
      if (!v || !item) {
        this.resetConfig()
        return
      }
      this.isExtWhitelistEnable =
        item.type === 'CMCC_CTBOSS' && item.nbIoTAccount === false && item.vpdnAccount === false
      this.config.carrierAccountId = ''
      this.$nextTick(() => {
        this.config = {
          ...this.config,
          carrierAccountId: v,
          ...(item || {}),
          carrierType: item && item.type,
          isNBIoTAccount: item && item.nbIoTAccount
        }
      })
    },
    changeCarrierAccount(v) {
      this.config = {
        ...DEFAULT_CONFIG,
        carrierAccountId: v
      }
      this.updateConfigWhenCarrierAccountChange(v)
    },
    enterRouter(name) {
      this.$router.push({ name: name })
    },
    changeLoadStatus(status) {
      this.loading = status
    },
    async handleSubmit() {
      const data = await this.$refs.baseReceive.onSubmit()
      if (!data) return
      this.$confirm('即将提交入库单，确认表单无误?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.cardImport(data)
        })
        .catch((e) => console.log(e))
    },
    async cardImport(form) {
      this.loading = true
      this.$emit('loading', true)
      let ret = await this.jaxLib.card.postReceiveNote(form)
      if (ret.success) {
        this.$message.success('入库单提交成功')
        // this.enterRouter('store-record-inner')
        this.visible = false
        this.$refs.baseReceive.saveToDb()
        this.resetConfig()
        this.$emit('confirm')
      } else {
        this.$message.error(ret.message)
      }
      // this.$emit('loading', false)
      this.loading = false
    }
  }
}
</script>

<template>
  <el-dialog
    title="入库"
    :visible="visible"
    width="89%"
    :before-close="handleClose"
    destroy-on-close
  >
    <div class="store-entry-bound">
      <div v-loading="loading" class="wh__body">
        <el-row v-if="visible">
          <span v-if="options.disabled" class="mr20"> 入库ID: {{ config.importId }} </span>
          <el-select
            v-model="config.carrier"
            placeholder="请选择运营商"
            :disabled="options.disabled"
            @change="onCarrierChange"
          >
            <el-option
              v-for="(label, value) in enums.carrier.maps()"
              :key="value"
              :value="value"
              :label="label"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="config.carrierAccountId"
            placeholder="请选择运营商账号"
            :clearable="false"
            :disabled="options.disabled"
            style="width: 300px"
            @change="changeCarrierAccount"
          >
            <el-option
              v-for="i in carrierAccountList"
              :key="i.id + i.name"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
          <span v-if="config.carrier && config.carrierAccountId" class="ml20">
            卡类型: {{ config.isNBIoTAccount ? 'NB-IOT卡' : '普通物联网卡' }}
          </span>
        </el-row>
        <hr class="mt10 mb10" />
        <div v-if="!config.carrierAccountId" class="mt20 tac">请先选择对应的运营商账号。</div>
        <template v-if="config.carrierAccountId && visible">
          <div v-if="!config.carrierChargeId" class="mt20 tac">
            对应运营商还没有创建资费表，请先创建资费表。
          </div>
          <base-receive-template
            v-else
            ref="baseReceive"
            :form-scheme="{
              ICCID: { show: !options.disabled }
            }"
            :config="config"
            :disabled="options.disabled"
            :form-config-to-restore="{
              cardIssuer: 'cardIssuer',
              protocolStack: 'protocolStack',
              productionBatch: 'productionBatch',
              city: 'city',
              cardProductionDate: 'cardProductionDate',
              testingEndType: 'testingEndType', // 测试期结束方式
              type: 'ratePlanType', // 套餐类型
              testingType: 'hasTesting', // 是否有测试期
              testDataVolume: 'testDataVolume', // 测试期流量
              // testDeadline: 'testDeadline', // 测试期结束时间
              chargeCategoryId: 'chargeCategoryId', //入库套餐规格,需要返回套餐规格id(id)
              // activationDeadline: 'activationDeadLine', // 激活宽限期结束时间
              cardMaterialId: 'cardMaterialId', // TODO 卡片材质，需要返回材质id (chargeEntryId)
              specification: 'cardSpecification', // 规格
              featureFee: 'featureFee', // TODO 功能费(如果有则返回)
              tags: 'specialLimit', // TODO 运营商特殊限， 特殊限制
              locationService: 'locationService', // TODO 定位功能
              freeForFirstMonth: 'freeForFirstMonth', // TODO 首月不计入套餐时间
              ...(options.extraRestore || {})
            }"
            @loading="changeLoadStatus"
          />
        </template>
      </div>
    </div>
    <div v-if="!options.disabled" slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
