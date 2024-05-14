<template>
  <div class="plan-manager-list">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-select
          v-model="search.carrier"
          placeholder="请选择运营商"
          style="width: 125px"
          clearable
          @change="changeType"
        >
          <el-option
            v-for="(key, val) in enums.carrier.maps()"
            :key="val"
            :label="key"
            :value="val"
          >
          </el-option>
        </el-select>
        <wh-volume-select
          v-model="volumeAndUnit"
          :volumeList="volumeList"
          @change="changeType"
          :carrier="search.carrier"
        />
        <wh-validity-select
          :showMonthly="true"
          v-model="search.validity"
          :volumeList="volumeList"
          :volumeAndUnit="volumeAndUnit"
          @change="changeType"
        />
        <el-input
          v-model="search.id"
          style="width: 140px"
          placeholder="请输入套餐规格ID"
          @change="changeType"
        >
        </el-input>
        <div class="float-right mb10">
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
            @click="onCreateClick"
            >新增</el-button
          >
        </div>
      </div>
    </div>
    <div class="wh__body" v-loading="loading">
      <div class="wh__body--table">
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          height="calc(100vh - 220px)"
        >
          <el-table-column
            v-for="(item, index) in PRICE_PACKAGE_COLUMES"
            :key="index"
            :formatter="item.formatter"
            :prop="item.key"
            :label="item.name"
            :min-width="item.width"
            :class-name="item.className"
          >
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleCheckPackage(scope.row)"
                >查看套餐</el-button
              >
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
    <specs-add-edit
      :data="specsData"
      :visible.sync="dialogVisible.displayEditorWin"
      @refresh="getList"
    />
  </div>
</template>

<script type="text/jsx">
  import specsAddEdit from './components/dialog-add-edit-specs.vue'
  import { PRICE_PACKAGE_COLUMES } from './mixins/const'
  import Download from '@/page/components/wh-download/wh-download'
  import filterQueryParams from '@/global/function/filterQueryParams'
  import whVolumeSelect from '@/page/components/wh-volume-select.vue'
  import whValiditySelect from '@/page/components/wh-validity-select.vue'
  import getVolumeAndUnitArr from '@/global/function/getVolumeAndUnitArr'

  export default {
    data() {
      return {
        PRICE_PACKAGE_COLUMES,
        loading: true,
        tableData: [],
        search: {},
        dialogVisible: {
          displayEditorWin: false
        },
        specsData: {},
        volumeAndUnit: '', // 筛选项：套餐规格
        volumeList: []
      }
    },
    methods: {
      // 列表样式
      tableRowClassName({ row }) {
        if (row.status === 'off') return 'table__extra--color'
      },
      // 拉取列表
      async getList() {
        this.loading = true
        const volumeAndUnitArr = this.volumeAndUnit.length
          ? getVolumeAndUnitArr(this.volumeAndUnit)
          : [undefined, undefined]
        this.search.volume = volumeAndUnitArr[0]
        this.search.volumeUnit = volumeAndUnitArr[1]
        let rst = await this.jaxLib.financial.volume.getVolumeList(
          filterQueryParams(this.search)
        )
        this.loading = false
        if (!rst.success) {
          this.$message.error('获取套餐规格列表失败')
          return false
        }
        this.tableData = rst.data
      },
      handleCheckPackage(row) {
        const query = {
          carrier: row.carrier,
          validity: row.validity,
          volume: row.volume,
          volumeUnit: row.volumeUnit === 'M' ? 'MB' : row.volumeUnit
        }
        if (query.volumeUnit !== 'C' && query.volume && query.volume % 1024 === 0) {
          query.volume /= 1024
          query.volumeUnit = 'GB'
        }
        this.$router.push({ name: 'finance-price-list', query })
      },
      // 切换类型
      changeType(v) {
        this.getList()
      },
      // 新增按钮点击回调
      onCreateClick() {
        this.dialogVisible.displayEditorWin = true
        this.specsData = {}
      },
      // 修改按钮点击回调
      handleEdit(row) {
        this.specsData = Object.assign({}, row)
        this.dialogVisible.displayEditorWin = true
      },
      handleDelete(val) {
        this.$confirm(`确定删除该套餐规格吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.jaxLib.financial.volume.delete({
            id: val.id
          })
          if (!res.success) return false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
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
        const { data, success } = await this.jaxLib.financial.volume.exportData()
        if (!success) return false
        await Download({ ...data })
      },
      async getVolumeOptions(carrier) {
        const params = {
          carrier
        }
        const rst = await this.jaxLib.financial.volume.getVolumeList(
          filterQueryParams(params)
        )
        this.volumeList = rst.data
      }
    },
    mounted() {
      this.getList()
    },
    created() {
      this.$store.dispatch('changeClassificationList')
      this.getVolumeOptions()
    },
    components: {
      'specs-add-edit': specsAddEdit,
      whVolumeSelect,
      whValiditySelect
    },
    watch: {
      'search.carrier'(carrier) {
        this.getVolumeOptions(carrier)
      }
    }
  }
</script>