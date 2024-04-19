<template>
  <div v-loading="loading" element-loading-text="处理时间可能较长，请耐心等待">
    <el-form
      ref="transferForm"
      label-position="left"
      label-width="110px"
      :model="transferForm"
      :rules="rules"
    >
      <el-form-item label="ICCID" prop="iccids">
        <div
          v-infinite-scroll="loadMoreIccid"
          class="wh__iccid--box iccid-box-scroll"
          :infinite-scroll-delay="0"
        >
          <el-checkbox-group v-if="validated.length > 0" v-model="transferForm.iccids">
            <el-checkbox v-for="item in computedValidated" :key="item" :label="item"> </el-checkbox>
          </el-checkbox-group>
          <span v-else class="tool__card--invalid">无卡片</span>
        </div>
        <div v-if="needCollapse">
          <el-button
            type="text"
            :icon="`el-icon-arrow-${isIccidCollapsed ? 'down' : 'up'}`"
            @click="handleCollapsed"
            >{{ isIccidCollapsed ? '显示全部' : '显示部分' }}</el-button
          >
        </div>
        <p class="tool__card__alert--box">
          <span
            >共<strong>{{ validated.length }}</strong
            >个，当前已选择<strong>{{ transferForm.iccids.length }}</strong
            >个ICCID</span
          >
          <el-tooltip class="item" effect="dark" content="请谨慎操作" placement="right">
            <span>
              <wh-std-icon sign="&#xe660;"> </wh-std-icon>
            </span>
          </el-tooltip>
        </p>
      </el-form-item>
      <el-form-item label="原因" prop="reason">
        <el-input v-model="transferForm.reason" type="textarea" placeholder="请输入操作原因">
        </el-input>
      </el-form-item>
      <el-form-item v-if="type === 'retiring'" label="实际销卡时间">
        <el-date-picker
          v-model="transferForm.date"
          :clearable="false"
          type="date"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="wh__dialog--footer">
      <el-button type="primary" :loading="loading" @click.native="confirm('transferForm')"
        >确认</el-button
      >
    </div>
  </div>
</template>
<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import DialogMixin from '@/global/mixins/dialog-mixin'
import moment from 'moment'
import retireConfirm from '@/page/card/card-operation/eliminate-card/mixin/retire-confirm'

const TransferForm = {
  iccids: [],
  reason: '',
  date: moment().format('YYYY-MM-DD')
}
const rules = {
  iccids: [
    { type: 'array', required: true, message: '请至少选择一个可用的ICCID', trigger: 'change' }
  ],
  reason: [{ type: 'string', required: true, message: '必须填写原因', trigger: 'change' }]
}
export default {
  mixins: [DialogMixin, retireConfirm],
  props: {
    multipleSelection: {
      type: null,
      required: true
    },
    dialogName: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      loading: false,
      transferForm: { ...TransferForm },
      rules: { ...rules },
      orgList: [],
      validated: [],
      isIccidCollapsed: true,
      loadedCursor: 1
    }
  },
  computed: {
    needCollapse() {
      return this.validated && this.validated.length > 20
    },
    computedValidated() {
      if (!this.needCollapse || !this.isIccidCollapsed) return this.validated
      return this.validated.slice(0, 20 * this.loadedCursor)
    }
  },
  methods: {
    loadMoreIccid() {
      this.loadedCursor++
    },
    // 打开
    open() {
      this.validate()
    },
    handleCollapsed() {
      this.isIccidCollapsed = !this.isIccidCollapsed
    },
    // 关闭
    close() {
      this.transferForm = { ...TransferForm }
    },
    // 检查
    async validate() {
      let { multipleSelection } = this
      let multipleStr =
        typeof multipleSelection === 'string'
          ? multipleSelection
          : multipleSelection.map((e) => e.iccid) + ''
      this.validated = iccidsTransfer(multipleStr)
      this.transferForm.iccids = iccidsTransfer(multipleStr)
    },
    // 确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$msgbox({
          title: '提示',
          message: '操作不可撤销，是否继续',
          showCancelButton: true
        }).then((action) => action === 'confirm' && this.submit(formName))
      })
    },
    // 提交
    async submit() {
      this.loading = true
      let rst
      if (this.type === 'refuse') {
        rst = await this.jaxLib.card.retiring.refuse({
          iccids: this.transferForm.iccids.join(','),
          cause: this.transferForm.reason.trim()
        })
      } else {
        const checkRes = await this.jaxLib.card.retiring.checkNoRetiredIccid({
          iccids: this.transferForm.iccids.join(',')
        })
        if (!checkRes.success) {
          this.$message.error(checkRes.message)
          this.loading = false
          return
        }
        if (!(await this.retireConfirm(checkRes.data))) {
          this.loading = false
          return
        }
        rst = await this.jaxLib.card.retiring.finish({
          iccids: this.transferForm.iccids.join(','),
          cause: this.transferForm.reason.trim(),
          retiredDate: moment(this.transferForm.date).format('YYYY-MM-DD')
        })
      }
      this.loading = false
      if (!rst.success) return
      this.$message.success('操作成功')
      this.$emit('closeDialog', this.dialogName, true)
    }
  }
}
</script>
<style scoped lang="scss">
.iccid-box-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 320px;
}
</style>
