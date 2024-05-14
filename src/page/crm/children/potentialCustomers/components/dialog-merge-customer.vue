<script>
import apis from '@/api/ajax'

export default {
  props: ['id'],
  data() {
    return {
      form: {
        id: '',
        mergeId: ''
      },
      rules: {
        mergeId: { required: true, message: '请选择客户' }
      },
      remoteCustomerList: [],
      loadingRemote: false
    }
  },

  watch: {
    'form.mergeId': function (val) {}
  },

  mounted() {
    this.form.id = this.id.toString()
  },

  methods: {
    close() {
      this.$refs.form.resetFields()
    },

    cancel() {
      this.$emit('onClose', { type: 'mergeCustomer', refreshable: false })
    },

    confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        let hash = { ...this.form }
        this.$emit('onClose', { type: 'mergeCustomer', refreshable: true, data: hash })
      })
    },

    async fetchCustomer(query) {
      if (query.length) {
        this.loadingRemote = true
        const ret = await apis.crm.customerSearchAll({ keyword: query })
        this.remoteCustomerList = ret.data
        this.loadingRemote = false
      }
    }
  }
}
</script>
<template>
  <div class="abandon-customer">
    <el-alert
      show-icon
      title="合并后当前客户将成为选择客户的子账户"
      type="warning"
      :closable="false"
    />
    <el-form ref="form" :model="form" :rules="rules" label-width="136px" style="margin-top: 20px">
      <el-form-item label="选择要合并的客户" prop="mergeId">
        <el-select
          v-model="form.mergeId"
          class="width95"
          clearable
          filterable
          remote
          :remote-method="fetchCustomer"
          :loading="loadingRemote"
          placeholder="输入客户名/公司名/联系人进行选择客户"
        >
          <el-option
            v-for="item in remoteCustomerList"
            :key="item.id"
            :label="item.company + (item.orgId ? '(orgId:' + item.orgId + ')' : '(未注册)')"
            :value="item.id"
            :disabled="!!item.orgId && !!item.orgId.length"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
