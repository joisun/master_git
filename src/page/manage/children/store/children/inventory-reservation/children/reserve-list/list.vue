<script>
import WriteOffModal from '@/page/manage/children/store/children/inventory-reservation/children/reserve-list/components/write-off-modal'
import {
  STATUS_EMUN,
  STATUS_EMUN_List,
  CONTROL_EMUN,
  SPEC_EMNU,
  MATERIAL_EMUN,
  NET_TYPE_EMUN,
  underwritingWillEmun
} from '@/page/manage/children/store/children/inventory-reservation/constants'
import { safeGet } from '@/global/function/safe-operations'
function createMessage(code) {
  const messageMap = {
    1: '确放该笔预定<strong>可以满足</strong>吗?',
    4: '确定<strong>释放</strong>该笔预定订单吗?',
    5: '确放该笔预定<strong>无法满足</strong>吗?'
  }
  return `
          <div>
            <p>${messageMap[code]}</p>
            <p>点击确定后，将有系统消息通知该销售</p>
          </div>

        `
}
export default {
  name: 'inventory-reservation-my-list',
  components: {
    WriteOffModal
  },
  data() {
    return {
      STATUS_EMUN,
      STATUS_EMUN_List,
      CONTROL_EMUN,
      SPEC_EMNU,
      MATERIAL_EMUN,
      NET_TYPE_EMUN,
      underwritingWillEmun,
      isLoading: false,
      page: {
        pageSize: 20,
        pageIndex: 1,
        total: 0
      },
      tableData: [],
      searchForm: {
        status: ''
      }
    }
  },
  computed: {
    recordId() {
      return this.$route.query.id || ''
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    strMap(str, mapper) {
      if (!str || !str.split) return []
      const arr = str.split(',')
      return arr.map((item) => mapper[item]).join(' , ')
    },
    onSearch() {
      this.page.pageIndex = 1
      this.getData()
    },
    handleWriteOff(row) {
      this.$refs.writeOffModal.open(row)
    },
    handleTableAction(row, status) {
      this.$confirm(createMessage(status), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      })
        .then(async () => {
          const res = await this.jaxLib.store.reserveUpdateStatus({
            status,
            id: row.id
          })
          if (safeGet(res, 'success', false)) {
            this.$message.success('操作成功')
            this.getData()
          }
        })
        .catch(() => {})
    },
    changeSize(val) {
      this.page.pageSize = val
      this.getData()
    },
    changPage(val) {
      this.page.pageIndex = val
      this.getData()
    },
    goBack() {
      this.$router.go(-1)
    },
    async getData() {
      let rst = await this.jaxLib.store.getMyReserve({
        status: this.searchForm.status,
        currentPage: this.page.pageIndex,
        pageSize: this.page.pageSize
      })
      if (!rst.success) return false
      this.tableData = rst.data.list
      this.page.total = rst.data.page.allCount
    }
  }
}
</script>

<template>
  <div class="store-record-inner">
    <write-off-modal ref="writeOffModal" @confirm="getData" />
    <div class="wh__header" style="display: flex; justify-content: space-between">
      <h2 class="wh-title">我的预定</h2>
      <el-tooltip content="返回" placement="left" effect="dark">
        <wh-std-icon
          sign="xe6aa"
          @click="goBack"
          style="font-size: 30px; cursor: pointer"
        ></wh-std-icon>
      </el-tooltip>
    </div>
    <div class="wh__tools--mix">
      <el-select
        v-model="searchForm.status"
        placeholder="状态"
        style="width: 300px"
        clearable
        @change="onSearch"
      >
        <el-option
          v-for="item in STATUS_EMUN_List"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" @click="onSearch">查询</el-button>
    </div>
    <div v-loading="isLoading" class="wh__body">
      <el-table :data="tableData" class="wh__body--table" height="calc(100vh - 260px)">
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-form label-position="left" inline class="my-reserve-table-expand">
              <el-form-item label="网络类型">
                <span>{{ NET_TYPE_EMUN[row.netType] }}</span>
              </el-form-item>
              <el-form-item label="材质">
                <span>{{ strMap(row.material, MATERIAL_EMUN) }}</span>
              </el-form-item>
              <el-form-item label="规格">
                <span>{{ strMap(row.specification, SPEC_EMNU) }}</span>
              </el-form-item>
              <el-form-item label="预定数量">
                <span>{{ row.reserveNum }}</span>
              </el-form-item>
              <el-form-item label="客户套餐">
                <span>{{ row.customerPackage }}</span>
              </el-form-item>
              <el-form-item label="售卖价格">
                <span>{{ row.salePrice }}</span>
              </el-form-item>
              <el-form-item label="合规">
                <span>{{ strMap(row.control, CONTROL_EMUN) }}</span>
              </el-form-item>
              <el-form-item label="包销">
                <span>{{ strMap(row.underwritingWill, underwritingWillEmun) }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="预定编号">
          <template #default="{ row }">
            {{ row.id }}
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="预定人">
          <template #default="{ row }">
            {{ row.realName }}
          </template>
        </el-table-column>
        <el-table-column prop="gmtCreated" label="预定时间" width="140px">
          <template #default="{ row }">
            {{ row.gmtCreated | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="successCount" label="运营商">
          <template #default="{ row }">
            {{ row.carrier | carrierFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="successCount" label="所属运营商" width="140px">
          <template #default="{ row }">
            {{ row.carrierAccountName }}
          </template>
        </el-table-column>
        <el-table-column prop="arrivalTime" label="到货时间" width="140px">
          <template #default="{ row }">
            {{ row.arrivalTime | dateFilter('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            {{ STATUS_EMUN[row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="gmtModified" label="最后一次操作时间" width="140px">
          <template #default="{ row }">
            {{ row.gmtModified | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="failCount" label="操作" width="340" fixed="right" align="right">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.status === 0"
              size="mini"
              type="primary"
              @click="handleTableAction(row, 1)"
              >需求满足</el-button
            >
            <el-button
              v-if="[1, 2].includes(row.status)"
              size="mini"
              type="primary"
              @click="handleWriteOff(row)"
              >核销</el-button
            >
            <el-button
              v-if="[1, 2].includes(row.status)"
              size="mini"
              type="primary"
              @click="handleTableAction(row, 4)"
              >释放</el-button
            >
            <el-button
              v-if="row.status === 0"
              size="mini"
              type="primary"
              @click="handleTableAction(row, 5)"
              >无法满足</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 30, 50, 100, 200]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @size-change="changeSize"
          @current-change="changPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<style scoped>
.my-reserve-table-expand {
  font-size: 0;
}
.my-reserve-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.my-reserve-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
