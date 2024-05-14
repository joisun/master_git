<script>
  import { mapState } from 'vuex'
  import moment from 'moment'
  import apis from '@/api/ajax'

  export default {
    inject: ['tuple'],
    props: ['content', 'stage', 'stageName', 'baseInfo'],

    data() {
      return {
        isEditing: false,
        loadingRemote: false,
        remoteCustomerList: [],
        targetSaleId: null,
        similarCustomId: null
      }
    },
    computed: {
      ...mapState({
        user: state => state.overall.user
      }),

      finished() {
        let temp = !!this.tuple.catalogs.find(item => item.id === this.stageName && item.finished)
        this.isEditing = !temp
        return temp
      },

      canEdit() {
        return (this.user.category !== 'seller' && this.user.category !== 'leader')
      }
    },

    watch: {
      baseInfo() {
        this.fetchCustomer()
      }
    },

    methods: {
      editSection() {
        this.isEditing = true
      },

      abandonSection() {
        this.$emit('onAbandon', { stage: this.stage })
      },

      autoSend() {
        if (!this.checkResult()) {
          return
        }
        if (this.similarCustomId) {
          const target = this.remoteCustomerList.find(item => item.id === this.similarCustomId)
          this.$confirm(`当前已选择相似客户，此客户将自动分配给${target.saleName}销售, 请确认是否正确?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('onSaveAutoSend', {
              stage: this.stage,
              similarCustomId: this.similarCustomId,
              targetSaleId: target.saleId
            })
          })
        } else {
          this.$emit('onSaveAutoSend', { stage: this.stage, similarCustomId: null, targetSaleId: null })
        }
      },
      setSalesman() {
        if (!this.checkResult()) {
          return
        }
        this.$emit('onSaveSetSalesman', { stage: this.stage })
      },

      // 校验
      checkResult() {
        let tempContent = { ...this.content }
        if (!tempContent.useScenes || (/^[ ]*$/).test(tempContent.useScenes)) {
          this.$message.error('应用场景不能为空')
          return false
        } else if (!tempContent.prePurchaseTime) {
          this.$message.error('预计购卡时间不能为空')
          return false
        } else if (!tempContent.prePurchaseNum) {
          this.$message.error('预计购卡数需大于0')
          return false
        }
        return true
      },

      saveSection() {
        if (this.checkResult()) {
          this.isEditing = false
          this.content.prePurchaseTime = +moment(this.content.prePurchaseTime)
          this.$emit('onSave', { stage: this.stage })
        }
      },

      async fetchCustomer() {
        if (this.baseInfo && this.baseInfo.company && !this.finished) {
          this.loadingRemote = true
          const ret = await apis.crm.customerAutoMatch({ orgName: this.baseInfo.company })
          this.remoteCustomerList = ret.data
          this.loadingRemote = false
        }
      }
    }
  }
</script>
<template>
  <div class="section clues" data-offset-id="clues">
    <div class="section__head">
      <span>线索审查</span>

      <div class="section__head--desc">
        <div class="desc__item">
          <label>进入时间：</label>
          <span>{{content.entryTime | dateFilter}}</span>
        </div>

        <div class="desc__item">
          <label>停留时间：</label>
          <template v-if="content.stayDays">
            <span>
              <i v-if="Math.floor(content.stayDays/24)>0">{{Math.floor(content.stayDays/24)}}天</i><i>{{content.stayDays%24}}小时</i>
            </span>
          </template>
        </div>
      </div>

      <div class="section__head--tool">
        <el-button v-if="finished && !isEditing" @click="editSection" class="cursor-pointer" size="mini">编辑</el-button>

        <template v-else-if="tuple.processedStage !== '3'">
          <el-button v-if="finished" @click="saveSection" type="primary" class="cursor-pointer" size="mini">保存
          </el-button>

          <template v-else>
            <el-button type="primary" @click="autoSend" class="cursor-pointer" size="mini">自动分配</el-button>

            <el-button type="primary" @click="setSalesman" :disabled="!!similarCustomId" class="cursor-pointer"
                       size="mini">指定分配
            </el-button>

            <el-button type="danger" @click="abandonSection" class="cursor-pointer" size="mini">丢弃</el-button>
          </template>
        </template>
      </div>
    </div>

    <!-- 内容编辑区域 -->
    <div class="section__body" v-if="isEditing">
      <div class="body__line">
        <div class="line-item is-required width70">
          <label>应用场景：</label>
          <el-input
            v-model="content.useScenes"
            placeholder="请输入内容"
            class="width70"
          ></el-input>
        </div>
      </div>

      <div class="body__line">
        <div class="line-item is-required width70">
          <label>预计购卡时间：</label>
          <el-date-picker
            v-model="content.prePurchaseTime"
            class="width65"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>

      <div class="body__line">
        <div class="line-item is-required width70">
          <label>预计购卡数：</label>
          <el-input-number
            v-model="content.prePurchaseNum"
            class="width70"
            :controls="false"
          ></el-input-number>
        </div>
      </div>

      <div class="body__line">
        <div class="line-item width70">
          <label>选择相似客户：</label>
          <el-select
            class="width70"
            v-model="similarCustomId"
            placeholder="选择相似客户"
          >
            <el-option
              v-for="item in remoteCustomerList"
              :key="item.id"
              :label="item.company + (item.orgId ? '(orgId:' + item.orgId + ')' : '(未注册)')"
              :disabled="!item.saleName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="body__line">
        <div class="line-item width70">
          <label>备注：</label>
          <el-input
            v-model="content.mark"
            placeholder="请输入内容"
            class="width70"
          ></el-input>
        </div>
      </div>
    </div>

    <!-- 内容展示区域 -->
    <div class="section__body" v-else>
      <div class="body__line">
        <div class="line-item is-required flex5 align-left">
          <label>应用场景：</label>
          <span>{{content.useScenes}}</span>
        </div>
      </div>

      <div class="body__line">
        <div class="line-item is-required flex5">
          <label>预计购卡时间：</label>
          <span>{{content.prePurchaseTime | dateFilter('YYYY-MM-DD')}}</span>
        </div>
      </div>

      <div class="body__line">
        <div class="line-item is-required flex5">
          <label>预计购卡数：</label>
          <span>{{content.prePurchaseNum}}</span>
        </div>
      </div>

      <div class="body__line">
        <div class="line-item flex5">
          <label>备注：</label>
          <span>{{content.mark}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
