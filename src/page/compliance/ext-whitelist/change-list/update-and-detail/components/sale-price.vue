<template>
  <el-table :data="formData.priceOfferShows" size="small" style="width: 650px">
    <el-table-column align="center" label="套餐" width="200px">
      <template #default="{ row }">
        <div style="margin-bottom: 20px">{{ row.priceOfferId }}({{ row.priceOfferName }})</div>
      </template>
    </el-table-column>
    <el-table-column align="center" label="变更前价格" width="200px">
      <template #default="{ row }">
        <div style="margin-bottom: 20px">
          {{ row.salePrice }}
        </div>
      </template>
    </el-table-column>
    <el-table-column align="left" label="变更后售价（套餐ID可能变更）（元）">
      <template #default="{ row, $index }">
        <el-form-item
          :prop="'priceOfferShows.' + $index + '.price'"
          label-width="0"
          :rules="{
            required: !isOpOrSu,
            message: '请输入变更后售价'
          }"
        >
          <el-input
            v-model="row.price"
            :disabled="disabled"
            type="text"
            autocomplete="off"
            size="small"
            style="width: 200px"
          />
        </el-form-item>
      </template>
    </el-table-column>
  </el-table>
</template>
<script >
export default {
  props: {
    isOpOrSu: {
      type: Boolean,
      require: false,
      default: false
    },
    disabled: {
      type: Boolean,
      require: false,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.el-table__row {
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>

