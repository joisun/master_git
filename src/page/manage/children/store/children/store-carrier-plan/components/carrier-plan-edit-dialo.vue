<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
  import whVolumeInput from '@/page/components/wh-volume-input.vue'
  import regexps from '@/constant/regexps'
  import { accountTypeParam } from '../mixins/const'

  export default {
    mixins: [DialogMixin],
    name: 'account-add-edit',
    props: {
      carrier: {
        type: String,
        default: ''
      },
      content: {
        default: null
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      let configValue = (rule, value, callback) => {
        let k = false
        this.parameter.config.map(e => {
          if (!e.value) k = true
        })
        if (k) {
          return callback(new Error('参数不能为空'))
        } else {
          callback()
        }
      }
      let volumeValue = (rule, value, callback) => {
        let volumeReg = regexps.volume
        if (this.form.offerType === 'custom' && !(this.form.validity === 3 || this.form.validity === 6 || this.form.validity === 12)) return callback(new Error('请选择合适的套餐周期'))
        if (!volumeReg.test(this.form.volume)) return callback(new Error('请输入正确的流量'))
        else callback()
      }
      return {
        form: {
          carrier: this.carrier,
          carrierAccountId: '',
          type: '',
          volume: '',
          validity: 3,
          validityUnit: 'M',
          offerType: ''
        },
        parameter: {
          config: []
        },
        rules: {
          carrier:
            [{ required: true, message: '不能为空', trigger: 'blur' }],
          carrierAccountId:
            [{ required: true, message: '不能为空', trigger: 'blur', type: 'number' }],
          offerType:
            [{ required: true, message: '不能为空', trigger: 'blur' }],
          volume:
            [{ validator: volumeValue.bind(this), trigger: 'blur' }],
          type:
            [{ required: true, message: '不能为空', trigger: 'blur' }]
        },
        configRules: {
          config: [
            { validator: configValue.bind(this), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      save() {
        if (this.loading) return false
        this.$refs.form.validate(f => {
          if (f) {
            this.$refs['configForm'].validate(valid => {
              if (valid) {
                this.send()
              }
            })
          }
        })
      },
      async send() {
        this.loading = true
        const arrayToObject = (array) => {
          let o = {}
          array.map(e => (o[e.key] = e.value))
          return o
        }
        let rst
        if (this.content) {
          rst = await this.jaxLib.store.carrierPlanUpdate({
            id: this.content.id,
            conf: JSON.stringify(arrayToObject(this.parameter.config))
          })
        } else {
          rst = await this.jaxLib.store.carrierPlanAdd({
            conf: JSON.stringify(arrayToObject(this.parameter.config)),
            ...this.form,
            validity: this.form.offerType === 'custom' ? this.form.validity : 1
          })
        }
        if (rst.success) {
          this.$message.success('保存成功')
          this.$emit('closeDialog', 1)
        }
        this.loading = false
      },
      open() {
        this.parameter = { config: [] }
        this.form = {
          carrier: this.carrier,
          carrierAccountId: '',
          type: '',
          volume: '',
          validity: 3,
          validityUnit: 'M',
          offerType: ''
        }
        if (this.content) {
          this.form.carrier = this.content.carrier
          this.form.carrierAccountId = this.content.carrierAccountId
          this.form.type = Number(this.content.type)
          this.form.volume = this.content.volume
          this.form.validity = this.content.validity
          this.form.offerType = this.content.offerType
          let conf = JSON.parse(this.content.conf)
          this.parameter.config = accountTypeParam[this.form.carrier][this.form.type].map(e => {
            return { info: e.info, key: e.key, value: conf[e.key] }
          })
        }
      },
      close() {
        this.$emit('closeDialog', 0)
      },
      changeCarrierType(val) {
        if (this.content) return false
        if (val) {
          this.parameter.config = accountTypeParam[this.carrier][val].map(e => {
            return { info: e.info, key: e.key, value: '' }
          })
          this.form.type = val
        } else {
          this.parameter = { config: [] }
        }
      }
    },
    computed: {
      accountTypeList() {
        return this.enums[`${this.carrier}AccountType`]
      }
    },
    components: {
      'wh-carrier-account-select': whCarrierAccountSelect,
      'wh-volume-input': whVolumeInput
    }
  }
</script>

<template>
  <div class="account-add-edit">
    <div class="wh__dialog--body">
      <el-form :inline="true" :model="form" :rules="rules" ref="form">
        <el-form-item label="运营商" class="account__item--long" prop="carrier">
          <el-select v-model="form.carrier" placeholder="选择运营商" clearable :disabled="true">
            <el-option :label="key" :value="val" v-for="(key, val) in enums.carrier.maps()" :key="val">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营商账号" class="account__item--long" prop="carrierAccountId" >
          <wh-carrier-account-select v-model="form.carrierAccountId" :carrier="form.carrier" :disabled="!!content">
          </wh-carrier-account-select>
        </el-form-item>
        <br>
        <el-form-item label="套餐类型" class="account__item--long" prop="offerType">
          <el-radio-group v-model="form.offerType" :disabled="!!content">
            <el-radio label="monthly">按月套餐</el-radio>
            <el-radio label="custom">自定义套餐</el-radio>
          </el-radio-group>
        </el-form-item>
        <br>
        <el-form-item label="套餐档位" prop="volume">
          <wh-volume-input v-model="form.volume" placeholder="流量" :disabled="!!content">
          </wh-volume-input>
          <el-select v-model="form.validity" placeholder="套餐周期" v-if="form.offerType === 'custom'"
            :disabled="!!content">
            <el-option :value="3" label="3个月">
            </el-option>
            <el-option :value="6" label="6个月">
            </el-option>
            <el-option :value="12" label="12个月">
            </el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="续费参数类型" class="account__item--long" prop="offerType" v-if="this.carrier">
          <el-radio-group v-model="form.type" :disabled="!!content" @change="changeCarrierType">
            <el-radio :label="Number(value)" v-for="(key, value) of accountTypeList.maps()" :key="value">{{key}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <h4>续费参数</h4>
      </el-form>
      <el-form :model="parameter" :rules="configRules" ref="configForm" label-width="100px" label-position="left">
        <el-form-item prop="config"  label-width="0">
          <el-form-item :label="key.key" class="account__item--long" v-for="(key, index) in parameter.config"
            :key="index">
            <el-input v-model="key.value">
            </el-input>
            <span>{{key.info}}</span>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <div class="wh__dialog--footer">
      <el-button type="primary" @click="close">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
