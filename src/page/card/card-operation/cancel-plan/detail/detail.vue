<template>
  <div class="carrier-account-modify-detail wh__warp">
    <div>
      <div class="wh__header">
        <h2 class="wh__header--title">取消计划套餐</h2>
        <span class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div v-loading="loading" class="wh__body">
        <p>
          1 、仅可对已激活或已停卡（未提交销卡）的卡进行修改。不允许取消购买返佣套餐卡的计划套餐。
          <br />
          2
          、每一批次的卡若存在套餐分类不同、计划套餐数量不同、卡不属于同一账户，则不允许同一批次取消计划套餐。<br />
          3 、若卡为单卡则不允许计划套餐开始不同的卡同一批次修改。<br />
          4 、若卡为自定义套餐则不允许套餐规格不同的卡同一批次修改。<br />
          5 、一次不能超过5000张卡<br />
        </p>
        <p class="warning">（此功能影响卡所有功能，请反复确认后再使用！）</p>
        <br />
        <el-form
          ref="form"
          label-position="top"
          label-width="80px"
          :model="form"
          style="width: 700px"
          :rules="formRule"
        >
          <el-form-item label="ICCID" prop="iccids">
            <el-input
              v-model="form.iccids"
              rows="6"
              style="width: 350px"
              :disabled="isShowDetail"
              type="textarea"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-if="!isShowDetail" label="">
            <el-button type="primary" @click="submitCheckForm()">下一步</el-button>
          </el-form-item>
          <template v-else>
            <el-form-item label="">
              <el-table
                ref="multipleTable"
                :data="planData"
                tooltip-effect="dark"
                style="width: 100%"
              >
                <el-table-column width="50">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.$index < selectIndex" disabled> </el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column type="index" width="50"> </el-table-column>
                <el-table-column v-if="!showMonthMode" label="套餐名称" prop="irpName">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.operatorType | carrierFilter }}{{ scope.row.irpName }}自定义套餐
                    </span>
                  </template>
                </el-table-column>
                <el-table-column v-if="!showMonthMode" prop="irpName" label="套餐档位">
                </el-table-column>
                <el-table-column v-if="showMonthMode" label="套餐开始时间" prop="effectiveDate">
                </el-table-column>
                <el-table-column v-if="showMonthMode" label="套餐结束时间" prop="expirationDate">
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="">
              <p>
                当前未显示计划套餐{{ total - size > 0 ? total - size : 0 }}个，
                当前卡片拥有的总计划套餐数: {{ total }}个
              </p>
              请输入你想要删除的套餐个数
              <el-input-number
                v-model="selectIndex"
                controls-position="right"
                :precision="0"
                :step="1"
                :min="1"
                :max="total"
              >
              </el-input-number>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </div>
    <div v-show="isShowDetail" class="show-package-diff">
      <el-button type="primary" :disabled="loading" @click="confirm">确认</el-button>
      <el-button @click="backList">取消</el-button>
    </div>
  </div>
</template>
<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { toolsMixin } from '@/global/mixins/table-selection'

const SELECTION_STORAGE_KEY = 'whitehouse_card_manager'
export default {
  name: 'cancel-plan-detail',
  mixins: [toolsMixin],
  data() {
    return {
      loading: false,
      isShowDetail: false,
      formRule: {
        iccids: [{ required: true, message: '请输入iccid', trigger: 'blur' }]
      },
      form: {
        iccids: ''
      },
      hasFeatureFee: false,
      showMonthMode: false,
      selectIndex: 1,
      total: 1,
      size: 30,
      planData: [],
      storageKey: SELECTION_STORAGE_KEY
    }
  },
  created() {
    if (this.$route.query.from === 'card-list') {
      const selected = this.getSelected('iccid')
      if (selected.length) {
        this.form.iccids = selected.join('\n')
      }
    }
  },
  methods: {
    async getDrpList() {
      const {
        data: { list, page },
        success
      } = await this.jaxLib.card.cancelPlanApplyPlanListGet({
        iccids: iccidsTransfer(this.form.iccids, ','),
        currentPage: 1,
        rowsPerPage: this.size
      })
      if (!success) return false
      this.planData = list
      this.showMonthMode = (list[0] || {}).offerType === 'monthly'
      this.total = page.allCount
      this.selectIndex = 1
      this.isShowDetail = true
    },
    submitCheckForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        const iccids = iccidsTransfer(this.form.iccids)
        if (iccids.length > 5000) {
          this.$message({ type: 'warning', message: '一次不能超过5000张卡' })
          return false
        }
        const { success } = await this.jaxLib.card.cancelPlanApplyValidate({
          iccids: iccids.join(',')
        })
        if (!success) return false
        this.getDrpList()
      })
    },
    backList() {
      // this.$router.push({ name: 'cancel-plan-list' })
      window.history.go(-1)
    },
    async confirm() {
      if (!this.selectIndex) {
        this.$message.error('请选择你要取消的套餐')
        return false
      }
      const res = await this.jaxLib.card.cancelPlanApplyPost({
        iccids: iccidsTransfer(this.form.iccids, ','),
        deleteDrpNum: this.selectIndex
      })
      if (!res.success) {
        return false
      }
      this.$message.success('提交成功')
      this.$router.push({ name: 'cancel-plan-list' })
    }
  }
}
</script>
