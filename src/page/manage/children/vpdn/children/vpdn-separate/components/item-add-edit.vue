<script>
/**
   * Create by zeter on 2018/2/27
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    data() {
      let orgIdValid = (rule, value, callback) => {
        if (!this.form.orgId) {
          return callback(new Error('用户ID不能为空'))
        } else if (this.orgName === '') {
          return callback(new Error('请选择合适的客户'))
        }
        callback()
      }
      let planValid = async(rule, value, callback) => {
        if (!this.form.priceOfferId) {
          return callback(new Error('套餐id不能为空'))
        }
        if (await this.changePlan()) {
          callback()
        } else {
          return callback(new Error('请填写合适的套餐ID'))
        }
      }
      let subPlanValid = async(rule, value, callback) => {
        this.form.subPlan.map(e => {
          if (!e.policyName) {
            return callback(new Error('子套餐名称不能为空'))
          } else if (!e.volumeThreshold) {
            return callback(new Error('子套餐流量不能为空'))
          } else if (!e.vmip) {
            return callback(new Error('子套餐vmip不能为空'))
          }
        })
        if (this.form.subPlan.filter(e => e.type === 'public').length > 1) {
          return callback(new Error('仅有一个套餐允许为公网套餐'))
        }
        let tagsAttach = this.form.subPlan.filter(e => {
          // eslint-disable-next-line no-unused-vars
          for (let i in e.tags) {
            if (e.tags[i] === 'ATTACH_MONTHLY_PACKAGE') return true
          }
        })
        if (tagsAttach.length > 1) {
          return callback(new Error('仅有一个套餐允许标记附属月套餐'))
        }
        if (tagsAttach.length && tagsAttach[0].type !== 'private') {
          return callback(new Error('标记附属月套餐的套餐必须是专网套餐'))
        }
        callback()
      }
      return {
        rules: {
          orgId: [{
            validator: orgIdValid.bind(this),
            trigger: 'blur'
          }],
          plan: [{
            validator: planValid.bind(this),
            trigger: 'blur'
          }],
          subPlan: [{
            validator: subPlanValid.bind(this),
            trigger: 'blur'
          }]
        },
        form: {
          orgId: '',
          priceOfferId: '',
          subPlan: [{
            policyName: '',
            volumeThreshold: '',
            destIp: '',
            vmip: '218.205.65.108',
            type: 'public',
            tags: [],
            extendMonthCount: 0
          }, {
            policyName: '',
            volumeThreshold: '',
            destIp: '',
            vmip: '218.205.65.108',
            type: 'private',
            tags: [],
            extendMonthCount: 0
          }]
        },
        orgName: '',
        orgEnterSure: false,
        planAllVolume: '',
        planEnterSure: false,
        allTags: [],
        oldUser: false
      }
    },
    props: {
      dialogName: {
        default: String
      },
      plan: {
        default: null
      }
    },
    async mounted() {
      let rst = await this.jaxLib.vpdn.acl.tags()
      if (rst.success) this.allTags = rst.data
    },
    methods: {
      // 取消
      cancel() {
        this.$emit('closeDialog', this.dialogName, 0)
      },
      // 执行校验
      sureClick() {
        // 校验
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.postData()
          }
        })
      },
      // 提交
      async postData() {
        const postDataConstructor = (e) => {
          let postConstructor = {
            orgId: this.form.orgId,
            priceOfferId: this.form.priceOfferId,
            policyName: e.policyName,
            type: e.type,
            volumeThreshold: e.volumeThreshold,
            destIp: e.type === 'public' ? '' : e.destIp,
            vmip: e.vmip,
            tags: e.tags.join(','),
            extendMonthCount: e.tags.indexOf('ATTACH_MONTHLY_PACKAGE') < 0 ? 0 : e.extendMonthCount
          }
          if (e.id) {
            postConstructor.id = e.id
          }
          return postConstructor
        }
        let rst = await this.jaxLib.vpdn.acl.save({
          aclPolicy: JSON.stringify([
            postDataConstructor(this.form.subPlan[0]), postDataConstructor(this.form.subPlan[1])
          ])
        })
        if (!rst.success) return false
        this.$emit('closeDialog', this.dialogName, 1)
        this.$message.success('策略提交成功')
      },
      // 打开后
      open() {
        if (this.plan) {
          // 编辑 -赋值 - 重置校验
          let planMiddle = this.plan.aclSwitcherList.slice()
          if (planMiddle.length !== 2) {
            planMiddle.push({
              policyName: '',
              volumeThreshold: '',
              destIp: '',
              vmip: '218.205.65.108',
              netName: '',
              id: '',
              type: 'public',
              tags: [],
              extendMonthCount: 0
            })
          }
          this.form = {
            orgId: this.plan.orgId + '',
            priceOfferId: this.plan.priceOfferId + '',
            subPlan: planMiddle
          }
          this.orgName = this.plan.orgName
          this.changePlan()
        } else {
        // 新增

        }
      },
      // 关闭
      close() {
        this.form = {
          orgId: '',
          priceOfferId: '',
          subPlan: [{
            policyName: '',
            volumeThreshold: '',
            destIp: '',
            vmip: '218.205.65.108',
            netName: '',
            id: '',
            type: 'public',
            tags: [],
            extendMonthCount: 0
          }, {
            policyName: '',
            volumeThreshold: '',
            destIp: '',
            vmip: '218.205.65.108',
            netName: '',
            id: '',
            type: 'private',
            tags: [],
            extendMonthCount: 0
          }]
        }
        this.oldUser = false
        this.$refs.form.resetFields()
      },
      // 查询用户并筛选
      async querySearchAsync(queryString, callback) {
        this.orgName = ''
        let rst = await this.jaxLib.customer.list.get({
          pageIndex: 1,
          pageSize: 100,
          orgName: queryString,
          saler: ''
        }, false)
        if (!rst.success) return false
        const findVpdnUser = i => i.name === 'ACL_POLICY_USER'
        let orgNameList = rst.data.list.filter(e => (e.tagList ? e.tagList.findIndex(findVpdnUser) >= 0 : false))
          .map(e => ({
            value: e.id + '',
            name: e.orgName
          }))
        callback(orgNameList)
      },
      // 勾选客户后
      handleSelect(item) {
        this.orgName = item.name
        this.$refs.form.validateField('orgId', (valid) => {})
        this.getUserBase()
      },
      // 获取用户基础
      async getUserBase() {
        let rst = await this.jaxLib.vpdn.acl.template({
          orgId: this.form.orgId
        })
        if (!rst.success) return false
        if (rst.data.length) {
          // eslint-disable-next-line no-unused-vars
          for (let i in rst.data) {
            let copied = rst.data[i]
            let copy = this.form.subPlan[i];
            ['destIp', 'netName', 'type', 'vmip', 'volumeThreshold', 'extendMonthCount'].forEach(e => {
              copy[e] = copied[e] || ''
            })
            copy.tags = []
            if (copied.attachMonthlyPackage) copy.tags.push('ATTACH_MONTHLY_PACKAGE')
            if (copied.exceedCut) copy.tags.push('EXCEED_CUT')
          }
          this.oldUser = true
        } else {
          this.oldUser = false
        }
      },
      // 套餐查询
      async changePlan() {
        // 失焦时去查询套餐，没有查到置为空，查到了给它值
        this.planAllVolume = ''
        let rst = await this.jaxLib.financial.plan.getById({
          id: this.form.priceOfferId
        })
        if (!rst.success) return false
        if (rst.data && typeof rst.data.volume === 'number') {
          this.planAllVolume = rst.data.volume
          return true
        }
        this.planAllVolume = ''
        return false
      }
    }
  }
</script>

<template>
  <div class="item-add-edit">
    <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="80px">
      <div class="wh__dialog--body">
        <el-form-item label="客户ID" prop="orgId">
          <el-autocomplete
            v-model="form.orgId"
            placeholder="请输入客户名称或ID"
            :disabled="!!plan"
            class="item-add-edit__search"
            custom-item="tem-select-item"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect">
          </el-autocomplete>
          <span v-if="orgName">用户名称: {{orgName}}</span>
        </el-form-item>
        <el-form-item label="套餐ID" prop="plan">
          <el-input v-model="form.priceOfferId" class="item-add-edit__search" :disabled="!!plan" @blur="changePlan">
          </el-input>
          <span v-if="planAllVolume !== ''">套餐流量: {{planAllVolume}}M</span>
        </el-form-item>
        <el-form-item label="子套餐" prop="subPlan">
          <div>
            <el-form label-width="100px" v-model="left" class="item-add-edit__plan flex">
              <div class="flex1" v-for="i in form.subPlan" :key="i.id">
                <el-form-item label="套餐名称">
                  <el-input v-model="i.policyName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="网络类型">
                  <div class="flex item-add-edit__plan--line">
                    <el-select v-model="i.type" placeholder="请选择" size="small" :disabled="oldUser">
                      <el-option
                        v-for="(label, value) in enums.networkType.maps()"
                        :label="label" :value="value" :key="value">
                      </el-option>
                    </el-select>
                    <el-input
                      v-model="i.netName"
                      size="small"
                      :disabled="true"
                      placeholder="网络名称"
                      class="item-add-edit__plan--small">
                    </el-input>
                    <el-input
                      v-model="i.id"
                      size="small"
                      class="item-add-edit__plan--small" :disabled="true" placeholder="策略ID">
                    </el-input>
                  </div>
                </el-form-item>
                <el-form-item label="流量规格">
                  <el-input
                    v-model="i.volumeThreshold"
                    size="small"
                    :disabled="!!plan ||
                      (oldUser && i.type==='private' &&
                      i.tags.indexOf('ATTACH_MONTHLY_PACKAGE') >= 0)">
                    <template slot="append">M</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="VMIP">
                  <el-input v-model="i.vmip" size="small" :disabled="oldUser"></el-input>
                </el-form-item>
                <el-form-item label="IP地址" v-if="i.type !== 'public'">
                  <el-input
                    type="textarea"
                    :disabled="oldUser"
                    :rows="1"
                    v-model="i.destIp"
                    size="small"
                    class="item-add-edit__plan--text">
                  </el-input>
                </el-form-item>
                <el-form-item label="套餐标记">
                  <el-checkbox-group v-model="i.tags">
                    <el-checkbox
                      v-for="item in allTags"
                      :key="item.desc"
                      :label="item.name"
                      class="bride__content--checkbox"
                      :disabled="(oldUser && i.type==='private') ||
                        (item.name === 'ATTACH_MONTHLY_PACKAGE' && i.type==='public')">
                      {{item.desc}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="延期月份">
                  <el-input-number
                    v-model="i.extendMonthCount"
                    size="small"
                    :controls="false"
                    class="item-add-edit__plan--small" :disabled="oldUser && i.type==='private'">
                  </el-input-number>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-form-item>
        <!--<el-form-item label="分离策略">-->
        <!--<el-checkbox-group v-model="form.type">-->
        <!--<el-checkbox label="A">子套餐分离机费，分离控制达量停用子套餐</el-checkbox>-->
        <!--<br>-->
        <!--<el-checkbox label="B">先使用套餐A，用完之后再使用套餐B</el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</el-form-item>-->
        <el-form-item label=" ">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="sureClick" :disabled="orgEnterSure && planEnterSure">确认</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
