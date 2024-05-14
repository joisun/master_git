<script>
import { categoryMap } from './index'
import apis from '@/api/ironman-api'

export default {
  props: {
    allTopics: {
      type: Object,
      default: () => {}
    },
    editRow: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      categoryMap,
      form: {
        supportTopic: {
          STATUS: [],
          NETWORK: [],
          SECURITY: [],
          SYSTEM: [],
          MONITOR: [],
          TOOL: []
        }
      },
      formRules: {
        version: { required: true, message: '请输入版本号', trigger: 'blur' },
        desc: { required: true, message: '请输入发布说明', trigger: 'blur' }
      },
      allVersionList: [],
      copyVersionId: ''
    }
  },
  created() {
    this.getAllVersion()
    if (this.type === 'edit') {
      this.form.version = this.editRow.version
      this.form.desc = this.editRow.desc
      const checkedTopic = this.editRow.supportTopic.split(',').map(item => Number(item))
      const supportTopic = {}
      Object.keys(this.form.supportTopic).forEach(item => supportTopic[item] = checkedTopic)
      this.form.supportTopic = supportTopic
    }
  },
  methods: {
    async getAllVersion() {
      const { success, data } = await apis.mqttVersionList({ pageIndex: 1, pageSize: 10000 })
      if (!success) return false
      this.allVersionList = data.list
    },
    copyVersion() {
      if (!this.copyVersionId) {
        this.form.supportTopic = { STATUS: [], NETWORK: [], SECURITY: [], SYSTEM: [], MONITOR: [], TOOL: [] }
        return true
      }
      const currentVersionSupportTopic = this.allVersionList.find(item => item.id === this.copyVersionId)
      if (!currentVersionSupportTopic) {
        return this.$message({ type: 'error', message: '版本错误' })
      }
      const checkedTopic = currentVersionSupportTopic.supportTopic.split(',').map(item => Number(item))
      const supportTopic = {}
      Object.keys(this.form.supportTopic).forEach(item => supportTopic[item] = checkedTopic)
      this.form.supportTopic = supportTopic
    },
    submit() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return false
        const supportTopic = Object.keys(this.form.supportTopic).reduce((a, b) => [ ...a, ...this.form.supportTopic[b] ], [])
        if (!supportTopic.length) {
          return this.$message({ type: 'warning', message: '请选择Topic' })
        }
        const params = {
          version: this.form.version,
          desc: this.form.desc,
          supportTopic: supportTopic.join(',')
        }
        if (this.type === 'edit') params.id = this.editRow.id
        const { success } = await apis.mqttVersionSave(params)
        if (!success) return false
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('close')
      })
    }
  }
}
</script>

<template>
  <div class="publish-dialog">
    <div class="mb10" style="text-align: right">
      拷贝版本：
      <el-select v-model="copyVersionId" clearable :disabled="type === 'edit'">
        <el-option v-for="item in allVersionList" :key="item.id" :value="item.id" :label="item.version">
          {{ item.version }}
        </el-option>
      </el-select>
      <el-button @click="copyVersion" :disabled="type === 'edit'">拷贝</el-button>
    </div>
    <el-form label-width="100px" ref="formRef" :model="form" :rules="formRules">
      <el-form-item label="版本号：" prop="version">
        <el-input
          :disabled="type === 'edit'"
          placeholder="请输入版本号"
          v-model="form.version"
          style="width: 300px;"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="Topic：">
        <div v-for="(item, key) in allTopics" :key="key">
          <p>{{ categoryMap[key] }}</p>
          <div class="topic-wrapper">
            <el-checkbox-group v-model="form.supportTopic[key]">
              <el-checkbox v-for="topic in item" :key="topic.id" :label="topic.id" :disabled="type === 'edit'">
                {{ topic.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="发布说明：" prop="desc">
        <el-input type="textarea" v-model="form.desc" placeholder="请输入发布说明"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss">
.publish-dialog {
  .topic-wrapper {
    .topic-item {
      display: inline-block;
      width: 200px;
    }
  }
}
</style>
