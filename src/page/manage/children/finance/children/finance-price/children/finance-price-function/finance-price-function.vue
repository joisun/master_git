<template>
  <div class="plan-manager-list">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-select
          v-model="search.generationArr"
          placeholder="请选择网络制式"
          style="width: 140px"
          clearable
          multiple
          collapse-tags
          @change="changeType"
        >
          <el-option
            v-for="option in options.generation"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-select
          v-model="search.cardFunctionArr"
          placeholder="请选择卡功能"
          style="width: 150px"
          clearable
          multiple
          collapse-tags
          @change="changeType"
        >
          <el-option
            v-for="option in options.cardFunction"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-select
          v-model="search.specialRestrictionArr"
          placeholder="请选择特殊限制"
          style="width: 200px"
          clearable
          collapse-tags
          multiple
          @change="changeType"
        >
          <el-option
            v-for="option in options.specialRestriction"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-select
          v-model="search.carrierSpecialRestriction"
          placeholder="请选择运营商特殊限制"
          style="width: 180px"
          clearable
          collapse-tags
          multiple
          @change="changeType"
        >
          <el-option
            v-for="option in options.carrierSpecialRestriction"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-input
          v-model="search.id"
          style="width: 150px"
          placeholder="请输入卡功能分类ID"
          @change="changeType"
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
    <div class="wh__body" v-loading="loading">
      <div class="wh__body--table">
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          height="calc(100vh - 220px)"
        >
          <el-table-column prop="id" label="ID" :min-width="40" />
          <el-table-column prop="name" label="分类名称" :min-width="100" />
          <el-table-column label="网络制式" :min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.generation">
                <el-tag
                  class="table-cell-tag"
                  v-for="(item, index) in scope.row.generation.split(',').sort()"
                  type="info"
                  :key="index"
                  >{{ item }}</el-tag
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column label="卡功能" :min-width="120">
            <template slot-scope="scope">
              <el-tag
                class="table-cell-tag"
                v-for="(item, index) in mapKeyToArray(
                  scope.row,
                  options.cardFunction
                )"
                type="info"
                :key="index"
                >{{ item }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="特殊限制" :min-width="120">
            <template slot-scope="scope">
              <el-tag
                class="table-cell-tag"
                v-for="(item, index) in mapKeyToArray(
                  scope.row,
                  options.specialRestriction
                )"
                type="info"
                :key="index"
                >{{ item }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="运营商特殊限制" :min-width="120">
            <template slot-scope="scope">
              <el-tag
                class="table-cell-tag"
                v-for="(item, index) in mapKeyToArray(
                  scope.row,
                  options.carrierSpecialRestriction
                )"
                type="info"
                :key="index"
                >{{ item }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
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
    <dialog-add-edit-function
      :data="dialogAddEditFunction.data"
      :visible.sync="dialogAddEditFunction.visible"
      @refreshList="onRefreshList"
    />
  </div>
</template>

<script type="text/jsx">
  import DialogAddEditFunction from './components/DialogAddEditFunction.vue'
  import Download from '@/page/components/wh-download/wh-download'
  import cardFunctionOptions from '@/constant/options/cardFunction'
  import filterQueryParams from '@/global/function/filterQueryParams'

  export default {
    data() {
      return {
        loading: true,
        tableData: [],
        search: {},
        dialogAddEditFunction: {
          data: {
            generation: []
          },
          visible: false
        },
        options: cardFunctionOptions
      }
    },
    methods: {
      // 列表样式
      tableRowClassName({ row }) {
        if (row.status === 'off') return 'table__extra--color'
      },
      // 拉取列表
      async getList(params = {}) {
        this.loading = true
        let rst = await this.jaxLib.financial.function.getFunctionList(params)
        this.loading = false
        if (!rst.success) {
          this.$message.error('获取卡功能分类列表失败')
          return false
        }
        this.tableData = rst.data
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
      },
      mapKeyToArray(row, map) {
        const arr = []
        map.forEach((item) => {
          if (row[item.value]) {
            arr.push(item.label)
          }
        })
        return arr
      },
      // 切换类型
      changeType() {
        const params = {}
        if (this.search.generationArr.length) {
          params.generation = this.search.generationArr.join(',')
        }
        if (this.search.cardFunctionArr.length) {
          cardFunctionOptions.cardFunction.forEach((option) => {
            if (option.value === 'smsType') {
              params.sms = true
            } else {
              if (this.search.cardFunctionArr.includes(option.value)) {
                params[option.value] = true
              }
            }
          })
        }
        if (this.search.specialRestrictionArr.length) {
          cardFunctionOptions.specialRestriction.forEach((option) => {
            if (this.search.specialRestrictionArr.includes(option.value)) {
              params[option.value] = true
            }
          })
        }
        if (this.search.carrierSpecialRestriction.length) {
          cardFunctionOptions.carrierSpecialRestriction.forEach((option) => {
            if (this.search.carrierSpecialRestriction.includes(option.value)) {
              params[option.value] = true
            }
          })
        }
        params.id = this.search.id
        this.getList(filterQueryParams(params))
      },
      // 新增按钮点击回调
      onAddClick() {
        this.dialogAddEditFunction.visible = true
        this.dialogAddEditFunction.data = {}
      },
      // 修改按钮点击回调
      handleEdit(row) {
        this.dialogAddEditFunction.visible = true
        this.dialogAddEditFunction.data = Object.assign({}, row)
      },
      handleDelete(val) {
        this.$confirm(`确定删除该套餐规格吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.jaxLib.financial.function.deleteFunction({
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
        const {
          data,
          success
        } = await this.jaxLib.financial.function.exportData()
        if (!success) return false
        await Download({ ...data })
      }
    },
    mounted() {
      this.getList()
    },
    created() {
      this.resetSearchParams()
    },
    components: {
      DialogAddEditFunction
    }
  }
</script>