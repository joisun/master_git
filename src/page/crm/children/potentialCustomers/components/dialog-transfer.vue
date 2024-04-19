<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import RealTimeUserSearch from '@/global/mixins/real-time-user-search'
  import RealTimeInputTagSearch from '@/global/mixins/real-time-input-tag'
  const form = {
    userId: '',
    inputTag: '',
    isSync: '0'
  }
  const rules = {
    userId: [{required: true, message: '请选择转移的销售'}]
  }
  export default {
    mixins: [DialogMixin, RealTimeUserSearch, RealTimeInputTagSearch],
    props: {
      customers: {
        type: Array
      },
      isRegister: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        form: { ...form },
        rules: { ...rules }
      }
    },
    methods: {
      close () {
        this.$refs.form.resetFields()
        this.form = { ...form }
      },
      cancel () {
        this.$emit('onClose', { type: 'transfer', refreshable: false })
      },
      confirm () {
        this.$refs.form.validate(valid => {
          if (!valid) return
          let hash = { ...this.form }
          hash.transferedIds = this.customers.map(item => item.id || item.userId).join(',')
          hash.isSync = +hash.isSync
          this.$emit('onClose', { type: 'transfer', refreshable: true, data: hash })
        })
      }
    }
  }
</script>
<template>
  <div class="customer-transfer">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px">
      <el-form-item label="客户">
        <el-tag size="mini"
                class="margin-right10"
                v-for="(item, index) in customers"
                :key="index">{{item.company}}
        </el-tag>
      </el-form-item>
      <el-form-item label="销售" prop="userId">
        <el-select
          v-model="form.userId"
          clearable
          filterable
          remote
          :remote-method="getRemoteUsers"
          :loading="loadingRemoteUsers"
          placeholder="请选择销售"
          class="width80">
          <el-option
            v-for="item in remoteUsers"
            :key="item.id"
            :label="item.realName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否同步到潜客" v-if="isRegister">
        <el-radio class="radio" v-model="form.isSync" label="1">同步</el-radio>
        <el-radio class="radio" v-model="form.isSync" label="0">不同步</el-radio>
      </el-form-item>
      <el-form-item label="跟踪标签" prop="inputTag">
        <el-select
          class="width70"
          clearable
          v-model="form.inputTag"
          filterable
          remote
          :remote-method="getRemoteInputTagList"
          :loading="loadingRemoteInputTag"
          placeholder="跟踪标签">
          <el-option
            v-for="item in remoteInputTagList"
            :key="item.id"
            :label="item.inputTag"
            :value="item.tagId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
