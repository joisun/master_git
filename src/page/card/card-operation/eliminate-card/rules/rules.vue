<template>
  <div class="eliminate-card">
    <update ref="update" @confirm="getList" />
    <records ref="records" />
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">销卡规则</h2>
        <span class="level2__back">
          <el-tooltip content="返回一级组织列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="onCancelBtnClick"> </wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <el-card header="后续新购卡" shadow="none" style="margin: 40px 0 20px">
        <el-form ref="form" :model="formData" label-width="130px">
          <el-form-item label=""> 后期新购的卡，自动按此规则进行 </el-form-item>
          <el-form-item label="自动销卡规则">
            <el-radio-group v-model="formData.autoRule">
              <el-radio label="1">次月销卡</el-radio>
              <el-radio label="delay">
                延迟
                <el-input-number
                  v-model="formData.delayMonthLocal"
                  :disabled="formData.autoRule === '1'"
                  :min="2"
                  :max="12"
                  label=""
                />
                个月销卡
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card header="已购卡" shadow="none">
        <div class="wh__tools">
          <div class="wh__tools--mix">
            <el-input
              v-model="search.orderNo"
              placeholder="请输入订单编号"
              class="wh__tools--search-input"
              clearable
              @change="onSearch"
            />
            <el-button type="primary" @click="onSearch">搜索</el-button>

            <el-button
              class="float-right"
              type="primary"
              :disabled="selectedOrderNo.length <= 0"
              @click="batchAlert(selectedOrderNo)"
              >批量变更</el-button
            >
          </div>
        </div>
        <div v-loading="loading" class="wh__body">
          <div class="wh__body--table">
            <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" fixed></el-table-column>
              <el-table-column label="序号" width="50px" align="center">
                <template #default="{ $index }">{{ $index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="orderNo" label="订单编号" width="180" />
              <el-table-column prop="buyCount" label="卡数" />
              <el-table-column prop="delayMonth" label="当前规则">
                <template #default="{ row }">
                  {{ row.delayMonth === 1 ? '次月销卡' : `延迟 ${row.delayMonth}个月` }}
                </template>
              </el-table-column>
              <el-table-column prop="gmtCreated" label="添加时间">
                <template #default="{ row }">
                  {{ row.gmtCreated | dateFilter }}
                </template>
              </el-table-column>
              <el-table-column prop="gmtModified" label="最后变更时间">
                <template #default="{ row }">
                  {{ row.gmtModified | dateFilter }}
                </template>
              </el-table-column>
              <el-table-column prop="actions" label="操作" width="150px">
                <template #default="{ row }">
                  <el-button size="mini" type="primary" @click="singleAlert(row)">变更</el-button>
                  <el-button size="mini" @click="openRecord(row.orderNo)">记录</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="wh__body--page">
            <el-pagination
              :current-page="page.pageIndex"
              :page-size="page.pageSize"
              :total="page.total"
              layout="pager, total"
              @current-change="handlePageChange"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Update from './components/update.vue'
import Records from './components/records.vue'
import filterQueryParams from '@/global/function/filterQueryParams'
export default {
  components: {
    Update,
    Records
  },
  data() {
    return {
      selectedOrderNo: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        orderNo: ''
      },
      formData: {
        autoRule: '1',
        delayMonth: 1,
        delayMonthLocal: 2
      },
      tableData: []
    }
  },
  watch: {
    'formData.autoRule'(newValue) {
      if (newValue === '1') {
        this.formData.delayMonth = 1
        this.formData.delayMonthLocal = 2
      } else {
        this.formData.delayMonth = this.formData.delayMonthLocal
      }
    },
    'formData.delayMonth'(newValue) {
      if (newValue === 1) {
        this.formData.autoRule = '1'
      } else {
        this.formData.autoRule = 'delay'
        this.formData.delayMonthLocal = newValue
      }
    }
  },
  created() {
    this.getConfig()
    this.getList()
  },
  methods: {
    handlePageChange(val) {
      this.page.pageIndex = val
      this.getList()
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.jaxLib.card.eliminateRules.updateRetireConfig({
            orgId: this.$route.query.orgId,
            delayMonth: this.formData.autoRule === '1' ? 1 : this.formData.delayMonthLocal
          })
          this.loading = false
          if (res && res.success) {
            this.$message.success('保存成功')
            await this.getConfig()
          }
        }
      })
    },
    openRecord(orderNo) {
      this.$refs.records.open(orderNo)
    },
    async getConfig() {
      this.loading = true
      let res = await this.jaxLib.card.eliminateRules.getRetireConfig({
        orgId: this.$route.query.orgId
      })
      this.loading = false
      this.formData.delayMonth = res.data
    },
    async getList() {
      this.loading = true
      let rst = await this.jaxLib.card.eliminateRules.retireRuleList(
        filterQueryParams({
          currentPage: this.page.pageIndex,
          rowsPerPage: this.page.pageSize,
          orgId: this.$route.query.orgId,
          ...this.search
        })
      )
      this.loading = false
      if (!rst.success) return false
      this.tableData = rst.data.list
      this.page.total = rst.data.page.allCount
    },
    handleSelectionChange(val) {
      this.selectedOrderNo = []
      val.forEach((item) => {
        this.selectedOrderNo.push(item.orderNo)
      })
    },
    onCancelBtnClick() {
      this.$router.push({ name: 'client-list' })
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getList()
    },
    batchAlert(orderNo) {
      this.$refs.update.open({ orderNo })
    },
    singleAlert(row) {
      this.$refs.update.open({ orderNo: row.orderNo, delayMonth: row.delayMonth })
    }
  }
}
</script>
