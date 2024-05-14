<script>
import apis from '@/api/ironman-api'
import ParamTable from './param-table'

export const paramsConvert = paramsList => {
  if (!paramsList || !paramsList.length) return {}
  const params = {}
  paramsList.forEach(item => {
    switch (item.type) {
      case 'int':
        params[item.name] = parseInt(item.example)
        break
      case 'bool':
        params[item.name] = Boolean(item.example)
        break
      case 'object':
      case 'array':
        try {
          params[item.name] = JSON.parse(item.example)
        } catch {
          params[item.name] = item.type === 'object' ? {} : []
        }
        break
      default:
        params[item.name] = item.example
    }
  })
  return params
}

export default {
  components: {
    ParamTable
  },
  props: {
    rowId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      topicPrepend: '/sys/CPE_%s/',
      form: {
        available: true,
        requestType: 'object',
        responseType: 'object'
      }
    }
  },
  created() {
    this.getDetail()
  },
  computed: {
    formatRequestParams() {
      const request = {
        'id': 'EB0FF258-935C-C87C-91F4-C5D9B549DE7A'
      }
      const { requestType, requestParam } = this.form
      const params = paramsConvert(requestParam)
      if (params.id) request.id = params.id
      delete params.id
      request.data = requestType === 'object' ? params : [ params ]
      return request
    },
    formatResponseParams() {
      const response = {
        'id': 'EB0FF258-935C-C87C-91F4-C5D9B549DE7A',
        'code': '200'
      }
      const { responseType, responseParam } = this.form
      const params = paramsConvert(responseParam)
      response.data = responseType === 'object' ? params : [ params ]
      return response
    }
  },
  methods: {
    async getDetail() {
      const { success, data } = await apis.mqttTopicDetail({ id: this.rowId })
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
    }
  }
}
</script>

<template>
  <div class="topic-detail">
    <div class="detail-row">
      <div class="label">名称：</div>
      <div class="value">{{ form.name }}</div>
    </div>
    <div class="detail-row">
      <div class="label">请求topic：</div>
      <div class="value">/sys/CPE_%s/{{ form.requestTopic }}</div>
    </div>
    <div class="detail-row">
      <div class="label">响应topic：</div>
      <div class="value">/sys/CPE_%s/{{ form.responseTopic }}</div>
    </div>
    <div class="detail-row">
      <div class="label">请求参数：</div>
      <div class="value">
        <param-table :data="form.requestParam"></param-table>
      </div>
    </div>
    <div class="detail-row">
      <div class="label">请求示例：</div>
      <div class="value">
        <pre v-if="form.requestParam && form.requestParam.length > 0"
             style="user-select: all;">{{ JSON.stringify(formatRequestParams, null, 2) }}</pre>
        <span v-else>无</span>
      </div>
    </div>
    <div class="detail-row">
      <div class="label">响应参数：</div>
      <div class="value">
        <param-table :data="form.responseParam"></param-table>
      </div>
    </div>
    <div class="detail-row">
      <div class="label">响应示例：</div>
      <div class="value">
        <pre v-if="form.responseParam && form.responseParam.length > 0"
             style="user-select: all;">{{ JSON.stringify(formatResponseParams, null, 2) }}</pre>
        <pre v-else style="user-select: all;">{{
            JSON.stringify({ id: 'EB0FF258-935C-C87C-91F4-C5D9B549DE7A', code: 200, msg: '' }, null, 2) }}</pre>
      </div>
    </div>
    <div class="detail-row">
      <div class="label">描述：</div>
      <div class="value">{{ form.desc }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.topic-detail {
  .detail-row {
    display: flex;
    margin-bottom: 15px;

    & .label {
      width: 100px;
      color: #999;
      text-align: right;
      padding-right: 20px;
    }

    & .value {
      flex: 1;
    }
  }
}
</style>
