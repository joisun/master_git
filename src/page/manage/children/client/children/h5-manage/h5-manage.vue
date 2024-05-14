<script>
import H5ConfigDialog from '@/page/manage/children/client/components/h5-config-dialog'
export default {
  components: {
    H5ConfigDialog
  },
  data() {
    return {
      search: {
        orgId: '',
        htmlKey: ''
      },
      list: [],
      isLoading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    formatRel(row) {
      if (!row.rel) return '否'
      return Object.keys(row.rel)
        .map((key) => `${row.rel[key]}(${key})`)
        .join()
    },
    handleEdit(row) {
      this.$refs.h5ConfigDialog.open(row)
    },
    // 加载数据
    async getData() {
      this.isLoading = true
      const { orgId, htmlKey } = this.search
      const rst = await this.jaxLib.customer.h5Manage.getList({
        orgId,
        htmlKey
      })
      this.isLoading = false
      if (!rst.success) {
        return false
      }
      this.list = rst.data
    }
  }
}
</script>

<template>
  <div class="audit">
    <h5-config-dialog ref="h5ConfigDialog" @confirm="getData" />
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh-title">H5管理</h2>
      </div>
      <div class="wh__tools">
        <div class="wh__tools--search">
          <el-input
            v-model.trim="search.htmlKey"
            placeholder="请输入链接"
            clearable
            style="width: 220px"
            @keyup.native.enter="getData"
          />
          <el-input
            v-model.trim="search.orgId"
            placeholder="请输入组织ID"
            clearable
            style="width: 220px"
            @keyup.native.enter="getData"
          >
            <el-button slot="append" icon="el-icon-search" @click="getData" />
          </el-input>
        </div>
      </div>
      <div class="wh__body">
        <div class="wh__body--table audit__table">
          <el-table v-loading="isLoading" :data="list" height="calc(100vh - 220px)">
            <el-table-column label="申请客户">
              <template slot-scope="scope">
                <span>{{ scope.row.orgId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否共用H5" width="350">
              <template #default="{ row }">
                {{ row.htmlCommon ? formatRel(row) : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="是否需要续费">
              <template>否</template>
            </el-table-column>
            <el-table-column label="收费方式">
              <template>SIMBOSS收钱，然后返佣给客户</template>
            </el-table-column>
            <el-table-column label="申请时间" min-width="120">
              <template slot-scope="scope">
                {{ scope.row.gmtCreated | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column label="链接">
              <template #default="{ row }">
                {{ row.htmlUrl }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button size="small" @click="handleEdit(row)">修改配置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
