<template>
  <div>
    <div v-for="(item, index) in formData.cardPriceOfferChangeDTOList" :key="index">
      <h4 style="margin-bottom: 12px; color: #666">分组{{ index + 1 }}</h4>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="变更前套餐分类"
            :prop="'cardPriceOfferChangeDTOList.' + index + '.origCategoryId'"
          >
            {{ item.origCategoryName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="变更前套餐规格"
            :prop="'cardPriceOfferChangeDTOList.' + index + '.oriPackage'"
          >
            {{ item.origPriceOfferId }}({{ item.origOfferName }})
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="变更前运营商账号"
            :prop="'cardPriceOfferChangeDTOList.' + index + '.carrierAccountId'"
          >
            {{ item.origCarrierAccountName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="变更后套餐分类"
            :prop="'cardPriceOfferChangeDTOList.' + index + '.targetCategoryName'"
          >
            <wh-classification-select
              v-if="!isHistory"
              v-model="item.targetCategoryId"
              :show-disabled="false"
              :carrier="item.carrier"
              @change="(...args) => classificationChange(...args, index)"
            />
            <template v-else>
              {{ item.targetCategoryName }}
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            :rules="{ required: true, message: '请选择变更后套餐规格' }"
            label="变更后套餐规格"
            :prop="'cardPriceOfferChangeDTOList.' + index + '.targetPriceOfferId'"
          >
            <rate-plan-select
              v-if="!isHistory"
              v-model="item.targetPriceOfferId"
              :org-id="item.orgId"
              :target-category-id="item.targetCategoryId || undefined"
              :orig-price-offer-id="item.origPriceOfferId || undefined"
              @change="(...args) => ratePlanChange(...args, index)"
            />
            <template v-else> {{ item.targetPriceOfferId }} ({{ item.targetOfferName }}) </template>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="6">-->
        <!--          <el-form-item-->
        <!--            label="流量池"-->
        <!--            :rules="{ required: true, message: '请选择流量池' }"-->
        <!--            :prop="'cardPriceOfferChangeDTOList.' + index + '.poolEnabled'"-->
        <!--          >-->
        <!--            <el-radio-group v-model="item.poolEnabled" :disabled="isHistory">-->
        <!--              <el-radio :label="true">是</el-radio>-->
        <!--              <el-radio :label="false">否</el-radio>-->
        <!--            </el-radio-group>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
      </el-row>
    </div>
  </div>
</template>
<script>
import WhClassificationSelect from '@/page/components/wh-classification-select.vue'
// import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import RatePlanSelect from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/rate-plan-select.vue'
export default {
  components: {
    RatePlanSelect,
    WhClassificationSelect
  },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    flowNo: {
      type: String,
      default: ''
    },
    isHistory: {
      type: Boolean,
      default: false
    }
  },
  created() {
    if (this.isHistory) {
      this.$emit('change', this.formData.cardPriceOfferChangeDTOList)
    } else {
      this.getData()
    }
  },
  methods: {
    classificationChange(_, item, index) {
      const data = this.formData.cardPriceOfferChangeDTOList
      data[index].targetCategoryName = item.name
      this.$emit('change', data)
    },
    ratePlanChange(_, item, index) {
      const data = this.formData.cardPriceOfferChangeDTOList
      data[index].targetOfferName = item.name
      this.$emit('change', data)
    },
    async getData() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.validateCustomerRatePlanChangeIccid({
        flowNo: this.flowNo
      })
      this.loading = false
      if (!success) return false
      const result = data.map((item) => {
        return {
          ...item,
          targetCategoryId: item.origCategoryId
        }
      })
      this.$emit('change', result)
    }
  }
}
</script>
