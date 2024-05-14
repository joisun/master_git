<script>
  import checkResult from '../mixins/common-check-content.js'
  import moment from 'moment'

  export default {
    inject: ['tuple'],
    props: ['content', 'stage', 'stageName', 'relativeCustomer'],
    mixins: [checkResult],
    data() {
      return {
        isEditing: false,
        relative: {
          targetId: '',
          similarCustomer: false
        }
      }
    },
    computed: {
      // competitors () {
      //   let { tuple: {settledBusinessId} } = this
      //   if (!settledBusinessId) return
      //   return this.tuple.competitors.filter(item => item.businessId === settledBusinessId)
      // },
      finished() {
        let temp = !!this.tuple.catalogs.find(item => item.id === this.stageName && item.finished)
        this.isEditing = !temp
        return temp
      }

    },
    watch: {
      'relativeCustomer': function() {
        if (this.relativeCustomer) {
          this.relative.similarCustomer = !!this.relativeCustomer.similarCustomer // 可能是undefined, 转为boolean
          this.relative.targetId = this.relativeCustomer.id
        }
      }
    },
    methods: {
      editSection() {
        this.isEditing = true
      },
      // 检查是否为空,没有用自带的验证规则，一是提示方式限定 二是有些是在选择某项的基础上验证的
      checkResult() {
        let tempContent = { ...this.content }
        if (!this.check(tempContent)) {
          return false
        } else if (!tempContent.useFor || !tempContent.useFor.length) {
          this.$message.error('应用场景不能为空')
          return false
        } else if (tempContent.customerType === null || tempContent.customerType === '') {
          this.$message.error('客户类型必选')
          return false
        } else if (tempContent.customerType && (!tempContent.currentSuppliers || !tempContent.currentSuppliers.length)) {
          this.$message.error('供应商必填')
          return false
        } else if (tempContent.customerType && tempContent.currentSuppliers && tempContent.currentSuppliers.some(item => item === '1') && (!tempContent.otherSuppliers || !tempContent.otherSuppliers.length)) {
          this.$message.error('其他供应商不能为空')
          return false
        } else if (tempContent.customerType && (!tempContent.currentProblem || !tempContent.currentProblem.length)) {
          this.$message.error('目前产品问题不能为空')
          return false
        } else if (!tempContent.yearMoney) {
          this.$message.error('目前/预计年金额不能为空')
          return false
        } else if (!/^\d+(\.)*(\d)*$/.test(tempContent.yearMoney)) {
          this.$message.error('目前/预计年金额只能是数据')
          return false
        } else if (tempContent.buyTime === null || tempContent.buyTime === '') {
          this.$message.error('预计采购时间不能为空')
          return false
        }
        return true
      },
      saveSection() {
        if (this.relative.similarCustomer || this.checkResult()) {
          this.isEditing = false
          this.content.buyTime = +moment(new Date(this.content.buyTime))
          this.$emit('onSave', { stage: this.stage, ...this.relative })
        }
      },

      failureSection() {
        this.$emit('onFailure', { stage: this.stage })
      }
    },
    created() {
      if (this.relativeCustomer) {
        this.relative.similarCustomer = !!this.relativeCustomer.similarCustomer // 可能是undefined, 转为boolean
        this.relative.targetId = this.relativeCustomer.id
      }
    }
  }
</script>
<template>
  <div class="section" data-offset-id="preliminary">
    <div class="section__head">
      <span>初步接洽</span>
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
        <el-button v-if="!finished" @click="failureSection" class="cursor-pointer" size="mini" type="danger">输单
        </el-button>
      </div>
    </div>

    <div class="section__body" v-if="isEditing">
      <template v-if="relativeCustomer && relativeCustomer.company">
        <div class="body__line">
          <div class="is-required line-item width70">
            <label>相似客户：</label>
            <el-input v-model="relativeCustomer.company" class="width70" :disabled="true"></el-input>
          </div>
        </div>
        <div class="body__line">
          <div class="is-required line-item">
            <label>是否为相似客户：</label>
            <div class="inline">
              <el-radio v-model="relative.similarCustomer" :label="true">是</el-radio>
              <el-radio v-model="relative.similarCustomer" :label="false">否</el-radio>
            </div>
          </div>
        </div>
      </template>
      <template v-if="!relative.similarCustomer">
        <div class="body__line">
          <div class="is-required line-item width70">
            <label>应用场景：</label>
            <el-input v-model="content.useFor" class="width70" placeholder="请填入应用场景"></el-input>
          </div>
        </div>
        <div class="body__line">
          <div class="is-required line-item">
            <label>客户类型：</label>
            <div class="inline">
              <el-radio v-model="content.customerType" :label="0">纯新采购</el-radio>
              <el-radio v-model="content.customerType" :label="1">更换（替换）供应商</el-radio>
            </div>
          </div>
        </div>
        <div class="body__line" v-if="content.customerType">
          <div class="line-box">
            <div class="line-box__title">
              供应商情况
            </div>
            <div class="line-box__body">
              <div class="body__line long-title">
                <div class="is-required line-item width70">
                  <label>目前供应商：</label>
                  <el-select
                    class="width65"
                    clearable
                    multiple
                    v-model="content.currentSuppliers"
                    placeholder="请选择供应商"
                  >
                    <el-option
                      v-for="item in tuple.currentSupplierLists"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="body__line long-title"
                   v-if="content.currentSuppliers && content.currentSuppliers.some(item => item==='1')">
                <div class="is-required line-item width70">
                  <label>其他供应商：</label>
                  <el-input class="width70" maxlength="30" v-model="content.otherSuppliers"
                            placeholder="请输入其他供应商"></el-input>
                </div>
              </div>
              <div class="body__line long-title">
                <div class="is-required line-item width70">
                  <label>目前产品问题：</label>
                  <el-input v-model="content.currentProblem" class="width65" placeholder="请输入目前产品问题"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="body__line">
          <div class="is-required line-item width70">
            <label>目前/预计年金额：</label>
            <el-input v-model="content.yearMoney" class="width65">
              <template slot="append">元</template>
            </el-input>
          </div>
        </div>

        <div class="body__line">
          <div class="is-required line-item">
            <label>有无竞品：</label>
            <div class="inline">
              <el-radio v-model="content.hasCompetitor" :label="1">有</el-radio>
              <el-radio v-model="content.hasCompetitor" :label="0">无</el-radio>
            </div>
          </div>
        </div>
        <!--有竞品 显示竞品情况-->
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
              <div class="body__line long-title"
                   v-if="content.competitor && content.competitor.some(item => item==='1')">
                <div class="is-required line-item width70">
                  <label>其他竞品：</label>
                  <el-input class="width70" maxlength="30" v-model="content.otherCompetitor"
                            placeholder="请输入其他竞品名"></el-input>
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
        <div class="body__line">
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
        <div class="body__line">
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
      </template>
    </div>

    <div class="section__body" v-else>
      <div class="body__line">
        <div class="line-item is-required flex5 align-left">
          <label>应用场景：</label>
          <span>{{content.useFor}}</span>
        </div>
      </div>
      <div class="body__line">
        <div class="line-item is-required flex5 align-left">
          <label>意向套餐：</label>
          <span v-crm-enum-extract="{original: content.useMeal[0], category: 'useMeal'}"></span>
          <span v-if="!!content.useMeal[1]">/<span
            v-crm-enum-extract="{original: content.useMeal[1], category: 'useMeal'}"></span></span>
        </div>
      </div>
      <div class="body__line">
        <div class="line-item is-required flex5">
          <label>预计采购时间：</label>
          <span>{{content.buyTime | dateFilter}}</span>
        </div>
      </div>
      <div class="body__line">
        <div class="line-item is-required flex5">
          <label>目前/预计年金额：</label>
          <span>{{content.yearMoney}}元</span>
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
                <span class="margin-right10" v-for="(item, index) in content.competitor" :key="index" v-if="item!=='1'"
                      v-crm-enum-extract="{original: item, category: 'competitor'}"></span>
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
      <div class="body__line">
        <div class="line-item is-required">
          <label>客户类型：</label>
          <span>{{ content.customerType === 1 ? '更换（替换）供应商' : '纯新采购'}}</span>
        </div>
      </div>
      <div class="body__line" v-if="content.customerType">
        <div class="line-box">
          <div class="line-box__title">
            供应商情况
          </div>
          <div class="line-box__body">
            <div class="body__line long-title">
              <div class="is-required line-item width70">
                <label>供应商名：</label>
                <span class="margin-right10" v-for="(item, index) in content.currentSuppliers" :key="index"
                      v-if="item!=='1'" v-crm-enum-extract="{original: item, category: 'currentSuppliers'}"></span>
                <span class="margin-right10" v-else>{{content.otherSuppliers}}</span>
              </div>
            </div>
            <div class="body__line long-title">
              <div class="is-required line-item width70">
                <label>目前供应商产品存在的问题：</label>
                <div class="inline align-middle width70">{{content.currentProblem}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>

</style>
