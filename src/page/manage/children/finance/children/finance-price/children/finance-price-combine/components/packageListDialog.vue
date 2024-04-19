<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="90%"
    :title="title"
    @close="cancel"
  >
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <wh-volume-input-select v-model="search.volume" @change="getList" />
        <wh-validity-select
          v-model="search.validity"
          :volume-list="volumeList"
          :volume-and-unit="volumeAndUnit"
          @change="changeType"
        />
        <el-select
          v-model="search.offerType"
          placeholder="请选择类型"
          style="width: 140px"
          clearable
          @change="changeType"
        >
          <el-option
            v-for="(key, val) in enums.planType.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
        <wh-classification-select
          v-model="search.categoryId"
          :show-disabled="false"
          :carrier="search.carrier"
          @change="changeType"
        >
        </wh-classification-select>
        <el-input
          v-model="search.id"
          style="width: 120px"
          placeholder="请输入套餐ID"
          @keyup.enter.native="changeType"
        >
        </el-input>
      </div>
    </div>

    <el-table
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      lazy
      :row-key="(item) => item.rowKey || item.id"
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        v-for="(item, index) in PRICE_COLUMNS"
        v-if="item.key !== 'categoryId'"
        :key="index"
        :formatter="item.formatter"
        :prop="item.key"
        :label="item.name"
        :min-width="item.width"
        :class-name="item.className"
      >
      </el-table-column>
      <el-table-column
        v-else
        :label="item.name"
        :min-width="item.width"
        :class-name="item.className"
      >
        <template slot-scope="scope">
          <price-class-panel :id="scope.row.categoryId" :key="scope.row.categoryId">
            <span>{{ scope.row.categoryId | classificationFilter }}</span>
          </price-class-panel>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.pageIndex"
      :page-size="page.pageSize"
      :page-sizes="[20, 40, 60, 100, 200, 500]"
      :total="page.total"
      layout="sizes, pager, total"
      @size-change="handleSizeChange"
      @current-change="changeIndex"
    >
    </el-pagination>
    <div slot="footer">
      <el-button v-loading="sureLoading" type="primary" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import cardFunctionOptions from '@/constant/options/cardFunction'
import { safeGet } from '@/global/function/safe-operations'
import {
  PRICE_COLUMNS,
  PRICE_SET_COLUMNS
} from '@/page/manage/children/finance/children/finance-price/children/finance-price-list/mixins/const'
import priceClassPanel from '@/page/components/panel/price-class-info-panel'
import whClassificationSelect from '@/page/components/wh-classification-select'
import whValiditySelect from '@/page/components/wh-validity-select'
import whVolumeInputSelect from '@/page/components/wh-volume-input-select'

export default {
  components: {
    'price-class-panel': priceClassPanel,
    'wh-classification-select': whClassificationSelect,
    whValiditySelect,
    whVolumeInputSelect
  },
  data() {
    return {
      PRICE_COLUMNS,
      PRICE_SET_COLUMNS,
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      search: {
        carrier: '',
        offerType: undefined,
        categoryId: '',
        id: '',
        volume: undefined,
        validity: undefined
      },
      visible: false,
      sureLoading: false,
      options: cardFunctionOptions,
      content: {},
      tableData: [],
      volumeAndUnit: '',
      volumeList: [],
      currentRow: null
    }
  },
  computed: {
    isAdd() {
      return !safeGet(this.content, 'id', undefined)
    },
    title() {
      return this.isAdd ? '新增' : '编辑'
    }
  },
  methods: {
    changeType() {
      this.page.pageIndex = 1
      this.getList()
    },
    async load(tree, treeNode, resolve) {
      this.loading = true
      let res = await this.jaxLib.financial.plan.get({ id: tree.id })
      if (!res.success) return false
      resolve(res.data)
    },
    // 切换页码
    changeIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    handleCurrentChange(row) {
      console.log('🎸 DEBUG_116 packageListDialog.vue 👉', row)
      this.currentRow = row
    },
    open({ carrier }) {
      this.search.carrier = carrier
      this.visible = true
      this.getList()
    },
    async getList() {
      this.loading = true
      let obj = {
        currentPage: this.page.pageIndex,
        rowsPerPage: this.page.pageSize,
        carrier: this.search.carrier,
        offerType: this.search.offerType,
        categoryId: this.search.categoryId,
        id: this.search.id,
        validity: this.search.validity
      }
      if (this.search.volume) {
        const pattern = /([0-9]+)(C|MB)/
        console.log(this.search.volume)
        const rst = pattern.exec(this.search.volume)
        const volume = parseFloat(rst[1])
        const unit = rst[2]
        obj.minVolume = volume
        obj.maxVolume = volume
        obj.useCountAsVolume = unit === 'C'
      }
      let rst = await this.jaxLib.financial.plan.getAll(obj)
      this.loading = false
      if (!rst.success) {
        this.$message.error('获取报价失败')
        return false
      }
      this.page.total = rst.data.page.allCount
      this.tableData = rst.data.list.map((item) => {
        item.status = item.status === 'on'
        item.hasChildren = true
        item.rowKey = `l1-${item.id}`
        return item
      })
    },
    async onSubmit() {
      this.$emit('confirm', {
        carrier: this.search.carrier,
        ...this.currentRow
      })
      this.visible = false
    },
    cancel() {
      this.visible = false
    }
  }
}
</script>
