<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      apnList: [],
      rule: {
        carrier: '',
        remark: '',
        apn: '',
        startIp: '',
        endIp: '',
        ipRange: '',
        inRouterIp: '',
        outRouterIp: '',
        controlIp: {
          control: '',
          speed: '',
          split: '',
          whitelist: '',
          blacklist: '',
          networking: ''
        },
        comment: ''
      },
      formRules: {
        carrier: [{ required: true, message: '请选择运营商', trigger: 'change' }],
        remark: [{ required: true, message: '请填写运营商账号', trigger: 'change' }],
        apn: [{ required: true, message: '请填写APN', trigger: 'change' }],
        startIp: [{ required: true, message: '请填写起始IP', trigger: 'change' }],
        endIp: [{ required: true, message: '请填写结束IP', trigger: 'change' }],
        inRouterIp: [{ required: true, message: '请填写入口路由器IP', trigger: 'change' }],
        outRouterIp: [{ required: true, message: '请填写出口路由器IP', trigger: 'change' }]
      },
      emptyRule: {}
    }
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue) {
        this.getApnList()
      }
    }
  },
  created() {
    this.emptyRule = JSON.parse(JSON.stringify(this.rule))
  },
  methods: {
    onCarrierChange() {
      this.getApnList()
    },
    async getApnList() {
      const { carrier } = this.rule
      if (!carrier) this.apnList = []
      this.isLoading = true
      const params = {
        carrier
      }
      if (!carrier || carrier === '*') {
        delete params.carrier
      }
      let res = await this.jaxLib.vpdn.apn.getList(params)
      this.isLoading = false
      if (!res.success) return false
      this.apnList = res.data
    },
    async getRuleDetail() {
      if (!this.id) {
        this.rule = JSON.parse(JSON.stringify(this.emptyRule))
        return true
      }
      let res = await this.jaxLib.vpdn.rule.get({ id: this.id })
      if (!res.success) return false
      this.rule = res.data
      Object.keys(this.emptyRule).forEach((key) => {
        if (this.rule[key] === undefined) {
          this.rule[key] = ''
        }
      })
    },
    reset() {
      this.rule = {
        carrier: '',
        remark: '',
        apn: '',
        startIp: '',
        endIp: '',
        ipRange: '',
        inRouterIp: '',
        outRouterIp: '',
        controlIp: {
          control: '',
          speed: '',
          split: '',
          whitelist: '',
          blacklist: '',
          networking: ''
        },
        comment: ''
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleClose() {
      this.reset()
      this.$emit('close')
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = {}
          let postData = JSON.parse(JSON.stringify(this.rule))
          Object.keys(postData.controlIp).forEach((key) => {
            if (!postData.controlIp[key].trim()) {
              delete postData.controlIp[key]
            }
          })
          if (this.id) {
            res = await this.jaxLib.vpdn.rule.update(postData)
          } else {
            res = await this.jaxLib.vpdn.rule.add(postData)
          }
          if (!res.success) return false
          this.$message({ type: 'success', message: this.id ? '保存成功' : '新增成功' })
          this.reset()
          this.$emit('close', true)
        }
      })
    }
  }
}
</script>

<template>
  <div class="edit-dialog">
    <el-dialog
      :title="id ? '编辑' : '新增'"
      :visible="dialogVisible"
      width="50%"
      @open="getRuleDetail"
      @close="handleClose"
    >
      <el-form ref="form" label-width="160px" :model="rule" :rules="formRules">
        <el-form-item label="运营商" prop="carrier">
          <el-select v-model="rule.carrier" class="width100" @change="onCarrierChange">
            <el-option
              v-for="(item, key) in enums.carrier.maps()"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运营商账号" prop="remark">
          <el-input v-model="rule.remark"></el-input>
        </el-form-item>
        <el-form-item label="APN" prop="apn">
          <el-select v-model="rule.apn" placeholder="选择APN">
            <el-option
              v-for="apn in apnList"
              :key="apn.apn"
              :label="apn.carrierName + ' - ' + apn.apn"
              :value="apn.apn"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始IP" prop="startIp">
          <el-input v-model="rule.startIp"></el-input>
        </el-form-item>
        <el-form-item label="结束IP" prop="endIp">
          <el-input v-model="rule.endIp"></el-input>
        </el-form-item>
        <el-form-item label="IP段">
          <el-input v-model="rule.ipRange"></el-input>
        </el-form-item>
        <el-form-item label="入口路由器IP" prop="inRouterIp">
          <el-input v-model="rule.inRouterIp"></el-input>
        </el-form-item>
        <el-form-item label="出口路由器IP" prop="outRouterIp">
          <el-input v-model="rule.outRouterIp"></el-input>
        </el-form-item>
        <el-form-item label="网络功能及其对应路由">
          <p class="mb10">
            <el-input v-model="rule.controlIp.control">
              <template slot="prepend">
                <span class="input-label">control</span>
              </template>
            </el-input>
          </p>
          <p class="mb10">
            <el-input v-model="rule.controlIp.speed">
              <template slot="prepend">
                <span class="input-label">speed</span>
              </template>
            </el-input>
          </p>
          <p class="mb10">
            <el-input v-model="rule.controlIp.split">
              <template slot="prepend">
                <span class="input-label">split</span>
              </template>
            </el-input>
          </p>
          <p class="mb10">
            <el-input v-model="rule.controlIp.whitelist">
              <template slot="prepend">
                <span class="input-label">whitelist</span>
              </template>
            </el-input>
          </p>
          <p class="mb10">
            <el-input v-model="rule.controlIp.blacklist">
              <template slot="prepend">
                <span class="input-label">blacklist</span>
              </template>
            </el-input>
          </p>
          <p class="mb10">
            <el-input v-model="rule.controlIp.networking">
              <template slot="prepend">
                <span class="input-label">networking</span>
              </template>
            </el-input>
          </p>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="rule.comment" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
