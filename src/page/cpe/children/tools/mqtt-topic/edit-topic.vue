<script>
import ParamsEdit from './params-edit.vue'
import apis from '@/api/ironman-api'

export const typeDefaultValue = {
  string: '',
  int: 0,
  array: [],
  object: {},
  bool: true
}
export default {
  components: {
    ParamsEdit
  },
  props: {
    categoryMap: {
      type: Object,
      default: () => {}
    },
    editRowId: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      topicPrepend: '/sys/CPE_%s/',
      form: {
        available: true,
        requestType: 'object',
        responseType: 'object'
      },
      formRules: {
        category: { required: true, message: '请选择分类', trigger: 'change' },
        name: { required: true, message: '名称不能为空', trigger: 'blur' },
        requestTopic: { required: true, message: '请求topic不能为空', trigger: 'blur' },
        responseTopic: { required: true, message: '响应topic不能为空', trigger: 'blur' }
      }
    }
  },
  created() {
    if (this.type === 'edit') {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      const { success, data } = await apis.mqttTopicDetail({ id: this.editRowId })
      if (!success) return false
      const { name, category, requestTopic, responseTopic, requestParam, responseParam, desc, available } = data
      const request = JSON.parse(requestParam || '{}')
      const response = JSON.parse(responseParam || '{}')
      this.form = {
        name,
        category,
        requestTopic: requestTopic.replace(this.topicPrepend, ''),
        responseTopic: responseTopic.replace(this.topicPrepend, ''),
        requestType: request.type || 'object',
        responseType: response.type || 'object',
        requestParam: request.param || [],
        responseParam: response.param || [],
        desc,
        available
      }
    },
    getParams(type, params) {
      if (!params) return false
      const param = params.filter(item => !!item.name).map(item => {
        if (item.example === '') {
          item.example = typeDefaultValue[item.type]
        }
        if (['object', 'array'].indexOf(item.type) > -1) {
          try {
            JSON.parse(item.example) // 校验对象和数组的示例值是否合理
          } catch {
            this.$message({ type: 'warning', message: '类型为object或者array的参数示例值不合法' })
            throw new Error()
          }
        }
        return item.type === 'bool' ? { ...item, example: Boolean(item.example) } : item
      })
      return { type, param }
    },
    async submit() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return false
        const { category, name, requestTopic, responseTopic, requestType, responseType, requestParam, responseParam, desc, available } = this.form
        const request = this.getParams(requestType, requestParam)
        const response = this.getParams(responseType, responseParam)
        const params = {
          category,
          name,
          requestTopic: this.topicPrepend + requestTopic,
          responseTopic: this.topicPrepend + responseTopic,
          desc,
          available
        }
        if (request) params.requestParam = JSON.stringify(request)
        if (response) params.responseParam = JSON.stringify(response)
        if (this.type === 'edit') params.id = this.editRowId
        const { success } = await apis.mqttTopicSave(params)
        if (!success) return false
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('close')
      })
    }
  }
}
</script>

<template>
  <div class="cpe-mqtt-topic">
    <el-form label-width="100px" :model="form" :rules="formRules" ref="formRef">
      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" style="width: 350px">
          <el-option v-for="(item, key) in categoryMap" :key="key" :label="item" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名称" v-model="form.name" style="width: 350px">
        </el-input>
      </el-form-item>
      <el-form-item label="请求topic" prop="requestTopic">
        <el-input placeholder="请求topic" style="width: 350px" v-model="form.requestTopic" :disabled="type === 'edit'">
          <template slot="prepend">{{ topicPrepend }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="响应topic" prop="responseTopic">
        <el-input placeholder="响应topic" style="width: 350px" v-model="form.responseTopic" :disabled="type === 'edit'">
          <template slot="prepend">{{ topicPrepend }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="请求类型">
        <el-radio v-model="form.requestType" label="object">对象</el-radio>
        <el-radio v-model="form.requestType" label="array">数组</el-radio>
      </el-form-item>
      <el-form-item label="请求参数">
        <params-edit v-model="form.requestParam" type="request"></params-edit>
      </el-form-item>
      <el-form-item label="响应类型">
        <el-radio v-model="form.responseType" label="object">对象</el-radio>
        <el-radio v-model="form.responseType" label="array">数组</el-radio>
      </el-form-item>
      <el-form-item label="响应参数">
        <params-edit v-model="form.responseParam"></params-edit>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.desc" type="textarea" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="是否可用" v-if="false">
        <el-switch
          v-model="form.available"
          active-color="#13ce66"
          inactive-color="#efefef">
        </el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>
