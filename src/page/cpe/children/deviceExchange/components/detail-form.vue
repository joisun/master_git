<template>
  <el-dialog :title="title" :visible.sync="visible">
    <el-form
      v-if="visible"
      ref="formRef"
      :model="form"
      :label-width="formLabelWidth"
      :rules="isDetail ? {} : computedRule"
      :validate-on-rule-change="false"
    >
      <el-form-item
        v-for="item in currentSchema"
        v-if="!item.hide"
        :key="item.dataIndex"
        :label="item.title"
        v-bind="item.formProps"
      >
        <el-radio-group
          v-if="item.valueType === 'radio'"
          v-model="form[item.dataIndex]"
          v-bind="item.fieldProps"
          :disabled="isDetail || item.disabled"
          v-on="item.fieldEvent"
        >
          <el-radio v-for="ve in item.valueEnum" :key="ve.value" :label="ve.value">{{
            ve.label
          }}</el-radio>
        </el-radio-group>
        <el-select
          v-else-if="item.valueType === 'select'"
          v-model="form[item.dataIndex]"
          auto-complete="none"
          :clearable="false"
          :disabled="isDetail || item.disabled"
          v-bind="item.fieldProps"
          style="width: 100%"
          placeholder=""
        >
          <el-option
            v-for="(option, index) in item.valueEnum"
            :key="index"
            :value="option.value"
            :label="option.label"
          >
          </el-option>
        </el-select>
        <template v-else-if="['text', 'textarea', 'number'].includes(item.valueType)">
          <el-input
            v-if="!item.disabled"
            v-model="form[item.dataIndex]"
            v-bind="item.fieldProps"
            :type="item.valueType"
            :disabled="isDetail || item.disabled"
            v-on="item.fieldEvent"
          />
          <el-input
            v-else
            :value="item.formatter ? deviceNameFormatter(form) : form[item.dataIndex]"
            v-bind="item.fieldProps"
            :type="item.valueType"
            :disabled="isDetail || item.disabled"
            v-on="item.fieldEvent"
          />
        </template>
        <template v-else-if="item.valueType === 'priceDiff'">
          <el-col :span="5">
            <el-select
              v-model="form.priceSymbol"
              :clearable="false"
              :disabled="isDetail || item.disabled"
            >
              <el-option key="0" :value="0" label="不补不退">不补不退</el-option>
              <el-option key="1" :value="1" label="补钱">补钱</el-option>
              <el-option key="2" :value="2" label="退钱">退钱</el-option>
            </el-select>
          </el-col>
          <el-col v-if="form.priceSymbol !== 0" :span="19" style="padding-left: 20px">
            <el-form-item :prop="item.dataIndex" style="margin: 0 0 0 0">
              <el-input
                v-model="form[item.dataIndex]"
                v-bind="item.fieldProps"
                :type="item.valueType"
                :disabled="isDetail || item.disabled"
                v-on="item.fieldEvent"
              />
            </el-form-item>
          </el-col>
        </template>
        <span v-else>{{ form[item.dataIndex] || '-' }}</span>
      </el-form-item>
    </el-form>
    <div v-if="!isDetail && type !== 'audit'" slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定提交</el-button>
    </div>
    <div v-if="type === 'audit' && !isDetail" slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="handleReject">驳回</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { province } from '@/constant/address'
import regexp from '@/constant/regexps'
import dateFormat from '@/global/filters/date-format'
function safeJSONParse(data) {
  try {
    return JSON.parse(data) || {}
  } catch (e) {
    return {}
  }
}
const addressFields = ['user_name', 'phone', 'address', 'logisticsProvince']
const typeValueEnum = [
  {
    label: '换货',
    value: 'CHANGE'
  },
  {
    label: '退货',
    value: 'RETURN'
  },
  {
    label: '维修',
    value: 'REPAIR'
  }
]
let objectValueEnum = [
  {
    label: '纯卡',
    value: 'ICCID'
  },
  {
    label: '纯设备',
    value: 'DEVICE'
  },
  {
    label: '卡+设备',
    value: 'PACKAGE'
  }
]
const examineValueEnum = [
  {
    label: '返厂维修',
    value: 'RETURN_FACTORY'
  },
  {
    label: '库存',
    value: 'INVENTORY'
  },
  {
    label: '寄回客户',
    value: 'SEND_BACK'
  }
]
const commonIccidsProps = {
  rows: 6,
  resize: 'none',
  placeholder: '请输入ICCID，一行一个'
}
const commMacAddrsProps = {
  rows: 6,
  resize: 'none',
  placeholder: '请输入Mac地址，一行一个'
}
export default {
  components: {},
  props: {
    deviceList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      type: '',
      loading: false,
      typeCnMap: {
        apply: '退换申请',
        audit: '审核',
        shipment: '寄货',
        recycle: '回收',
        examine: '验收',
        batchExamineApply: '批量验收申请',
        batchExamine: '批量验收操作',
        batchFactoryApply: '批量返厂申请',
        batchFactory: '批量返厂操作',
        batchFactoryDone: '批量返厂完成'
      },
      componentMap: {
        radio: 'radio-group',
        text: 'el-input',
        textarea: 'el-input'
      },
      macAddrList: '',
      formLabelWidth: '150px',
      visible: false,
      form: {
        type: typeValueEnum[0].value,
        object: objectValueEnum[0].value,
        priceDifference: 0,
        iccids: '',
        macAddrs: '',
        priceSymbol: 0
      },
      objectValueEnum,
      typeValueEnum,
      applySchema: [
        {
          title: '设备订单号',
          dataIndex: 'oldTradeNo',
          showInDetail: true
        },
        {
          title: '申请类型',
          dataIndex: 'type',
          valueType: 'radio',
          valueEnum: typeValueEnum,
          fieldEvent: {
            change: this.handleTypeChange
          },
          formProps: {
            prop: 'type'
          },
          isRequired: true
        },
        {
          title: '申请对象',
          dataIndex: 'object',
          valueType: 'radio',
          valueEnum: objectValueEnum,
          fieldEvent: {
            change: this.handleObjectChange
          },
          formProps: {
            prop: 'object'
          },
          isRequired: true
        },
        {
          title: '客户ID',
          dataIndex: 'orgId',
          valueType: 'text',
          formProps: {
            prop: 'orgId'
          },
          isRequired: true
        },
        {
          title: 'MAC地址',
          dataIndex: 'macAddrs',
          valueType: 'textarea',
          fieldProps: commMacAddrsProps,
          formProps: {
            prop: 'macAddrs'
          },
          isRequired: true
        },
        {
          title: 'ICCID',
          dataIndex: 'iccids',
          valueType: 'textarea',
          fieldProps: commonIccidsProps,
          formProps: {
            prop: 'iccids'
          },
          isRequired: true
        },
        {
          title: '申请原因',
          dataIndex: 'reason',
          valueType: 'textarea',
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'reason'
          },
          isRequired: true
        },
        {
          title: '新收货人姓名',
          dataIndex: 'user_name',
          valueType: 'text',
          formProps: {
            prop: 'user_name'
          },
          isRequired: true
        },
        {
          title: '新收货人手机号',
          dataIndex: 'phone',
          valueType: 'text',
          formProps: {
            prop: 'phone'
          },
          isRequired: true,
          validator: (rule, value, callback) => {
            if (!value) {
              return callback(new Error('新收货人手机号不能为空'))
            }
            if (!regexp.mobile.test(value)) {
              return callback(new Error('请输入正确的手机号'))
            }
            callback()
          }
        },
        {
          title: '新收货省份',
          dataIndex: 'logisticsProvince',
          valueType: 'select',
          valueEnum: province,
          formProps: {
            prop: 'logisticsProvince'
          },
          isRequired: true
        },
        {
          title: '新收货地址',
          dataIndex: 'address',
          valueType: 'textarea',
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'address'
          },
          isRequired: true
        },
        {
          title: '新快递单号',
          dataIndex: 'newLogisticsNo',
          valueType: 'text',
          showInDetail: true,
          formProps: {
            prop: 'newLogisticsNo'
          }
        },
        {
          title: '旧快递单号',
          dataIndex: 'oldLogisticsNo',
          valueType: 'text',
          formProps: {
            prop: 'oldLogisticsNo'
          },
          isRequired: () => this.form.type === 'RETURN'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          valueType: 'textarea',
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'remark'
          }
        }
      ],
      auditSchema: [
        {
          title: '公司名称',
          dataIndex: 'orgName',
          formProps: {
            prop: 'orgName'
          }
        },
        {
          title: '申请类型',
          dataIndex: 'type',
          valueType: 'radio',
          valueEnum: typeValueEnum,
          disabled: true,
          fieldEvent: {
            change: this.handleTypeChange
          },
          formProps: {
            prop: 'type'
          }
        },
        {
          title: '申请对象',
          disabled: true,
          dataIndex: 'object',
          valueType: 'radio',
          valueEnum: objectValueEnum,
          formProps: {
            prop: 'object'
          }
        },
        {
          title: 'MAC地址',
          disabled: true,
          dataIndex: 'macAddrs',
          valueType: 'textarea',
          fieldProps: commMacAddrsProps,
          formProps: {
            prop: 'macAddrs'
          }
        },
        {
          title: 'ICCID',
          dataIndex: 'iccids',
          valueType: 'textarea',
          disabled: true,
          fieldProps: commonIccidsProps,
          formProps: {
            prop: 'iccids'
          }
        },
        {
          title: '申请原因',
          dataIndex: 'reason',
          valueType: 'textarea',
          disabled: true,
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'reason'
          }
        },
        {
          title: '变更前商品名称',
          dataIndex: 'oldItemName',
          formatter: true,
          valueType: 'text',
          disabled: true,
          formProps: {
            prop: 'oldItemName'
          }
        },
        {
          title: '变更后商品名称',
          dataIndex: 'newItemNo',
          valueType: 'select',
          valueEnum: this.deviceList,
          disabled: false,
          formProps: {
            prop: 'newItemNo'
          },
          isRequired: true
        },
        {
          title: '套餐有效期',
          dataIndex: 'expireDate',
          valueType: 'text',
          disabled: true,
          formProps: {
            prop: 'expireDate'
          }
        },
        {
          title: '补差额(元)',
          dataIndex: 'priceDifference',
          valueType: 'priceDiff',
          disabled: false,
          isRequired: true
        },
        {
          title: '备注',
          dataIndex: 'remark',
          valueType: 'textarea',
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          disabled: false,
          formProps: {
            prop: 'remark'
          }
        }
      ],
      shipmentSchema: [
        {
          title: '申请类型',
          dataIndex: 'type',
          valueType: 'radio',
          valueEnum: typeValueEnum,
          fieldEvent: {
            change: this.handleTypeChange
          },
          disabled: true,
          formProps: {
            prop: 'type'
          }
        },
        {
          title: '申请对象',
          dataIndex: 'object',
          valueType: 'radio',
          valueEnum: objectValueEnum,
          formProps: {
            prop: 'object'
          },
          disabled: true
        },
        {
          title: '变更后商品名称',
          dataIndex: 'newItemNo',
          valueType: 'select',
          valueEnum: this.deviceList,
          isRequired: true,
          formProps: {
            prop: 'newItemNo'
          }
        },
        {
          title: '新MAC地址',
          dataIndex: 'macAddrs',
          valueType: 'textarea',
          fieldProps: commMacAddrsProps,
          isRequired: true,
          formProps: {
            prop: 'macAddrs'
          }
        },
        {
          title: 'ICCID',
          dataIndex: 'iccids',
          valueType: 'textarea',
          fieldProps: commonIccidsProps,
          isRequired: true,
          formProps: {
            prop: 'iccids'
          }
        },

        {
          title: '新收货人姓名',
          dataIndex: 'user_name',
          valueType: 'text',
          isRequired: true,
          formProps: {
            prop: 'user_name'
          }
        },
        {
          title: '新收货人手机号',
          dataIndex: 'phone',
          valueType: 'text',
          isRequired: true,
          formProps: {
            prop: 'phone'
          }
        },
        {
          title: '新收货省份',
          dataIndex: 'logisticsProvince',
          valueType: 'select',
          valueEnum: province,
          isRequired: true,
          formProps: {
            prop: 'logisticsProvince'
          }
        },
        {
          title: '新收货地址',
          dataIndex: 'address',
          valueType: 'textarea',
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          isRequired: true,
          formProps: {
            prop: 'address'
          }
        },
        {
          title: '新快递单号',
          dataIndex: 'newLogisticsNo',
          valueType: 'text',
          isRequired: false,
          formProps: {
            prop: 'newLogisticsNo'
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          valueType: 'textarea',
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'remark'
          }
        }
      ],
      recycleSchema: [
        {
          title: '申请类型',
          dataIndex: 'type',
          valueType: 'radio',
          valueEnum: typeValueEnum,
          fieldEvent: {
            change: this.handleTypeChange
          },
          disabled: true,
          formProps: {
            prop: 'type'
          }
        },
        {
          title: '申请对象',
          dataIndex: 'object',
          valueType: 'radio',
          valueEnum: objectValueEnum,
          disabled: true,
          formProps: {
            prop: 'object'
          }
        },
        {
          title: '旧MAC地址',
          dataIndex: 'macAddrs',
          valueType: 'textarea',
          disabled: true,
          fieldProps: commMacAddrsProps,
          formProps: {
            prop: 'macAddrs'
          }
        },
        {
          title: '旧ICCID',
          dataIndex: 'iccids',
          valueType: 'textarea',
          fieldProps: commonIccidsProps,
          disabled: true,
          formProps: {
            prop: 'iccids'
          }
        },
        {
          title: '旧设备寄回快递单号',
          dataIndex: 'oldLogisticsNo',
          valueType: 'text',
          formProps: {
            prop: 'oldLogisticsNo'
          },
          isRequired: true
        },
        {
          title: '备注',
          dataIndex: 'remark',
          valueType: 'textarea',
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'remark'
          }
        }
      ],
      examineSchema: [
        {
          title: '旧MAC地址',
          dataIndex: 'macAddr'
        },
        {
          title: '验收结果',
          dataIndex: 'acceptanceStatus',
          valueType: 'radio',
          valueEnum: examineValueEnum,
          formProps: {
            prop: 'acceptanceStatus'
          },
          isRequired: true
        },
        {
          title: '寄回客户姓名',
          dataIndex: 'user_name',
          valueType: 'text',
          showInDetail: true,
          formProps: {
            prop: 'user_name'
          }
        },
        {
          title: '寄回客户手机号',
          dataIndex: 'phone',
          valueType: 'text',
          showInDetail: true
        },
        {
          title: '寄回客户地址',
          dataIndex: 'address',
          valueType: 'textarea',
          showInDetail: true,
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'address'
          }
        },
        {
          title: '寄回快递单号',
          dataIndex: 'logiNO',
          valueType: 'text',
          showInDetail: true,
          formProps: {
            prop: 'logiNO'
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          valueType: 'textarea',

          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'remark'
          }
        }
      ],
      batchExamineApplySchema: [
        {
          title: 'MAC地址',
          dataIndex: 'macAddrs',
          valueType: 'textarea',
          fieldProps: commMacAddrsProps,
          formProps: {
            prop: 'macAddrs'
          },
          isRequired: true
        },
        {
          title: '备注',
          dataIndex: 'remark',
          valueType: 'textarea',

          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'remark'
          }
        }
      ],
      batchExamineSchema: [
        {
          title: '旧MAC地址',
          dataIndex: 'macAddrs',
          valueType: 'textarea',
          fieldProps: commonIccidsProps,
          formProps: {
            prop: 'macAddrs'
          },
          isRequired: true
        },
        {
          title: '验收结果',
          dataIndex: 'acceptanceStatus',
          valueType: 'radio',
          valueEnum: examineValueEnum,
          formProps: {
            prop: 'acceptanceStatus'
          },
          isRequired: true
        },
        {
          title: '备注',
          dataIndex: 'remark',
          valueType: 'textarea',
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'remark'
          }
        }
      ],
      batchFactoryApplySchema: [
        {
          title: 'MAC地址',
          dataIndex: 'macAddrs',
          valueType: 'textarea',
          fieldProps: commMacAddrsProps,
          formProps: {
            prop: 'macAddrs'
          },
          isRequired: true
        },
        {
          title: '备注',
          dataIndex: 'remark',
          valueType: 'textarea',
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'remark'
          }
        }
      ],
      batchFactorySchema: [
        {
          title: 'MAC地址',
          dataIndex: 'macAddrs',
          valueType: 'textarea',
          fieldProps: commMacAddrsProps,
          formProps: {
            prop: 'macAddrs'
          },
          isRequired: true
        },
        {
          title: '寄回厂商快递单号',
          dataIndex: 'outLogisticsNo',
          valueType: 'text',
          formProps: {
            prop: 'outLogisticsNo'
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          valueType: 'textarea',

          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'remark'
          }
        }
      ],
      batchFactoryDoneSchema: [
        {
          title: 'MAC地址',
          dataIndex: 'macAddrs',
          valueType: 'textarea',
          fieldProps: commMacAddrsProps,
          formProps: {
            prop: 'macAddrs'
          },
          isRequired: true
        },
        {
          title: '厂商寄回快递单号',
          dataIndex: 'inLogisticsNo',
          valueType: 'text',
          formProps: {
            prop: 'inLogisticsNo'
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          valueType: 'textarea',
          fieldProps: {
            rows: 3,
            resize: 'none'
          },
          formProps: {
            prop: 'remark'
          }
        }
      ],
      content: {},
      isDetail: false,
      currentSchema: null
    }
  },
  computed: {
    filteredObjectEnum() {
      if (this.form.type !== 'CHANGE') {
        return objectValueEnum.filter((item) => item.value !== 'ICCID')
      }
      return objectValueEnum
    },
    title() {
      return this.isDetail ? '详情' : this.typeCnMap[this.type]
    },
    computedRule() {
      let rules = {}
      this.currentSchema &&
        this.currentSchema.forEach((item) => {
          rules = {
            ...rules,
            [item.dataIndex]: [
              {
                required:
                  typeof item.isRequired === 'function'
                    ? item.isRequired()
                    : item.isRequired || false,
                validator: item.validator,
                message: item.validator ? '' : `${item.title}不能为空`
              }
            ]
          }
        })
      return rules
    }
  },
  watch: {
    visible(newValue) {
      if (!newValue) {
        this.form = {
          type: typeValueEnum[0].value,
          object: objectValueEnum[0].value,
          priceDifference: 0,
          iccids: '',
          macAddrs: '',
          priceSymbol: 0
        }
        this.$refs.formRef.resetFields()
      }
    }
  },
  methods: {
    deviceNameFormatter(form) {
      const data = this.deviceList.find((d) => d.value === form.oldItemNo)
      return `${form.oldItemName}${data && data.model ? '(' + data.model + ')' : ''}`
    },
    handleReject() {
      this.$confirm('确定驳回？', '提示')
        .then(async () => {
          const { id } = this.form
          const res = await this.jaxLib.cpe.getAfterSaleRequestReviewReject({ id, remark: '' })
          if (res && res.success) {
            this.$message.success('操作成功')
            this.visible = false
            this.$emit('confirm')
          }
        })
        .catch()
    },
    handleSubmit() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        const {
          iccids,
          macAddrs,
          user_name,
          phone,
          address,
          logisticsProvince,
          priceSymbol,
          priceDifference
        } = this.form
        const params = {
          ...this.form,
          newContactInfo: JSON.stringify({
            user_name,
            phone,
            address,
            logisticsProvince
          })
          // oldItemNo: 'D00007',
          // expireDate: '2021-12-31 12:12:12'
        }
        if (priceDifference && priceSymbol === 1) {
          params.priceDifference = -priceDifference
        }
        if (priceSymbol === 0) {
          params.priceDifference = 0
        }
        if (iccids) {
          params.iccids = iccidsTransfer(iccids)
        }
        if (macAddrs) {
          params.macAddrs = iccidsTransfer(macAddrs)
        }
        addressFields.forEach((item) => delete params[item])
        await this.submitDispatcher(params)
      })
    },

    async submitDispatcher(params) {
      this.loading = true
      const apiMapper = {
        apply: 'afterSaleRequestSave', // 退换申请
        // auditReject: 'getAfterSaleRequestReviewReject', // 审核驳回
        audit: 'getAfterSaleRequestReviewPass', // 审核通过
        shipment: 'getAfterSaleRequestDeliverCommit', // 寄货处理
        recycle: 'getAfterSaleRequestRecyleCommit', // 回收提交
        examine: 'getAfterSaleRequestAcceptanceCommit', // 验收提交
        batchExamineApply: 'returnAcceptanceSave',
        batchExamine: 'getAfterSaleRequestAcceptanceCommit',
        batchExamineDone: 'returnAcceptanceDone',
        batchFactoryApply: 'returnFactorySave',
        batchFactory: 'returnFactoryCommit',
        batchFactoryDone: 'returnFactoryDone'
      }
      const paramsFilter = {
        apply: [
          'id',
          'type',
          'object',
          'orgId',
          'macAddrs',
          'iccids',
          'reason',
          'newContactInfo',
          'oldLogisticsNo',
          'remark'
        ],
        audit: ['id', 'oldItemNo', 'newItemNo', 'priceDifference', 'remark'],
        shipment: ['id', 'macAddrs', 'iccids', 'newLogisticsNo', 'remark', 'newItemNo'],
        recycle: ['id', 'macAddrs', 'iccids', 'oldLogisticsNo', 'remark'],
        examine: ['id', 'macAddr', 'acceptanceStatus', 'remark'],
        batchExamine: ['macAddrs', 'acceptanceStatus', 'remark'],
        batchExamineApply: ['macAddrs', 'remark'],
        batchFactoryApply: ['macAddrs', 'remark'],
        batchFactory: ['macAddrs', 'remark', 'outLogisticsNo'],
        batchFactoryDone: ['macAddrs', 'remark', 'inLogisticsNo']
      }
      let data = {}
      if (paramsFilter[this.type] && paramsFilter[this.type].length) {
        paramsFilter[this.type].forEach((item) => {
          data[item] = params[item]
        })
      } else {
        data = { ...params }
      }
      if (!data.iccids) delete data.iccids
      if (!data.macAddrs) delete data.macAddrs
      try {
        const res = await this.jaxLib.cpe[apiMapper[this.type]](data)
        if (res && res.success) {
          this.$message.success('操作成功')
          this.visible = false
          this.$emit('confirm')
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    handleObjectChange(value) {
      if (value === 'ICCID') {
        this.currentSchema.forEach((item) => {
          if (item.dataIndex === 'macAddrs') {
            item.hide = true
          }
          if (item.dataIndex === 'iccids') {
            item.hide = false
          }
        })
        this.currentSchema = [...this.currentSchema]
        this.form.macAddrs = ''
      } else if (value === 'DEVICE') {
        this.currentSchema.forEach((item) => {
          if (item.dataIndex === 'iccids') {
            item.hide = true
          }
          if (item.dataIndex === 'macAddrs') {
            item.hide = false
          }
        })
        this.currentSchema = [...this.currentSchema]
        this.form.iccids = ''
      } else {
        this.currentSchema.forEach((item) => {
          if (item.dataIndex === 'iccids') {
            item.hide = false
          }
          if (item.dataIndex === 'macAddrs') {
            item.hide = false
          }
        })
        this.currentSchema = [...this.currentSchema]
      }
      this.clearValidate()
      return this.currentSchema
    },
    handleTypeChange(value) {
      if (value === 'RETURN') {
        this.currentSchema.forEach((item) => {
          if (addressFields.includes(item.dataIndex)) {
            item.hide = true
          }
        })
      } else {
        this.currentSchema.forEach((item) => {
          if (addressFields.includes(item.dataIndex)) {
            item.hide = false
          }
        })
      }
      const idx = this.currentSchema.findIndex((item) => item.dataIndex === 'object')
      this.currentSchema.splice(idx, 1, {
        ...this.currentSchema[idx],
        valueEnum: this.filteredObjectEnum
      })
      this.form.object = this.filteredObjectEnum[0].value
      this.$refs.formRef.clearValidate()
      this.clearValidate()
      this.handleObjectChange(this.form.object)
    },
    clearValidate() {
      this.$refs.formRef && this.$refs.formRef.clearValidate()
    },
    open(content, type) {
      this.content = content
      this.isDetail = type.indexOf('Detail') !== -1
      this.type = type.replace('Detail', '')
      if (content && content.id) {
        const { newContactInfo, iccids, macAddrs, contactInfo } = content
        const { user_name, phone, address, logisticsProvince } =
          safeJSONParse(newContactInfo || contactInfo) || {}
        let { priceDifference } = content
        this.form.priceSymbol = 0
        if (priceDifference) {
          if (+priceDifference < 0) {
            this.form.priceSymbol = 1
          }
          if (+priceDifference > 0) {
            this.form.priceSymbol = 2
          }
          priceDifference = Math.abs(priceDifference)
        }
        this.form = {
          ...this.form,
          ...content,
          user_name,
          phone,
          address,
          logisticsProvince,
          iccids: iccids ? iccids.join('\n') : '',
          macAddrs: macAddrs ? macAddrs.join('\n') : '',
          priceDifference,
          expireDate: dateFormat(content.expireDate)
        }
      }
      this.visible = true
      this.currentSchema = this[`${this.type}Schema`]
      if (
        ![
          'examine',
          'batchExamineApply',
          'batchExamine',
          'batchFactoryApply',
          'batchFactory',
          'batchFactoryDone'
        ].includes(this.type)
      ) {
        this.handleObjectChange(this.form.object)
      }
      if (!this.isDetail) {
        this.currentSchema = this.currentSchema.filter((item) => !item.showInDetail)
      }
    }
  }
}
</script>

<style scoped></style>
