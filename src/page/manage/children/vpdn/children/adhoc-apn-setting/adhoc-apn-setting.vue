<script>
import EditDialog from './components/edit-dialog'
import { safeGet } from '@/global/function/safe-operations'
import filterQueryParams from '@/global/function/filterQueryParams'
import vpdnApnFormat from '@/global/filters/vpdn-apn-format'

export default {
  name: 'adhoc-apn-setting',
  components: {
    EditDialog
  },
  data() {
    return {
      vpdnApnFormat,
      searchForm: {},
      id: 0,
      isLoading: true,
      tableData: [{ id: 1 }]
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async handleEnableChange(row) {
      let res = await this.jaxLib.vpdn.apn.enable({
        enable: row.enable,
        id: row.id
      })
      if (safeGet(res, 'success', false)) {
        this.$message.success('操作成功')
        await this.getTableData()
      }
    },
    async getTableData() {
      this.isLoading = true
      let res = await this.jaxLib.vpdn.apn.getList(filterQueryParams({ ...this.searchForm }))
      this.isLoading = false
      if (!res.success) return false
      this.tableData = res.data
    },
    handleEditConfirm() {
      this.getTableData()
    },
    openDialog(row) {
      this.$refs.editDialog.open(row)
    }
  }
}
</script>

<template>
  <div class="routing-rules wh__warp">
    <div class="wh__header">
      <h2 class="wh-title">APN设置</h2>
    </div>
    <div class="wh__tools--mix">
      <el-select
        v-model="searchForm.carrier"
        clearable
        placeholder="运营商"
        class="card-manage__search--select"
        @change="getTableData"
      >
        <el-option
          v-for="(key, val) in enums.carrier.maps()"
          :key="val"
          :label="key"
          :value="val"
        />
      </el-select>
      <el-input
        v-model.trim="searchForm.carrierName"
        placeholder="运营商名称"
        class="card-manage__search--input-lg"
        @change="getTableData"
      />
      <el-input
        v-model.trim="searchForm.apn"
        placeholder="APN名称"
        class="card-manage__search--input-lg"
        @change="getTableData"
      />
      <el-select
        v-model="searchForm.type"
        clearable
        placeholder="APN类型"
        style="width: 200px"
        @change="getTableData"
      >
        <el-option
          v-for="(_, val) in enums.vpdnApnType.maps()"
          :key="val"
          :label="`${val} （${vpdnApnFormat(val)}）`"
          :value="val"
        />
      </el-select>
      <el-select
        v-model="searchForm.enable"
        clearable
        placeholder="是否可开卡"
        class="card-manage__search--select"
        style="width: 120px"
        @change="getTableData"
      >
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
      <el-button icon="el-icon-search" @click="getTableData()" />
      <el-button class="float-right" type="primary" @click="openDialog()"> 新增 </el-button>
    </div>
    <div class="wh__body">
      <el-table v-loading="isLoading" :data="tableData" height="calc(100vh - 200px)">
        <el-table-column label="运营商" prop="carrier" width="90px">
          <template #default="{ row }">
            {{ row.carrier | carrierFilter }}
          </template>
        </el-table-column>
        <el-table-column label="运营商名称" prop="carrierName" />
        <el-table-column label="APN名称" prop="apn" />
        <el-table-column label="APN类型" width="200px">
          <template #default="{ row }">{{ row.type }} （{{ row.type | vpdnApnFormat }}）</template>
        </el-table-column>
        <el-table-column label="配置服务" width="200px">
          <template #default="{ row}">
            {{row.services ? row.services[0] : '' | vpdnTagFilter }}
          </template>
        </el-table-column>
        <el-table-column label="上架状态" width="100px" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.enable" @change="handleEnableChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作" width="80px">
          <template #default="{ row }">
            <el-button type="primary" @click="openDialog(row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-dialog ref="editDialog" @confirm="handleEditConfirm" />
  </div>
</template>
