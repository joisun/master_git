<script>
/**
 * Create by zeter on 2019-02-27
 */
import { beforeModifyList, afterModifyList } from '../mixins/const'
import { iccidsTransfer } from '@/global/function/iccids-tool'
import whClassificationSelect from '@/page/components/wh-classification-select.vue'

export default {
  name: 'show-package-diff',
  components: {
    'wh-classification-select': whClassificationSelect
  },
  props: {
    content: {
      type: Object,
      default: () => {}
    },
    iccids: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      beforeModifyList,
      afterModifyList,
      loading: false,
      money: 0,
      planList: [],
      isChangePool: false,
      beforeChangeMoney: 0,
      form: {
        categoryId: '',
        targetPriceOfferId: '',
        poolEnable: false
      }
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    costMoney() {
      if (this.id) {
        return this.content.targetTotalMoney - this.content.origTotalMoney
      } else {
        return this.beforeChangeMoney - this.content.origTotalMoney
      }
    },
    mode() {
      return Object.keys(this.content).length
    }
  },
  watch: {
    'content.categoryId'(newValue) {
      this.form.categoryId = newValue
    }
  },
  mounted() {
    if (!this.content.id) {
      this.getBalance()
      this.getPlanList()
    }
  },
  methods: {
    back() {
      this.$emit('back')
    },
    async getPlanList() {
      let rst = await this.jaxLib.card.getModifyPlanList({
        iccids: iccidsTransfer(this.iccids, ','),
        orgId: this.content.refId,
        origPriceOfferId: this.content.origPriceOfferId,
        targetCategoryId: this.form.categoryId
      })
      if (!rst.success) return false
      this.planList = rst.data || []
    },
    async getBalance() {
      this.loading = true
      let rst = await this.jaxLib.customer.balance.get({ orgId: this.content.refId })
      this.loading = false
      if (!rst.success) return false
      this.money = rst.data.balance
    },
    async changPool() {
      this.changeTargetId(this.form.targetPriceOfferId)
    },
    async changeTargetId(val) {
      if (val === '') {
        this.beforeChangeMoney = 0
        return false
      }
      let rst = await this.jaxLib.card.modifyPlanCheckPlan({
        iccids: iccidsTransfer(this.iccids, ','),
        orgId: this.content.refId,
        poolEnable: this.form.poolEnable,
        origPriceOfferId: this.content.origPriceOfferId,
        targetPriceOfferId: this.form.targetPriceOfferId
      })
      if (!rst.success) return false
      this.beforeChangeMoney = rst.data.targetTotalMoney
      this.form.categoryId = res.data.categoryId
    },
    emitModifyAjax(msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: true
      })
        .then(() => {
          this.twiceSure()
        })
        .catch(() => {})
    },
    async sure() {
      this.loading = true
      let rst = await this.jaxLib.card.customerModifyPlan({
        iccids: iccidsTransfer(this.iccids, ','),
        targetPriceOfferId: this.form.targetPriceOfferId,
        poolEnable: this.form.poolEnable
      })
      this.loading = false
      if (!rst.success) return false
      if (!rst.data.success) {
        this.emitModifyAjax(rst.data.message)
      } else {
        this.$message.success('申请成功')
        this.$router.push({ name: 'customer-modify-package-list' })
      }
    },
    async twiceSure() {
      this.loading = true
      let rst = await this.jaxLib.card.customerModifyPlan({
        iccids: iccidsTransfer(this.iccids, ','),
        targetPriceOfferId: this.form.targetPriceOfferId,
        poolEnable: this.form.poolEnable,
        ignoreExceedCheck: true
      })
      this.loading = false
      if (!rst.success) return false
      this.$message.success('申请成功')
      this.$router.push({ name: 'customer-modify-package-list' })
    }
  }
}
</script>

<template>
  <div class="show-package-diff">
    <div class="flex">
      <div class="flex1 wh__card mr20">
        <div class="wh__card--header">变更前</div>
        <ul class="wh__card--body">
          <li v-for="i in beforeModifyList" :key="i.key">
            {{ i.name }}: {{ i.formatter ? i.formatter(content[i.key]) : content[i.key] }}
          </li>
          <li>套餐规格: {{ content.origOfferName }}({{ content.origPriceOfferId }})</li>
          <li>变更前总价: {{ (content.origTotalMoney / 10000) | numberFilter }}</li>
        </ul>
      </div>
      <div class="flex1 wh__card">
        <div class="wh__card--header">变更后</div>
        <ul class="wh__card--body">
          <li v-for="i in afterModifyList" :key="i.key">
            {{ i.name }}: {{ i.formatter ? i.formatter(content[i.key]) : content[i.key] }}
          </li>
          <li>
            套餐分类：<wh-classification-select
              v-if="!id"
              v-model="form.categoryId"
              :show-disabled="false"
              :carrier="content.carrier"
              @change="getPlanList"
            />
            <template v-else>
              {{ content.targetCategoryName }}
            </template>
          </li>
          <li v-if="id">
            套餐类型:
            {{ content.targetCardType }}
          </li>
          <li>
            套餐档位:
            <el-select
              v-if="!id"
              v-model="form.targetPriceOfferId"
              placeholder="请选择套餐档位"
              size="small"
              style="width: 300px"
              @change="changeTargetId"
            >
              <el-option
                v-for="item in planList"
                :key="item.id"
                :label="item.name + '(ID:' + item.id + ')'"
                :value="item.id"
              >
                {{ item.name }}(ID:{{ item.id }})
              </el-option>
            </el-select>
            <template v-else>
              {{ content.targetOfferName }}
            </template>
          </li>
          <li v-if="!id">
            流量池:
            <template v-if="content.origCardType.indexOf('自定义') >= 0"> 否 </template>
            <el-radio-group v-else v-model="form.poolEnable" @change="changPool">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </li>
          <li>
            是否更改当前激活套餐: {{ content.origCardType.indexOf('自定义') >= 0 ? '否' : '是' }}
          </li>
          <li>
            变更后总价:
            <span v-if="!id">{{ (beforeChangeMoney / 10000) | numberFilter }}</span>
            <span v-else>{{ (content.targetTotalMoney / 10000) | numberFilter }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex">
      <div v-if="!content.id" class="flex1 mr20">
        账户余额: {{ (money / 10000) | numberFilter }}
      </div>
      <div class="flex1">
        <div>所需费用: {{ (costMoney / 10000) | numberFilter }}</div>
        <div v-if="id">生效时间: {{ content.gmtModified | dateFilter }}</div>
        <div v-if="!id">
          <el-button @click="back">上一步</el-button>
          <el-button
            type="primary"
            :disabled="loading || form.targetPriceOfferId === ''"
            @click="sure"
            >确认</el-button
          >
        </div>
        <div v-else>
          <div>操作人: {{ content.changeBy }}</div>
          <div>操作时间: {{ content.gmtCreated | dateFilter }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
