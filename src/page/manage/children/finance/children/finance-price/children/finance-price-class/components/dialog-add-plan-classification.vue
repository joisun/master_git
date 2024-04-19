<script>
  import Vue from 'vue'
  import { cloneDeep } from 'lodash'
  import moment from 'moment'
  import DialogMixin from '@/global/mixins/dialog-mixin'

  const validateTimeRange = function(rule, val, cb) {
    if (this.form.tags.RECHARGE_TIME_LIMIT) {
      let { preDate, backDate } = val
      if (!(preDate && backDate)) {
        return cb(new Error('开启续费时间限制后，时间区间不能为空！'))
      }
      cb()
    } else cb()
  }
  const dateRanges = Array(13).map((item, index) => ({
    label: index + 1,
    value: index + 1
  }))
  const timeRange = {
    preDate: '',
    preTime: new Date().setHours(0, 0, 0),
    backDate: '',
    backTime: new Date().setHours(0, 0, 0)
  }
  const backDateRanges = dateRanges.slice()
  backDateRanges.unshift({ label: '最后一天', value: '-1' })
  const form = {
    name: '',
    displayName: '',
    carrier: '',
    tags: {},
    rechargeTimeRange: {},
    type: '',
    flag: ['', ''],
    platform: ''
  }
  const getRules = function() {
    return {
      name: [
        { required: true, message: '套餐分类名称不能为空', trigger: 'blur' },
        { max: 20, message: '套餐分类名称不能超不20个字符', trigger: 'blur' }
      ],
      displayName: [
        { required: true, message: '套餐分类昵称不能为空', trigger: 'blur' },
        { max: 20, message: '套餐分类昵称不能超不20个字符', trigger: 'blur' }
      ],
      carrier: [{ required: true, message: '运营商不能为空', trigger: 'blur change' }],
      type: [{ required: true, message: '类型不能为空', trigger: 'blur change' }],
      platform: [{ required: true, message: '平台不能为空', trigger: 'blur change' }],
      rechargeTimeRange: [{ validator: validateTimeRange.bind(this), trigger: 'blur' }],
      flag: {
        validator: (rule, value, callback) => {
          let errorKey = false
          let air = false
          for (let i = 0; i <= 1; i++) {
            if (this.form.flag[i].indexOf(',') >= 0) errorKey = true
            if (!this.form.flag[i].trim() && this.form.flag[i].length) air = true
          }
          if (air) callback(new Error('标记有误，不能写入空格'))
          if (errorKey) callback(new Error('标记有误，请不要随意输入符号'))
          else callback()
        },
        trigger: 'blur'
      }
    }
  }

  export default {
    mixins: [DialogMixin],
    props: {
      dialogName: String
    },
    data() {
      return {
        loading: false,
        form: cloneDeep(form),
        platforms: [],
        rules: { ...getRules.call(this) },
        tags: [],
        dateRanges,
        backDateRanges
      }
    },
    methods: {
      async fetchTags() {
        let _rearrange = (tags) => {
          let filtered = tags.filter(tag => tag.name === 'RECHARGE_TIME_LIMIT')
          let index,
              target
          if (filtered.length > 0) {
            target = filtered[0]
            index = tags.indexOf(target)
            tags.splice(index, 1)
            tags.push(target)
          }
          return tags
        }
        let _normalizeForm = (hash, tags) => {
          tags.forEach(tag => (hash.tags[tag.name] = false))
          return hash
        }
        let rst = await this.jaxLib.financial.plan.getClassificationTags()
        if (!rst.success) return false
        let hash = cloneDeep(this.form)
        let tags = this.tags = _rearrange(rst.data)
        hash = _normalizeForm(hash, tags)
        hash.rechargeTimeRange = { ...timeRange }
        Vue.set(this, 'form', hash)
      },
      open() {
        this.fetchTags()
      },
      close() {
        this.$refs.ruleForm.resetFields()
        this.$nextTick(() => (this.form = cloneDeep(form)))
      },
      cancel(formName) {
        this.$refs[formName].resetFields()
        this.$emit('closeDialog', this.dialogName, false)
      },
      confirm(formName) {
        let _normalizeRange = ({ preDate, preTime, backDate, backTime }) => {
          //        let rangBuffer = `01/00:00:00~24/23:59:59`
          if (preDate < 10) preDate = `0${preDate}`
          if (typeof backDate === 'number' && backDate < 10) backDate = `0${backDate}`
          preTime = moment(preTime).format('YYYY-MM-DD HH:mm:ss').split(/\s+/)[1]
          backTime = moment(backTime).format('YYYY-MM-DD HH:mm:ss').split(/\s+/)[1]
          return `${preDate}/${preTime}~${backDate}/${backTime}`
        }
        this.$refs[formName].validate(async valid => {
          if (!valid) return
          let { form: { rechargeTimeRange } } = this
          let hash = cloneDeep(this.form)
          hash.identification = hash.flag.map(e => e.trim()).join(',')
          delete hash.flag
          hash.rechargeTimeRange = hash.tags.RECHARGE_TIME_LIMIT ? _normalizeRange(rechargeTimeRange) : ''
          hash.tags = Object.keys(hash.tags).filter(key => hash.tags[key]).join(',')
          let rst = await this.jaxLib.financial.plan.createPlanClassification(hash)
          if (!rst.success) return false
          this.$message.success('创建套餐分类成功')
          this.$emit('closeDialog', this.dialogName, true)
        })
      },
      // 获取最后一项
      handleChange(value) {
        this.form.platform = value[value.length - 1]
      },

      // 选择运营商
      carrierOnChange(value) {
        const platformTypes = this.enums.platformTypes.maps()
        this.platforms = platformTypes[value].platforms
        this.form.platform = ''
      }
    }
  }
</script>
<template>
  <div class="dialog-add-classification">
    <el-form :model="form"
      :rules="rules"
      ref="ruleForm"
      label-position="left"
      label-width="110px">
      <el-form-item label="分类名称" prop="name">
        <el-input class="width60" v-model="form.name" placeholder="分类名称（对内）">
        </el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="displayName">
        <el-input class="width60" v-model="form.displayName" placeholder="分类昵称（对外）">
        </el-input>
      </el-form-item>
      <el-form-item label="运营商" prop="carrier">
        <el-select v-model="form.carrier" placeholder="选择运营商" @change="carrierOnChange">
          <el-option v-for="(val, key) in enums.carrier.maps()" :key="key" :label="val" :value="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="选择类型">
          <el-option v-for="(val, key) in enums.planClassType.maps()" :label="val" :value="key" :key="key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属平台" prop="platform">
        <el-select v-model="form.platform" placeholder="选择所属平台" :disabled="form.carrier ? false : true">
          <el-option v-for="(item, key) in platforms" :key="key" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="特性">
        <div class="classification__features">
          <div class="classification__features--item" :key="index" v-for="(item, index) in tags">
            <span class="feature__item--label">{{item.desc}}</span>
            <el-switch v-model="form.tags[item.name]" active-text="开启"
                       inactive-text="关闭">
            </el-switch>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="form.tags.RECHARGE_TIME_LIMIT" prop="rechargeTimeRange" label="续费区间">
        <el-select class="width20" v-model="form.rechargeTimeRange.preDate" clearable>
          <el-option
            v-for="item in dateRanges"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-time-picker
          class="width25"
          v-model="form.rechargeTimeRange.preTime">
        </el-time-picker>
        &nbsp;
        -
        &nbsp;
        <el-select class="width20" v-model="form.rechargeTimeRange.backDate" clearable>
          <el-option
            v-for="item in backDateRanges"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-time-picker
          class="width25"
          v-model="form.rechargeTimeRange.backTime">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="标记" prop="flag">
        <el-input class="width30" v-model="form.flag[0]" placeholder="标记1" :maxlength="6">
        </el-input>
        <el-input class="width30" v-model="form.flag[1]" placeholder="标记2" :maxlength="6">
        </el-input>
      </el-form-item>
      <div class="classification__footer">
        <el-button @click="cancel('ruleForm')">取消</el-button>
        <el-button type="primary" @click="confirm('ruleForm')" :loading="loading">确认</el-button>
      </div>
    </el-form>
  </div>
</template>
