<template>
  <el-form
    :label-width="labelWidth"
    :model="form"
    :rules="rules"
    ref="form"
    :disabled="disabled"
    :inline="false"
    :class="{ 'form-not-inline': !defaultMargin }"
  >
    <el-form-item label="网络属性" prop="vpdnOnly">
      <el-radio
        v-for="item in options.networkAttribute"
        v-model="form.vpdnOnly"
        :label="item.value"
        :key="item.value"
        >{{ item.label }}</el-radio
      >
    </el-form-item>
    <el-form-item label="套餐属性" prop="type">
      <el-radio
        v-for="item in options.packageAttribute"
        v-model="form.type"
        :label="item.value"
        :key="item.value"
        >{{ item.label }}</el-radio
      >
    </el-form-item>
    <el-form-item label="所属平台" prop="platform" v-if="form.carrier">
      <el-radio
        v-for="item in platformOptions"
        v-model="form.platform"
        :label="item"
        :key="item"
        >{{ item }}</el-radio
      >
    </el-form-item>
    <el-form-item label="续费限制" prop="renewRestriction">
      <el-checkbox-group v-model="form.renewRestriction">
        <el-checkbox
          :label="option.value"
          v-for="option in options.renewRestriction"
          :key="option.value"
          >{{ option.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item
      label="续费区间"
      prop="rechargeTimeRange"
      v-show="form.renewRestriction.includes('RECHARGE_TIME_LIMIT')"
    >
      <wh-recharge-timerange
        v-model="form.rechargeTimeRange"
        ref="rechargeTimeRange"
      />
    </el-form-item>
    <el-form-item label="NBIoT" prop="NB_IOT">
      <el-switch
        v-model="form.NB_IOT"
        active-text="开启"
        :active-value="true"
        :inactive-value="false"
        inactive-text="关闭"
      ></el-switch>
    </el-form-item>
    <el-form-item label="定位功能" prop="LOCATION_SERVICE">
      <el-switch
        v-model="form.LOCATION_SERVICE"
        active-text="开启"
        :active-value="true"
        :inactive-value="false"
        inactive-text="关闭"
      ></el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
  import renewOptions from '@/constant/options/renew'
  import WhRechargeTimerange from './WhRechargeTimerange.vue'

  export default {
    props: {
      data: {
        type: Object,
        required: false
      },
      defaultMargin: {
        default: true
      },
      disabled: {
        default: false
      }
    },
    data() {
      const checkRechargeTimeRange = (rule, value, callback) => {
        if (this.form.renewRestriction.includes('RECHARGE_TIME_LIMIT')) {
          const result = this.$refs.rechargeTimeRange.checkValid()
          if (!result.valid) {
            return callback(new Error('开始时间需要小于结束时间！'))
          }
        }
        callback()
      }
      return {
        rules: {
          rechargeTimeRange: [
            {
              validator: checkRechargeTimeRange,
              trigger: 'blur'
            }
          ]
        },
        options: renewOptions,
        form: {
          carrier: '',
          vpdnOnly: undefined,
          type: false,
          platform: '',
          renewRestriction: [],
          rechargeTimeRange: '',
          NB_IOT: false,
          LOCATION_SERVICE: false
        },
        labelWidth: '120px'
      }
    },
    computed: {
      platformOptions() {
        if (!this.form.carrier) {
          return []
        }
        return this.enums.platformTypes.get(this.form.carrier).platforms
      }
    },
    methods: {
      onChangeSMService(type) {
        switch (type) {
          case 0:
            this.form.sms.isMonth = false
            this.form.sms.isYear = false
            break
          case 1:
            this.form.sms.isAlways = false
            break
        }
      },
      validate() {
        const form = this.$refs.form
        let result = false
        form.validate((valid) => {
          result = valid
        })
        return result
      },
      generateSubmitData() {
        const tagsList = JSON.parse(JSON.stringify(this.form.renewRestriction))
        if (this.form.vpdnOnly) {
          tagsList.push('VPDN_ONLY')
        }
        if (this.form.NB_IOT) {
          tagsList.push('NB_IOT')
        }
        if (this.form.LOCATION_SERVICE) {
          tagsList.push('LOCATION_SERVICE')
        }
        const submitData = {
          carrier: this.form.carrier,
          type: this.form.type,
          platform: this.form.platform,
          tags: tagsList.join(','),
          rechargeTimeRange: this.form.rechargeTimeRange
        }
        return submitData
      },
      generateFormData() {
        if (this.data.id) {
          // 续费限制
          this.form.renewRestriction = this.data.renewRestriction
          // 网络属性
          this.form.vpdnOnly = this.data.vpdnOnly
          // 套餐属性
          this.form.type = this.data.type
          // 运营商
          this.form.carrier = this.data.carrier
          // 平台
          this.form.platform = this.data.platform
          this.form.rechargeTimeRange = this.data.rechargeTimeRange
          this.form.LOCATION_SERVICE = this.data.LOCATION_SERVICE
          this.form.NB_IOT = this.data.NB_IOT
        } else {
          this.resetFormData()
        }
      },
      resetFormData() {
        const formData = {
          carrier: '',
          vpdnOnly: undefined,
          type: false,
          platform: '',
          renewRestriction: [],
          rechargeTimeRange: '',
          NB_IOT: false,
          LOCATION_SERVICE: false
        }
        this.form = Object.assign({}, this.form, formData)
      }
    },
    created() {
      this.generateFormData()
    },
    components: {
      WhRechargeTimerange
    },
    watch: {
      'data.id'(v) {
        this.generateFormData()
      },
      'data.carrier'(v) {
        this.form.carrier = v
      }
    }
  }
</script>