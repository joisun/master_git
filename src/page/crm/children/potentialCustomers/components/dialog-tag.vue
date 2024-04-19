<script type="text/jsx">
  import * as appTypes from '@/store/types'
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import RealTimeInputTagSearch from '@/global/mixins/real-time-input-tag'

  const form = {
    inputTagId: ''
  }
  const rules = {
    inputTagId: [{ required: true, whitespace: true, message: '请至少选择一个跟踪标签', trigger: 'blur' }]
  }
  export default {
    mixins: [DialogMixin, RealTimeInputTagSearch],
    props: ['command'],
    data() {
      return {
        form: { ...form },
        rules: { ...rules },
        states: {
          isAdding: false,
          tag: ''
        },
        mapping: {
          '1': '应用勾选项',
          '0': '应用全部'
        }
      }
    },
    methods: {
      close() {
        this.form = { ...form }
        this.states.tag = ''
        this.$refs.form.resetFields()
      },
      open() {
        this.$store.dispatch(appTypes.INPUT_TAG_SEARCH, { keyword: '' })
      },
      async saveTag() {
        let { states: { tag } } = this
        await this.$store.dispatch(appTypes.INPUT_TAG_POST, { inputTag: tag })
        this.states.isAdding = false
        this.open()
      },
      cancel() {
        this.$emit('onClose', { type: 'inputTag', refreshable: false })
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (!valid) return
          this.$emit('onClose', { type: 'inputTag', refreshable: true, data: this.form })
        })
      }
    }
  }
</script>
<template>
  <div class="customer-input-tag-dialog">
    <p class="margin-bottom10">请输入跟进标签（当前{{mapping[command]}}）</p>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px">
      <el-form-item label="跟踪标签" prop="inputTagId">
        <el-select
          class="width100"
          clearable
          v-model="form.inputTagId"
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
      <p class="f-size-l9 margin-top10 el-form-item">没找到合适的标签？
        <el-button class="link" @click="states.isAdding = true" size="mini">点击添加</el-button></p>
      <el-form-item label="标签名" v-if="states.isAdding">
        <el-input class="width75" v-on:keyup.native.enter="saveTag" v-model="states.tag" placeholder="请输入标签名，回车键保存">
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
