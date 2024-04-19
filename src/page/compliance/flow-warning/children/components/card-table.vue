<template>
  <div class="whitelist-card-table">
    <el-table :data="tableData" width="100%">
      <el-table-column prop="iccid" label="ICCID" />
    </el-table>
    <el-pagination
      :current-page="page.currentPage"
      :page-size="page.rowsPerPage"
      :total="page.totalCount"
      @current-change="handlePageChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    page: {
      type: Object,
      require: true
    }
  },
  computed: {
    tableData() {
      return this.list.map((iccid) => ({ iccid }))
    }
  },
  methods: {
    handlePageChange(page) {
      this.$emit('change', page)
    }
  }
}
</script>

<style lang="scss">
.whitelist-card-table {
  width: 100%;
  margin-bottom: 20px;
  .whitelist-exist-row {
    background-color: #eee;
  }
}
</style>
