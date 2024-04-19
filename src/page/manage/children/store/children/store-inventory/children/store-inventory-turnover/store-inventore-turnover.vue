<script>
  import dateFormat from '@/global/filters/date-format'
  import Download from '@/page/components/wh-download/wh-download'

  export default {
    name: 'store-inventory-turnover',
    data() {
      return {
        loading: '',
        tableData: []
      }
    },
    computed: {
      showSearchValue() {
        let query = this.$route.query
        let carrier = this.enums.carrier.get(query.carrier)
        let material = this.enums.materialType.get(query.material)
        let specification = this.enums.specificationType.get(query.specification)
        let carrierAccountId = query.carrierAccountId
        let carrierAccountName = query.carrierAccountName
        let type = this.enums.ratePlanType.get(query.type)
        return {
          ...query,
          type,
          carrier,
          material,
          specification,
          carrierAccountId,
          carrierAccountName
        }
      }
    },
    methods: {
      async getList() {
        this.loading = true
        let rst = await this.jaxLib.store.detail({ ...this.$route.query })
        this.loading = false
        if (!rst.success) {
          return false
        }
        this.tableData = rst.data.list
      },
      onCancelBtnClick() {
        this.$router.go(-1)
      },
      async downStore(val, flag) {
        const { carrier, carrierAccountId, packageName, material, specification, type } = this.$route.query
        let postData = {
          carrier,
          carrierAccountId,
          packageName,
          material,
          specification,
          type,
          batchNo: val.batchNo,
          activationDeadline: dateFormat(val.activationDeadline),
          relatedTag: val.relatedTag,
          relatedCategory: val.relatedCategory,
          status: flag ? null : 'inventory'
        }
        const { success, data } = await this.jaxLib.store.exportDetail(postData)
        if (!success) return false
        await Download({ ...data })
      }
    },
    mounted() {
      this.getList()
    },
    activated() {
      this.getList()
    }
  }
</script>

<template>
  <div class="turnover">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">库存管理</h2>
        <span class="float-right ">
          <el-tooltip content="返回商品列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="onCancelBtnClick" class="font28">
            </wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="wh__tools--mix">
        <div>
          <el-tag>运营商：{{showSearchValue.carrier}}</el-tag>
          <el-tag>供应商账号：{{`${showSearchValue.carrierAccountName}(${showSearchValue.carrierAccountId})`}}</el-tag>
          <el-tag>套餐档位：{{showSearchValue.packageName}}</el-tag>
          <el-tag>类型：{{showSearchValue.type}}</el-tag>
          <el-tag>材质：{{showSearchValue.material}}</el-tag>
          <el-tag>规格：{{showSearchValue.specification}}</el-tag>
        </div>
      </div>
      <div class="wh__body">
        <div class="wh__body--table" v-loading="loading">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="calc(100vh - 260px)"
            v-loading="loading">
            <el-table-column
              label="批次号"
              prop="batchNo"
              min-height="100">
            </el-table-column>
            <el-table-column
              label="入库总量"
              prop="importCount"
              min-height="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="downStore(scope.row, true)">{{scope.row.importCount}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="当前库存数量"
              prop="inventoryCount"
              min-height="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="downStore(scope.row, false)">{{scope.row.inventoryCount}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="测试期"
              prop="supportTesting"
              min-height="100">
              <template slot-scope="scope">
                <span>{{scope.row.supportTesting ? '是':'否'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="是否VPDN卡"
              prop="vpdnCard"
              min-height="100">
              <template slot-scope="scope">
                {{scope.row.vpdnCard ? '是':'否'}}
              </template>
            </el-table-column>
            <el-table-column
              label="激活宽限期"
              prop="stock"
              min-width="120">
              <template slot-scope="scope">
                {{scope.row.activationDeadline | dateFilter}}
              </template>
            </el-table-column>
            <el-table-column
              label="特殊限制"
              prop="tagDesc"
              min-width="180">
              <template slot-scope="scope">
                <el-tooltip
                  popper-class="turnover__tooltip-popper" effect="dark" :content="scope.row.tagDesc"
                  placement="bottom">
                  <span class="inner__cell--long text-ellipsis" style="display: block;">
                    {{ scope.row.tagDesc }}
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="关联"
              prop="stock"
              min-width="180">
              <template slot-scope="scope">
                <el-tooltip
                  popper-class="turnover__tooltip-popper" effect="dark" :content="scope.row.refCategoryDesc"
                  placement="bottom">
                  <span class="inner__cell--long text-ellipsis" style="display: block;">
                    {{ scope.row.refCategoryDesc }}
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
