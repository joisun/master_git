<template>
  <div style="width: 400px">
    <el-tabs v-model="currentTabName">
      <el-tab-pane name="registerFree" label="注册赠送套餐">
        <div class="wh__dialog--body">
          <div class="mb10">
            <el-input
              v-model="presentStd.id"
              placeholder="月套餐ID"
              size="small"
              @blur="blurEvent($event, 'presentStd')"
            >
            </el-input>
            <div v-if="Object.keys(presentStd.plan).length">
              <div>
                套餐规格:
                <span
                  v-tag-extract="{
                    offerType: presentStd.plan.offerType,
                    validity: presentStd.plan.validity,
                    validityUnit: presentStd.plan.validityUnit,
                    volume: presentStd.plan.volume,
                    unlimited: presentStd.plan.unlimitedVolume,
                  }"
                ></span>
              </div>
              <div>套餐分类: {{ presentStd.plan.className }}</div>
            </div>
          </div>
          <div class="mb10">
            <el-input
              v-model="presentCus.id"
              placeholder="自定义套餐ID"
              size="small"
              @blur="blurEvent($event, 'presentCus')"
            >
            </el-input>
            <div v-if="Object.keys(presentCus.plan).length">
              <div>
                套餐规格:
                <span
                  v-tag-extract="{
                    offerType: presentCus.plan.offerType,
                    validity: presentCus.plan.validity,
                    validityUnit: presentCus.plan.validityUnit,
                    volume: presentCus.plan.volume,
                    unlimited: presentCus.plan.unlimitedVolume,
                  }"
                ></span>
              </div>
              <div>套餐分类: {{ presentCus.plan.className }}</div>
            </div>
          </div>
        </div>
        <div class="wh__dialog--footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane name="poolRule" label="流量池组池规则">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          class="wh__dialog--body"
          label-width="120px"
          label-position="right"
        >
          <el-form-item label="组池规则" prop="poolRule">
            <el-select
              placeholder="按套餐分类组池"
              @change="ruleChange"
              v-model="form.poolRule"
            >
              <el-option
                v-for="item in poolRules"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model="form.remark"
              placeholder="输入备注信息"
            >
            </el-input>
          </el-form-item>

          <el-form-item class="wh__dialog--footer">
            <el-button @click="close">取 消</el-button>
            <el-button
              type="primary"
              @click="onSubmit"
              :disabled="submitDisable"
              >确 认</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DialogMixin from '@/global/mixins/dialog-mixin'
import classificationFilter from '@/global/filters/classification-format'
import VolumeFormat from '@/global/filters/volume-format'
import moment from 'moment'

export default {
  mixins: [DialogMixin],
  props: {
    orgId: {
      default: String,
    },
    pointOrgName: {
      default: String,
    },
    orgContent: {
      default: Object,
    },
    dialogName: {
      default: String,
    },
  },
  data() {
    return {
      currentTabName: 'registerFree',

      presentStd: { id: '', plan: {} },
      presentCus: { id: '', plan: {} },

      form: {
        poolRule: '',
        remark: '',
      },
      rules: {
        poolRule: [
          { required: true, message: '选择不同规则', trigger: 'blur' },
        ],
        remark: [{ required: true, message: '请填写备注', trigger: 'blur' }],
      },
      poolRules: ['按套餐分类组池', '仅按套餐规格组池'],
      defaultRule: '',
      submitDisable: true,
      isLoading: true,
    }
  },
  methods: {
    operatingEditList(type, index) {
      let obj = { id: '', plan: '' }
      if (type === 'addPlan') this.priceList.push(obj)
      if (type === 'deletePlan') this.priceList.splice(index, 1)
    },
    // 失焦
    async blurEvent(e, index) {
      let rst = await this.jaxLib.financial.plan.get({
        id: this[index].id,
      })
      if (!rst.success) return false
      if (rst.data) {
        rst.data.className = classificationFilter(rst.data.categoryId)
        this[index].plan = rst.data || {}
        return true
      }
      this[index].plan = {}
      return false
    },
    open() {
      this.isMerge()

      if (this.orgContent.presentStdId) {
        this.presentStd.id = this.orgContent.presentStdId;
        this.blurEvent(null, 'presentStd')
      }
      if (this.orgContent.presentCusId) {
        this.presentCus.id = this.orgContent.presentCusId;
        this.blurEvent(null, 'presentCus')
      }
    },
    // 保存
    async save() {
      if (!this.presentStd.plan || !this.presentCus.plan) {
        this.$message.error('请输入两个合理的套餐id')
        return false
      }
      if (
        this.presentStd.plan &&
        this.presentStd.plan.offerType !== 'monthly'
      ) {
        this.$message.error('请输入正确的月度套餐')
        return false
      }
      if (this.presentCus.plan && this.presentCus.plan.offerType !== 'custom') {
        this.$message.error('请输入正确的自定义套餐')
        return false;
      }
      let rst = await this.jaxLib.customer.active.setPresent({
        id: this.orgId,
        presentStdId: this.presentStd.id,
        presentCusId: this.presentCus.id,
      })
      if (rst.success) {
        this.$emit('closeDialog', this.dialogName, true)
      } else {
        this.msg(`粗错了%>_<%粗错了 因为: ${body.message}`, 'error')
      }
    },
    close() {
      this.presentStd = { id: '', plan: {} }
      this.presentCus = { id: '', plan: {} }

      this.form.remark = ''
      this.form.poolRule = ''
      this.currentTabName = 'registerFree'
      this.defaultRule = ''
      this.submitDisable = true

      this.$emit('closeDialog', this.dialogName, false)
    },

    async isMerge() {
      let rst = await this.jaxLib.customer.active.isMerged({
        orgId: this.orgId,
      })
      this.form.poolRule = rst.data.merged
        ? '仅按套餐规格组池'
        : '按套餐分类组池'
      this.defaultRule = this.form.poolRule
    },
    async onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let rst = await this.jaxLib.customer.active.test({
            orgId: this.orgId,
          })
          if (!rst.success) return
          if (rst.data && rst.data.length > 0) {
            // 爆池
            const msg = `${
              this.isMerged ? '合并后' : '拆分后'
            }以下流量池将会爆池，请确认是否需要继续修改！`
            let poolList = [];
            rst.data.forEach((element) => {
              poolList.push(
                element.poolPlatform ? `${this.enums.carrier.get(element.carrier)}${
                  element.poolPlatform
                }-${VolumeFormat(element.poolSpecification)}-${
                  element.vpdn ? 'VPDN' : '公网'
                } 使用量：${
                  element.totalVolume
                    ? ((element.useVolume * 100) / element.totalVolume).toFixed(
                        2
                      )
                    : 0
                }%${this.orgId === element.orgId ? '' : ' (子流量池)'} ` : `${this.enums.carrier.get(element.carrier)}-${VolumeFormat(element.poolSpecification)} 使用量：${
                  element.totalVolume
                    ? ((element.useVolume * 100) / element.totalVolume).toFixed(
                        2
                      )
                    : 0
                }% `
              )
            })
            this.onMessage(this.getMessage(msg, poolList))
          } else {
            this.invert()
          }
        }
      });
    },
    async invert() {
      const param = {
        orgId: this.orgId,
        remark: this.form.remark,
      }
      let rst = await this.jaxLib.customer.active.invert(param)
      if (!rst.success) return false
      this.close()
      this.$message.success('配置成功')
    },

    getMessage(msg, poolList) {
      return (
        <div>
          <p>{msg}</p>
          <div>
            {poolList.map((item) => {
              return <p>{item}</p>
            })}
          </div>
        </div>
      )
    },
    onMessage(msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'text',
      })
        .then(() => {
          this.invert()
        })
        .catch(() => {})
    },

    ruleChange(value) {
      if (value !== this.defaultRule) {
        this.submitDisable = false
      } else {
        this.submitDisable = true
      }
    },
  },
  async created() {
    await this.$store.dispatch('changeClassificationList')
  },
};
</script>
