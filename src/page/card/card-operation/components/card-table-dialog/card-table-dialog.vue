<template>
  <el-dialog title="卡号列表" :visible.sync="visible" width="30%">
    <el-table :data="data.list" style="width: 100%">
      <el-table-column prop="iccid" label="卡号" />
    </el-table>
    <el-pagination
      :current-page="page.currentPage"
      :page-size="page.rowsPerPage"
      :total="page.allCount"
      layout="pager, total"
      @current-change="changeIndex"
    />
  </el-dialog>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    getData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      formData: {},
      success: [],
      isLoading: false,
      id: ''
    }
  },
  computed: {
    page() {
      const page = this.data.page
        ? this.data.page
        : {
            currentPage: 1
          }
      return page
    }
  },
  methods: {
    open(id) {
      this.visible = true
      this.getData({ id })
      this.id = id
    },
    changeIndex(val) {
      this.getData({
        pageNo: val,
        id: this.id
      })
    }
  }
}
</script>
