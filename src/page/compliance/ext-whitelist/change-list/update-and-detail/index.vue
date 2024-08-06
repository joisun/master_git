<template>
  <div>
    <div class="wh__header">
      <h2 class="wh-title">{{ flowNo ? '' : '新增' }}合规变更</h2>
      <span class="level2__back" style="top: 0">
        <el-tooltip content="返回" placement="left" effect="dark">
          <wh-std-icon sign="xe6aa" @click="goBack"></wh-std-icon>
        </el-tooltip>
      </span>
    </div>

    <el-card style="margin-bottom: 20px">
      <p style="font-size: 12px; margin-bottom: 30px">
        1、移动卡若选择本月生效，且实际【运营商侧变更确认】节点完成时间和提交时间为同一个月，则需要客户支付1元/张卡，并且此金额不计入销售提成中；<br/>
        2、电信卡只有杭州电信可以转公网限额，并且无论生效时间选择哪一个，都需要客户支付1.3元/张卡，并且此金额不计入销售提成中；<br/>
        3、选定次月生效或者立即生效就不能做二次更改-运营商侧无法做二次更改; <br/>
        4、移动每月20号之后禁止提交立即生效工单; <br/>
        5、电信每月25号之后禁止提交立即生效工单;<br/>
        6、每月最后两日禁止提交任何工单；<br/>
        7、套餐变更引起进行变化会在销售确认前进行扣除或退回，合规类型变更引起的1元/张或1元/张扣款会在销售确认后进行扣除，金额的变化都会计算在实际变更时间的月份上；
      </p>
      <el-form
          ref="form"
          :model="formData"
          label-width="120px"
          size="large"
          :rules="computedFormRules"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item v-if="formData.flowNo" label="流程编号">
              {{ formData.flowNo }}
            </el-form-item>
            <el-form-item label="变更类型" prop="type">
              <el-select
                  v-model="formData.type"
                  :disabled="commonDisabled"
                  placeholder="变更类型"
                  clearable
                  @change="handleTypeChange"
              >
                <el-option
                    v-for="(key, val) in enums.complianceType.maps()"
                    :key="val"
                    :label="key"
                    :value="val"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="变更原因" prop="changeReason">
              <el-select
                  v-model="formData.changeReason"
                  placeholder="变更原因"
                  clearable
                  :disabled="commonDisabled"
              >
                <el-option
                    v-for="(key, val) in enums.complianceChangeReason.maps()"
                    :key="val"
                    :label="key"
                    :value="val"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <h4 style="margin-bottom: 12px; color: #666">客户信息</h4>
        <el-row>
          <el-col :span="6">
            <el-form-item label="客户ID" prop="orgId">
              <el-select
                  v-model="formData.orgId"
                  :disabled="commonDisabled"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="输入客户ID搜索"
                  :remote-method="queryOrgAsync"
                  @change="orgIdChange"
              >
                <el-option
                    v-for="item in orgNameList"
                    :key="item.id"
                    :label="`${item.id} (${item.orgName})`"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称">
              {{ formData.orgName }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属销售">
              {{ formData.saleName | saleFilter }}
            </el-form-item>
          </el-col>
        </el-row>
        <h4 style="margin-bottom: 12px; color: #666">卡信息</h4>
        <el-row>
          <el-col :span="6">
            <el-form-item label="运营商" prop="carrier">
              <el-select
                  v-model="formData.carrier"
                  placeholder="请选择运营商"
                  :disabled="commonDisabled"
                  @change="carrierChange"
              >
                <el-option label="中国移动" value="cmcc"/>
                <el-option label="中国电信" value="chinanet"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生效时间" prop="effectiveType">
              <el-select
                  v-model="formData.effectiveType"
                  placeholder="请选择生效时间"
                  :disabled="commonDisabled"
              >
                <el-option
                    v-for="(key, val) in enums.complianceEffectiveType.maps()"
                    :key="val"
                    :label="key"
                    :value="val"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="ICCID" required prop="iccidInputType">
              <el-radio-group
                  v-model="formData.iccidInputType"
                  :disabled="commonDisabled"
                  @change="inputTypeChange"
              >
                <el-radio label="2">手动输入</el-radio>
                <el-radio label="3">文件上传</el-radio>
                <el-radio v-if="formData.type === 'TW'" label="4">无，仅白名单池变更</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="formData.iccidInputType === '2'" prop="iccids" :rules="iccidsRules">
              <el-input
                  v-model="formData.iccids"
                  :disabled="commonDisabled"
                  type="textarea"
                  :rows="8"
                  style="width: 400px"
                  placeholder="可以直接复制excel中整列ICCID；手动输入多个ICCID，一行一个；最多10000个；"
                  @change="handleIccidChange"
              />
            </el-form-item>
            <el-form-item
                v-else-if="formData.iccidInputType === '3'"
                prop="fileUrl"
                :rules="iccidsRules"
            >
              <el-upload
                  ref="upload"
                  v-model="formData.excludeOssKey"
                  :disabled="commonDisabled"
                  accept=".pdf,.xlsx,.docx"
                  :limit="1"
                  drag
                  list-type="list"
                  action="/ajax/common/file/upload"
                  :on-success="onSuccess"
                  class="wh-file-upload"
                  :file-list="localFileList"
                  :on-remove="fileRemove"
              >
                <i slot="default" class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">
                  <p>
                    <el-button type="text" @click="downloadTemplate">模版文件</el-button>
                  </p>
                </div>
                <div
                    slot="file"
                    slot-scope="{ file }"
                    style="display: flex; justify-content: space-between"
                >
                  <span style="cursor: pointer" @click="downloadFile">
                    <i class="el-icon-download"></i> {{ file.name }}</span
                  >
                  <i class="el-icon-close" @click="removeFile"></i>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="是否套餐变更差价直接为0" prop="freePlanChange" label-width="300">
              <el-radio v-model="formData.freePlanChange" :label="true" :disabled="commonDisabled">是</el-radio>
              <el-radio v-model="formData.freePlanChange" :label="false" :disabled="commonDisabled">否</el-radio>
            </el-form-item>
            <el-form-item
                v-if="formData.iccidInputType !== '4'"
                label="销售价格"
                style="margin-bottom: 5px"
            >
              <sale-price
                  :is-op-or-su="isOpOrSu"
                  :form-data="formData"
                  style="margin-bottom: 22px"
                  :disabled="disabledWithSellerRole || formData.freePlanChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input
              v-model="formData.remark"
              style="width: 300px"
              type="textarea"
              rows="4"
              :disabled="disabledWithSellerRole"
          />
        </el-form-item>

        <template v-if="formData.type === 'TW'">
          <el-form-item
              label="白名单池操作"
              prop="extWhitelistWorkOrderSaveDTO.operateType"
              :rules="[{ required: !isOpOrSu, message: '请选择白名单池操作', trigger: 'submit' }]"
          >
            <el-radio-group
                v-model="formData.extWhitelistWorkOrderSaveDTO.operateType"
                :disabled="disabledWithSellerRole"
                @change="onOperateTypeChange"
            >
              <el-radio label="NEW">新增</el-radio>
              <el-radio label="EXISTED">已存在</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="formData.extWhitelistWorkOrderSaveDTO.operateType === 'EXISTED'">
            <el-form-item key="cmcc" label="白名单池" prop="groupNo" style="width: 300px">
              <el-select
                  v-model="formData.groupNo"
                  placeholder="请选择白名单池"
                  clearable
                  style="width: 300px"
                  :disabled="disabledWithSellerRole"
                  @change="(v) => onTemplateChange(v, true)"
              >
                <el-option
                    v-for="item in computedTemplateList"
                    :key="item.groupNo"
                    :label="`${item.poolName}`"
                    :value="item.groupNo"
                />
              </el-select>
            </el-form-item>
          </template>
          <ip-domain-table-form
              :operate-type="formData.extWhitelistWorkOrderSaveDTO.operateType"
              :cidr-max-count="formData.carrier === 'cmcc' ? 10 : 256"
              :carrier="formData.carrier"
              :address-list="formData.addressList"
              :required="!isOpOrSu"
              :disabled="disabledWithSellerRole"
              @change="ipDomainsChange"
          />
        </template>
        <el-form-item v-if="!disabledWithSellerRole">
          <el-button type="primary" :loading="loading" @click="onSubmit">提交</el-button>
          <el-button :loading="loading" @click="goBack">取消</el-button>
        </el-form-item>
        <el-button v-if="canClose" type="danger" :loading="loading" @click="handleFlowClose"
        >关闭
        </el-button
        >
      </el-form>
    </el-card>
    <process v-if="flowNo && formData.status" :flow-no="flowNo" :flow-data="formData"/>
  </div>
</template>

<script>
import SalePrice from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/sale-price.vue'
import IpDomainTableForm from './components/ip-domain-table-form.vue'
import Process from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/process.vue'
import {iccidsTransfer} from '@/global/function/iccids-tool'
import ajax from '@/api/ajax'
import {safeParse} from '@/global/function/safe-operations'
import filterQueryParams from '@/global/function/filterQueryParams'
import mixins from '@/page/compliance/ext-whitelist/mixins'

const DEFAULT_ADDRESS_LIST_ITEM = JSON.stringify({
  addressType: '',
  address: '',
  explanation: '',
  action: 'ADD'
})
const submitSchemas = {
  TV: {
    flowNo: '',
    type: 'TV', //变更类型
    changeReason: '', //变更原因
    orgId: '', //-客户ID
    carrier: '', //-运营商
    effectiveType: '', //-生效类型
    iccids: [],
    remark: '', //-备注
    freePlanChange: false,

    priceOfferShows: [],
    iccidsOssKey: '' //-oss文件地址
  },
  TL: {
    flowNo: '',
    type: 'TL', //变更类型
    changeReason: '', //变更原因
    orgId: '', //-客户ID
    carrier: '', //-运营商
    effectiveType: '', //-生效类u
    iccids: [],
    remark: '', //-备注
    freePlanChange: false,
    priceOfferShows: [],
    iccidsOssKey: '', //-oss文件地址
  },
  TW: {
    flowNo: '',
    type: 'TW',
    changeReason: '',
    effectiveType: '',
    orgId: '',
    iccids: [],
    remark: '',
    freePlanChange: false,
    priceOfferShows: [],
    extWhitelistWorkOrderSaveDTO: {
      carrier: '',
      submitterId: '',
      poolId: '',
      poolCarrierId: '',
      poolName: '',
      remark: '',
      detail: {
        addressList: [
          {
            address: '',
            action: '',
            explanation: '',
            addressType: '',
            effectiveDate: ''
          }
        ]
      },
      operateType: 'NEW',
      purpose: ''
    },
    iccidsOssKey: ''
  }
}
export default {
  components: {Process, IpDomainTableForm, SalePrice},
  mixins: [mixins],
  data() {
    const {flowNo = ''} = this.$route.query
    return {
      iccidsRulesCheck: true,
      loading: false,
      currentStatus: '',
      role: '',
      // canClose: false,
      templateList: [],
      flowNo,
      orgNameList: [],
      formData: {
        freePlanChange: false,
        status: '',
        iccids: '',
        iccidInputType: '2',
        priceOfferShows: [{
          salePrice: 1,
          price: ''
        }],
        addressList: [JSON.parse(DEFAULT_ADDRESS_LIST_ITEM)],
        saleName: '',
        orgName: '',
        groupNo: ''
      },
      localFileList: [],
      iccidsRules: {
        validator: async (_, value, callback) => {
          if (!this.iccidsRulesCheck) {
            return callback()
          }
          if (!value) {
            return callback('不能为空')
          }
          const res = await this.queryPackagesByIccids()
          if (!res.success) {
            return callback(res.message)
          }
          callback()
        },
        trigger: 'change'
      }
    }
  },
  watch: {
    'formData.freePlanChange'() {
      this.formData.priceOfferShows = this.formData.priceOfferShows.map(item => {
        return {
          ...item,
          price: item.salePrice
        }
      })
    }
  },
  computed: {
    commonDisabled() {
      return !!this.flowNo
    },
    disabledWithSellerRole() {
      if (!this.currentStatus) {
        return false
      }
      if (this.currentStatus === 'SUBMIT_APPLICATION') {
        if (!this.flowNo) {
          return false
        }
        return !this.isSeller
      }
      return true
    },
    isSeller() {
      return this.role === 'seller'
    },
    isOpOrSu() {
      return this.role === 'opOrSu'
    },
    computedFormRules() {
      const {isOpOrSu} = this
      return {
        type: [{required: true, message: '请选择变更类型', trigger: 'submit'}],
        changeReason: [{required: true, message: '请选择变更原因', trigger: 'submit'}],
        orgId: [{required: !isOpOrSu, message: '请选择客户ID', trigger: 'submit'}],
        carrier: [{required: true, message: '请选择运营商', trigger: 'submit'}],
        effectiveType: [{required: true, message: '请选择生效时间', trigger: 'submit'}],
        // operateType: [{ required: isSeller, message: '请选择白名单池操作', trigger: 'submit' }],
        groupNo: [{required: !isOpOrSu, message: '请选择白名单池'}]
      }
    },
    computedTemplateList() {
      const {carrier = ''} = this.formData
      return this.templateList.filter(
          (item) => item.carrier.toUpperCase() === carrier.toUpperCase()
      )
    }
  },
  async created() {
    await this.getRole()
    if (this.flowNo) {
      this.getDetail()
    }
  },
  methods: {
    // async handleFlowClose() {
    //   const res = await this.jaxLib.whitelist.forceClose({ flowNo: this.flowNo })
    //   if (res && res.success) {
    //     this.$message.success('关闭成功')
    //     this.$router.go(-1)
    //   }
    // },
    async getRole() {
      const {success, data} = await this.jaxLib.whitelist.opOrSu({})
      if (success) {
        this.role = data
        if (this.isSeller) {
          // 当发起人角色为销售时，默认选择客户发起，且不可修改；
          this.formData.changeReason = 'CUSTOM'
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      }
    },
    // async checkCanCLose() {
    //   const { success, data } = await this.jaxLib.whitelist.complianceCanClose({
    //     flowNo: this.flowNo
    //   })
    //   if (success) {
    //     this.canClose = data
    //   }
    // },
    async getPoolAddress(orgId) {
      if (!orgId) {
        this.templateList = []
        return
      }
      this.loading = true
      const {success, data} = await this.jaxLib.whitelist.listPoolAddress({orgId})
      this.loading = false
      if (!success) return false
      this.templateList = data
    },
    onTemplateChange(groupNo, isClearAddress) {
      this.$refs.form.clearValidate()
      this.formData.extWhitelistWorkOrderSaveDTO.poolId = ''
      const res = this.templateList.find((item) => item.groupNo === groupNo) || {}
      if (isClearAddress) {
        this.formData.addressList = [JSON.parse(DEFAULT_ADDRESS_LIST_ITEM)]
        this.formData.extWhitelistWorkOrderSaveDTO.poolId = res.poolId
        this.formData.extWhitelistWorkOrderSaveDTO.poolCarrierId = res.poolCarrierId
      }
      if (!groupNo) return
      this.formData.addressList =
          res.detail.addressList.length === 0
              ? [JSON.parse(DEFAULT_ADDRESS_LIST_ITEM)]
              : [
                ...res.detail.addressList.map((item) => {
                  return {
                    ...item,
                    address: (item.address || '').trim(),
                    action: !!isClearAddress ? '' : 'ADD',
                    isExist: !!isClearAddress
                  }
                })
              ]
    },
    carrierChange() {
      this.formData.groupNo = ''
      this.onOperateTypeChange()
    },
    updateFields(addForm, existForm) {
      if (this.formData.extWhitelistWorkOrderSaveDTO.operateType === 'NEW') {
        this.formData = {
          ...this.formData,
          ...addForm
        }
      } else {
        this.formData = {
          ...this.formData,
          ...existForm
        }
      }
    },
    onOperateTypeChange() {
      this.updateFields(
          // 1. 选择模版清除
          // 2. ip域名列表清除
          // 3. ICCID操作设置为[新增]
          {
            groupNo: '',
            template: '',
            addressList: [JSON.parse(DEFAULT_ADDRESS_LIST_ITEM)],
            iccidOperationType: 'ADD'
          },
          // 1. 业务名称清除
          // 2. ip域名列表清除
          {
            groupNo: '',
            addressList: [JSON.parse(DEFAULT_ADDRESS_LIST_ITEM)]
          }
      )
      if (this.formData.extWhitelistWorkOrderSaveDTO) {
        this.formData.extWhitelistWorkOrderSaveDTO.poolId = ''
        this.formData.extWhitelistWorkOrderSaveDTO.poolCarrierId = ''
      }
      this.$refs.form.clearValidate(['iccids'])
    },
    downloadTemplate() {
      window.open('https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/iccid-template.xlsx')
    },
    removeFile() {
      this.$refs.upload.clearFiles()
    },
    async downloadFile() {
      const {
        success,
        data: {fileUrl}
      } = await ajax.common.getDownloadUrlByNode({fileKey: this.formData.iccidsOssKey})
      if (!success) return false
      window.open(fileUrl.replace('http', 'https'))
    },
    async getDetail() {
      const res = await this.jaxLib.whitelist.getInfoByFlowNo({flowNo: this.flowNo})
      if (res && res.success) {
        this.formData = {
          ...this.formData,
          ...res.data
        }
        const {
          iccids,
          orgId,
          iccidsOssKey,
          priceOfferShows,
          extWhitelistWorkOrderSaveDTO,
          status
        } = res.data
        this.currentStatus = status
        this.iccidsRulesCheck = false
        if (iccidsOssKey) {
          this.formData.iccidInputType = '3'
          this.formData.fileUrl = iccidsOssKey
          this.localFileList = [{name: iccidsOssKey, url: ''}]
        } else if (iccids.length > 0) {
          this.formData.iccidInputType = '2'
          this.formData.iccids = iccids.join('\n')
        } else {
          this.formData.iccidInputType = '4'
        }
        priceOfferShows
            ? (this.formData.priceOfferShows = safeParse(priceOfferShows).map((item) => {
              return {
                ...item,
                salePrice: item.origPrice,
                price: item.price
              }
            }))
            : []
        await this.queryPackagesByIccids()
        await this.getPoolAddress(orgId)
        if (extWhitelistWorkOrderSaveDTO) {
          const {poolId} = extWhitelistWorkOrderSaveDTO
          if (poolId) {
            this.formData.groupNo = (
                this.computedTemplateList.find((item) => item.poolId === poolId) || {}
            ).groupNo
            this.onTemplateChange(this.formData.groupNo, true)
          }
          if (
              extWhitelistWorkOrderSaveDTO.detail &&
              extWhitelistWorkOrderSaveDTO.detail.addressList
          ) {
            this.formData.addressList = extWhitelistWorkOrderSaveDTO.detail.addressList
          }
        }
        await this.queryOrgAsync(orgId)
        this.orgIdChange(orgId)
        this.$nextTick(() => {
          this.iccidsRulesCheck = true
        })
      }
    },
    handleTypeChange(v) {
      this.formData = {
        ...this.formData,
        ...JSON.parse(JSON.stringify(submitSchemas[v] || {})),
        iccids: '',
        orgName: '',
        saleName: '',
        changeReason: this.isSeller ? 'CUSTOM' : ''
      }
    },
    orgIdChange(v) {
      const item = this.orgNameList.find((item) => item.id === v) || {}
      this.formData.saleName = item.saleName
      this.formData.orgName = item.orgName
      this.getPoolAddress(v)
    },
    async queryOrgAsync(queryString) {
      this.formData.orgName = ''
      const res = await this.jaxLib.customer.list.get(
          {
            pageIndex: 1,
            pageSize: 100,
            orgName: queryString,
            saler: ''
          },
          false
      )
      if (!res.success) return false
      this.orgNameList = res.data.list.map((e) => ({
        id: e.id,
        orgName: e.orgName,
        saleName: e.saleName
      }))
    },
    async queryPackagesByIccids() {
      const {iccids, fileUrl, iccidInputType} = this.formData
      if (iccidInputType === '4') {
        return
      }
      let params = {}
      if (iccidInputType === '2') {
        if (!iccids) return
        params = {
          iccids: iccidsTransfer(iccids).filter((item) => !!item)
        }
      } else if (iccidInputType === '3') {
        if (!fileUrl) return
        params = {
          iccidsOssKey: fileUrl
        }
      }
      const res = await this.jaxLib.whitelist.getPriceOfferByIccids(params)
      if (res && res.success) {
        this.formData.priceOfferShows = res.data.map((item) => {
          return {
            ...item,
            ...(this.formData.priceOfferShows.find((s) => s.priceOfferId === item.priceOfferId) ||
                {})
          }
        })
      }
      return res
    },
    handleIccidChange() {
    },
    bathInputChange() {
    },
    filterParams() {
      const {type, fileUrl, iccids, iccidInputType, addressList, remark, carrier, freePlanChange} = this.formData
      const params = {}
      if (type === 'TW') {
        this.formData.extWhitelistWorkOrderSaveDTO = {
          ...this.formData.extWhitelistWorkOrderSaveDTO,
          detail: {
            addressList: addressList
                // .filter((item) => item.action)
                .map(({action, address, addressType, explanation}) => ({
                  action,
                  address,
                  addressType,
                  explanation
                }))
          },
          remark,
          carrier,
          freePlanChange
        }
      }
      Object.keys(submitSchemas[type]).forEach((key) => {
        params[key] = this.formData[key]
      })
      if (iccidInputType === '2') {
        params.iccids = iccidsTransfer(iccids).filter((item) => !!item)
      }
      if (iccidInputType === '3') {
        params.iccids = []
        params.iccidsOssKey = fileUrl
      }
      if (iccidInputType === '4') {
        params.iccids = []
        params.iccidsOssKey = ''
      }
      return filterQueryParams(params)
    },
    async onSubmit() {
      await this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const res = await this.jaxLib.whitelist[
              this.flowNo ? 'complianceSaveAndSubmit' : 'complianceSubmit'
              ](this.filterParams())
          this.loading = false
          if (res && res.success) {
            this.$message.success('提交成功')
            this.goBack()
          }
        }
      })
    },
    inputTypeChange() {
      this.$refs.form.clearValidate(['iccids', 'fileUrl'])
    },
    fileChange(_, fileList) {
      this.localFileList = fileList
    },
    fileRemove() {
      this.localFileList = []
      this.formData.fileUrl = ''
    },
    async onSuccess(data) {
      if (data && data.data) {
        this.formData.fileUrl = data.data.filePosition
        this.$refs.form.validateField('fileUrl')
      }
    },
    ipDomainsChange(data, type) {
      this.formData.addressList = data
      if (type === 'DEL') {
        this.$refs.form.clearValidate()
      }
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
