<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    props: {
      orgId: {
        default: String
      },
      pointOrgName: {
        default: String
      },
      orgContent: {
        default: Object
      },
      dialogName: {
        default: String
      }
    },
    data() {
      return {
        formLabelWidth: '78px',
        // 角色列表
        roles: [{
          value: '默认值',
          label: '无效角色'
        }],
        addUserForm: {
          user_account: '',
          name: '',
          password: '',
          phone: '',
          email: '',
          status: 'active',
          description: '',
          org_id: this.orgId,
          role_id: -1
        },
        passwordVertify: ''
      }
    },
    methods: {
      async getRole() {
        let rst = await this.jaxLib.customer.list.roleList()
        if (rst.success) {
          this.roles = rst.data.map((e, i) => ({
            value: e.id,
            label: e.roleName
          }))
          this.addUserForm.role_id = this.roles[0].value
        }
      },
      open() {
        this.resetUserForm()
        this.getRole()
      },
      // 重置添加用户表单
      resetUserForm() {
        this.addUserForm = {
          user_account: '',
          name: '',
          password: '',
          phone: '',
          email: '',
          status: 'active',
          description: '',
          org_id: this.orgId,
          role_id: ''
        }
        this.passwordVertify = ''
      },
      // 添加新用户
      async doAddUser() {
        if (this.passwordVertify !== this.addUserForm.password) {
          this.msg('确认密码不一致', 'warning')
          return
        }
        let postData = this.addUserForm
        postData.filter = 'phone&email&description'
        let rst = await this.jaxLib.customer.orgUser.create_user('ajax/customers/create_user', postData)
        if (rst.success) {
          this.msg('添加新用户成功', 'success')
          this.$emit('closeDialog', this.dialogName, true)
        } else {
          this.msg('添加新用户失败', 'error')
        }
      },
      close() {
        this.resetUserForm()
        this.$emit('closeDialog', this.dialogName, false)
      }

    }
  }
</script>

<template>
  <div class="add-user">
    <el-form :model="addUserForm" style="width: 440px">
      <el-form-item label="账号" :label-width="formLabelWidth">
        <el-input v-model="addUserForm.user_account" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="名字" :label-width="formLabelWidth">
        <el-input v-model="addUserForm.name" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <input v-model="addUserForm.password" type="password" class="wh-input"/>
      </el-form-item>
      <el-form-item label="确认密码" :label-width="formLabelWidth">
        <input v-model="passwordVertify" type="password" class="wh-input"/>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="addUserForm.email" auto-complete="on">
        </el-input>
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="addUserForm.phone" auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth">
        <el-select v-model="addUserForm.status">
          <el-option label="可用" value="active">
          </el-option>
          <el-option label="不可用" value="enactive">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-select v-model="addUserForm.role_id">
          <el-option
            v-for="role in roles"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="addUserForm.description">
        </el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="wh-dialog-footer">
      <el-button type="text" @click.native="close">取 消</el-button>
      <el-button type="primary" @click.native="doAddUser">确 定</el-button>
    </span>
  </div>
</template>
