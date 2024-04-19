<script>
/**
 * Create by zeter on 2017/11/6
 */
import { cardStoreMap } from '../mixins/consts'
import filterSession from '../mixins/in-filter-session'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'

export default {
  components: {
    'wh-carrier-account-select': whCarrierAccountSelect
  },
  data() {
    return {
      operatorList: [],
      statusList: [],
      cardStoreMap: [...cardStoreMap],
      tableData: [],
      searchForm: {
        carrier: 'cmcc',
        carrierAccountId: '',
        ratePlanVolume: '',
        type: '', // ratePlanType
        specification: '',
        material: '',
        validity: '',
        validityUnit: '',
        volumeType: '',
        packageName: ''
      },
      pageConfig: {
        currentPage: 1,
        rowsPerPage: 20,
        allCount: 0
      },
      loading: true,
      filterFields: {
        full: filterSession.getStoredFilterSet(true),
        stored: filterSession.getStoredFilterSet()
      },
      listRatePlan: []
    }
  },
  computed: {
    showWhatRect() {
      let middleValue = {}
      this.filterFields.stored.forEach((e) => {
        middleValue[e] = 'true'
      })
      return middleValue
    }
  },
  created() {
    this.getListRatePlan()
    if (!this.$route.query.enter || this.$route.query.enter === 'false') {
      this.searchForm = { ...this.searchForm, ...this.$route.query }
    }
  },
  mounted() {
    this.getTableData()
    this.getListRatePlan()
  },
  methods: {
    // 搜索
    searchConfig() {
      this.pageConfig.currentPage = 1
      this.getTableData()
    },
    resetSearchForm() {
      this.searchForm = {
        carrier: 'cmcc',
        carrierAccountId: '',
        ratePlanVolume: '',
        type: '',
        specification: '',
        material: '',
        validity: '',
        validityUnit: '',
        volumeType: '',
        packageName: ''
      }
      this.getTableData()
    },
    changeCarrier(val) {
      this.searchForm.type = ''
      this.searchForm.carrierAccountId = ''
      this.searchConfig()
    },
    purify(oriData) {
      let data = { ...oriData }
      delete data.enter
      // eslint-disable-next-line no-unused-vars
      for (let key in oriData) {
        let value = oriData[key]
        if (!value) delete data[key]
      }
      return data
    },
    async getListRatePlan() {
      let rst = await this.jaxLib.store.listRatePlan()
      if (!rst.success) {
        return false
      }
      this.listRatePlan = rst.data.list
    },
    async getTableData() {
      this.loading = true
      let postData = this.purify(this.searchForm)
      postData.carrier = postData.carrier.toLocaleLowerCase()
      if (postData.volumeType === 'COUNT') {
        postData.useCountAsVolume = true
      } else if (postData.volumeType === 'AMOUNT') {
        postData.useCountAsVolume = false
      }
      postData.carrier = postData.carrier.toLocaleUpperCase()
      let rst = await this.jaxLib.store.list({
        ...postData,
        pageSize: this.pageConfig.rowsPerPage,
        currentPage: this.pageConfig.currentPage
      })
      this.loading = false
      if (!rst.success) {
        return false
      }
      console.log('🎸 DEBUG_125 goods.vue 👉', rst)
      this.tableData = rst.data.list
      this.pageConfig.allCount = rst.data.page.allCount
    },
    handleCurrentChange(val) {
      this.pageConfig.currentPage = val
      this.getTableData()
    },
    handleSizeChange(val) {
      this.pageConfig.rowsPerPage = val
      this.getTableData()
    },
    handleIntoStore(val) {
      this.$router.push({
        name: 'store-inventory-turnover',
        query: {
          carrier: val.carrier,
          carrierAccountId: val.carrierAccountId,
          material: val.material,
          packageName: val.packageName,
          specification: val.specification,
          type: val.type,
          carrierAccountName: val.carrierAccountName
        }
      })
    },
    handleFilterChange(filterList) {
      filterSession.setStorage(filterList)
    }
  }
}
</script>

<template>
  <div>
    <div class="wh__tools--mix">
      <div class="wh__tools--search">
        <el-select
          v-model="searchForm.carrier"
          placeholder="运营商"
          style="width: 120px"
          @change="changeCarrier"
        >
          <el-option
            v-for="(label, value) in enums.carrier.maps()"
            :key="value"
            :value="value"
            :label="label"
          >
          </el-option>
        </el-select>
        <wh-carrier-account-select
          v-if="searchForm.carrier !== ''"
          v-model="searchForm.carrierAccountId"
          style="width: 150px"
          placeholder="供应商账号"
          size="small"
          :carrier="searchForm.carrier"
          @change="searchConfig"
        >
        </wh-carrier-account-select>
        <el-select
          v-model="searchForm.packageName"
          placeholder="套餐档位"
          style="width: 120px"
          value-key="label"
          clearable
          @change="searchConfig"
        >
          <template v-if="searchForm.type !== 'POOL'">
            <el-option v-for="item in listRatePlan" :key="item" :label="item" :value="item">
            </el-option>
          </template>
        </el-select>
        <el-select
          v-model="searchForm.material"
          placeholder="材质"
          style="width: 100px"
          clearable
          @change="searchConfig"
        >
          <el-option
            v-for="(label, value) in enums.materialType.maps()"
            :key="label"
            :label="label"
            :value="value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchForm.specification"
          placeholder="规格"
          style="width: 100px"
          clearable
          @change="searchConfig"
        >
          <el-option
            v-for="(label, value) in enums.specificationType.maps()"
            :key="label"
            :label="label"
            :value="value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchForm.type"
          placeholder="类型"
          style="width: 150px"
          clearable
          @change="searchConfig()"
        >
          <el-option
            v-for="(label, value) in enums.ratePlanType.maps()"
            :key="value"
            :label="label"
            :value="value"
            clearable
          >
          </el-option>
        </el-select>
        <el-tooltip content="重置搜索条件">
          <el-button class="wh__tools--search-btn" size="mini" @click="resetSearchForm">
            <wh-std-icon sign="&#xe629;"> </wh-std-icon>
          </el-button>
        </el-tooltip>
        <el-popover
          ref="popover-filter"
          title="字段过滤"
          placement="bottom"
          class="wh__tools--filter"
          trigger="click"
        >
          <el-checkbox-group v-model="filterFields.stored" @change="handleFilterChange">
            <el-checkbox
              v-for="(value, key) in filterFields.full"
              :key="key"
              :label="key"
              class="wh__tools--filter-item"
            >
              {{ value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-popover>
        <el-button v-popover:popover-filter class="float-right" size="mini">
          <wh-std-icon sign="&#xe693;"> </wh-std-icon>
        </el-button>
      </div>
    </div>
    <div class="wh__body">
      <div class="wh__body--table">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          height="calc(100vh - 190px)"
        >
          <template v-for="(item, index) in cardStoreMap" v-if="showWhatRect[item.key]">
            <el-table-column
              v-if="item.key === 'standardInventoryCount'"
              :key="index"
              :formatter="item.formatter"
              :prop="item.key"
              :label="item.label"
              :min-width="item.width"
              :class-name="item.className"
            >
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.isEdit === true"
                  v-model="scope.row.standardInventoryCount"
                  type="text"
                  size="small"
                ></el-input>
                <span v-else>{{ scope.row.standardInventoryCount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="index"
              :formatter="item.formatter"
              :prop="item.key"
              :label="item.label"
              :min-width="item.width"
              :class-name="item.className"
            >
            </el-table-column>
          </template>
          <el-table-column label="操作" prop="stock" min-width="100px" min-height="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleIntoStore(scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="pageConfig.currentPage"
          :page-size="pageConfig.rowsPerPage"
          :page-sizes="[20, 60, 100, 200]"
          layout=" total, sizes, prev,  pager,next"
          :total="pageConfig.allCount"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
