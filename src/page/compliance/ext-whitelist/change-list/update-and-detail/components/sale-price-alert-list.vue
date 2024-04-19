<template>
  <div>
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="origPriceOfferId" label="变更前套餐ID" width="180">
        <template #default="{ row }">
          {{ row.origPriceOfferId }}({{ row.origOfferName }})
        </template>
      </el-table-column>
      <el-table-column prop="origCategoryName" label="变更前套餐分类" width="180" />
      <el-table-column prop="origPrice" label="变更前销售价"> </el-table-column>
      <el-table-column prop="address" label="变更后套餐ID">
        <template #default="{ row }">
          {{ row.targetPriceOfferId }}({{ row.targetOfferName }})
        </template>
      </el-table-column>
      <el-table-column prop="targetCategoryName" label="变更后套餐分类" />
      <el-table-column prop="targetgPrice" label="变更后参考价（申请时填写的变更后售价）(元)">
      </el-table-column>
      <el-table-column prop="currentSalePrice" label="当前时间点套餐销售报价（元）" />
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    flowNo: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    isHistory: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    flowNo() {
      this.getData()
    }
  },
  created() {
    !this.isHistory && this.getData()
  },
  methods: {
    async getData() {
      const res = await this.jaxLib.whitelist.listSalePriceChange({ flowNo: this.flowNo })
      if (res && res.success) {
        this.$emit('change', res.data)
      }
    }
  }
}
</script>
