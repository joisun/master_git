<script>
  export default {
    inject: ['tuple'],
    props: ['content'],

    data () {
      return {
      }
    },

    methods: {
      // 审核通过
      audit () {
        this.$emit('onAudit', {stage: this.tuple.processedStage, command: 0})
      },

      deleteCustomer () {
        this.$emit('onDelete')
      }
    }
  }
</script>
<template>
  <div class="conflict-container">
    <div class="conflict-content">
      <div class="conflict-info">
        <p>报备冲突：</p>
        <div>
          <span>冲突客户ID: {{content.conflictId}}</span>
          <span class="conflict-reason">冲突原因: {{content.reason}}</span>
        </div>
      </div>

      <div class="button-group">
        <el-button type="primary" size="small" @click="audit">通过</el-button>
        <el-button type="danger" size="small" @click="deleteCustomer">删除客户</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .conflict-container {
    margin: -24px -24px 22px;
    position: relative;
    background: #F8F8F8;
    padding-bottom: 16px;

    .conflict-content {
      width: 100%;
      background: #FFEFD4;
      padding: 17px 27px 14px;
      display: flex;

      .conflict-info {
        flex: 1;

        p, span {
          line-height: 22px;
        }

        .conflict-reason {
          margin-left: 30px;
        }
      }

      .button-group {
        margin: 6px 0;
      }
    }
  }

</style>
