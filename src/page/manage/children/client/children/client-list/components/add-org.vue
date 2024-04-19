<script>
/**
   * Create by zeter on 2017/5/31
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    props: {
      dialogName: {
        default: String
      }
    },
    mixins: [DialogMixin],
    data() {
      return {
        formLabelWidth: '78px',
        addForm: {
          orgName: '',
          fullName: '',
          phone: '',
          address: '',
          status: 'active',
          description: '',
          iccidProtected: 'no',
          inviteCode: ''
        }
      }
    },
    methods: {
      open() {
        this.resetForm()
      },
      // 添加用户
      async doAdd() {
        let postData = {
          org_name: this.addForm.orgName,
          full_name: this.addForm.fullName,
          phone: this.addForm.phone,
          address: this.addForm.address,
          status: this.addForm.status,
          description: this.addForm.description,
          inviteCode: this.addForm.inviteCode,
          iccid_protected: this.addForm.iccidProtected === 'no' ? 0 : 1,
          filter: 'description&address&inviteCode'
        }
        let rst = await this.jaxLib.customer.orgUser.createOrg(postData)
        if (rst.success) {
          this.msg('添加成功', 'success')
          this.$emit('closeDialog', this.dialogName, true)
        }
      },
      resetForm() {
        this.addForm = {
          orgName: '',
          fullName: '',
          phone: '',
          address: '',
          status: 'active',
          description: '',
          iccidProtected: 'no'
        }
      },
      close() {
        this.resetForm()
        this.$emit('closeDialog', this.dialogName, false)
      }
    }
  }
</script>

<template>
  <div class="add-org">
    <el-form :model="addForm" style="width: 440px">
      <el-form-item label="机构名称" :label-width="formLabelWidth">
        <el-input v-model="addForm.orgName" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="机构全名" :label-width="formLabelWidth">
        <el-input v-model="addForm.fullName" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="电话号码" :label-width="formLabelWidth">
        <el-input v-model="addForm.phone" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="机构地址" :label-width="formLabelWidth">
        <el-input v-model="addForm.address" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth">
        <el-select v-model="addForm.status">
          <el-option label="可用" value="active">
          </el-option>
          <el-option label="不可用" value="enactive">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ICCID隐藏" :label-width="formLabelWidth">
        <el-select v-model="addForm.iccidProtected">
          <el-option label="不隐藏" value="no">
          </el-option>
          <el-option label="隐藏" value="yes">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邀请人" :label-width="formLabelWidth">
        <el-input v-model="addForm.inviteCode" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="addForm.description">
        </el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="wh-dialog-footer">
      <el-button type="text" @click.native="close">取 消</el-button>
      <el-button type="primary" @click.native="doAdd">确 定</el-button>
    </span>
  </div>
</template>
