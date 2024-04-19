<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    notice: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleDownload(url) {
      url = url.replace('http://', 'https://')
      window.open(url)
    }
  }
}
</script>

<template>
  <div class="notice-detail">
    <el-dialog
      title="公告详情"
      :visible.sync="visible"
      :before-close="close"
      :close-on-click-modal="false"
      width="80%"
    >
      <h2>{{ notice.title }}</h2>
      <p class="time">{{ notice.gmt_created | dateFilter }}</p>
      <div class="content" v-html="notice.content"></div>
      <div v-if="notice.attachment" class="attachment">
        <i class="el-icon-paperclip"></i>附件：
        <a href="javascript:" @click="handleDownload(notice.attachment)">{{
          notice.attachment.split('/').pop()
        }}</a>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.notice-detail {
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  .time {
    text-align: center;
    margin-bottom: 15px;
  }
  .content {
    padding: 0 10px;
  }
  .attachment {
    margin-top: 30px;
    a {
      color: #1c8de0;
      text-decoration: underline;
    }
  }
}
</style>
