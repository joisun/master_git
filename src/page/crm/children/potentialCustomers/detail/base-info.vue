<script>
import Contact from './contact.vue'
import usageScenario from '../mixins/usage-scenario'
export default {
  components: { Contact },
  mixins: [usageScenario],
  inject: ['tuple'],
  props: ['content', 'stage', 'stageName'],
  data() {
    return {
      isEditing: false,
      cascaderProps: {
        label: 'name',
        value: 'id'
      }
    }
  },
  computed: {
    finished() {
      let temp = !!this.tuple.catalogs.find((item) => item.id === this.stageName && item.finished)
      this.isEditing = !temp
      return temp
    },
    hasOrgId() {
      return true
    }
    // hasAuthEditAssociatied () {
    //   return Auth.hasAuth('/api/authority/register/id')
    // }
  },
  // watch: {
  //   'content': function (val) {
  //     let finished = this.finished
  //     this.isEditing = !finished
  //   }
  // },
  methods: {
    checkResult() {
      let tempContent = { ...this.content }
      if (!tempContent.company || !tempContent.company.length) {
        this.$message.error('客户名不能为空')
        return false
      } else if (!tempContent.sourceId || !tempContent.sourceId.length) {
        this.$message.error('来源不能为空')
        return false
      } else if (!tempContent.industryId || !tempContent.industryId.length) {
        this.$message.error('行业不能为空')
        return false
      } else if (!tempContent.areaId || !tempContent.areaId.length) {
        this.$message.error('地区不能为空')
        return false
      } else if (!tempContent.usageScenario || !tempContent.usageScenario.length) {
        this.$message.error('场景不能为空')
        return false
      } else if (tempContent.industryId.toString() === '100,110' && !tempContent.newIndustry) {
        this.$message.error('您选择了其他-其他行业，请为该客户补充行业')
        return false
      }
      return true
    },
    async editSection() {
      const { success, data } = await this.jaxLib.common.desensitizationShow(
        {
          id: this.content.orgId,
          showField: ['userAccount'],
          idType: 'orgId'
        },
        'crm'
      )
      if (success) {
        this.$emit('change', {
          ...this.content,
          registerAccount: data.userAccount || this.content.registerAccount
        })
      }
      this.isEditing = true
    },
    saveSection() {
      if (this.checkResult()) {
        this.$emit('onSave', { stage: this.stage })
      }
    },

    abandonSection() {
      this.$emit('onAbandon', { stage: this.stage })
    },

    receiveSection() {
      this.$emit('onReceive', { stage: this.stage })
    },

    auditSection(command) {
      this.$emit('onAudit', { stage: this.stage, command })
    },

    // handleSelectChange (val) {
    //   let selected = this.remoteRegisters.find(item => item.userId === val)
    //   this.content.registerName = selected && selected.company
    // },

    autoSend() {
      this.$emit('onAutoSend')
    },

    setSalesman() {
      this.$emit('onSetSalesman')
    }
  }
}
</script>
<template>
  <div class="section" data-offset-id="baseInfo">
    <div class="section__head">
      <span>用户基础信息</span>
      <div class="section__head--desc">
        <div class="desc__item">
          <label>创建时间：</label>
          <span>{{ content.createTime | dateFilter }}</span>
        </div>
      </div>
      <div class="section__head--tool">
        <el-button
          v-if="finished && !isEditing"
          class="cursor-pointer"
          size="mini"
          @click="editSection"
          >编辑</el-button
        >
        <el-button v-else type="primary" class="cursor-pointer" size="mini" @click="saveSection"
          >保存</el-button
        >
      </div>
    </div>
    <div v-if="isEditing" class="section__body">
      <div class="body__line">
        <div :class="['is-required', 'line-item', 'flex3', content.company ? '' : 'is-error']">
          <label>客户名：</label>
          <el-input v-model="content.company" placeholder="请输入客户名" class="width60"></el-input>
          <div v-if="content.incompleteLinkId" class="form-item-company-incomplete width60">
            <span>半匹配：</span>
            <span>{{ content.incompleteLinkId }}</span>
          </div>
        </div>
        <div class="line-item flex3">
          <label>注册账号：</label>
          <el-input
            :disabled="true"
            :placeholder="content.registerAccount"
            class="width60"
          ></el-input>
        </div>
        <div class="is-required line-item flex3">
          <label>来源：</label>
          <el-select
            v-model="content.sourceId"
            :disabled="tuple.user.category === 'seller'"
            placeholder="请选择业务类型"
          >
            <el-option
              v-for="item in tuple.sources"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="body__line">
        <div class="is-required line-item flex3">
          <label>行业：</label>
          <el-cascader
            v-model="content.industryId"
            clearable
            :props="cascaderProps"
            :options="tuple.industries"
          >
          </el-cascader>
        </div>
        <div class="is-required line-item flex3">
          <label>场景：</label>
          <el-cascader v-model="content.usageScenario" clearable :options="usageScenarioList">
          </el-cascader>
        </div>
        <div class="line-item flex3">
          <label>orgId：</label>
          <el-input :disabled="true" class="width65" :placeholder="content.orgId"></el-input>
        </div>
      </div>
      <div v-if="content.industryId.toString() === '100,110'" class="body__line">
        <div class="is-required line-item flex3">
          <label>补充行业：</label>
          <el-input
            v-model="content.newIndustry"
            placeholder="请输入行业"
            class="width20"
          ></el-input>
        </div>
      </div>
      <div class="body__line">
        <div class="is-required line-item flex3">
          <label>地区：</label>
          <el-select v-model="content.areaId" placeholder="请选择地区">
            <el-option
              v-for="item in tuple.areaGroups"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="line-item flex3">
          <label>地址：</label>
          <el-input
            v-model="content.address"
            class="width65 align-middle"
            type="textarea"
            placeholder="请输入客户地址"
          ></el-input>
        </div>
        <div class="line-item flex3"></div>
      </div>
      <div class="body__line">
        <Contact :customer-id="tuple.customerId"></Contact>
      </div>
    </div>
    <div v-else class="section__body">
      <div class="body__line">
        <div :class="['is-required', 'line-item', 'flex3', content.company ? '' : 'is-error']">
          <label>客户名：</label>
          <span>{{ content.company }}</span>
        </div>
        <div class="line-item flex3">
          <label>注册账号：</label>
          <wh-desensitization
            :id="content.orgId"
            show-field="userAccount"
            system="crm"
            id-type="orgId"
          >
            {{ content.registerAccount }}
          </wh-desensitization>
        </div>
        <div class="is-required line-item flex3">
          <label>来源：</label>
          <span v-crm-enum-extract="{ original: content.sourceId, category: 'source' }"></span>
        </div>
      </div>
      <div class="body__line">
        <div class="line-item is-required flex3">
          <label>行业：</label>
          <span>
            <span v-industry-extract="content.industryId[0]"></span>
            <span v-if="!!content.industryId[1]"
              >/<span v-industry-extract="content.industryId[1]"></span
            ></span>
          </span>
        </div>
        <div class="line-item is-required flex3">
          <label>场景：</label>
          <span v-if="usageScenarioList.length">
            <span v-if="!!content.usageScenario[0]">{{
              flatUsageScenarioList[content.usageScenario[0]]
            }}</span>
            <span v-if="!!content.usageScenario[1]"
              >/{{ flatUsageScenarioList[content.usageScenario[1]] }}</span
            >
          </span>
        </div>
        <div class="line-item flex3">
          <label>orgId：</label>
          <span>{{ content.orgId }}</span>
        </div>
      </div>
      <div class="body__line">
        <div class="line-item flex3">
          <label>标记：</label>
          <span v-if="content.remarks">{{ content.remarks.join(',') }}</span>
        </div>
        <div class="is-required line-item flex3">
          <label>地区：</label>
          <span v-crm-enum-extract="{ original: content.areaId, category: 'smallRegion' }"></span>
        </div>
        <div class="line-item flex3">
          <label>地址：</label>
          <div class="inline align-middle">{{ content.address }}</div>
        </div>
      </div>
      <div class="body__line">
        <Contact :customer-id="tuple.customerId" :read-only="true"></Contact>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.article .section .section__body {
  .contacts .contact-body {
    ul li {
      margin-bottom: 10px;
      border: 1px solid #ebebeb;
      border-radius: 4px;

      &:hover {
        border-color: #b3e5fc;
      }

      a {
        display: block;
        padding: 10px;
        cursor: pointer;

        & > span.item {
          display: inline-block;
          min-width: 100px;
        }

        & > span.item.phone,
        span.item.title {
          min-width: 160px;
        }

        & > span.item.email {
          min-width: 200px;
        }

        & > span.item.description {
          max-width: 250px;
          vertical-align: middle;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        &:hover > span.operate {
          display: inline-block;
        }

        & > span.operate {
          float: right;
          display: none;

          .iconfont {
            opacity: 0.8;
            cursor: pointer;
          }
        }
      }
    }
  }

  .form-item-company-incomplete {
    margin: 5px 10px 0px 85px;
    line-height: 25px;
    padding-left: 10px;
    background: #ffe8c2;
    color: #ff554e;
    border-radius: 3px;
  }
}
</style>
