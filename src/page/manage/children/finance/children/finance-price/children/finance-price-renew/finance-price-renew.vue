<template>
  <div class="plan-manager-list">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-select
          v-model="search.carrier"
          placeholder="请选择运营商"
          style="width: 130px"
          clearable
          @change="changeType"
        >
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          />
        </el-select>
        <el-select
          v-model="search.vpdnOnly"
          placeholder="请选择网络属性"
          style="width: 140px"
          clearable
          @change="changeType"
        >
          <el-option
            v-for="option in options.networkAttribute"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-select
          v-model="search.type"
          placeholder="请选择套餐属性"
          style="width: 140px"
          clearable
          @change="changeType"
        >
          <el-option
            v-for="option in options.packageAttribute"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-select
          v-if="search.carrier"
          v-model="search.platform"
          placeholder="请选择所属平台"
          style="width: 130px"
          clearable
          @change="changeType"
        >
          <el-option
            v-for="option in this.enums.platformTypes.get(search.carrier)
              .platforms"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>
        <el-select
          v-model="search.renewRestriction"
          placeholder="请选择续费限制"
          style="width: 220px"
          clearable
          collapse-tags
          multiple
          @change="changeType"
        >
          <el-option
            v-for="option in options.renewRestriction"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-input
          v-model="search.id"
          style="width: 155px"
          placeholder="请输入续费分类ID"
          @change="changeType"
          :clearable="true"
        >
        </el-input>
        <div class="float-right">
          <el-button
            class="float-right wh__tools--mix-btn"
            size="mini"
            @click="onExportClick"
            >导出</el-button
          >
          <el-button
            type="primary"
            class="float-right"
            size="mini"
            @click="onAddClick"
            >新增</el-button
          >
        </div>
      </div>
    </div>
    <div class="wh__body">
      <div class="wh__body--table">
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          height="calc(100vh - 220px)"
        >
          <template v-for="(item, index) in TABLE_COLUMES">
            <el-table-column
              :key="index"
              :formatter="item.formatter"
              :prop="item.key"
              :label="item.name"
              :min-width="item.width"
              :class-name="item.className"
              v-if="item.key !== 'renewRestriction'"
            >
            </el-table-column>
            <el-table-column v-if="item.key === 'renewRestriction'" :class-name="item.className" :key="index" :label="item.name"  :min-width="item.width">
              <template slot-scope="scope">
                <el-tag class="table-cell-tag" type="info" v-for="restriction in scope.row.renewRestriction" :key="restriction">
                  {{options.renewRestrictionObj[restriction]}}
                </el-tag>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button size="mini" @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <dialog-add-edit-renew
      :visible.sync="dialogAddEditRenew.visible"
      @refreshList="onRefreshList"
      :data="dialogAddEditRenew.data"
    />
  </div>
</template>

<script type="text/jsx">
  import DialogAddEditRenew from './components/DialogAddEditRenew.vue'
  import Download from '@/page/components/wh-download/wh-download'
  import { TABLE_COLUMES } from './mixins/const'
  import renewOptions from '@/constant/options/renew'
  import { mapActions, mapState } from 'vuex'
  import filterQueryParams from '@/global/function/filterQueryParams'

  export default {
    data() {
      return {
        TABLE_COLUMES,
        loading: true,
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        },
        search: {
          carrier: '',
          id: '',
          vpdnOnly: undefined,
          type: '',
          platform: '',
          renewRestriction: []
        },
        dialogAddEditRenew: {
          visible: false,
          data: {},
        },
        options: renewOptions
      }
    },
    computed: {
      ...mapState({
        tableData: (state) => state.planRenew.planRenewClassificationList
      })
    },
    methods: {
      ...mapActions(['getPlanRenewClassificationList', 'deleteRenew']),
      // 列表样式
      tableRowClassName({ row }) {
        if (row.status === 'off') return 'table__extra--color'
      },
      // 拉取列表
      async getList(params = {}) {
        this.loading = true
        let rst = await this.getPlanRenewClassificationList(params)
        this.loading = false
      },
      onRefreshList() {
        this.resetSearchParams()
        this.getList()
      },
      resetSearchParams() {
        this.search = Object.assign({}, this.search, {
          id: '',
          carrierSpecialRestriction: [],
          generationArr: [],
          cardFunctionArr: [],
          specialRestrictionArr: []
        })
        this.params = {}
      },
      // 切换类型
      changeType(type) {
        let params = {
          carrier: this.search.carrier,
          id: this.search.id,
          vpdnOnly: this.search.vpdnOnly,
          type: this.search.type,
          platform: this.search.platform
        }
        if (this.search.renewRestriction.length) {
          params = {
            ...params,
            allowAppendPackage: this.search.renewRestriction.includes(
              'ALLOW_APPEND_PACKAGE'
            )
              ? true
              : undefined,
            allowAppendPoolPackage: this.search.renewRestriction.includes(
              'ALLOW_APPEND_POOL_PACKAGE'
            )
              ? true
              : undefined,
            allowExtendPeriod: this.search.renewRestriction.includes(
              'ALLOW_EXTEND_PERIOD'
            )
              ? true
              : undefined,
            allowChangeRatePlan: this.search.renewRestriction.includes(
              'ALLOW_CHANGE_RATE_PLAN'
            )
              ? true
              : undefined,
            allowAutoRecharge: this.search.renewRestriction.includes(
              'ALLOW_AUTO_RECHARGE'
            )
              ? true
              : undefined,
            rechargeTimeLimit: this.search.renewRestriction.includes(
              'RECHARGE_TIME_LIMIT'
            )
              ? true
              : undefined
          }
        }
        this.getList(filterQueryParams(params))
      },
      // 新增按钮点击回调
      onAddClick() {
        this.dialogAddEditRenew.visible = true
        this.dialogAddEditRenew.data = {}
      },
      // 修改按钮点击回调
      handleEdit(row) {
        this.dialogAddEditRenew.visible = true
        this.dialogAddEditRenew.data = Object.assign({}, row)
      },
      handleDelete(val) {
        this.$confirm(`确定删除该套餐规格吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.deleteRenew({
            id: val.id
          })
          if (!res.success) return false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.resetSearchParams()
          this.getList()
        })
      },
      // 关闭弹窗
      closeDialog(idx, flag) {
        this.dialogVisible[idx] = false
        this.specsId = 0
        if (flag) this.getList()
      },
      // 数据导出回调
      async onExportClick() {
        const { data, success } = await this.jaxLib.financial.renew.exportData()
        if (!success) return false
        await Download({ ...data })
      }
    },
    created() {
      this.getList()
    },
    components: {
      DialogAddEditRenew
    }
  }
</script>
