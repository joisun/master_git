<script>
import MqttTopic from './mqtt-topic'
import VersionPublish from './version-publish'
import TopicIssue from './topic-issue'

export const categoryMap = {
  STATUS: '状态',
  NETWORK: '网络',
  SECURITY: '安全',
  SYSTEM: '系统',
  MONITOR: '监控',
  TOOL: '工具'
}

export default {
  components: {
    MqttTopic,
    VersionPublish,
    TopicIssue
  },
  data() {
    return {
      versionId: 0,
      activeTab: this.$route.query.tab || 'first'
    }
  },
  watch: {
    activeTab(val) {
      if (val === 'second') {
        this.versionId = 0
      }
    }
  },
  methods: {
    showVersionTopic(versionId) {
      this.versionId = versionId
      this.activeTab = 'first'
    },
    backList() {
      window.history.go(-1)
    }
  }
}
</script>

<template>
  <div class="cpe-mqtt-topic">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">Mqtt Topic版本管理</h2>
        <span v-if="!$route.query.enter" class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__body">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="Topic管理" name="first">
            <mqtt-topic :version-id="versionId"></mqtt-topic>
          </el-tab-pane>
          <el-tab-pane label="版本管理" name="second">
            <version-publish
              v-if="activeTab === 'second'"
              @show-version-topic="showVersionTopic"
            ></version-publish>
          </el-tab-pane>
          <el-tab-pane label="Topic下发" name="third">
            <topic-issue v-if="activeTab === 'third'"></topic-issue>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
