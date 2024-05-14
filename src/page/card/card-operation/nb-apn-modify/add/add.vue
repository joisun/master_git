<template>
  <div class="nb-apn-add-edit modify-package-detail">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">NB卡APN修改</h2>
        <span class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="goBack"> </wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div>
        <p>目前仅可对果壳移动NB卡。</p>
        <p>每次最多可提交{{ maxIccidLength }}张。</p>
      </div>
      <div class="wh__body" v-loading="isLoading">
        <el-form
          label-position="top"
          label-width="80px"
          :model="form"
          style="width: 450px"
          :rules="rules"
          ref="form"
          :inline="true"
          :validate-on-rule-change="false"
          :disabled="data ? true : false"
        >
          <el-form-item label="ICCID" prop="iccids">
            <el-input
              rows="6"
              v-model="form.iccids"
              type="textarea"
              :disabled="mode"
              style="width: 300px"
            >
            </el-input>
          </el-form-item>
          <template v-if="!!mode">
            <div>
              <el-form-item label="当前APN名称" prop="oldApnName">
                <el-select v-model="form.oldApnName">
                  <el-option
                    v-for="item in options.apnOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="选择变更后的APN" prop="newApnName">
                <el-select
                  v-model="form.newApnName"
                  @change="onNewApnNameChanged"
                >
                  <el-option
                    v-for="item in options.apnOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="低功耗模式" prop="lowPowerMode">
                <el-select v-model="form.lowPowerMode" disabled>
                  <el-option
                    v-for="item in options.lowPowerModeOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div>
              <p>TAU参数</p>
              <el-form-item label="精度" prop="tauPrecisionType">
                <el-select
                  v-model="form.tauPrecisionType"
                  @change="form.tauPrecisionVal = undefined"
                >
                  <el-option
                    v-for="item in options.tauPrecisionTypeOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="数值" prop="tauPrecisionVal">
                <el-select
                  v-model="form.tauPrecisionVal"
                  :disabled="!form.tauPrecisionType"
                >
                  <el-option
                    v-for="item in options.tauPrecisionValueOptions[
                      form.tauPrecisionType
                    ]"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div>
              <p>PSM参数</p>
              <el-form-item label="精度" prop="psmPrecisionType">
                <el-select
                  v-model="form.psmPrecisionType"
                  @change="form.psmPrecisionVal = undefined"
                >
                  <el-option
                    v-for="item in options.psmPrecisionTypeOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="数值" prop="psmPrecisionVal">
                <el-select
                  v-model="form.psmPrecisionVal"
                  :disabled="!form.psmPrecisionType"
                >
                  <el-option
                    v-for="item in options.psmPrecisionValueOptions[
                      form.psmPrecisionType
                    ]"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </div>
            <el-form-item label="TeDRX参数" prop="tedrx">
              <el-select v-model="form.tedrx">
                <el-option
                  v-for="item in options.tedrxOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <div v-if="!mode">
          <el-button type="primary" @click="submitCheckForm()"
            >下一步</el-button
          >
        </div>
        <div v-if="!!mode && !data">
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import { toolsMixin } from '@/global/mixins/table-selection'
  import {
    apnOptions,
    newApnNameToLowPowerModeMap,
    lowPowerModeOptions,
    tedrxOptions,
    form,
    checkIccidLength,
    maxIccidLength,
    tauPrecisionTypeOptions,
    tauPrecisionValueOptions,
    psmPrecisionTypeOptions,
    psmPrecisionValueOptions
  } from './mixins/const'

  export default {
    name: 'nb-apn-modify-add',
    mixins: [toolsMixin],
    data() {
      return {
        maxIccidLength,
        form,
        options: {
          apnOptions,
          lowPowerModeOptions,
          tedrxOptions,
          tauPrecisionTypeOptions,
          tauPrecisionValueOptions,
          psmPrecisionTypeOptions,
          psmPrecisionValueOptions
        },
        success: [],
        isLoading: false,
        data: {}
      }
    },
    computed: {
      mode() {
        return this.success.length || this.form.newApnName ? true : false
      },
      rules() {
        return {
          iccids: [
            { required: true, message: '请输入iccid', trigger: 'blur' },
            {
              validator: checkIccidLength,
              trigger: 'blur'
            }
          ],
          newApnName: [{ required: true, message: '请选择apn', trigger: 'blur' }],
          oldApnName: [{ required: true, message: '请选择apn', trigger: 'blur' }],
          tedrx: [
            {
              required: form.lowPowerMode === '2' || form.lowPowerMode === '3',
              message: '请选择TeDRX参数',
              trigger: 'blur'
            }
          ],
          tauPrecisionType: [
            {
              required: form.lowPowerMode === '1' || form.lowPowerMode === '3',
              message: '请选择TAU精度',
              trigger: 'blur'
            }
          ],
          tauPrecisionVal: [
            {
              required: form.lowPowerMode === '1' || form.lowPowerMode === '3',
              message: '请选择TAU数值',
              trigger: 'blur'
            }
          ],
          psmPrecisionType: [
            {
              required: form.lowPowerMode === '1' || form.lowPowerMode === '3',
              message: '请选择PSM精度',
              trigger: 'blur'
            }
          ],
          psmPrecisionVal: [
            {
              required: form.lowPowerMode === '1' || form.lowPowerMode === '3',
              message: '请选择PSM数值',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      // 提交保存
      onSubmit() {
        this.$refs.form.validate(async (valid) => {
          if (!valid) return false
          let rst = await this.jaxLib.store.nbApnModifySave({
            iccids: iccidsTransfer(this.form.iccids),
            nbApnArgs: {
              operType: '1',
              ...this.form
            }
          })
          if (rst.success) {
            this.$message.success('操作成功！')
            this.success = []
            this.resetForm()
            this.$router.back(-1)
          }
        })
      },
      resetForm() {
        this.form = form
        this.$refs.form.resetFields()
      },
      submitCheckForm() {
        this.$refs.form.validate(async (valid) => {
          if (!valid) return false
          let rst = await this.jaxLib.store.nbApnModifyValidate({
            iccids: iccidsTransfer(this.form.iccids)
          })
          if (!rst.success) return false
          this.form.iccids = rst.data.successIccids.join(' ')
          this.success = rst.data.successIccids
        })
      },
      goBack() {
        window.history.go(-1)
      },
      onNewApnNameChanged(v) {
        this.form.lowPowerMode = newApnNameToLowPowerModeMap[v]
      }
    },
    mounted() {
      this.data = this.$route.query.data
      if (this.data) {
        const reg = new RegExp(',', 'g')
        try {
          const targets = JSON.parse(this.data.targets)
          this.form = targets
          this.form.iccids = this.data.iccids.replace(reg, '\n')
        } catch {

        }
      } else {
        this.form.newApnName = ''
        this.resetForm()
      }
    }
  }
</script>

<style lang="scss">
  .nb-apn-add-edit {
    .el-form-item__content {
      display: flex;
      .form-item-child {
        flex: 1;
        &:last-of-type {
          text-align: right;
        }
      }
    }
  }
</style>
