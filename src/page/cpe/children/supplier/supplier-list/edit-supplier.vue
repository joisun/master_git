<script>
  import apis from '@/api/ajax'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      dialogType: {
        type: String,
        default: 'edit'
      },
      editSupplier: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        form: {
          name: '',
          address: '',
          contacts: [],
          description: ''
        }
      }
    },
    created() {
      if (this.dialogType === 'edit') {
        this.form = { ...this.editSupplier }
      }
      if (!this.form.contacts.length) {
        this.addContact(true)
      }
    },
    methods: {
      addContact(primary = false) {
        this.form.contacts.push({ name: '', phone: '', remark: '', primary })
      },
      deleteContact(index) {
        this.form.contacts.splice(index, 1)
      },
      primaryContactChange(checkedIndex) {
        this.form.contacts.forEach((item, index) => item.primary = index === checkedIndex)
      },
      cancel() {
        this.$emit('close')
      },
      close() {
        this.form = { name: '', address: '', contacts: [], description: '' }
      },
      submit() {
        this.$refs.formRef.validate(async valid => {
          if (!valid) {
            return false
          }
          const contacts = this.form.contacts.filter(item => (item.name || item.phone || item.remark))
          if (contacts.length && !contacts.find(item => item.primary)) {
            return this.$message({ type: 'warning', message: '请选择一个主要联系人' })
          }
          const params = { ...this.form, contacts }
          if (this.dialogType !== 'add') {
            params.id = this.editSupplier.id
          } else {
            delete params.id
          }
          const { success } = await apis.cpe.supplierSave(params)
          if (!success) {
            return false
          }
          this.$message({ type: 'success', message: this.dialogType === 'add' ? '新增成功' : '编辑成功' })
          this.$emit('close')
        })
      }
    }
  }
</script>

<template>
  <div class="edit-supplier">
    <el-dialog
      :title="dialogType === 'add' ? '新增' : '编辑'"
      width="800px"
      @close="close"
      :visible="visible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px" ref="formRef" :model="form">
        <el-form-item
          label="供应商名称"
          prop="name"
          :rules="[
            { required: true, message: '供应商名称不能为空', trigger: 'blur' }
          ]"
        >
          <el-input placeholder="请输入供应商名称" :disabled="dialogType === 'edit'" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
          label="供应商地址"
          prop="address"
          :rules="[
            { required: true, message: '供应商地址不能为空', trigger: 'blur' }
          ]"
        >
          <el-input placeholder="请输入供应商地址" v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-table size="mini" :data="form.contacts" border>
            <el-table-column label="姓名" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.name" placeholder="请输入姓名"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="联系电话" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.phone" placeholder="请输入联系电话"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.remark" placeholder="请输入备注"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="scope.row.primary"
                  @change="primaryContactChange(scope.$index)"
                  :label="true"
                  style="margin-right: 10px;"
                >
                  主要联系人
                </el-radio>
                <el-button
                  :disabled="form.contacts.length <= 1"
                  size="mini"
                  @click="deleteContact(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <p class="add-contact">
            <i class="el-icon-circle-plus-outline" @click="addContact()"></i>
          </p>
        </el-form-item>
        <el-form-item label="合作模式">
          <el-input v-model="form.description" type="textarea" placeholder="请输入合作模式" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss">
  .edit-supplier {
    .add-contact {
      i {
        font-size: 18px;
        cursor: pointer;
        margin-top: 5px;
      }
    }
  }
</style>
