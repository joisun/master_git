<script>
import AddEditForm from './components/add-edit-form'
export default {
  components: {
    AddEditForm
  },
  data() {
    return {
      carrier: this.$route.params.carrier || 'cmcc',
      activeItem: null,
      displayEditorShow: false,
      tableData: [],
      loading: false
    }
  },
  watch: {
    async $route(val) {
      if (val.name === 'card-export-strategy-list' && val.params.carrier !== this.carrier) {
        this.carrier = val.params.carrier
        await this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    usedPriceOfferCategoryIds(excludePackageCategory) {
      let res = {}
      this.tableData.forEach((item) => {
        if (item.packageCategory === excludePackageCategory) return
        item.priceOfferCategoryIds.forEach((id) => (res[id] = 1))
      })
      return res
    },
    genTableData(data) {
      const resMap = {}
      data.forEach((item) => {
        resMap[item.packageCategory] = [...(resMap[item.packageCategory] || []), item]
      })
      return Object.keys(resMap).map((key) => {
        return {
          carrier: resMap[key][0].carrier,
          packageCategory: key,
          priceOfferCategoryIds: resMap[key][0].priceOfferCategoryIds
            .split(',')
            .map((item) => +item),
          priceOfferCategoryNameList: resMap[key][0].priceOfferCategoryNameList,
          packageSize: resMap[key].map((item) => {
            return {
              id: item.id,
              lowerLimit: item.packageSizeStart,
              upperLimit: item.packageSizeEnd < 0 ? '' : item.packageSizeEnd,
              carrierAccount: item.carrierAccountIds.split(',').map((item) => ({ id: +item }))
            }
          })
        }
      })
    },
    handleAdd() {
      this.$refs.addEditForm.open({
        carrier: this.carrier,
        usedPriceOfferCategoryIds: this.usedPriceOfferCategoryIds()
      })
    },
    // 编辑
    handleEdit(row) {
      this.$refs.addEditForm.open({
        ...row,
        usedPriceOfferCategoryIds: this.usedPriceOfferCategoryIds(row.packageCategory)
      })
    },
    tabsClick(tab) {
      this.$router.push({ name: `card-export-strategy-list`, params: { carrier: tab.name } })
      this.getList()
    },
    async getList() {
      let rst = await this.jaxLib.store.deviceBaseExportStrategyList({
        carrier: this.carrier
      })
      if (!rst.success) return false
      this.tableData = this.genTableData(rst.data)
    },

    handleDelete(row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { success } = await this.jaxLib.store.deviceBaseExportStrategyDelete({
            ids: row.packageSize.map((item) => item.id).join()
          })
          if (!success) return
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          await this.getList()
        })
        .catch(() => {})
    }
  }
}
</script>

<template>
  <div class="store-carrier-plan">
    <add-edit-form ref="addEditForm" @confirm="getList" />
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">出卡策略配置</h2>
      </div>
      <div class="wh__tabs">
        <el-tabs v-model="carrier" class="wh__tabs" @tab-click="tabsClick">
          <el-tab-pane
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :name="val"
          />
        </el-tabs>
      </div>
      <div v-loading="loading" class="wh__body">
        <div class="wh__tools">
          <div class="wh__tools--mix">
            <el-button type="primary" class="float-right" @click="handleAdd">新增</el-button>
          </div>
        </div>
        <div class="wh__body--table">
          <el-table :data="tableData">
            <el-table-column label="套餐大类" width="100">
              <template #default="{ row }">
                {{ row.packageCategory }}
              </template>
            </el-table-column>
            <el-table-column label="关联分类" width="300">
              <template #default="{ row }">
                {{ row.priceOfferCategoryNameList.join('，') }}
              </template>
            </el-table-column>
            <el-table-column label="套餐大小" width="200">
              <template #default="{ row }">
                <div
                  v-for="(p, i) in row.packageSize"
                  :key="i"
                  :style="{
                    borderTop: i !== 0 ? '1px solid #EBEEF5' : 'none',
                    height: p.carrierAccount.length * 30 + 'px',
                    lineHeight: p.carrierAccount.length * 30 + 'px'
                  }"
                >
                  ({{ p.lowerLimit | volumeFilter }},
                  <template v-if="p.upperLimit !== ''">
                    {{ p.upperLimit | volumeFilter }}]
                  </template>
                  <template v-else>∞)</template>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="出卡渠道(运营商)">
              <template #default="{ row }">
                <div
                  v-for="(p, i) in row.packageSize"
                  :key="i"
                  :style="i !== 0 ? { borderTop: '1px solid #EBEEF5' } : {}"
                >
                  <div
                    v-for="(c, ci) in p.carrierAccount"
                    :key="c.id"
                    style="height: 30px; line-height: 30px"
                  >
                    {{ ci + 1 }}. {{ c.id | carrierAccountFilter(row.carrier) }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template #default="{ row }">
                <el-button size="mini" @click="handleEdit(row)">修改</el-button>
                <el-button type="primary" size="mini" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
