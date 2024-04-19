<template>
  <div class="carrier-account-modify-detail wh__warp">
    <div>
      <div class="wh__header">
        <h2 class="wh__header--title">套餐转移 (仅限宇视的卡操作)</h2>
        <span class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div v-loading="loading" class="wh__body">
        <p>
          1、每次只允许操作一张卡；<br />
          2、被转移的卡和接受的新卡必须为同一客户，如果有子账户，必须为同一个子账户；<br />
          3、被转移卡必须有激活套餐；接受套餐的新卡，必须为过期状态，不允许有激活套餐；<br />
          4、操作套餐转移时，被转移的卡所有未过期的套餐都会被同时转移；
        </p>
        <br />
        <el-form
          ref="form"
          label-position="top"
          label-width="80px"
          :model="form"
          style="width: 700px"
          :rules="formRule"
        >
          <el-row type="flex" justify="start" :gutter="20">
            <el-col>
              <el-form-item label="被转移卡ICCID" prop="origIccid">
                <el-input
                  v-model="form.origIccid"
                  rows="6"
                  style="width: 350px"
                  :disabled="isShowDetail"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="step === 2 || id">
              <el-form-item label="接受卡ICCID" prop="targetIccid">
                <el-input
                  v-model="form.targetIccid"
                  rows="6"
                  style="width: 350px"
                  type="textarea"
                  :disabled="!!id"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="!isShowDetail" label="">
            <el-button type="primary" @click="nextStep()">下一步</el-button>
          </el-form-item>
          <template v-else>
            <el-form-item label="">
              <el-table
                ref="multipleTable"
                :data="planData"
                tooltip-effect="dark"
                style="width: 100%"
              >
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column label="套餐开始时间" prop="effectiveDate">
                  <template #default="{ row }">
                    {{ row.effectiveDate | dateFilter }}
                  </template>
                </el-table-column>
                <el-table-column label="套餐结束时间" prop="expirationDate">
                  <template #default="{ row }">
                    {{ row.expirationDate | dateFilter }}
                  </template>
                </el-table-column>
                <el-table-column label="套餐已使用量" prop="usageDataVolume">
                  <template #default="{ row }">
                    {{ row.usageDataVolume }}
                  </template>
                </el-table-column>
                <el-table-column label="套餐剩余量" prop="leftDataVolume">
                  <template #default="{ row }">
                    {{ row.leftDataVolume }}
                  </template>
                </el-table-column>
              </el-table>
              <div class="wh__body--page">
                <el-pagination
                  :current-page="page.pageIndex"
                  :page-size="page.pageSize"
                  :total="page.total"
                  layout="pager, total"
                  @current-change="handlePageChange"
                />
              </div>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </div>
    <div v-show="isShowDetail" class="show-package-diff">
      <el-button v-if="!id" type="primary" :disabled="loading" @click="submitCheckForm"
        >确认</el-button
      >
      <el-button @click="backList">{{ id ? '返回' : '取消' }}</el-button>
    </div>
  </div>
</template>
<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { toolsMixin } from '@/global/mixins/table-selection'

const SELECTION_STORAGE_KEY = 'whitehouse_card_manager'
export default {
  name: 'plan-transfer-detail',
  mixins: [toolsMixin],
  data() {
    const id = this.$route.query.id
    return {
      id,
      loading: false,
      isShowDetail: false,
      formRule: {
        origIccid: [{ required: true, message: '请输入被转移卡ICCID', trigger: 'blur' }],
        targetIccid: [{ required: true, message: '请输入接受卡ICCID', trigger: 'blur' }]
      },
      form: {
        icorigIccidcids: '',
        targetIccid: ''
      },
      step: 1,
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      planData: []
    }
  },
  created() {
    if (this.id) {
      this.isShowDetail = true
      this.getDetail()
      this.getDrpListById()
    }
  },
  methods: {
    async getDetail() {
      const { data, success } = await this.jaxLib.card.transfer.detail({
        id: this.id
      })
      if (!success) return false
      const { origIccid, targetIccid } = data
      this.form = {
        ...this.form,
        origIccid,
        targetIccid
      }
    },
    handlePageChange(val) {
      this.page.pageIndex = val
      this.id ? this.getDrpListById() : this.getDrpList()
    },
    async getDrpListById() {
      const {
        data: { list, page },
        success
      } = await this.jaxLib.card.transfer.detailDrpList({
        id: this.id,
        currentPage: this.page.pageIndex,
        rowsPerPage: this.page.pageSize
      })
      if (!success) return false
      this.planData = list
      this.page.total = page.allCount
    },
    async getDrpList() {
      const {
        data: { list, page },
        success
      } = await this.jaxLib.card.transfer.getCanTransferList({
        iccid: iccidsTransfer(this.form.origIccid, ','),
        currentPage: this.page.pageIndex,
        rowsPerPage: this.page.pageSize
      })
      if (!success) return false
      this.planData = list
      this.page.total = page.allCount
      this.isShowDetail = true
    },
    submitCheckForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        const origIccid = iccidsTransfer(this.form.origIccid).join()
        const targetIccid = iccidsTransfer(this.form.targetIccid).join()
        const checkRes = await this.jaxLib.card.transfer.check({
          origIccid,
          targetIccid
        })
        if (!checkRes.success) {
          return
        }
        const { success } = await this.jaxLib.card.transfer.transfer({
          origIccid,
          targetIccid
        })
        if (!success) return false
        this.$message.success('提交成功')
        this.$router.push({ name: 'plan-transfer' })
      })
    },
    nextStep() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        await this.getDrpList()
        this.step = 2
      })
    },
    backList() {
      window.history.go(-1)
    }
  }
}
</script>
