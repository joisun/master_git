<template>
  <el-dialog :visible="visible" @close="closeDialog" title="取消停机保号">
    <el-alert
      title="仅可对已设置停机保号的卡进行取消，包括已进入停机保号状态、未进入停机保号状态、已提交销卡的卡；取消后，当月立即恢复原有卡
    状态，和原有卡数据；"
      type="info"
      :closable="false"
    />
    <div class="mt10" v-if="step === 1">
      <el-form
        :model="formStep1"
        :inline="true"
        ref="formStep1"
        :rules="rulesStep1"
      >
        <el-form-item label="iccid" prop="iccids">
          <WhIccidInput v-model="formStep1.iccids" />
        </el-form-item>
      </el-form>
    </div>
    <div class="mt10" v-if="step === 2">
      <div v-for="(item, index) in formStep2" :key="index">
        <p class="item">分类{{ (index + 1) | toCNumber }}:</p>
        <p class="item">
          <label>iccid</label>
          <WhIccidInput v-model="item.iccids" disabled style="width: 250px" />
        </p>
        <p class="item">
          <label>取消月份</label>
          <span>{{ item.cancelMonthCount }}个月</span>
        </p>
        <p class="item">
          <label>退款金额</label>
          <span>{{ item.totalFee / 10000 }}元</span>
        </p>
        <el-divider v-if="index != formStep2.length - 1" />
      </div>
    </div>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="onNextStep" v-show="step === 1"
        >下一步</el-button
      >
      <el-button type="primary" @click="onConfirm" v-show="step === 2"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
  import WhIccidInput from './WhIccidInput.vue'
  export default {
    props: {
      visible: {
        type: Boolean
      }
    },
    filters: {
      toCNumber(number) {
        switch (number) {
          case 1:
            return '一'
          case 2:
            return '二'
        }
      }
    },
    data() {
      return {
        step: 1,
        formStep1: {
          iccids: ''
        },
        rulesStep1: {
          iccids: [{ required: true, message: '请输入iccid', trigger: 'blur' }]
        },
        formStep2: [],
        loading: false,
        validIccids: []
      }
    },
    components: {
      WhIccidInput
    },
    methods: {
      closeDialog(refresh = false) {
        this.step = 1
        this.$emit('update:visible', false)
        if (this.$refs.formStep1) {
          this.formStep1.iccids = ''
          this.$refs.formStep1.resetFields()
        }
        if (refresh) {
          this.$emit('refresh')
        }
      },
      onNextStep() {
        this.$refs.formStep1.validate(async (valid) => {
          if (valid) {
            const params = {
              iccids: this.formStep1.iccids
            }
            this.loading = true
            try {
              const {
                success,
                data
              } = await this.jaxLib.card.retainNumber.validate(params)
              this.loading = false
              if (success && data.validList.length) {
                this.formStep2 = data.validList
                this.step = 2
                this.formStep1.iccids = ''
                this.validIccids = data.validList.map((e) => e.iccids)
                this.$refs.formStep1.resetFields()
              }
              if (!data.validList.length) {
                this.$message.error('没有可以操作的卡片！请重新输入')
                this.formStep1.iccids = ''
              }
            } catch {
              this.loading = false
            }
          }
        })
      },
      async onConfirm() {
        const params = {
          iccids: this.validIccids.join(',')
        }
        this.loading = true
        try {
          const { success } = await this.jaxLib.card.retainNumber.cancelRetain(
            params
          )
          this.loading = false
          if (success) {
            this.$message.success('取消停机保号成功！')
            this.closeDialog(true)
          }
        } catch {
          this.loading = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .item {
    margin-bottom: 10px;
    label {
      margin-right: 10px;
      vertical-align: top;
    }
  }
</style>