<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categoryList: []
    }
  },
  mounted() {},
  created() {
    this.queryCategory()
  },
  methods: {
    async queryCategory() {
      const result = await this.jaxLib.blog.queryCategory()
      if (!result.success) return
      this.categoryList = result.data
    },
    editType(row) {
      this.$prompt('请输入分类名称', `${row ? '编辑' : '新增'}分类`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true
      })
        .then(async ({ value }) => {
          let param = { name: value }
          if (row)
            param = {
              ...param,
              id: row.id
            }
          const result = await this.jaxLib.blog.saveCategory(param)
          if (!result.success) return
          this.$message.success('添加成功')
          this.queryCategory()
          // this.closeDialog()
        })
        .catch(() => {})
    },
    deleteType(row) {
      this.$confirm(`请确认是否删除【${row.name}】分类`, '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const result = await this.jaxLib.blog.deleteCategory({ id: row.id })
          if (!result.success) return
          this.$message.success('删除成功')
          this.queryCategory()
        })
        .catch(() => {})
    },
    submit() {
      this.closeDialog()
    },
    closeDialog(row) {
      this.$emit('closeDialog')
    }
  }
}
</script>

<template>
  <div>
    <el-dialog title="分类编辑" :visible="isVisible" @close="closeDialog">
      <el-button type="primary" style="margin-bottom: 20px" @click="editType()">新增</el-button>
      <el-table :data="categoryList">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editType(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteType(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
