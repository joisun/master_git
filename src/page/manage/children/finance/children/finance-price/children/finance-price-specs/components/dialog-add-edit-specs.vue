<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="380px"
    :visible="visible"
    top="25vh"
    @close="closeDialog"
    :title="title"
  >
    <div v-loading="sureLoading">
      <div class="wh__dialog--body">
        <el-form label-width="100px" :model="form" :rules="rules" ref="form">
          <template>
            <el-form-item label="运营商类型" prop="carrier">
              <el-select
                v-model="form.carrier"
                placeholder="请选择运营商"
                style="width: 100%"
                :disabled="!isAdd"
              >
                <el-option
                  v-for="(key, val) in enums.carrier.maps()"
                  :key="val"
                  :label="key"
                  :value="val"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规格类型" prop="volumeType">
              <el-select
                v-model="form.volumeType"
                placeholder="请选择规格类型"
                style="width: 100%"
                @change="volumeChange"
                :disabled="!isAdd"
              >
                <el-option
                  v-for="item in options.volumeType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="套餐大小" prop="volume">
              <el-input
                v-model="form.volume"
                type="number"
                :disabled="!isAdd"
                :min="0"
              >
                <el-select
                  v-model="form.volumeUnit"
                  slot="append"
                  style="width: 70px"
                  :disabled="!isAdd"
                >
                  <el-option label="MB" value="MB" />
                  <el-option label="GB" value="GB" />
                  <el-option label="次" value="C" />
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="套餐周期" prop="validity">
              <wh-cycle-input
                v-model="form.validity"
                :isMonthly="form.volumeType === 'monthly'"
                :disabled="form.volumeType === 'monthly' || !isAdd"
                :min="1"
              />
            </el-form-item>
          </template>
          <el-form-item label="规格状态" prop="status">
            <el-switch
              v-model="form.status"
              active-text="可用"
              inactive-text="禁用"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="wh__dialog--footer">
        <el-button type="primary" @click="onSubmit" v-loading="sureLoading"
          >提交</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import whCycleInput from '@/page/components/wh-cycle-input.vue'

  export default {
    props: {
      dialogName: {
        default: ''
      },
      data: {
        type: Object,
        required: false
      },
      visible: {
        type: Boolean
      }
    },
    data() {
      return {
        sureLoading: false,
        rules: {
          carrier: [{ required: true, message: '运营商不能为空' }]
        },
        form: {
          volumeUnit: 'MB',
          volumeType: '',
          validity: 0,
          carrier: '',
          volume: 0,
          status: 0
        },
        options: {
          volumeType: [
            {
              value: 'monthly',
              label: '按月套餐'
            },
            {
              value: 'custom',
              label: '自定义套餐'
            }
          ]
        }
      }
    },
    methods: {
      volumeChange(v) {
        switch (v) {
          case 'monthly':
            this.form.validity = 1
            break
        }
      },
      resetFormData() {
        this.form = Object.assign({}, this.form, {
          volumeUnit: 'MB',
          volumeType: '',
          validity: 0,
          carrier: '',
          volume: 0,
          status: 0
        })
        this.$refs.form.resetFields()
      },
      onSubmit() {
        const form = this.$refs.form
        form.validate((valid) => {
          if (valid) {
            const params = {
              carrier: this.form.carrier,
              volume:
                this.form.volumeUnit === 'MB'
                  ? parseFloat(this.form.volume)
                  : parseInt(this.form.volume),
              volumeUnit: this.form.volumeUnit,
              validity:
                this.form.volumeType === 'monthly'
                  ? 0
                  : parseInt(this.form.validity),
              status: this.form.status
            }
            if (this.form.volumeUnit === 'GB') {
              params.volume = 1024 * parseInt(this.form.volume)
              params.volumeUnit = 'MB'
            }
            if (!this.isAdd) {
              params.id = this.data.id
            }
            if (params.volumeUnit === 'M') {
              params.volumeUnit = 'MB'
            }
            this.$confirm(`确定保存该套餐规格吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              let res = await this.jaxLib.financial.volume.save(params)
              if (!res.success) return false
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.$emit('refresh')
              this.closeDialog()
            })
          }
        })
      },
      generateFormData() {
        this.form = Object.assign({}, this.form, this.data)
        if (this.form.volume && this.form.volume % 1024 === 0 && this.form.volumeUnit !== 'C') {
          this.form.volume /= 1024
          this.form.volumeUnit = 'GB'
        }
        this.form.volumeType = this.form.validity === 0 ? 'monthly' : 'custom'
      },
      closeDialog() {
        this.$emit('update:visible', false)
      }
    },
    components: {
      whCycleInput
    },
    computed: {
      isAdd() {
        return !this.data.id
      },
      title() {
        return this.idEdit ? '编辑套餐规格' : '新增套餐规格'
      }
    },
    created() {
      if (this.data.id) {
        this.generateFormData()
      }
    },
    watch: {
      idEdit() {
        return this.data.id ? true : false
      },
      visible(v) {
        if (v) {
          if (this.data.id) {
            this.generateFormData()
          }
        } else {
          this.resetFormData()
        }
      }
    }
  }
</script>