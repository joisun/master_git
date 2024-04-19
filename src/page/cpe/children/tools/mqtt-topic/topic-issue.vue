<script>
import apis from '@/api/ironman-api'
import { categoryMap } from './index'
import { paramsConvert } from './topic-detail'
import { toolsMixin } from '@/global/mixins/table-selection'

const SELECTION_STORAGE_KEY = 'whitehouse_cpe_device_list'
const TOPIC_ISSUE_LIST_KEY = 'whitehouse_cpe_topic_issue_list'

export default {
  mixins: [toolsMixin],
  data() {
    return {
      topic: '',
      macAddr: '',
      topicList: [],
      request: '',
      response: '',
      categoryMap,
      storageKey: SELECTION_STORAGE_KEY,
      isLoading: false,
      topicIssueList: [] // 下发记录列表，存在localStorage里面
    }
  },
  computed: {
    selectedTopic() {
      if (!this.topic) return {}
      const topic = this.topicList.find((item) => item.id === this.topic)
      return topic || null
    }
  },
  watch: {
    topic() {
      if (!this.selectedTopic || !this.selectedTopic.requestParam) {
        return (this.request = JSON.stringify({}, null, 2))
      }
      const { type, param } = JSON.parse(this.selectedTopic.requestParam)
      const params = paramsConvert(param)
      delete params.id
      this.request = JSON.stringify(type === 'object' ? params : [params], null, 2)
    }
  },
  created() {
    this.getAllTopics()
    this.init()
    this.getLocalTopicIssueList()
  },

  methods: {
    init() {
      const { from, macAddr } = this.$route.query
      if (macAddr) {
        this.macAddr = macAddr
        return
      }
      if (from === 'device-list') {
        const selected = this.getSelected('macAddr')
        if (selected.length) {
          this.macAddr = selected[0]
        }
      }
    },
    getLocalTopicIssueList() {
      const topicIssueList = localStorage.getItem(TOPIC_ISSUE_LIST_KEY)
      if (topicIssueList) {
        try {
          this.topicIssueList = JSON.parse(topicIssueList)
        } catch {}
      }
    },
    async getAllTopics() {
      const { success, data } = await apis.mqttTopicList({ pageIndex: 1, pageSize: 10000 })
      if (!success) return false
      this.topicList = data.list
    },
    showIssueLogDetail(row) {
      this.macAddr = row.macAddr
      this.topic = row.topicId
      this.request = row.request
      this.response = row.response
    },
    removeIssueLogItem(removeIndex) {
      const list = this.topicIssueList.filter((item, index) => index !== removeIndex)
      localStorage.setItem(TOPIC_ISSUE_LIST_KEY, JSON.stringify(list))
      this.getLocalTopicIssueList()
    },
    async submit() {
      const { selectedTopic, macAddr } = this
      if (!selectedTopic || !selectedTopic.requestTopic) {
        return this.$message({ type: 'warning', message: '请选择Topic' })
      }
      if (!macAddr) {
        return this.$message({ type: 'warning', message: '请输入Mac地址' })
      }
      const request = this.request.trim()
      let param = {}
      if (request) {
        try {
          param = JSON.parse(request)
        } catch (e) {
          return this.$message({ type: 'warning', message: '参数不是正确的json格式' })
        }
      }
      this.isLoading = true
      this.response = ''
      const { success, data } = await apis.topicIssue({
        topic: selectedTopic.requestTopic,
        macAddr,
        param: JSON.stringify(param)
      })
      this.isLoading = false
      if (!success) return false
      const response = data.response
      try {
        // 判断响应是不是json, 是json的话要格式化显示
        const params = JSON.parse(response)
        this.response = JSON.stringify(params, null, 2)
      } catch (e) {
        this.response = response
      }
      const storageData = [
        {
          topic: '【' + categoryMap[this.selectedTopic.category] + '】' + this.selectedTopic.name,
          topicId: selectedTopic.id,
          macAddr,
          request: this.request,
          response: this.response
        },
        ...this.topicIssueList
      ]
      if (storageData.length > 10) storageData.pop()
      localStorage.setItem(TOPIC_ISSUE_LIST_KEY, JSON.stringify(storageData))
      this.getLocalTopicIssueList()
    }
  }
}
</script>

<template>
  <div class="cpe-mqtt-topic-issue">
    <div class="flex">
      <div class="flex1">
        <el-form label-width="100px">
          <el-form-item label="Topic">
            <el-select v-model="topic" placeholder="请选择Topic" filterable>
              <el-option
                v-for="item in topicList"
                :key="item.id"
                :value="item.id"
                :label="'【' + categoryMap[item.category] + '】' + item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Mac地址">
            <el-input v-model="macAddr" placeholder="请输入Mac地址"></el-input>
          </el-form-item>
          <el-form-item label="参数">
            <el-input
              v-model="request"
              type="textarea"
              placeholder="请输入请求参数"
              :rows="6"
            ></el-input>
          </el-form-item>
          <el-form-item label="响应">
            <el-input v-model="response" type="textarea" :rows="8" readonly></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="isLoading" @click="submit">下发</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="flex1 topic-issue-log">
        <div class="title">最近下发记录</div>
        <div class="list">
          <template v-if="topicIssueList.length > 0">
            <div v-for="(item, index) in topicIssueList" :key="index" class="list-item">
              <div class="label" @click="showIssueLogDetail(item)">
                {{ index + 1 }}、{{ item.topic }}
              </div>
              <div class="close" @click="removeIssueLogItem(index)">
                <span class="el-icon-close"></span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="empty">暂无记录</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cpe-mqtt-topic-issue {
  .el-input,
  .el-select,
  .el-textarea {
    width: 80%;
  }

  .topic-issue-log {
    .title {
      color: #444;
      font-size: 16px;
      font-weight: bold;
    }

    .list {
      padding-top: 15px;
      width: 80%;

      .empty {
        color: #999;
      }

      &-item {
        display: flex;
        color: #555555;
        cursor: pointer;
        line-height: 26px;
        font-size: 14px;

        .label {
          flex: 1;
        }

        .close {
          width: 20px;
        }
      }
    }
  }
}
</style>
