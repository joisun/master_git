<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import RealTimeUserSearch from '@/global/mixins/real-time-user-search'
  import RealTimeInputTagSearch from '@/global/mixins/real-time-input-tag'

  export default {
    props: ['content'],
    mixins: [DialogMixin, RealTimeUserSearch, RealTimeInputTagSearch],
    data () {
      return {
        form: {
          salesmanId: '',
          inputTag: ''
        },
        rules: {
          salesmanId: {required: true, message: '请选择销售'}
        }
      }
    },
    methods: {
      close () {
        this.$refs.form.resetFields()
      },

      cancel () {
        this.$emit('onClose', { type: 'setSalesman', refreshable: false })
      },

      confirm () {
        this.$refs.form.validate(valid => {
          if (!valid) return
          let hash = {...this.form}
          this.$emit('onClose', { type: 'setSalesman', refreshable: true, data: hash })
        })
      }
    }
  }
</script>
<template>
  <div class="abandon-customer">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="90px"
    >
      <el-form-item label="客户">
        <el-tag size="medium">{{ content.company }}</el-tag>
      </el-form-item>

      <el-form-item label="销售" prop="salesmanId">
        <el-select
          class="width70"
          clearable
          v-model="form.salesmanId"
          filterable
          remote
          :remote-method="getRemoteUsers"
          :loading="loadingRemoteUsers"
          placeholder="请选择销售">
          <el-option
            v-for="item in remoteUsers"
            :key="item.id"
            :label="item.realName + (!item.acceptCustomer ? '(客户数已达上限)' : '')"
            :disabled="!item.acceptCustomer"
            :value="item.id">
          </el-option>
        </el-select>
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
          placeholder="跟踪标签"
        >
          <el-option
            v-for="item in remoteInputTagList"
            :key="item.id"
            :label="item.inputTag"
            :value="item.tagId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
