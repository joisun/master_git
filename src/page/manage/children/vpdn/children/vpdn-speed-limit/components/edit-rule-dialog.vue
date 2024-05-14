<style lang="scss">
</style>

<template>
  <div class="speed-rule-edit">
    <el-form ref="form" class="speed-rule-edit-form" :rules="rules" :model="form" label-width="40px">
      <div class="wh__dialog--body">
        <el-form-item label="客户" prop="orgId">
          <template v-if="isCreate">
            <el-input v-model="form.orgId" class="long" placeholder="请输入开启“VPDN-限速”的客户ID">
            </el-input>
            <span v-if="orgName">{{orgName}}</span>
          </template>
          <span v-else>
            {{ model.orgName }}（{{ model.orgId}}）
          </span>
        </el-form-item>
        <el-form-item label="套餐" prop="priceOfferId">
          <template v-if="isCreate">
            <el-input v-model="form.priceOfferId" class="long" placeholder="请输入【套餐分类】开启“VPDN”的套餐ID">
            </el-input>
            <span v-if="priceOfferName">{{priceOfferName}}</span>
          </template>
          <span v-else>
            {{model.priceOfferName}}（{{model.priceOfferId}}）
          </span>
        </el-form-item>
        <el-form-item label="规则">
          <template v-if="isCreate">
            <el-select placeholder="请输入" class="long" value="套餐使用量">
              <el-option value="套餐使用量">套餐使用量</el-option>
            </el-select>
          </template>
          <span v-else>
            {{ model.rule }}
          </span>
        </el-form-item>
        <el-form-item>
          <table class="speed-rule-edit-form__rules">
            <thead>
              <tr>
                <td>触发条件</td>
                <td>执行策略</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rule, index) in form.rules" :key="index">
                <td style="padding-right: 10px;">
                  <div class="speed-rule-edit-form__rule" :class="{
                    'speed-rule-edit-form__rule--error': rule.volumeError
                  }">
                    <span>
                      <el-input
                        size="small"
                        v-model="rule.volumeStart"
                        @input="onChangeVolumeStart(arguments[0], index)">
                      </el-input>
                      <el-select
                        size="small"
                        v-model="rule.volumeStartUnit"
                        @input="onChangeVolumeStart(arguments[0], index)">
                        <el-option value="MB">MB</el-option>
                        <el-option value="GB">GB</el-option>
                      </el-select>
                    </span>
                    <span>≤ 套餐使用量 &lt;</span>
                    <span>
                      <el-input size="small" v-model="rule.volumeEnd" @input="onChangeVolumeEnd(arguments[0], index)">
                      </el-input>
                      <el-select size="small"
                        v-model="rule.volumeEndUnit"
                        @input="onChangeVolumeEnd(arguments[0], index)">
                        <el-option value="MB">MB</el-option>
                        <el-option value="GB">GB</el-option>
                      </el-select>
                    </span>
                  </div>
                </td>
                <td>
                  <div class="speed-rule-edit-form__rule" :class="{
                    'speed-rule-edit-form__rule--error': rule.speedError
                  }">
                    <span>网速限制至</span>
                    <span>
                      <!-- speedLevelList的都是Kbps单位的 -->
                      <el-select class="speed" size="small" v-model="rule.speed">
                        <el-option
                          v-for="level in speedLevelList"
                          :key="level.value"
                          :label="`${level.value}Kbps`"
                          :value="level.value">
                        </el-option>
                      </el-select>
                    </span>
                    <el-button
                      v-if="index < 4"
                      :disabled="form.rules.length === 5"
                      type="primary" size="small" icon="el-icon-plus"
                      circle
                      @click="onClickAdd(index)">
                    </el-button>
                    <el-button
                      v-if="index != 0"
                      type="primary"
                      size="small"
                      icon="el-icon-minus"
                      circle
                      style="margin-left: 0;"
                      @click="onClickDel(index)">
                    </el-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-form-item>
        <el-button type="primary" @click="onClickSubmit">确认</el-button>
        <el-button @click="onClickCancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'

  class Rule {
    constructor() {
      this.id = ''
      this.speedLimitId = ''
      this.volumeStart = ''
      this.volumeStartUnit = ''
      this.volumeEnd = ''
      this.volumeEndUnit = ''
      this.speed = ''
      this.speedUnit = 'Kbps'
    }

    static parse(rule) {
      let convertVolume = (value) => {
        if (+value >= 1024) {
          let numbericValue = value / 1024
          if (Number.isInteger(numbericValue)) {
            return [numbericValue, 'GB']
          }
        }
        return [value, 'MB']
      }
      let convertSpeed = (value) => [value, 'Kbps']

      let r = new Rule()
      r.id = rule.id
      r.speedLimitId = rule.speedLimitId

      let [volumeStart, volumeStartUnit] = convertVolume(rule.usageStart)
      r.volumeStart = volumeStart
      r.volumeStartUnit = volumeStartUnit

      let [volumeEnd, volumeEndUnit] = convertVolume(rule.usageEnd)
      r.volumeEnd = volumeEnd
      r.volumeEndUnit = volumeEndUnit

      let [speed, speedUnit] = convertSpeed(rule.speedLimitValue)
      r.speed = speed
      r.speedUnit = speedUnit

      return r
    }

    /**
     * 单位标准化
     */
    standardize() {
      let convert2mb = (unit, value) => {
        if (value === '') {
          return value
        }
        return unit === 'GB' ? value * 1024 : +value
      }

      let convert2kbps = (unit, value) => {
        if (value === '') {
          return value
        }
        return unit === 'Mbps' ? value * 1024 : +value
      }

      let result = {
        symbolStart: '≤',
        symbolEnd: '<',
        usageStart: convert2mb(this.volumeStartUnit, this.volumeStart),
        usageEnd: convert2mb(this.volumeEndUnit, this.volumeEnd),
        speedLimitValue: convert2kbps(this.speedUnit, this.speed)
      }

      if (this.id) {
        result.id = this.id
      }
      if (this.speedLimitId) {
        result.speedLimitId = this.speedLimitId
      }

      return result
    }

    positiveValidator(value, minLimit) {
      return !(String(value).trim() === '' ||
        isNaN(+value) ||
        !Number.isInteger(+value) ||
        +value < minLimit ||
        +value > 9999)
    }

    validateVolume() {
      if (this.volumeStartUnit === '' || this.volumeEndUnit === '') {
        return new Error('请选择单位')
      }

      if (!this.positiveValidator(this.volumeStart, 0)) {
        return new Error('请输入0-9999之间的正整数')
      }
      if (!this.positiveValidator(this.volumeEnd, 0)) {
        return new Error('请输入0-9999之间的正整数')
      }

      let result = this.standardize()

      if (+result.usageStart > +result.usageEnd) {
        return new Error('起始使用量必须小于等于终止使用量')
      }
    }

    validateSpeed() {
      if (this.speedUnit === '') {
        return new Error('请选择单位')
      }

      if (!this.positiveValidator(this.speed, 1)) {
        return new Error('请输入1-9999之间的正整数')
      }
    }
  }

  export default {
    mixins: [DialogMixin],
    props: {
      speedLevelList: {
        type: Array,
        default: _ => []
      },
      isCreate: {
        type: Boolean
      },
      model: {
        default: _ => ({})
      }
    },
    data() {
      let orgIdValidator = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback(new Error(' '))
          return
        }
        let p = this.jaxLib.vpdn.speedLimit.checkSpeedLimit({ orgId: value })
        p.then(resp => {
          if (!resp.success) {
            callback(new Error(resp.message))
          } else {
            this.orgName = resp.data
            callback()
          }
        }).catch(err => {
          console.error(err)
        })
      }
      let priceOfferIdValidator = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback(new Error(' '))
          return
        }
        let p = this.jaxLib.vpdn.speedLimit.checkVPDN({ id: value })
        p.then(resp => {
          if (!resp.success) {
            callback(new Error(resp.message))
          } else {
            this.priceOfferName = resp.data
            callback()
          }
        }).catch(err => {
          console.error(err)
        })
      }

      this.$nextTick(_ => this.reset())

      return {
        orgName: '',
        priceOfferName: '',
        rules: {
          orgId: [
            { validator: orgIdValidator, trigger: 'blur' }
          ],
          priceOfferId: [
            { validator: priceOfferIdValidator, trigger: 'blur' }
          ]
        },
        delConfigIds: [],
        form: {
          orgId: '',
          priceOfferId: '',
          rules: []
        }
      }
    },
    watch: {
      visible(value) {
        if (!value) {
          this.orgName = ''
          this.priceOfferName = ''
          this.$refs.form.resetFields()
        } else {
          this.reset()
        }
      }
    },
    methods: {
      validate() {
        let rules = this.form.rules
        for (let i = 0; i < rules.length; i++) {
          let rule = rules[i]
          let volumeError = rule.validateVolume()
          let flag = true
          if (volumeError != null) {
            this.$set(rule, 'volumeError', volumeError.toString())
            flag = false
          } else {
            this.$delete(rule, 'volumeError')
          }
          let speedError = rule.validateSpeed()
          if (speedError != null) {
            flag = false
            this.$set(rule, 'speedError', speedError.toString())
          } else {
            this.$delete(rule, 'speedError')
          }
          if (!flag) {
            return false
          }
        }
        return true
      },
      onClickCancel() {
        this.$emit('close')
      },
      reset() {
        let model = this.model || {}
        // this.orgName = model.orgName
        // this.priceOfferName = model.priceOfferName
        this.form.orgId = model.orgId
        this.form.priceOfferId = model.priceOfferId
        this.form.rules = (model.speedLimitConfigs || []).map(rule => Rule.parse(rule))
        if (this.form.rules.length === 0) {
          this.form.rules = [new Rule()]
        }
      },
      async submit() {
        let form = {
          orgId: this.form.orgId,
          priceOfferId: this.form.priceOfferId,
          speedLimitConfigs: this.form.rules.map(rule => rule.standardize())
        }
        if (this.isCreate) {
          let resp = await this.jaxLib.vpdn.speedLimit.create(form)
          if (!resp.success) {
            this.$message.error(resp.message)
            return
          }
          this.$message.success('新增成功')
        } else {
          form.speedLimitId = this.model.speedLimitId
          form.delConfigIds = this.delConfigIds.join(',')
          let resp = await this.jaxLib.vpdn.speedLimit.update(form)
          if (!resp.success) {
            this.$message.error(resp.message)
            return
          }
          this.$message.success('修改成功')
        }
        this.$emit('submited')
        this.$emit('close')
      },
      onClickSubmit() {
        let ruleValid = this.validate()
        this.$refs.form.validate(valid => {
          if (!valid || !ruleValid) {
            return
          }
          this.submit()
        })
      },
      onChangeVolumeEnd(value, index) {
        if (this.form.rules.length === index + 1) {
          return
        }
        let rule = this.form.rules[index]
        this.form.rules[index + 1].volumeStart = rule.volumeEnd
        this.form.rules[index + 1].volumeStartUnit = rule.volumeEndUnit
      },
      onChangeVolumeStart(value, index) {
        if (index === 0) {
          return
        }
        let rule = this.form.rules[index]
        this.form.rules[index - 1].volumeEnd = rule.volumeStart
        this.form.rules[index - 1].volumeEndUnit = rule.volumeStartUnit
      },
      onClickAdd(index) {
        let rule = new Rule()
        let prevRule = this.form.rules[index]
        let nextRule = this.form.rules[index + 1]
        if (prevRule) {
          rule.volumeStart = prevRule.volumeEnd
          rule.volumeStartUnit = prevRule.volumeEndUnit
        }
        if (nextRule) {
          rule.volumeEnd = nextRule.volumeStart
          rule.volumeEndUnit = nextRule.volumeStartUnit
        }
        this.form.rules.splice(index + 1, 0, rule)
      },
      onClickDel(index) {
        let rule = this.form.rules[index]
        let prevRule = this.form.rules[index - 1]
        let nextRule = this.form.rules[index + 1]
        if (nextRule && prevRule) {
          nextRule.volumeStart = prevRule.volumeEnd
          nextRule.volumeStartUnit = prevRule.volumeEndUnit
        }
        this.form.rules.splice(index, 1)
        if (rule.id && this.delConfigIds.indexOf(rule.id) === -1) {
          this.delConfigIds.push(rule.id)
        }
      }
    }
  }
</script>
