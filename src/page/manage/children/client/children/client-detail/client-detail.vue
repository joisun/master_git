<script>
/**
 * Create by zeter on 2018/10/12
 */
import { userInfoColumns } from './mixins/consts.js'
import regexp from '@/constant/regexps'

const checkMobile = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('账号不能为空'))
  }
  if (!regexp.mobile.test(value)) {
    return callback(new Error('请输入正确的手机号'))
  }
  callback()
}
export default {
  name: 'user-info',
  data() {
    return {
      columns: userInfoColumns,
      loading: false,
      tableData: {},
      dialogVisible: false,
      accountForm: {
        account: '',
        remark: ''
      },
      accountFormRule: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    orgId() {
      return this.$route.query.orgId
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    formatItem(e, row, formatter) {
      if (formatter) {
        return formatter(e, row)
      } else if (row[e]) return row[e]
      return ''
    },
    async getData() {
      this.loading = true
      let rst = await this.jaxLib.customer.info({
        orgId: this.orgId
      })
      if (!rst.success) return false
      this.loading = false
      this.tableData = {
        ...rst.data.qualification,
        ...rst.data.information,
        ...rst.data.information.orgAdmin
      }
      this.tableData.orgName = rst.data.information.orgName
      this.tableData.email = rst.data.information.email
      this.tableData.orgId = rst.data.information.id
      this.tableData.legalName = rst.data.qualification.name
    },
    onCancelBtnClick() {
      this.$router.push({ name: 'client-list' })
    },
    viewImg(src) {
      this.$whImgShow([src])
    },
    showEditAccountDialog() {
      this.accountForm.account = this.tableData.userAccount
      this.dialogVisible = true
    },
    submitChangeAccount() {
      this.$refs.accountFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        }
        const res = await this.jaxLib.customer.changeAccount({
          ...this.accountForm,
          userId: this.tableData.orgAdmin.id
        })
        if (!res.success) {
          return false
        }
        this.$message({ type: 'success', message: '变更成功' })
        this.dialogVisible = false
        this.getData()
      })
    },
    accountDialogClose() {
      this.accountForm = {
        account: '',
        remark: ''
      }
    }
  }
}
</script>

<template>
  <div class="customer-user-info">
    <div class="wh__warp">
      <div>
        <div class="wh__header">
          <h2 class="wh__header--title">用户详情</h2>
          <span class="level2__back">
            <el-tooltip content="返回一级组织列表" placement="left" effect="dark">
              <wh-std-icon sign="xe6aa" @click="onCancelBtnClick"> </wh-std-icon>
            </el-tooltip>
          </span>
        </div>
      </div>
      <div class="wh__body">
        <ul v-loading="loading" class="customer-user-info__box">
          <li v-for="item in columns" :key="item.userAccount">
            {{ item.name }}
            <template v-if="item.key">
              :
              <span
                :key="Date.now()"
                v-desensitization="item.desensitization && item.desensitization(tableData)"
              >
                {{ formatItem(item.key, tableData, item.formatter) }}
              </span>
              <span v-if="item.key === 'userAccount'">
                <el-button type="link" size="mini" @click="showEditAccountDialog(tableData)"
                  >变更</el-button
                >
              </span>
            </template>
          </li>
          <div class="customer-user-info__box--img">
            <p>营业执照:</p>
            <span>
              <img
                v-if="tableData.licencePic"
                :src="tableData.licencePic"
                @click="viewImg(tableData.licencePic)"
              />
            </span>
          </div>
          <div class="customer-user-info__box--img">
            <p>法人身份证:</p>
            <span>
              <img
                v-if="tableData.idCardPicFont"
                class=""
                :src="tableData.idCardPicFont"
                @click="viewImg(tableData.idCardPicFont)"
              />
              <img
                v-if="tableData.idCardPicBack"
                :src="tableData.idCardPicBack"
                @click="viewImg(tableData.idCardPicBack)"
              />
            </span>
          </div>
        </ul>
        <el-dialog
          title="账号变更"
          :visible.sync="dialogVisible"
          width="30%"
          @close="accountDialogClose"
        >
          <el-form ref="accountFormRef" :model="accountForm" :rules="accountFormRule">
            <el-form-item label="新账号" prop="account">
              <el-input v-model="accountForm.account" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="accountForm.remark" type="textarea" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitChangeAccount">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
