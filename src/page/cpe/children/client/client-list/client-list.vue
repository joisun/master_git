<script>
import apis from '@/api/ajax'
import { mapState } from 'vuex'
import cpeUserLogin from '@/global/function/cpe-super-login'
import ResetPwdDialog from '@/global/components/reset-pwd-dialog.vue'
export default {
  name: 'CpeClientList',
  components: { ResetPwdDialog },
  data() {
    return {
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      loading: false,
      form: {
        searchInput: ''
      },
      tableDate: [],
      system: {},
      dialog: {
        isShow: false,
        title: '',
        editRow: {},
        form: { money: '', description: '', seller: '' }
      },
      editBrandDialog: {
        isShow: false,
        form: { orgId: '', brand: '' }
      }
    }
  },
  watch: {
    '$route.query.searchInput'(newValue) {
      if (newValue) {
        this.form.searchInput = newValue
        this.getList()
      }
    }
  },
  mounted() {
    this.getBannerUrl()
    this.getList()
  },
  computed: {
    ...mapState({
      salesList: (state) => state.salesPerson.salesList
    })
  },
  activated() {
    this.getList()
  },
  methods: {
    resetPwd(org) {
      this.$confirm('确定为该客户重置密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: true
      })
        .then(async () => {
          let res = await apis.cpe.resetPwd({
            orgId: org.orgId
          })
          if (res && res.success) {
            this.$refs.resetPwdDialog.open(res.data)
          }
        })
        .catch(() => {})
    },
    async getList() {
      const { pageIndex, pageSize } = this.page
      this.loading = true
      const {
        success,
        data: { list, page }
      } = await apis.cpe.getCustomerList({
        pageIndex,
        pageSize,
        keyword: this.form.searchInput.trim()
      })
      this.loading = false
      if (!success) return false
      this.tableDate = list
      this.page.total = page.allCount
    },
    changePageIndex(val) {
      this.page.pageIndex = val
      this.getList()
    },
    search() {
      this.page.pageIndex = 1
      this.getList()
    },
    async getBannerUrl() {
      const { success, data } = await apis.common.getBannerUrl({
        needSystem: true
      })
      if (!success) return false
      this.system = data
    },
    async userLogin(item) {
      await cpeUserLogin(item, { system: this.system })
    },
    setPrice(item) {
      this.$router.push({
        name: 'cpe-client-price-set',
        query: { id: item.orgId, orgName: item.fullName }
      })
    },
    handleDialogShow(title, editRow) {
      this.dialog.isShow = true
      this.dialog.title = title
      this.dialog.editRow = editRow
      this.dialog.form.seller = editRow.saleName
    },
    async dialogSubmit() {
      const orgId = this.dialog.editRow.orgId
      const title = this.dialog.title
      const { money, seller, description } = this.dialog.form
      let res = {}
      if (title === '配额') {
        if (Number(money) === 0 || Number(money) > 999999999) {
          return this.$message({ type: 'warning', message: '分配金额不合法' })
        }
        res = await apis.cpe.balanceRecharge({ orgId, money: Number(money), description })
      } else {
        if (!seller) {
          return this.$message({ type: 'warning', message: '请选择分配销售' })
        }
        res = await apis.cpe.orgAssign({ orgId, seller, description })
      }
      if (res.success) {
        this.$message({ type: 'success', message: '保存成功' })
        // this.dialog.isShow = false
        this.closeDialog()
        this.changePageIndex(1)
      }
    },
    closeDialog() {
      this.dialog = {
        isShow: false,
        title: '',
        editRow: {},
        form: { money: '', description: '', seller: '' }
      }
    },
    handleEditBrandDialogShow({ orgId, brand }) {
      this.editBrandDialog.form = { orgId, brand }
      this.editBrandDialog.isShow = true
    },
    async renameBrand() {
      if (!this.editBrandDialog.form.brand) {
        return this.$message({ type: 'error', message: '请输入品牌名称' })
      }
      const { success } = await apis.cpe.renameOrgBrand({ ...this.editBrandDialog.form })
      if (success) {
        this.$message({ type: 'success', message: '保存成功' })
        this.editBrandDialog.isShow = false
        this.getList()
      }
    }
  }
}
</script>

<template>
  <div class="wh-app-wrap">
    <div class="wh__header">
      <div class="wh__header--title">客户管理</div>
    </div>
    <!-- tools -->
    <div class="wh__tools">
      <div class="wh__tools--search">
        <el-input
          v-model="form.searchInput"
          placeholder="客户id、客户名称、账号、联系电话、品牌"
          class="wh__tools--search-input"
          style="width: 350px"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click.native="search"> </el-button>
        </el-input>
      </div>
    </div>
    <!-- list-->
    <div class="wh__body">
      <div class="wh__body--table">
        <el-table v-loading="loading" :data="tableDate" row-key="orgId">
          <el-table-column label="客户ID" prop="orgId" width="120px" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="userLogin(scope.row)">{{ scope.row.orgId }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="客户名称" prop="fullName"></el-table-column>
          <el-table-column label="账号" prop="userAccount">
            <template slot-scope="{ row }">
              <span
                v-desensitization="{
                  id: row.orgId,
                  showField: 'userAccount',
                  system: 'ironman',
                  idType: 'orgId'
                }"
                >{{ row.userAccount }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="品牌">
            <template slot-scope="scope">
              <span>{{ scope.row.brand }}</span>
              <span
                class="el-icon-edit-outline cursor-pointer"
                @click="handleEditBrandDialogShow(scope.row)"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" prop="phone" align="center">
            <template slot-scope="{ row }">
              <span
                v-desensitization="{
                  id: row.orgId,
                  showField: 'phone',
                  system: 'ironman',
                  idType: 'orgId'
                }"
                >{{ row.userAccount }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="销售归属" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.saleName | saleFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280px" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="setPrice(scope.row)">设置报价</el-button>
              <el-button size="small" @click="handleDialogShow('配额', scope.row)">配额</el-button>
              <el-button size="small" @click="handleDialogShow('销售归属', scope.row)"
                >销售归属</el-button
              >
              <el-button size="small" @click="resetPwd(scope.row)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="编辑品牌"
          :visible="editBrandDialog.isShow"
          width="500px"
          @close="editBrandDialog.isShow = false"
        >
          <el-form label-width="100px">
            <el-form-item label="品牌名称:">
              <el-input
                v-model="editBrandDialog.form.brand"
                placeholder="请输入品牌名称"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="renameBrand">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="wh__body--page">
        <el-pagination
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total"
          @current-change="changePageIndex"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialog.title" :visible="dialog.isShow" :show-close="false" width="500px">
      <el-form label-width="120px">
        <el-form-item label="客户名称：">{{ dialog.editRow.fullName }}</el-form-item>
        <el-form-item v-if="dialog.title === '配额'" label="分配金额：">
          <el-input v-model="dialog.form.money" placeholder="请输入分配金额" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item v-else label="分配销售：">
          <el-select v-model="dialog.form.seller" style="width: 100%">
            <el-option v-for="item in salesList" :key="item.key" :value="item.name">{{
              item.name
            }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="dialog.form.description"
            type="textarea"
            placeholder="请输入备注"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <reset-pwd-dialog ref="resetPwdDialog" />
  </div>
</template>
