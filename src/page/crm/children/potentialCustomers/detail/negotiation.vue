<script>
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
        } else if (!tempContent.settle || !tempContent.settle.length) {
          this.$message.error('结算方式不能为空')
          return false
        } else if (!tempContent.payMethod || !tempContent.payMethod.length) {
          this.$message.error('付费方式不能为空')
          return false
        } else if (!tempContent.customerStage || !tempContent.customerStage.length) {
          this.$message.error('客户商务流程不能为空')
          return false
        }
        return true
      },
      editSection () {
        this.isEditing = false
      },

      saveSection () {
        if (this.checkResult()) {
          this.isEditing = false
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
  <div class="section" data-offset-id="negotiation">
    <div class="section__head">
      <span>商务谈判</span>
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
          <label>报价首单总收入：</label>
          <el-input v-model="content.firstIncome" class="width65">
            <template slot="append">元</template>
          </el-input>
        </div>
      </div>
      <div class="body__line long-title">
        <div class="is-required line-item width70">
          <label>结算方式：</label>
          <el-select
            class="width65"
            v-model="content.settle"
            placeholder="请选择结算方式">
            <el-option
              v-for="item in tuple.settles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="body__line long-title">
        <div class="is-required line-item width70">
          <label>付费方式：</label>
          <el-select
            class="width65"
            v-model="content.payMethod"
            placeholder="请选择付费方式">
            <el-option
              v-for="item in tuple.payMethod"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="body__line long-title">
        <div class="is-required line-item width70">
          <label>客户商务流程：</label>
          <el-select
            class="width65"
            v-model="content.customerStage"
            placeholder="请选择客户内部商务流程">
            <el-option
              v-for="item in tuple.customerStages"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="section__body" v-else>
      <div class="body__line">
        <div class="line-item is-required width70">
          <label>报价首单总收入：</label>
          <span>{{content.firstIncome}}元</span>
        </div>
      </div>
      <div class="body__line">
        <div class="line-item is-required width70">
          <label>结算方式：</label>
          <span v-crm-enum-extract="{original: content.settle, category: 'settle'}"></span>
        </div>
      </div>
      <div class="body__line">
        <div class="line-item is-required width70">
          <label>付费方式：</label>
          <span v-crm-enum-extract="{original: content.payMethod, category: 'payMethod'}"></span>
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
        <div class="line-item is-required width70">
          <label>客户商务流程：</label>
          <span v-crm-enum-extract="{original: content.customerStage, category: 'customerStage'}"></span>
        </div>
      </div>
    </div>
  </div>
</template>
