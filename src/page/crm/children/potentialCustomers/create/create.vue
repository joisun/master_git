<script>
  /* eslint-disable no-return-assign */

  import { mapState } from 'vuex'
  import * as appTypes from '@/store/types'
  import regexp from '@/constant/regexps'
  import usageScenario from '../mixins/usage-scenario'
  const Concat = {
    name: '',
    mobile: '',
    email: '',
    title: '',
    description: ''
  }
  export default {
    mixins: [usageScenario],
    data () {
      return {
        form: {
          sourceId: '',
          areaId: '',
          industryId: [],
          usageScenario: [],
          company: '',
          address: '',
          registerAccount: '',
          contact: [{ ...Concat }]
        },
        rules: {
          sourceId: [{required: true, message: '请选择来源'}],
          areaId: [{required: true, message: '请选择地区'}],
          company: [{required: true, message: '请填写客户名'}],
          'contact.mobile': [{pattern: regexp.mobile, message: '请输入正确的手机号'}],
          'contact.email': [{pattern: regexp.email, message: '请输入正确的邮箱'}]
        },
        loading: false,
        cascaderProps: {
          label: 'name',
          value: 'id'
        }
      }
    },
    computed: {
      ...mapState({
        user: state => state.overall.user,
        sources: state => state.overall.crmEnum.source,
        industries: state => state.industry.list,
        areaGroups: state => state.overall.crmEnum.smallRegion
      })
    },
    methods: {
      cancel () {
        this.$router.back(-1)
      },
      confirm () {
        let contact = this.form.contact
        if (contact.find(item => !item.email && !item.mobile)) {
          // 存在联系人 有三个字段没填完的
          this.$message.warning('联系人中【邮箱】【手机号】至少填一个')
          return
        }
        this.$refs.form.validate(async valid => {
          if (!valid) return
          let {user, form} = this
          form = { ...form }
          form.industryId = form.industryId.toString()
          form.usageScenario = form.usageScenario.toString()
          let hash = {
            userId: user.id,
            category: user.category,
            baseInfo: JSON.stringify(form),
            contact: JSON.stringify(form.contact)
          }
          this.loading = true

          const ret = await this.$store.dispatch(appTypes.CUSTOMER_POST, hash).finally(() => this.loading = false)
          this.$message.success('创建客户成功')
          if (ret.data.customerId) {
            let customerId = ret.data.customerId
            this.$nextTick(() => this.$router.push(`/crm/potential-customers/${customerId}/detail`))
          }
        })
      },
      addContact () {
        this.form.contact.push({ ...Concat })
      },
      deleteContact (index) {
        this.form.contact.splice(index, 1)
      }
    }
  }
</script>
<template>
  <div class="wh__warp">
    <div class="wh__header">
      <h2 class="wh__header--title">创建新客户</h2>
      <span class="wh__header--close">
          <wh-std-icon sign="xe6aa" @click="cancel">
          </wh-std-icon>
        </span>
    </div>
    <div class="wh__body">
      <div class="customer-create">
        <el-form
          class="base-form"
          :inline="true"
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px">
          <div class="base-info">
            <el-form-item label="公司名" prop="company">
              <el-input v-model="form.company" placeholder="请输入公司名"></el-input>
            </el-form-item>
            <el-form-item label="来源" prop="sourceId">
              <el-select
                v-model="form.sourceId"
                placeholder="请选择来源">
                <el-option
                  v-for="item in sources"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区" prop="areaId">
              <el-select
                placeholder="请选择地区"
                v-model="form.areaId">
                <el-option
                  v-for="item in areaGroups"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行业" class="is-spec" prop="industryId">
              <el-cascader
                class=""
                clearable
                :props="cascaderProps"
                :options="industries"
                v-model="form.industryId">
              </el-cascader>
            </el-form-item>
            <el-form-item label="场景" class="is-spec" prop="usageScenario">
              <el-cascader
                clearable
                :options="usageScenarioList"
                v-model="form.usageScenario">
              </el-cascader>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" class="align-middle" type="textarea" placeholder="请输入客户地址"></el-input>
            </el-form-item>
          </div>


          <div class="contact-body">
            <div class="contact-line"
                 v-for="(item, index) in form.contact" :key="index">
              <div class="contact-line__tool"><span>联系人{{index + 1}}</span>
                <el-button v-if="index >=1" circle @click="deleteContact(index)" icon="el-icon-delete
"></el-button>
              </div>
              <el-form-item label="姓名"
                            class="is-spec"
                            :prop="'contact.' + index + '.name'">
                <el-input placeholder="联系人姓名" v-model="form.contact[index]['name']"></el-input>
              </el-form-item>
              <el-form-item label="手机号"
                            class="is-spec"
                            :prop="'contact.' + index + '.mobile'"
                            :rules="rules['contact.mobile']">
                <el-input placeholder="联系人手机号" v-model="form.contact[index]['mobile']"></el-input>
              </el-form-item>
              <el-form-item class="is-spec" label="邮箱" :rules="rules['contact.email']">
                <el-input placeholder="联系人邮箱" v-model="form.contact[index]['email']"></el-input>
              </el-form-item>
              <el-form-item label="职务">
                <el-input placeholder="联系人职务" v-model="form.contact[index]['title']"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="description">
                <el-input type="textarea" v-model="form.contact[index]['description']"></el-input>
              </el-form-item>
            </div>
            <el-button icon="el-icon-plus" size="small" @click="addContact">增加新联系人</el-button>
          </div>
          <div class="sure">
            <el-form-item label="">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="confirm" :loading="loading">确定</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .customer-create{
    padding: 20px;
    margin-top: 20px;
    background: #fff;
    form.base-form{
      display: flex;
      flex-wrap: wrap;
      .el-form-item{
        flex: 0 0 50%;
        margin-right: 0;
      }
      .el-form-item__content{
        width: 75%;
        .el-select, .el-cascader{
          width: 100%;
        }
      }
      .split-line {
        margin-left: 40px;
        margin-top: 20px;
        margin-right: 100px;
        border-top: 1px dashed #d8dce5;
      }
      .contact-body{
        margin-top: 20px;
        border: 1px #969696 solid;
        margin-left: 40px;
        padding: 10px;
      }
      .contact-line{
        position: relative;
        padding-top: 10px;
        border-top: 1px #969696 solid;
        &:first-child{
          border-top: none;
        }
        &:hover{
          .contact-line__tool .icon {
            visibility: visible;
          }
        }
        .contact-line__tool{
          .icon{
            transition: visibility .3s ease-out;
            visibility: hidden;
          }
          & > span:first-child{
            display: inline-block;
            margin-left: 40px;
            margin-bottom: 10px;
          }
        }
      }
    }
    .sure{
      margin: 20px auto;
    }
  }
</style>
