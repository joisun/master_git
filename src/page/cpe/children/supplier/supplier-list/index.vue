<script>
  import apis from '@/api/ajax'
  import EditSupplier from './edit-supplier.vue'

  export default {
    components: {
      EditSupplier
    },
    data() {
      return {
        isShowEditDialog: false,
        dialogType: 'add',
        search: {
          name: ''
        },
        supplierList: [],
        editRow: {}
      }
    },
    created() {
      this.getList()
    },
    methods: {
      async getList() {
        const { success, data } = await apis.cpe.supplierList({ ...this.search })
        if (!success) {
          return false
        }
        this.supplierList = data.map(item => {
          if (item.contacts) {
            const primaryContact = item.contacts.find(contact => contact.primary)
            if (primaryContact) {
              return {
                ...item,
                contactName: primaryContact.name,
                contactPhone: primaryContact.phone
              }
            }
          }
          return { ...item, contactName: '-', contactPhone: '-' }
        })
      },
      closeDialog() {
        this.dialogType = 'add'
        this.isShowEditDialog = false
        this.getList()
      },
      editSupplier(row) {
        this.dialogType = 'edit'
        this.editRow = row
        this.isShowEditDialog = true
      },
      deleteSupplier(row) {
        this.$confirm(`确定删除供应商「${row.name}」吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { success } = await apis.cpe.supplierDelete({ id: row.id })
          if (!success) {
            return false
          }
          this.$message({ type: 'success', message: '删除成功' })
          await this.getList()
        })
      },
      toProductList(model) {
        this.$router.push({ name: 'cpe-supplier-product', query: { model } })
      }
    }
  }
</script>

<template>
  <div class="wh__warp cpe-supplier-product">
    <div class="wh__header">
      <div class="wh__header--title">供应商名录</div>
    </div>
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          placeholder="供应商名称"
          name="searchField"
          v-model="search.name"
          @keyup.enter.native="getList"
          class="wh__tools--search-input"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="getList">
          </el-button>
        </el-input>
        <el-button class="float-right" type="primary" @click="isShowEditDialog = true">新增</el-button>
      </div>
    </div>
    <div class="wh__body">
      <div class="wh__body--table">
        <el-table :data="supplierList">
          <el-table-column label="序号" align="center" width="120">
            <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column label="供应商名称" width="300">
            <template slot-scope="scope">
              {{scope.row.name}} ({{scope.row.id}})
            </template>
          </el-table-column>
          <el-table-column label="联系人" prop="contactName" width="120"></el-table-column>
          <el-table-column label="联系电话" prop="contactPhone" width="120"></el-table-column>
          <el-table-column label="合作产品">
            <template slot-scope="scope">
              <span v-if="!scope.row.products.length">-</span>
              <template v-else>
                <el-tag
                  class="link"
                  v-for="item in scope.row.products"
                  :key="item.model"
                  @click="toProductList(item.model)"
                >
                  {{item.name}}({{item.model}})
                </el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button @click="editSupplier(scope.row)">编辑</el-button>
              <el-button @click="deleteSupplier(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <edit-supplier
        v-if="isShowEditDialog"
        :visible="isShowEditDialog"
        :dialogType="dialogType"
        :editSupplier="editRow"
        @close="closeDialog"
      >
      </edit-supplier>
    </div>
  </div>
</template>

<style lang="scss">
  .cpe-supplier-product {
    .link {
      color: #1c8de0;
      margin-right: 8px;
      cursor: pointer;
    }
  }
</style>
