<script>
/**
   * Create by zeter on 2018/11/21
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  let thresholdRegexp = new RegExp(/^[1-9]\d?$/)
  let emailRegexp = new RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g)
  let phoneRegexp = new RegExp(/\d{3}-\d{8}|\d{4}-\{7,8}/g)
  export default {
    mixins: [DialogMixin],
    name: 'alarm-setting-dialog',
    props: {
      dialogName: {
        default: String
      }
    },
    data() {
      let checkTotalThreshold = (rule, value, callback) => {
        let groupValue = this.alarmForm
        let groupThreshold = []
        // eslint-disable-next-line no-unused-vars
        for (let i in groupValue.thresholdValue) {
          groupThreshold[i] = (groupValue.thresholdValue[i].toString().match(thresholdRegexp)) || !groupValue.thresholdValue[i]
        }
        let totalThreshold = groupValue.thresholdValue[0] || groupValue.thresholdValue[1] || groupValue.thresholdValue[2]
        let effective = groupThreshold[0] && groupThreshold[1] && groupThreshold[2]
        if (this.alarmTypeValue !== 0 && !totalThreshold) {
          callback(new Error('请选择至少一个告警值'))
        } else if (this.alarmTypeValue === 0 && totalThreshold) {
          callback(new Error('请选择至少一种通知方式'))
        } else if (this.alarmTypeValue !== 0 && !effective) {
          callback(new Error('请输入有效的告警值(0-99之中的整数)'))
        } else {
          callback()
        }
      }
      let checkEmail = (rule, value, callback) => {
        let checkValue = value !== '' ? value.split('\n') : []
        let canUseValue = true
        // eslint-disable-next-line no-unused-vars
        for (let i of checkValue) {
          if (!i.match(emailRegexp) && i !== '') canUseValue = false
        }
        if (this.alarmForm.emailCheck && value.trim() === '') {
          callback(new Error('请输入邮箱'))
        } else if (!canUseValue) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
      let checkMessage = (rule, value, callback) => {
        let checkValue = value !== '' ? value.split('\n') : []
        let canUseValue = true
        // eslint-disable-next-line no-unused-vars
        for (let i of checkValue) {
          if (!i.match(phoneRegexp) && i === '') canUseValue = false
        }
        if (this.alarmForm.messageCheck && value.trim() === '') {
          callback(new Error('请输入手机号码'))
        } else if (!canUseValue) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
      return {
        alarmForm: {
          emailCheck: false,
          emailText: '',
          messageCheck: false,
          messageText: '',
          thresholdValue: ['', '', '']
        },
        alarmFormRules: {
          input: [
            { validator: checkTotalThreshold, trigger: 'blur' }
          ],
          emailText: [
            { validator: checkEmail, trigger: 'blur' }
          ],
          messageText: [
            { validator: checkMessage, trigger: 'blur' }
          ]
        },
        alarmBtn: false // 提交是否禁用
      }
    },
    computed: {
      alarmTypeValue() {
        let emailSure = this.alarmForm.emailCheck === true ? 2 : 0
        let messageSure = this.alarmForm.messageCheck === true ? 1 : 0
        return emailSure + messageSure
      }
    },
    methods: {
      // 校验提交告警
      sureAlarm() {
        this.$refs.alarmForm.validate(async(valid) => {
          if (valid) {
            let validOverThreshold = this.alarmForm.thresholdValue.filter(item => !!item).sort((a, b) => a - b)
            this.alarmBtn = true
            let rst = await this.jaxLib.pool.sureAlarm({
              notifyPhone: this.alarmForm.messageText.replace(/\n/g, ','),
              notifyEmail: this.alarmForm.emailText.replace(/\n/g, ','),
              notifyOption: this.alarmTypeValue,
              warningThreshold: validOverThreshold[0] ? Number(validOverThreshold[0] / 100).toFixed(2) : '',
              criticalThreshold: validOverThreshold[1] ? Number(validOverThreshold[1] / 100).toFixed(2) : '',
              fatalThreshold: validOverThreshold[2] ? Number(validOverThreshold[2] / 100).toFixed(2) : ''
            })
            if (!rst.success) return false
            this.alarmBtn = false
            this.$message.success('设置成功')
            this.$emit('closeDialog', this.dialogName)
          }
        })
      },
      // 重载告警表单
      async readAlarm() {
        let rst = await this.jaxLib.pool.queryAlarm()
        if (rst.success && rst.data !== null) {
          this.alarmForm = {
            emailCheck: rst.data.emailNotify,
            emailText: rst.data.notifyEmail.replace(/,/g, '\n') || '',
            messageCheck: rst.data.smsNotify,
            messageText: rst.data.notifyPhone.replace(/,/g, '\n') || '',
            thresholdValue: [
              rst.data.warningThreshold !== 0 ? Number(rst.data.warningThreshold * 100).toFixed(0) : '',
              rst.data.criticalThreshold !== 0 ? Number(rst.data.criticalThreshold * 100).toFixed(0) : '',
              rst.data.fatalThreshold !== 0 ? Number(rst.data.fatalThreshold * 100).toFixed(0) : ''
            ]
          }
        }
      },
      open() {
        this.alarmBtn = false
        this.readAlarm()
      },
      close() {
        this.$emit('closeDialog', this.dialogName)
      }
    }
  }
</script>

<template>
  <div class="alarm-setting-dialog wh__dialog">
    <div class="wh__dialog--body">
      <el-form label-position="top" :model="alarmForm" :rules="alarmFormRules" ref="alarmForm">
        <div>
          <h4>通知设置</h4>
          <el-form-item prop="emailText">
            <el-checkbox v-model="alarmForm.emailCheck" label="开启邮箱通知">
            </el-checkbox>
            <div>
              <el-input
                type="textarea"
                placeholder="请输入邮箱，多个邮箱换行输入"
                v-model="alarmForm.emailText">
              </el-input>
            </div>
          </el-form-item>
          <el-form-item prop="messageText">
            <el-checkbox v-model="alarmForm.messageCheck" label="开启短信通知">
            </el-checkbox>
            <div>
              <el-input
                type="textarea"
                placeholder="请输入手机号码，多个手机号码换行输入"
                v-model="alarmForm.messageText">
              </el-input>
            </div>
          </el-form-item>
          <h4>告警设置<span>(每个规格触发通知一次)</span></h4>
          <el-form-item prop="input">
            <el-form-item>
              <span>流量池使用量超过
                <el-input
                  v-model="alarmForm.thresholdValue[0]"
                  class="threshold"
                  size="mini">
                </el-input>%进行通知
              </span>
            </el-form-item>
            <el-form-item>
              <span>流量池使用量超过
                <el-input
                  v-model="alarmForm.thresholdValue[1]"
                  class="threshold"
                  size="mini">
                </el-input>%进行通知
              </span>
            </el-form-item>
            <el-form-item>
              <span>流量池使用量超过
                <el-input
                  v-model="alarmForm.thresholdValue[2]"
                  class="threshold"
                  size="mini">
                </el-input>%进行通知
              </span>
            </el-form-item>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="wh__dialog--footer">
      <el-button @click="$emit('closeDialog', dialogName)">取 消</el-button>
      <el-button type="primary" @click="sureAlarm" :disabled="alarmBtn">确 定</el-button>
    </div>
  </div>
</template>
