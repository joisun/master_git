<script>
  import DetailStageFlow from './../components/detail-stage-flow'

  export default {
    inject: ['tuple'],
    props: ['content'],

    components: { DetailStageFlow },

    data() {
      return {
        isSpecialFocus: '',
        isRegister: false,
        orgId: '',
        createTime: 0,
        customer: {
          id: null
        },
        stage: '',
        beforeFailStage: '',
        dialogStatus: {
          isSetSalesmanShow: false
        },
        canMerge: true,
        canDelete: true
      }
    },

    watch: {
      'content': function (val) {
        this.customer = val
        this.stage = val.stage
        this.beforeFailStage = val.beforeFailStage || ''
        this.isRegister = !!val.baseInfo.orgId && !!val.baseInfo.orgId.length
        this.isSpecialFocus = val.isSpecialFocus
        this.orgId = val.baseInfo.orgId
        this.createTime = val.baseInfo.createTime
      }
    },

    methods: {
      // 输单重新启动
      failureReset() {
        this.$emit('onReset')
      },

      handleCommand(command) {
        switch (command) {
          case 'transfer':
            this.$emit('onSetSalesman')
            break
          case 'delete':
            this.$emit('onDelete')
            break
          case 'merge':
            this.$emit('onMergeCustomer')
        }
      },

      focus() {
        this.$emit('onFocus', this.isSpecialFocus)
      },
      async enterCustomer(id) {
        this.$router.push({ name: 'client-list', query: { id: id } })
      },
    }
  }
</script>
<template>
  <div class="customers-header">
    <div class="customers-header-top">
      <wh-std-icon sign="&#xe64c;" class="icon-company color-primary"></wh-std-icon>
      <span class="company-name">{{content.baseInfo.company}}</span>

      <el-button
        type="function"
        size="small"
        @click="focus"
        :class="['special-focus-button', isSpecialFocus === '1' ? 'is-special-focus' : '']"
      >
        <template v-if="isSpecialFocus === '1'">
          <wh-std-icon sign="&#xe68b;" class="special-focus-icon color-warning"></wh-std-icon>
          <span>已关注</span>
        </template>

        <template v-else>
          <wh-std-icon class="special-focus-icon" sign="&#xe66b;"></wh-std-icon>
          <span>加关注</span>
        </template>
      </el-button>

      <el-dropdown class="float-right" @command="handleCommand">
        <el-button type="primary" size="small">
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="transfer">变更负责人</el-dropdown-item>

          <el-dropdown-item
            v-if="canMerge"
            command="merge"
          >
            合并
          </el-dropdown-item>

          <el-dropdown-item
            v-if="canDelete"
            command="delete"
            :disabled="isRegister"
          >
            删除
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!--输单状态重新启动-->
      <el-button
        v-if="this.stage==='11'"
        class="float-right margin-right10"
        type="function"
        size="small"
        @click="failureReset"
      >
        重新启动
      </el-button>
    </div>

    <div class="customers-header-content">
      <el-row class="content-info">
        <el-col :span="4">
          <span>ID: {{customer.id}}</span>
        </el-col>

        <el-col :span="5">
          <span>orgId: </span>
          <a
            class="link"
            target="_blank"
            @click="enterCustomer(orgId)"
          >
            {{orgId}}
          </a>
        </el-col>

        <el-col :span="5">
          <span>负责人: {{customer.manager}}</span>
        </el-col>

        <el-col :span="5">
          <span>邀请人: {{customer.baseInfo ? customer.baseInfo.invitationCode : ''}}</span>
        </el-col>

        <el-col :span="5">
          <span>创建时间: {{createTime | dateFilter}}</span>
        </el-col>
      </el-row>

      <detail-stage-flow :stage="stage" :beforeFailStage="beforeFailStage"></detail-stage-flow>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .customers-header {
    border: 0.5px solid #BFBFBF;
    padding: 20px 39px 20px 60px;
    position: relative;
    background-color: #fff;

    .customers-header-top {
      .icon-company {
        position: absolute;
        left: 16px;
        top: 28px;
        font-size: 30px;
        color: #ec407a;

        .iconfont {
          font-size: 32px;
        }
      }

      .company-name {
        font-size: 24px;
        line-height: 32px;
        color: rgba(0, 0, 0, .85);
        vertical-align: bottom;
      }

      .special-focus-button {
        margin-left: 7px;
        padding: 5px 15px 10px 10px;

        &:hover, &:active, &:focus {
          color: #555;
          background: #fff;
          border-color: #d8dce5;
        }

        .special-focus-icon {
          margin-right: 2px;
          vertical-align: bottom;
        }
      }
    }

    .customers-header-content {
      .content-info {
        padding: 20px 0;
      }
    }
  }

</style>
