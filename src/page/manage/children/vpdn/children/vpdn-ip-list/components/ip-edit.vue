<script>
/**
 * Create by zeter on 2018/6/6
 */
import carrierMap from '@/collect/carrier-map'
import DialogMixin from '@/global/mixins/dialog-mixin'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import filterQueryParams from '@/global/function/filterQueryParams'

export default {
  components: {
    'wh-carrier-account-select': whCarrierAccountSelect
  },
  mixins: [DialogMixin],
  props: {
    dialogName: {
      default: '',
      required: true,
      type: String
    }
  },
  data() {
    return {
      carrierList: carrierMap.beTemplate(),
      routeList: [],
      form: {
        carrier: '',
        carrierAccountId: '',
        routerIp: '',
        apn: '',
        startIp: '',
        endIp: '',
        apnId: ''
      },
      apnList: [],
      rules: {
        carrier: [{ required: true, message: '请选择运营商', trigger: 'change' }],
        carrierAccountId: [
          { type: 'number', required: true, message: '请选择运营商账号', trigger: 'change' }
        ],
        routerIp: [{ required: true, message: '请选择路由器', trigger: 'change' }],
        apn: [{ required: true, message: '请选择APN', trigger: 'change' }],
        startIp: [{ required: true, message: '请填写起始IP', trigger: 'change' }],
        endIp: [{ required: true, message: '请填写结束IP', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getRouteList()
    this.getApnList()
  },
  methods: {
    onCarrierChange(v) {
      this.form.apn = ''
      if (!v) this.apnList = []
      this.getApnList()
    },
    async getApnList() {
      this.isLoading = true
      const { carrier } = this.form
      let res = await this.jaxLib.vpdn.apn.getList({ carrier })
      this.isLoading = false
      if (!res.success) return false
      this.apnList = res.data
    },
    open() {},
    async getRouteList() {
      let rst = await this.jaxLib.card.getRoute()
      if (!rst.success) return false
      this.routeList = rst.data
    },
    resetFrom() {
      this.form = {
        carrier: '',
        carrierAccountId: '',
        routerIp: '',
        apn: '',
        startIp: '',
        endIp: '',
        apnId: ''
      }
      this.$refs.form.resetFields()
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let postData = {
            carrier: this.form.carrier,
            carrierAccountId: this.form.carrierAccountId,
            apn: this.form.apn,
            startIp: this.form.startIp,
            endIp: this.form.endIp,
            routerIp: this.form.routerIp,
            apnId: this.form.apnId
          }
          if (!postData.apnId || !postData.apnId.trim()) {
            delete postData.apnId
          }
          let rst = await this.jaxLib.vpdn.ip.addPlan(postData)
          if (!rst.success) return false
          this.$message.success('提交成功')
          this.$emit('closeDialog', this.dialogName, true)
        }
      })
    },
    cancel() {
      this.$emit('closeDialog', this.dialogName, false)
    },
    close() {
      this.resetFrom()
    }
  }
}
</script>

<template>
  <div class="ip-edit">
    <el-form ref="form" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="运营商" prop="carrier">
        <el-select v-model="form.carrier" placeholder="选择运营商" @change="onCarrierChange">
          <el-option
            v-for="(c, index) in carrierList"
            :key="index"
            :label="c.name"
            :value="c.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运营商账号" prop="carrierAccountId">
        <wh-carrier-account-select
          v-model="form.carrierAccountId"
          placeholder="选择运营商账号"
          :carrier="form.carrier"
        >
        </wh-carrier-account-select>
      </el-form-item>
      <el-form-item label="入口路由器" prop="routerIp">
        <el-select v-model="form.routerIp" placeholder="选择路由器">
          <el-option
            v-for="c in routeList"
            :key="c.id"
            :label="c.displayName + ' - ' + c.innerIp"
            :value="c.innerIp"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="APN" prop="apn">
        <el-select v-model="form.apn" placeholder="选择APN">
          <el-option
            v-for="apn in apnList"
            :key="apn.apn"
            :label="apn.carrierName + ' - ' + apn.apn"
            :value="apn.apn"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="APN ID">
        <el-input v-model.trim="form.apnId"></el-input>
      </el-form-item>
      <el-form-item label="起始IP" prop="startIp">
        <el-input v-model.trim="form.startIp"> </el-input>
      </el-form-item>
      <el-form-item label="结束IP" prop="endIp">
        <el-input v-model.trim="form.endIp"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
