<template>
  <div>
    <div v-for="(item, index) in formData.whiteHousePriceChangeDTOList" :key="index">
      <h4 style="margin-bottom: 12px; color: #666">分组{{ index + 1 }}</h4>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="ICCID"
            :prop="'whiteHousePriceChangeDTOList.' + index + '.iccids'"
            :rules="[{ required: true, message: '请输入ICCID' }]"
          >
            <el-input
              v-model="item.iccids"
              style="width: 300px"
              type="textarea"
              rows="4"
              :disabled="isHistory"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="变更前运营商账号"
            :prop="'whiteHousePriceChangeDTOList.' + index + '.origCarrierAccountName'"
          >
            {{ item.origCarrierAccountName }}
            <!--            <wh-carrier-account-select v-model="item.carrierAccountId" :carrier="item.carrier" />-->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="变更前套餐类型"
            :prop="'whiteHousePriceChangeDTOList.' + index + '.origDbType'"
          >
            {{ enums.ratePlanType.maps()[item.origDbType] }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="变更前套餐规格"
            :prop="'whiteHousePriceChangeDTOList.' + index + '.origPlanName'"
          >
            {{ item.origPlanName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="是否需要功能费"
            :prop="'whiteHousePriceChangeDTOList.' + index + '.hasFeatureFee'"
            :rules="[{ required: true, message: '请选择是否需要功能费' }]"
          >
            <el-select
              v-model="item.hasFeatureFee"
              placeholder="是否需要功能费"
              :disabled="isHistory"
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="变更后营商账号"
            :prop="'whiteHousePriceChangeDTOList.' + index + '.targetCarrierAccountId'"
            :rules="[{ required: true, message: '请选择变更后营商账号' }]"
          >
            <wh-carrier-account-select
              v-if="!isHistory"
              v-model="item.targetCarrierAccountId"
              :carrier="item.carrier"
              :list-filter="carrierListFilter"
              :signed-carrier-id="item.signedCarrierId"
            />
            <template v-else>
              {{ item.targetCarrierAccountName }}
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="变更后套餐类型"
            :prop="'whiteHousePriceChangeDTOList.' + index + '.targetDbType'"
            :rules="[{ required: true, message: '请选择变更后套餐类型' }]"
          >
            <el-select
              v-if="!isHistory"
              v-model="item.targetDbType"
              clearable
              placeholder="套餐类型"
              @change="targetDbTypeChange"
            >
              <el-option
                v-for="(key, val) in enums.ratePlanType.maps()"
                :key="val"
                :label="key"
                :value="val"
              />
            </el-select>
            <template v-else>
              {{ item.targetDbType | ratePlanTypeFilter }}
            </template>
          </el-form-item>
        </el-col>
        <!--       阶梯-->
        <el-col v-if="!item.isStep" :span="6">
          <el-form-item
            label="变更后套餐规格"
            :prop="'whiteHousePriceChangeDTOList.' + index + '.targetCarrierChargeCategoryId'"
            :rules="[{ required: true, message: '请选择变更后套餐规格' }]"
          >
            <rate-plan-select-whitehouse
              v-if="!isHistory"
              v-model="item.targetCarrierChargeCategoryId"
              :carrier="item.carrier"
              :carrier-account-id="item.targetCarrierAccountId"
              :db-type="item.targetDbType"
              @change="(...args) => targetPlanNameChange(...args, index)"
            />
            <template v-else>
              {{ item.targetPlanName }}
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
import RatePlanSelectWhitehouse from '@/page/compliance/ext-whitelist/change-list/update-and-detail/components/rate-plan-select-whitehouse.vue'
export default {
  components: {
    RatePlanSelectWhitehouse,
    whCarrierAccountSelect
  },
  props: {
    flowType: {
      type: String,
      default: ''
    },
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
      this.$emit(
        'change',
        this.formData.whiteHousePriceChangeDTOList.map((item) => {
          return {
            ...item,
            iccids: item.iccids.join('\n')
          }
        })
      )
    } else {
      this.getData()
    }
  },
  methods: {
    carrierListFilter(list) {
      if (this.flowType === 'TW') {
        return list.filter((item) => item.extWhiteAccount)
      }
      return list
    },
    targetPlanNameChange(_, item, index) {
      const data = this.formData.whiteHousePriceChangeDTOList
      data[index].targetPlanName = item.carrierPlanName
      this.$emit('change', data)
    },
    targetDbTypeChange() {},
    async getData() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.validateCarrierAccount4Compliance({
        flowNo: this.flowNo
      })
      this.loading = false
      if (!success) return false
      this.detail = data.map((item) => {
        const res = {
          ...item,
          iccids: item.iccids.replace(',', '\n')
        }
        if (res.isStep) {
          delete res.targetCarrierChargeCategoryId
        }
        return res
      })
      this.$emit('change', data)
    }
  }
}
</script>
