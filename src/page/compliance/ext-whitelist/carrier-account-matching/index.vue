<script>
import AddForm from './components/add-form'
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select'
import Download from '@/page/components/wh-download/wh-download'
import filterQueryParams from '@/global/function/filterQueryParams'
import { safeGet } from '@/global/function/safe-operations'
export default {
  components: {
    AddForm,
    'wh-carrier-account-select': whCarrierAccountSelect
  },
  data() {
    return {
      loading: false,
      tableData: [],
      typeOptions: {
        chinanet: {},
        cmcc: {},
        unicom: {}
      },
      search: {
        carrierName: '',
        oldCarrierAccountId: '',
        newCarrierAccountId: ''
      }
    }
  },
  created() {
    this.getTypes()
    this.getList()
  },
  methods: {
    getParams() {
      const { carrierName, oldCarrierAccountId, newCarrierAccountId } = this.search
      return filterQueryParams({
        carrierName,
        oldCarrierAccountId,
        newCarrierAccountId
      })
    },
    async getList() {
      this.loading = true
      const { success, data } = await this.jaxLib.whitelist.accountMatchList(this.getParams())
      this.loading = false
      if (!success) return false
      this.tableData = data
    },

    handleEdit(row) {
      this.$refs.addForm.open(row)
    },
    handleAdd() {
      this.$refs.addForm.open()
    },
    async handleExport() {
      const { success, data } = await this.jaxLib.whitelist.accountMatchExportList(this.getParams())
      if (!success) return false
      await Download({ ...data })
    },
    async getTypes() {
      const res = await this.jaxLib.whitelist.accountMatchGetTypeMap()
      if (safeGet(res, 'success', false)) {
        this.typeOptions = res.data
      }
    },
    onCarrierChange() {
      this.search = {
        ...this.search,
        oldCarrierAccountId: '',
        newCarrierAccountId: ''
      }
      this.getList()
    }
  }
}
</script>
<template>
  <div class="wh__warp">
    <add-form ref="addForm" @confirm="getList()" />
    <div class="wh__header">
      <h2 class="wh-title">卡类型变更运营商账号匹配</h2>
    </div>
    <div class="ext-whitelist-carrier-config">
      <div v-loading="loading" class="wh__body">
        <div class="wh__tools">
          <div class="wh__tools--mix">
            <el-select
              v-model="search.carrierName"
              clearable
              placeholder="运营商"
              class="card-manage__search--select"
              @change="onCarrierChange"
            >
              <el-option
                v-for="(key, val) in enums.carrier.maps()"
                :key="val"
                :label="key"
                :value="val"
              >
              </el-option>
            </el-select>
            <wh-carrier-account-select
              v-model="search.oldCarrierAccountId"
              style="width: 300px"
              placeholder="变更前运营商账号"
              :carrier="search.carrierName"
              @change="getList"
            />

            <wh-carrier-account-select
              v-model="search.newCarrierAccountId"
              style="width: 300px"
              placeholder="变更后运营商账号"
              :carrier="search.carrierName"
              @change="getList"
            />
            <el-button style="float: right" type="primary" icon="el-icon-plus" @click="handleAdd"
              >新 增</el-button
            >
            <el-button
              style="float: right; margin-right: 8px"
              icon="el-icon-download"
              @click="handleExport"
              >常规导出</el-button
            >
          </div>
        </div>
        <div class="wh__body--table">
          <el-table :data="tableData">
            <el-table-column label="运营商" prop="carrier">
              <template #default="{ row }">
                {{ row.carrier | carrierFilter }}
              </template>
            </el-table-column>
            <el-table-column label="变更类型" prop="type" align="center" width="120px">
              <template #default="{ row }">
                {{ typeOptions[row.carrier][row.type] }}
              </template>
            </el-table-column>
            <el-table-column label="变更前运营商账号(ID)" prop="" align="center">
              <template #default="{ row }">
                {{ row.oldCarrierAccountName }}({{ row.oldCarrierAccountId }})
              </template>
            </el-table-column>
            <el-table-column label="变更后运营商账号(ID)" prop="" align="center">
              <template #default="{ row }">
                {{ row.newCarrierAccountName }}({{ row.newCarrierAccountId }})
              </template>
            </el-table-column>
            <el-table-column label="最后编辑时间" prop="editDate" align="center">
              <template #default="{ row }">
                {{ row.gmtModified | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" align="center">
              <template #default="{ row }">
                {{ row.remark }}
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="action" width="100px">
              <template #default="{ row }">
                <el-button size="mini" type="primary" @click="handleEdit(row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
