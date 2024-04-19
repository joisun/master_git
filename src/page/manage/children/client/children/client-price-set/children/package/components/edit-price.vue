<script>
/**
 * Create by zeter on 2017/5/31
 */
import DialogMixin from '@/global/mixins/dialog-mixin'
import whVolumeInput from '@/page/components/wh-volume-input.vue'
import regexps from '@/constant/regexps'

export default {
  components: {
    'wh-volume-input': whVolumeInput
  },
  mixins: [DialogMixin],
  props: {
    orgName: {
      default: String
    },
    content: {
      default: Object
    },
    dialogName: {
      default: String
    },
    orgId: {
      default: Number
    }
  },
  data() {
    return {
      form: {
        step: [1, 12]
      }
    }
  },
  methods: {
    // 获取用户标记信息
    open() {
      this.form = {
        ...this.content,
        operator: Number(this.content.operator)
      }
    },
    // 保存用户打标
    async save() {
      if (!this.checkForm()) return false
      if (
        this.form.minPurchaseLimit % this.content.rechargeUnit !== 0 ||
        this.form.maxPurchaseLimit % this.content.rechargeUnit !== 0
      ) {
        return this.$message.error(`请确认购卡周期输入为${this.content.rechargeUnit}的倍数`)
      }
      if (this.form.minPurchaseLimit > this.form.maxPurchaseLimit)
        return this.$message.error('购卡周期的最小值不能大于最大值')
      let rst = await this.jaxLib.customer.priceTable.save({
        orgId: this.orgId,
        systemOfferId: this.content.id,
        minPurchaseLimit: this.form.minPurchaseLimit,
        maxPurchaseLimit: this.form.maxPurchaseLimit,
        status: this.form.status ? 'on' : 'off',
        apiRechargeCountLimit: this.form.apiRechargeCountLimit,
        cardFee: this.form.cardFee,
        pasterCardFee: this.form.pasterCardFee,
        ceramicCardFee: this.form.ceramicCardFee,
        pasterCeramicCardFee: this.form.pasterCeramicCardFee
      })
      if (!rst.success) {
        this.$message.error('销售报价属性设置失败！' + rst.message)
        return false
      }
      this.$message.success('销售报价属性设置成功！')
      this.$emit('closeDialog', this.dialogName, true)
    },
    // 校验
    checkForm() {
      let arr = ['cardFee', 'pasterCardFee', 'ceramicCardFee', 'pasterCeramicCardFee'].find((e) => {
        return this.form[e] !== -1 && !regexps.money.test(this.form[e])
      })
      if (arr) {
        this.$message.error('请填写正确的金额')
        return false
      }
      return true
    },
    close() {
      this.form = {
        step: [1, 12]
      }
      this.$emit('closeDialog', this.dialogName, false)
    },
    toCheck(isMin) {
      let reg = /^[0-9]+$/
      if (isMin) {
        if (!reg.test(this.form.minPurchaseLimit)) {
          this.$nextTick(() => {
            this.form.minPurchaseLimit = parseInt(this.form.minPurchaseLimit)
          })
        } else if (this.form.minPurchaseLimit % this.content.rechargeUnit !== 0) {
          this.$message.error(`输入数字必须是${this.content.rechargeUnit}的倍数`)
        }
      } else {
        if (!reg.test(this.form.maxPurchaseLimit)) {
          this.$nextTick(() => {
            this.form.maxPurchaseLimit = parseInt(this.form.maxPurchaseLimit)
          })
        } else if (this.form.maxPurchaseLimit % this.content.rechargeUnit !== 0) {
          this.$message.error(`输入数字必须是${this.content.rechargeUnit}的倍数`)
        }
      }
    }
  }
}
</script>

<template>
  <div class="edit-price">
    <div class="wh__dialog--header">
      <span class="wh__dialog--header-title">报价id: {{ content.id }}</span
      >&nbsp;&nbsp;&nbsp;
      <span class="wh__dialog--header-title">客户: {{ orgName }}</span>
    </div>
    <el-form ref="form" :model="form" :inline="true">
      <div class="wh__dialog--body">
        <div class="plan__dialog--block">
          <el-form-item label="运营商类型" prop="operator">
            <el-select v-model="form.operator" placeholder="选择运营商" :disabled="true">
              <el-option
                v-for="(key, val) in enums.carrier.mapsByOrdinal()"
                :key="val"
                :label="val"
                :value="key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套餐类型" prop="offerType" placeholder="选择套餐类型">
            <el-select v-model="form.offerType" :disabled="true">
              <el-option
                v-for="(key, val) in enums.planType.maps()"
                :key="val"
                :label="key"
                :value="val"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="plan__dialog--block">
          <el-form-item v-if="form.useCountAsVolume" label="连接次数" prop="volume">
            <el-input
              v-model="form.volume"
              :disabled="true"
              style="width: 140px; margin-right: 5px"
            ></el-input
            ><span>次</span>
          </el-form-item>
          <el-form-item v-else label="流量大小(MB)" prop="volume">
            <wh-volume-input v-model="form.volume" :disabled="true"> </wh-volume-input>
          </el-form-item>
          <el-form-item v-if="form.offerType === 'monthly'" label="购卡周期">
            <div class="plan__dialog--step" style="margin-bottom: 20px">
              <el-input-number
                v-model="form.minPurchaseLimit"
                placeholder="请输入最小周期"
                :controls="false"
                class="plan__dialog--step-input"
                :min="1"
                :max="content.rechargeUnit != null ? Infinity : 120"
                @change="toCheck(true)"
              >
              </el-input-number>
              -
              <el-input-number
                v-model="form.maxPurchaseLimit"
                placeholder="请输入最大周期"
                :controls="false"
                class="plan__dialog--step-input"
                :min="1"
                :max="content.rechargeUnit != null ? Infinity : 120"
                @change="toCheck(false)"
              >
              </el-input-number>
            </div>
          </el-form-item>
        </div>

        <div class="plan__dialog--block plan__dialog--price">
          <el-form-item label="价格">
            <div class="plan__dialog--price-box customer-price-set-box">
              <div class="plan__dialog--price-cloums">
                <div class="plan__dialog--price-label">运营商官方报价(元)</div>
                <div class="plan__dialog--price-value">
                  {{ form.officalPrice }}
                </div>
                <div
                  v-if="form.offerType === 'overflow-package'"
                  class="plan__dialog--price-computed"
                >
                  折合1G为{{ form.officalPrice * 1024 }}元
                </div>
              </div>
              <div class="plan__dialog--price-cloums">
                <div class="plan__dialog--price-label">平台售价(元)</div>
                <div class="plan__dialog--price-value">
                  {{ form.price }}
                </div>
                <div
                  v-if="form.offerType === 'overflow-package'"
                  class="plan__dialog--price-computed"
                >
                  折合1G为{{ form.price * 1024 }}元
                </div>
              </div>
              <div class="plan__dialog--price-cloums">
                <div class="plan__dialog--price-label">销售底价(元)</div>
                <div class="plan__dialog--price-value">
                  {{ form.bottomPrice }}
                </div>
                <div
                  v-if="form.offerType === 'overflow-package'"
                  class="plan__dialog--price-computed"
                >
                  折合1G为{{ form.bottomPrice * 1024 }}元
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="plan__dialog--block plan__dialog--price">
          <el-form-item label="卡费">
            <div class="plan__dialog--price-box customer-price-set-box">
              <div v-if="form.cardFee !== -1" class="plan__dialog--price-cloums">
                <div class="plan__dialog--price-label">塑料插拔卡(元)</div>
                <div class="plan__dialog--price-value">
                  <el-input v-model="form.cardFee" placeholder="请输入内容"> </el-input>
                </div>
              </div>
              <div v-if="form.pasterCardFee !== -1" class="plan__dialog--price-cloums">
                <div class="plan__dialog--price-label">塑料贴片卡(元)</div>
                <div class="plan__dialog--price-value">
                  <el-input v-model="form.pasterCardFee" placeholder="请输入内容"> </el-input>
                </div>
              </div>
              <div v-if="form.ceramicCardFee !== -1" class="plan__dialog--price-cloums">
                <div class="plan__dialog--price-label">陶瓷插拔卡(元)</div>
                <div class="plan__dialog--price-value">
                  <el-input v-model="form.ceramicCardFee" placeholder="请输入内容"> </el-input>
                </div>
              </div>
              <div v-if="form.pasterCeramicCardFee !== -1" class="plan__dialog--price-cloums">
                <div class="plan__dialog--price-label">陶瓷贴片卡(元)</div>
                <div class="plan__dialog--price-value">
                  <el-input v-model="form.pasterCeramicCardFee" placeholder="请输入内容">
                  </el-input>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="plan__dialog--block">
          <el-form-item label="套餐状态">
            <el-switch
              v-model="form.status"
              :disabled="form.disableOnStatus"
              active-text="上架"
              inactive-text="下架"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="API续费次数">
            <el-input-number
              v-model="form.apiRechargeCountLimit"
              :min="-1"
              :max="999"
              :controls="false"
              :debounce="1000"
              style="width: 70px"
              size="small"
            >
            </el-input-number>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="wh__dialog--footer">
      <el-button type="primary" class="" @click="save">提交</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>
