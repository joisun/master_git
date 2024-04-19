<script>
/**
 * Create by zeter on 2019/12/26
 */
import moment from 'moment'
import regexps from '@/constant/regexps'
import { iccidsTransfer } from '@/global/function/iccids-tool'
export default {
  name: 'inventory-change-block',
  props: {
    inputData: {
      type: Object
    },
    iccids: {
      type: String
    }
  },
  data() {
    return {
      allTags: [],
      realTags: [],
      form: {
        testingType: false,
        testDataVolume: 0,
        testDeadline: '',
        tags: [],
        remark: '',
        refCategory: [],
        activationDeadline: ''
      },
      rules: {
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        testingType: [
          {
            validator: (rule, value, callback) => {
              if (value && !this.form.testDeadline) {
                callback('请选择测试期结束时间')
                return false
              }
              if (value && !regexps.volume.test(this.form.testDataVolume)) {
                callback('请填写正确的测试期流量')
                return false
              }
              if (value && Number(this.form.testDataVolume) === 0) {
                callback('请填写正确的测试期流量')
                return false
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        activationDeadline: [{ required: true, message: '激活宽限期不能为空', trigger: 'change' }]
      },
      carrierRealName: false,
      carrierType: ''
    }
  },
  computed: {
    planClassificationList() {
      return this.$store.getters.getClassificationList(this.inputData.carrier)
    }
  },
  async mounted() {
    this.setCarrierRealName()
    this.initForm(this.inputData)
    await this.$store.dispatch('changeClassificationList')
    await this.getCardTags()
  },
  methods: {
    back() {
      this.$router.push({})
    },
    async getCardTags() {
      const { data, success } = await this.jaxLib.card.tags.list({
        carrier: this.inputData.carrier
      })
      if (!success) return false
      this.allTags = data
    },
    initForm(data) {
      console.log(data)
      this.form.testingType = !!data.testDataVolume
      this.form.testDataVolume = data.testDataVolume
      this.form.testDeadline = data.testDeadline
        ? moment(data.testDeadline.time).format('YYYY-MM-DD')
        : ''
      this.form.tags = data.tags ? data.tags.split(',') : []
      this.form.refCategory = data.refCategory
        ? data.refCategory.split(',').map((e) => Number(e))
        : []
      this.form.remark = ''
      this.form.activationDeadline = moment(data.activationDeadline.time).format('YYYY-MM-DD')
      if (this.carrierRealName) this.form.tags.push('CARRIER_REAL_NAME')
    },
    postForm() {
      this.$refs.form.validate(async (f) => {
        if (!f) return false
        let data = { ...this.form }
        if (!data.testingType) {
          delete data.testDataVolume
          delete data.testDeadline
        }
        delete data.testingType
        const { success } = await this.jaxLib.store.inventoryChangeApply({
          ...data,
          tags: data.tags.join(','),
          refCategory: data.refCategory.join(','),
          iccids: iccidsTransfer(this.iccids, ',')
        })
        if (!success) return false
        this.$message.success('入库信息修改提交成功')
        this.$router.push({ name: 'inventory-modify-list' })
      })
    },
    setCarrierRealName() {
      let carrierAccountList =
        this.$store.state.carrierAccount[`${this.inputData.carrier}AccountList`]
      if (carrierAccountList == null) {
        carrierAccountList = []
      }
      if (carrierAccountList.length > 0 && this.inputData.carrierAccountId) {
        let list = carrierAccountList.filter(
          (item) => item.id === Number(this.inputData.carrierAccountId)
        )
        if (list.length === 1) {
          this.carrierRealName = list[0].carrierRealName
          this.carrierType = list[0].type
        }
      }
      this.getRealTags()
    },
    getRealTags() {
      let tags = [
        { name: 'CARRIER_IMEI_BIND', desc: '机卡绑定', disabled: false },
        { name: 'CARRIER_REAL_NAME', desc: '实名认证', disabled: this.carrierRealName }
      ]
      this.realTags = tags
    }
  }
}
</script>

<template>
  <div class="inventory-change-block">
    <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px">
      <el-form-item label="运营商">
        <span>
          {{ inputData.carrier | carrierFilter }}
          {{ inputData.carrierAccountId | carrierAccountFilter(inputData.carrier) }}
        </span>
      </el-form-item>
      <el-form-item label="套餐类型">
        <span>{{ inputData.type | ratePlanTypeFilter }}</span>
      </el-form-item>
      <el-form-item label="测试期" prop="testingType">
        <el-radio-group
          v-model="form.testingType"
          :disabled="inputData.carrier !== 'cmcc' || carrierType === 'NO_API_ACCOUNT'"
        >
          <el-radio :label="true">有</el-radio>
          <el-radio :label="false">无</el-radio>
        </el-radio-group>
        <template v-if="form.testingType">
          <span>测试期流量</span>
          <el-input
            v-model="form.testDataVolume"
            style="width: 200px; display: inline-block"
            placeholder="测试期流量"
          >
          </el-input>
          <span>测试期结束时间</span>
          <el-date-picker
            v-model="form.testDeadline"
            style="width: 200px; display: inline-block"
            type="date"
            placeholder="选择测试期结束时间"
          >
          </el-date-picker>
        </template>
      </el-form-item>
      <el-form-item label="激活宽限期" prop="activationDeadline">
        <el-date-picker v-model="form.activationDeadline" type="date" placeholder="选择激活宽限期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="套餐规格">
        <span
          v-tag-extract="{
            validity: inputData.validity,
            validityUnit: inputData.validityUnit,
            volume: inputData.totalDataVolume,
            ratePlanType: inputData.type,
            useCountAsVolume: inputData.useCountAsVolume
          }"
        >
        </span>
      </el-form-item>
      <el-form-item label="材质">
        <span>
          {{ inputData.cardMaterial | materialTypeFilter }}
          {{ inputData.cardSpecification | specificationTypeFilter }}
        </span>
      </el-form-item>
      <el-form-item label="特殊限制">
        <el-checkbox-group v-model="form.tags">
          <el-checkbox v-for="item in allTags" :key="item.desc" :label="item.name">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="运营商特殊限制">
        <el-checkbox-group v-model="form.tags">
          <el-checkbox
            v-for="item in realTags"
            :key="item.desc"
            :label="item.name"
            :disabled="item.disabled"
          >
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="关联分类">
        <el-checkbox-group v-model="form.refCategory">
          <el-checkbox
            v-for="item in planClassificationList"
            :key="item.id + item.name"
            :label="item.id"
            >{{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="批次号">
        <span>{{ inputData.importBatchNo }}</span>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="postForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

