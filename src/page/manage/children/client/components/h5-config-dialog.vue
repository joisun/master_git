<template>
  <el-dialog title="H5配置" :visible.sync="visible" :before-close="handleClose">
    <el-form ref="form" :model="formData" label-width="130px">
      <el-form-item label="注册登录">
        <el-radio-group v-model="formData.needLogin" :disabled="isDisabled">
          <el-radio label="需要" disabled></el-radio>
          <el-radio label="不需要"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否需要续费">
        <el-radio-group v-model="formData.needRecharge" :disabled="isDisabled">
          <el-radio label="需要" disabled></el-radio>
          <el-radio label="不需要"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="收费方式">
        <el-radio-group v-model="formData.payWay" disabled>
          <el-radio label="SIMBOSS收钱，然后返佣给客户"></el-radio>
          <el-radio label="客户自己收钱"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="共用H5链接">
        <el-radio-group v-model="formData.htmlCommon" :disabled="isDisabled">
          <el-radio :label="1">需要</el-radio>
          <el-radio :label="0">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="formData.htmlCommon === 1 && !isDisabled"
        label="共用H5链接客户"
        prop="orgIds"
        :rules="{
          required: false,
          message: '请选择需要公用的客户'
        }"
      >
        <el-select
          v-model="formData.orgIds"
          :disabled="isDisabled"
          style="width: 400px"
          filterable
          remote
          clearable
          multiple
          reserve-keyword
          placeholder="输入客户ID搜索"
          :remote-method="queryOrgAsync"
        >
          <el-option
            v-for="item in orgNameList"
            :key="item.id"
            :label="`${item.orgName}(${item.id})`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="H5链接"
        :rules="[
          { required: true, message: '请输入H5链接' },
          { min: 4, message: 'H5链接至少输入4个字符' },
          {
            validator(rule, value, callback) {
              const reg = /[\w-\.]+$/g
              if (!reg.test(value)) {
                return callback('只能由数字、字母、-、.、_组成')
              }
              callback()
            }
          }
        ]"
        prop="htmlKey"
      >
        <el-input
          v-model="formData.htmlKey"
          :disabled="isDisabled"
          placeholder="请输入内容"
          style="width: 400px"
          min-length="4"
        >
          <template slot="prepend">{{ commPrefix }}</template>
        </el-input>
        <el-button :disabled="isDisabled" @click="genRandomString()">随机生成</el-button>
      </el-form-item>
    </el-form>
    <span v-if="!isDisabled" slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { safeGet } from '@/global/function/safe-operations'
const DEFAULT_FORM_DATA = JSON.stringify({
  orgIds: [],
  htmlKey: '',
  htmlCommon: 0,
  payWay: 'SIMBOSS收钱，然后返佣给客户',
  needLogin: '不需要',
  needRecharge: '不需要'
})
export default {
  data() {
    return {
      commPrefix: 'https://client.simboss.com/query/',
      visible: false,
      isAdd: true,
      formData: JSON.parse(DEFAULT_FORM_DATA),
      content: {},
      orgNameList: [],
      detail: null
    }
  },
  computed: {
    isDisabled() {
      return !this.detail ? false : !(this.detail || {}).main
    }
  },
  methods: {
    genRandomString() {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const urlLength = 10
      let url = ''
      for (let i = 0; i <= urlLength; i++) {
        const randomNumber = Math.floor(Math.random() * chars.length)
        url += chars.substring(randomNumber, randomNumber + 1)
      }
      this.formData.htmlKey = url
    },
    open(content) {
      this.content = content
      this.formData = {
        ...this.formData,
        orgId: content.orgId
      }
      this.getDetail()
      this.visible = true
    },
    handleClose() {
      this.reset()
      this.visible = false
    },
    reset() {
      this.$refs.form.clearValidate()
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.content = {}
      this.detail = null
    },
    async getDetail() {
      const res = await this.jaxLib.customer.h5Manage.getH5Config({
        orgId: this.content.orgId
      })
      if (safeGet(res, 'success', false)) {
        this.isAdd = !res.data
        this.detail = res.data
        this.formData = {
          ...this.formData,
          ...(this.detail || {}),
          orgIds: res.data && res.data.rel ? Object.keys(res.data.rel).map((item) => +item) : []
        }
      }
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        const { id, orgId, htmlKey, orgIds } = this.formData
        const htmlUrl = `${this.commPrefix}${htmlKey}`
        const res = await this.jaxLib.customer.h5Manage[
          this.isAdd ? 'insertH5Config' : 'updateH5Config'
        ]({
          id,
          orgId,
          htmlKey,
          htmlUrl,
          orgIds
        })
        if (safeGet(res, 'success', false)) {
          this.$message.success('操作成功')
          this.reset()
          this.$emit('confirm')
          this.visible = false
        }
      })
    },
    async queryOrgAsync(queryString) {
      this.formData.orgName = ''
      const res = await this.jaxLib.customer.list.get(
        {
          pageIndex: 1,
          pageSize: 100,
          orgName: queryString,
          saler: ''
        },
        false
      )
      if (!res.success) return false
      this.orgNameList = res.data.list.map((e) => ({
        id: e.id,
        orgName: e.orgName
      }))
    }
  }
}
</script>
