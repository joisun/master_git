<script>
import DialogMixin from '@/global/mixins/dialog-mixin'
import AccountForm from '../mixins/account-form.js'
export default {
  name: 'account-add-edit',
  mixins: [DialogMixin],
  props: {
    carrier: {
      type: String,
      default: ''
    },
    content: {
      default: null
    },
    list: {
      default: []
    }
  },
  data() {
    return {
      form: new AccountForm(1, this.list.length ? this.list[0].id : ''),
      signedCarrierList: [],
      allSignedCarrierList: {}
    }
  },
  computed: {
    apiTypeList() {
      return this.$store.state.overall.enum[`${this.carrier}APIType`]
    },
    platformTypeList() {
      return this.$store.state.overall.enum[`${this.carrier}PlatformType`]
    },
    noSelfList() {
      return this.list.filter((e) => (this.content && e.id !== this.content.id) || !this.content)
    }
  },
  methods: {
    async getSignedCarrierList() {
      if (this.allSignedCarrierList[this.carrier]) {
        this.signedCarrierList = this.allSignedCarrierList[this.carrier]
        return
      }
      const { success, data } = await this.jaxLib.store.signedCarrierListGet({
        carrier: this.carrier
      })
      if (!success) return false
      this.allSignedCarrierList[this.carrier] = data
      this.signedCarrierList = this.allSignedCarrierList[this.carrier]
    },
    async save() {
      let data = { ...this.form }
      console.log(data)
      if (this.carrier === 'unicom') {
        ;['smsChannelApiKey'].forEach((e) => {
          delete data[e]
        })
      }
      if (this.carrier === 'chinanet') {
        ;['planType', 'smsChannelApiKey'].forEach((e) => {
          delete data[e]
        })
      }
      if (this.carrier === 'cmcc') {
        ;['planType'].forEach((e) => {
          delete data[e]
        })
      }
      if (data.refId === '') delete data.refId
      data.status = data.status ? 'ACTIVE' : 'DEACTIVE'
      data.carrier = this.carrier.toUpperCase()
      this.post(data)
    },
    async post(data) {
      const { success } = await this.jaxLib.store.carrierAccountConfigSave(data)
      if (success) {
        this.$message.success('保存成功')
        this.$emit('closeDialog', true)
      }
    },
    async open() {
      await this.getSignedCarrierList(this.carrier)
      if (this.content) {
        for (let i of Object.keys(this.form)) {
          this.form[i] = this.content.hasOwnProperty(i) ? this.content[i] : ''
        }
        this.form.id = this.content.id
        this.form.status = this.content.status === 'ACTIVE'
      } else {
        let type = Object.keys(this.apiTypeList)[0]
        this.form = new AccountForm(type, this.list.length ? this.list[0].id : '')
      }
    },
    close() {
      this.$emit('closeDialog', false)
    }
  }
}
</script>

<template>
  <div class="account-add-edit">
    <el-form :inline="true" :model="form">
      <div class="account__item">
        <el-form-item label="用户名" class="account__item--long">
          <el-input v-model="form.username" placeholder="用户名"> </el-input>
        </el-form-item>
        <el-form-item label="密码" class="account__item--long">
          <el-input v-model="form.password" placeholder="密码"> </el-input>
        </el-form-item>
      </div>
      <div class="account__item">
        <el-form-item label="描述" class="account__item--long">
          <el-input v-model="form.description" placeholder="描述"> </el-input>
        </el-form-item>
        <el-form-item label="api类型">
          <el-select v-model="form.type" placeholder="请选择">
            <template>
              <el-option
                v-for="(key, value) of apiTypeList"
                :key="value"
                :label="key"
                :value="value"
              >
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item v-if="carrier === 'unicom'" label="首次激活资费计划类型">
          <el-select v-model="form.planType" placeholder="请选择">
            <el-option label="按天" value="day"> </el-option>
            <el-option label="按半月" value="half-month"> </el-option>
            <el-option label="按整月" value="full"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="form.activeCardExpandPool">流量池容量扩大激活卡</el-checkbox>
        </el-form-item>
      </div>
      <div class="account__item">
        <el-form-item label="状态">
          <el-switch v-model="form.status" on-text="" off-text=""> </el-switch>
        </el-form-item>
        <el-form-item label="批次前缀">
          <el-input v-model="form.batchPrefix" placeholder="批次前缀"> </el-input>
        </el-form-item>
        <el-form-item label="所属运营商">
          <el-select v-model="form.signedCarrierId">
            <el-option
              v-for="item in signedCarrierList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属平台">
          <el-select v-model="form.platformType" placeholder="请选择">
            <template>
              <el-option
                v-for="(key, value) of platformTypeList"
                :key="value"
                :label="key"
                :value="value"
              >
              </el-option>
            </template>
          </el-select>
        </el-form-item>
      </div>
      <div v-if="form.type !== 'NO_API_ACCOUNT'" class="account__item">
        <el-form-item label="apiUrl" class="account__item--url">
          <el-input v-model="form.apiUrl" placeholder="apiUrl"> </el-input>
        </el-form-item>
      </div>
      <div v-if="form.type !== 'NO_API_ACCOUNT'" class="account__item">
        <el-form-item label="appId" class="account__item--long">
          <el-input v-model="form.appId" placeholder="appId"> </el-input>
        </el-form-item>
        <el-form-item label="secret" class="account__item--long">
          <el-input v-model="form.secret" placeholder="secret"> </el-input>
        </el-form-item>
      </div>
      <div v-if="form.type !== 'NO_API_ACCOUNT'" class="account__item">
        <el-form-item v-if="carrier === 'cmcc'" label="短信appId" class="account__item--long">
          <el-input v-model="form.smsChannelApiKey" placeholder="短信appId"> </el-input>
        </el-form-item>
        <el-form-item label="拓展信息" class="account__item--long">
          <el-input v-model="form.extInfo" placeholder="拓展信息,请填写JSON格式"> </el-input>
        </el-form-item>
      </div>
      <div class="account__item">
        <el-form-item label="关联子账号">
          <el-select v-model="form.refId" placeholder="请选择" clearable>
            <el-option
              v-for="item in noSelfList"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="form.masterAccount">主账号</el-checkbox>
        </el-form-item>
        <el-form-item label="售卖类型">
          <el-radio v-model="form.resaleSupplier" :label="true">转售</el-radio>
          <el-radio v-model="form.resaleSupplier" :label="false">运营</el-radio>
        </el-form-item>
      </div>
      <div class="account__item">
        <el-form-item label="">
          <el-checkbox v-model="form.vpdnAccount">VPDN账号</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.nbIotAccount">NB账号</el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="form.gprsSwitchSupport" :disabled="form.type === 'NO_API_ACCOUNT'">
            支持停开GPRS
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="form.physicalSwitchSupport"
            :disabled="form.type === 'NO_API_ACCOUNT'"
          >
            支持停复机
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.basicApiNotSupported">不支持基础API</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.carrierRealName">实名认证</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.extWhiteList">公网白名单账号</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.voiceCardAccount">语音账号</el-checkbox>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
