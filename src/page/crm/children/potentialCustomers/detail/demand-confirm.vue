<script>
  import moment from 'moment'
  import checkResult from '../mixins/common-check-content.js'

  export default {
    inject: ['tuple'],
    props: ['content', 'stage', 'stageName'],
    mixins: [checkResult],
    data () {
      return {
        isEditing: false
      }
    },
    computed: {
      requireProducts () {
        let { tuple: {settledBusinessId} } = this
        if (!settledBusinessId) return
        let requireProducts = this.tuple.requireProducts || []
        return requireProducts.filter(item => item.businessId === settledBusinessId)
      },

      finished () {
        let temp = !!this.tuple.catalogs.find(item => item.id === this.stageName && item.finished)
        this.isEditing = !temp
        return temp
      }
    },

    // watch: {
    //   'content': function (val) {
    //     let finished = this.finished
    //     this.isEditing = !finished
    //   }
    // },

    methods: {
      checkResult () {
        let tempContent = {...this.content}
        if (!this.check(tempContent)) {
          return false
        } else if (tempContent.match === null || tempContent.match === '') {
          this.$message.error('企朋产品是否满足客户需求必选')
          return false
        } else if (!tempContent.match && (!tempContent.specialNeed || !tempContent.specialNeed.length)) {
          this.$message.error('客户特殊需求不能为空')
          return false
        }
        return true
      },

      editSection () {
        this.isEditing = true
      },

      saveSection () {
        if (this.checkResult()) {
          this.isEditing = false
          this.content.buyTime = moment(new Date(this.content.buyTime))
          this.$emit('onSave', {stage: this.stage})
        }
      },

      abandonSection () {
        this.$emit('onAbandon', {stage: this.stage})
      },

      failureSection () {
        this.$emit('onFailure', {stage: this.stage})
      }
    }
  }
</script>
<template>
  <div class="section" data-offset-id="demandConfirm">
    <div class="section__head">
      <span>需求确认</span>
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
        <el-button v-else type="primary" @click="saveSection" class="cursor-pointer" size="mini">保存</el-button>

        <el-button v-if="!finished" @click="failureSection" class="cursor-pointer" size="mini" type="danger">输单</el-button>
      </div>
    </div>
    <div class="section__body" v-if="isEditing">
      <div class="body__line">
        <div class="line-item is-required">
          <label>企朋产品是否满足客户需求：</label>
          <div class="inline">
            <el-radio v-model="content.match" :label="1">是</el-radio>
            <el-radio v-model="content.match" :label="0">否</el-radio>
          </div>
        </div>
      </div>
      <div class="body__line long-title" v-if="content.match === 0">
        <div class="is-required line-item width70">
          <label>客户特殊需求：</label>
          <el-input class="align-middle width65" type="textarea" v-model="content.specialNeed"></el-input>
        </div>
      </div>
      <div class="body__line long-title">
        <div class="is-required line-item width70">
          <label>意向套餐：</label>
          <el-cascader
            class="width65"
            clearable
            :props="tuple.cascaderProps"
            :options="tuple.useMeals"
            v-model="content.useMeal"
          ></el-cascader>
        </div>
      </div>
      <div class="body__line long-title">
        <div class="is-required line-item width70">
          <label>预计首单总收入：</label>
          <el-input v-model="content.firstIncome" class="width65">
            <template slot="append">元</template>
          </el-input>
        </div>
      </div>
      <div class="body__line long-title">
        <div class="is-required line-item width70">
          <label>预计年度总收入：</label>
          <el-input v-model="content.yearIncome" class="width65">
            <template slot="append">元</template>
          </el-input>
        </div>
      </div>
      <div class="body__line long-title">
        <div class="is-required line-item width70">
          <label>预计采购时间：</label>
          <el-date-picker
            class="width65"
            v-model="content.buyTime"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </div>
      </div>
      <div class="body__line long-title">
        <div class="is-required line-item width70">
          <label>有无竞品：</label>
          <div class="inline">
            <el-radio v-model="content.hasCompetitor" :label="1">有</el-radio>
            <el-radio v-model="content.hasCompetitor" :label="0">无</el-radio>
          </div>
        </div>
      </div>
      <div class="body__line" v-if="content.hasCompetitor === 1">
        <div class="line-box">
          <div class="line-box__title">
            竞品概况
          </div>
          <div class="line-box__body">
            <div class="body__line long-title">
              <div class="is-required line-item width70">
                <label>竞品名：</label>
                <el-select
                  class="width70"
                  clearable
                  multiple
                  v-model="content.competitor"
                  placeholder="请选择竞品">
                  <el-option
                    v-for="item in tuple.competitors"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="body__line long-title" v-if="content.competitor && content.competitor.some(item => item==='1')">
              <div class="is-required line-item width70">
                <label>其他竞品：</label>
                <el-input class="width70" maxlength="30" v-model="content.otherCompetitor" placeholder="请输入其他竞品名"></el-input>
              </div>
            </div>
            <div class="body__line long-title">
              <div class="is-required line-item width70">
                <label>竞品存在的问题：</label>
                <el-input class="align-middle width70" type="textarea" v-model="content.notice"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section__body" v-else>
      <div class="body__line long-title">
        <div class="line-item is-required">
          <label>企朋产品是否满足客户需求：</label>
          <span>{{content.match === 1 ? '是' : '否'}}</span>
        </div>
      </div>
      <div class="body__line" v-if="content.match === 0">
        <div class="line-item is-required width70 demand-confirm">
          <label>客户特殊需求：</label>
          <div class="inline width65">{{content.notice}}</div>
        </div>
      </div>
      <div class="body__line long-title">
        <div class="line-item is-required width70">
          <label>预计首单总收入：</label>
          <span>{{content.firstIncome}}元</span>
        </div>
      </div>
      <div class="body__line long-title">
        <div class="line-item is-required width70">
          <label>预计年度总收入：</label>
          <span>{{content.yearIncome}}元</span>
        </div>
      </div>
      <div class="body__line">
        <div class="line-item is-required flex5 align-left">
          <label>意向套餐：</label>
          <span v-crm-enum-extract="{original: content.useMeal[0], category: 'useMeal'}"></span>
          <span v-if="!!content.useMeal[1]">/<span v-crm-enum-extract="{original: content.useMeal[1], category: 'useMeal'}"></span></span>
        </div>
      </div>
      <div class="body__line">
        <div class="line-item is-required">
          <label>有无竞品：</label>
          <span>{{content.hasCompetitor === 1 ? '有' : '无'}}</span>
        </div>
      </div>
      <div class="body__line" v-if="content.hasCompetitor === 1">
        <div class="line-box">
          <div class="line-box__title">
            竞品概况
          </div>
          <div class="line-box__body">
            <div class="body__line long-title">
              <div class="is-required line-item width70">
                <label>竞品名：</label>
                <span class="margin-right10" v-for="(item, index) in content.competitor" :key="index" v-if="item!=='1'" v-crm-enum-extract="{original: item, category: 'competitor'}"></span>
                <span class="margin-right10" v-else>{{content.otherCompetitor}}</span>
              </div>
            </div>
            <div class="body__line long-title">
              <div class="is-required line-item width70">
                <label>竞品存在的问题：</label>
                <div class="inline align-middle width70">{{content.notice}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
