<template>
  <el-form
    label-width="120px"
    :model="form"
    :rules="rules"
    ref="form"
    :disabled="disabled"
    :class="{ 'form-not-inline': !defaultMargin }"
  >
    <el-form-item label="网络制式" prop="generation">
      <el-checkbox-group v-model="form.generation">
        <el-checkbox
          :label="option.value"
          v-for="option in options.generation"
          :key="option.value"
          >{{ option.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="卡功能" prop="cardFunction">
      <el-checkbox-group v-model="form.cardFunction">
        <el-checkbox
          :label="option.value"
          v-for="option in options.cardFunction"
          :key="option.value"
          >{{ option.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item
      label="短信服务方式"
      v-show="form.cardFunction.includes('smsType')"
    >
      <el-radio
        v-model="form.sms.isAlways"
        :label="true"
        @change="onChangeSMService(0)"
        >{{ options.supportSms[0].label }}</el-radio
      >
      <el-checkbox
        @change="onChangeSMService(1)"
        v-model="form.sms.isMonth"
        :label="options.supportSms[1].value"
        >{{ options.supportSms[1].label }}</el-checkbox
      >
      <el-checkbox
        @change="onChangeSMService(1)"
        v-model="form.sms.isYear"
        :label="options.supportSms[2].value"
        >{{ options.supportSms[2].label }}</el-checkbox
      >
    </el-form-item>
    <el-form-item label="特殊限制">
      <el-checkbox-group v-model="form.specialRestriction">
        <el-checkbox
          :label="option.value"
          v-for="option in options.specialRestriction"
          :key="option.value"
          >{{ option.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="运营商特殊限制">
      <el-checkbox-group v-model="form.carrierSpecialRestriction">
        <el-checkbox
          :label="option.value"
          v-for="option in options.carrierSpecialRestriction"
          :key="option.value"
          >{{ option.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
  import cardFunctionOptions from '@/constant/options/cardFunction'
  import transformArrayToObj from '@/global/function/transformArrayToObj'

  export default {
    props: {
      data: {
        type: Object,
        required: false
      },
      disabled: {
        default: false
      },
      defaultMargin: {
        default: true
      }
    },
    data() {
      const generationValidator = (rule, value, callback) => {
        if (!value.length) {
          callback(new Error('请至少选择一项网络制式'))
        }
        callback()
      }
      return {
        rules: {
          generation: [
            {
              validator: generationValidator,
              trigger: 'blur',
              required: true
            }
          ]
        },
        form: {
          generation: [],
          cardFunction: [],
          sms: {
            isAlways: false,
            isMonth: false,
            isYear: false
          },
          specialRestriction: [],
          carrierSpecialRestriction: []
        },
        options: cardFunctionOptions
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
      // 由外部组件调用
      validate() {
        const form = this.$refs.form
        let result = false
        form.validate((valid) => {
          result = valid
        })
        return result
      },
      generateSubmitData() {
        function getSMSType(form) {
          if (!form.cardFunction.includes('smsType')) {
            return 0
          } else if (form.sms.isAlways) {
            return 1
          } else if (form.sms.isMonth && !form.sms.isYear) {
            return 2
          } else if (form.sms.isYear && !form.sms.isMonth) {
            return 3
          } else {
            return 4
          }
        }
        const submitData = {
          generation: this.form.generation.join(','),
          ...transformArrayToObj(this.form.cardFunction),
          ...transformArrayToObj(this.form.carrierSpecialRestriction),
          ...transformArrayToObj(this.form.specialRestriction),
          smsType: getSMSType(this.form),
          status: 1 //状态（0:关闭，1:开启）
        }
        return submitData
      },
      generateFormData() {
        if (this.data.id) {
          // 网络制式
          this.form.generation = this.data.generation.split(',')
          // 卡功能
          this.form.cardFunction = []
          cardFunctionOptions.cardFunction.forEach((item) => {
            if (this.data[item.value]) {
              this.form.cardFunction.push(item.value)
            }
          })
          // 短信服务方式
          this.form.sms.isAlways = false
          this.form.sms.isMonth = false
          this.form.sms.isYear = false
          switch (this.data.smsType) {
            case 1:
              this.form.sms.isAlways = true
              break
            case 2:
              this.form.sms.isMonth = true
              break
            case 3:
              this.form.sms.isYear = true
              break
            case 4:
              this.form.sms.isYear = true
              this.form.sms.isMonth = true
              break
          }
          // 特殊限制
          this.form.specialRestriction = []
          cardFunctionOptions.specialRestriction.forEach((item) => {
            if (this.data[item.value]) {
              this.form.specialRestriction.push(item.value)
            }
          })
          // 运营商特殊限制
          this.form.carrierSpecialRestriction = []
          cardFunctionOptions.carrierSpecialRestriction.forEach((item) => {
            if (this.data[item.value]) {
              this.form.carrierSpecialRestriction.push(item.value)
            }
          })
        } else {
          this.resetFormData()
        }
      },
      resetFormData() {
        const formData = {
          generation: [],
          cardFunction: [],
          sms: {
            isAlways: false,
            isMonth: false,
            isYear: false
          },
          specialRestriction: [],
          carrierSpecialRestriction: []
        }
        this.form = Object.assign({}, this.form, formData)
        this.$refs.form.resetFields()
      }
    },
    watch: {
      'data.id' () {
        this.generateFormData()
      }
    },
    mounted() {
      this.generateFormData()
    }
  }
</script>