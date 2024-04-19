<script type="text/jsx">
  import * as appTypes from '@/store/types'
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import RealTimeInputMarkSearch from '@/global/mixins/real-time-input-mark'

  const form = {
    remarkId: ''
  }
  const rules = {
    remarkId: [{ required: true, type: 'number', whitespace: true, message: '请至少选择一个标记', trigger: 'blur' }]
  }
  export default {
    mixins: [DialogMixin, RealTimeInputMarkSearch],
    data() {
      return {
        form: { ...form },
        rules: { ...rules },
        states: {
          isAdding: false,
          remark: ''
        }
      }
    },
    methods: {
      close() {
        this.form = { ...form }
        this.states.remark = ''
        this.$refs.form.resetFields()
      },
      open() {
        this.$store.dispatch(appTypes.INPUT_MARK_SEARCH, { remark: '' })
      },
      async saveTag() {
        let { states: { remark } } = this
        await this.$store.dispatch(appTypes.INPUT_MARK_POST, { remark })
        this.states.isAdding = false
        this.open()
      },
      cancel() {
        this.$emit('onClose', { type: 'inputMark', refreshable: false })
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (!valid) return
          this.$emit('onClose', { type: 'inputMark', data: this.form, refreshable: true })
        })
      }
    }
  }
</script>
<template>
  <div class="customer-input-tag-dialog">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px">
      <el-form-item label="标记" prop="remarkId">
        <el-select
          class="width100"
          clearable
          v-model="form.remarkId"
          filterable
          remote
          :remote-method="getRemoteInputMarkList"
          :loading="loadingRemoteInputMark"
          placeholder="搜索标记">
          <el-option
            v-for="item in remoteInputMarkList"
            :key="item.id"
            :label="item.remark"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <p class="f-size-l9 margin-top10 el-form-item">没找到合适的标记？
        <el-button class="link" @click="states.isAdding = true" size="mini">点击添加</el-button>
      </p>
      <el-form-item label="标记名" v-if="states.isAdding">
        <el-input class="width75" v-on:keyup.native.enter="saveTag" v-model="states.remark" placeholder="请输入标记名，回车键保存">
        </el-input>
        <el-button @click="saveTag">保存</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
