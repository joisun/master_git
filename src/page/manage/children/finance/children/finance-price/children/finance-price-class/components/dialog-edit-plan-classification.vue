<script>
/**
   * Create by zeter on 2018/8/10
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import { cloneDeep } from 'lodash'

  const formBase = {
    displayName: '',
    check: [false, false],
    flag: ['', ''],
    disabled: true
  }
  export default {
    name: 'dialog-edit-plan-classification',
    mixins: [DialogMixin],
    props: {
      item: Object,
      dialogName: String
    },
    data() {
      return {
        form: cloneDeep(formBase),
        rules: {
          displayName: [
            { required: true, message: '套餐分类昵称不能为空', trigger: 'blur' },
            { max: 20, message: '套餐分类昵称不能超不20个字符', trigger: 'blur' }
          ],
          flag: {
            validator: (rule, value, callback) => {
              let empty = false
              let error = false
              for (let i = 0; i <= 1; i++) {
                if (this.form.check[i] && !this.form.flag[i].trim()) empty = true
                else if (this.form.flag[i] && this.form.flag[i].indexOf(',') >= 0) error = true
              }
              if (empty) callback(new Error('勾选的标记不能为空'))
              else if (error) callback(new Error('标记有误，请不要随意输入符号'))
              else callback()
            },
            trigger: 'blur'
          }
        }
      }
    },
    methods: {
      open() {
        this.form.displayName = this.item.displayName
        this.form.flag = this.item.identification ? this.item.identification.split(',') : ['', '']
        if (this.form.flag.length === 1) {
          this.form.flag.push('')
        }
        this.form.disabled = !this.item.disabled
        this.form.check = [this.item.displayIdentificationA, this.item.displayIdentificationB]
      },
      confirm() {
        this.$refs.form.validate(async valid => {
          if (valid) {
            let hash = {
              id: this.item.id,
              displayName: this.form.displayName,
              identification: this.form.flag.map(e => e.trim()).join(','),
              identificationA: this.form.check[0],
              identificationB: this.form.check[1],
              disabled: !this.form.disabled
            }
            let rst = await this.jaxLib.financial.plan.updateClassificationDisplayName(hash)
            if (!rst.success) return false
            this.$message.success('分类编辑成功')
            this.$emit('closeDialog', this.dialogName, true)
          } else {
            return false
          }
        })
      },
      close() {
        this.form = cloneDeep(formBase)
        this.$refs.form.resetFields()
        this.$emit('closeDialog', this.dialogName, false)
      }
    }
  }
</script>

<template>
  <div class="dialog-edit-classification">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="昵称" prop="displayName">
        <el-input type="text" v-model="form.displayName"></el-input>
      </el-form-item>
      <el-form-item label="购卡标识" prop="flag">
        <div>
          <el-checkbox v-model="form.check[0]">
          </el-checkbox>
          <el-input type="text" class="width50 mb5" :maxlength="6" v-model="form.flag[0]"
            placeholder="请输入购卡标识1">
          </el-input>
        </div>
        <div>
          <el-checkbox v-model="form.check[1]">
          </el-checkbox>
          <el-input type="text" class="width50" :maxlength="6" v-model="form.flag[1]" placeholder="请输入购卡标识2">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="分类状态">
        <el-switch
          v-model="form.disabled"
          active-text="可用"
          inactive-text="禁用">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirm">提交</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
