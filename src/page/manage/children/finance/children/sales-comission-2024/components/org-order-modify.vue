<script>
const DEFAULT_FORM_DATA = JSON.stringify({
  modifyContent: [],
  remark: ''
})
function convertArrayToObject(array) {
  return array.reduce((acc, current) => {
    // Assigning the originValue to the key in the accumulator object
    acc[current.key] = current.value
    return acc
  }, {}) // Initialize the accumulator as an empty object
}

export default {
  data() {
    return {
      content: {},
      params: {},
      formData: JSON.parse(DEFAULT_FORM_DATA),
      visible: false,
      isConfirming: false
    }
  },
  methods: {
    close() {
      this.formData = JSON.parse(DEFAULT_FORM_DATA)
      this.content = {}
      this.params = {}
      this.isConfirming = false
      this.visible = false
    },
    open(content) {
      this.content = content
      console.log('🎸 DEBUG_34 org-order-modify.vue 👉', this.content)
      this.formData = {
        ...this.formData,
        ...content
      }
      this.formData.modifyContent = [
        {
          field: '收入金额（元）',
          originValue: content.income,
          key: 'income',
          value: undefined
        },
        {
          field: '成本（元）',
          originValue: content.cost,
          key: 'cost',
          value: undefined
        },
        {
          field: '利润额（元）',
          originValue: content.gross,
          key: 'gross',
          value: undefined
        },
        {
          field: '预计提成（元）',
          originValue: content.commission,
          key: 'commission',
          value: undefined
        }
      ]
      this.visible = true
    },

    async submit() {
      if (this.isConfirming) {
        let res = await this.jaxLib.salesComission.salesCommission2024.detailModifyCost({
          ...this.params,
          id: this.content.id,
          monthDate: this.content.monthDate
        })
        if (res && res.success) {
          this.$message({ type: 'success', message: '操作成功' })
          this.close()
          this.$emit('confirm')
        }
        return
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { modifyContent, remark } = this.formData
          const modifyValues = convertArrayToObject(modifyContent)
          this.isConfirming = true
          this.params = {
            ...modifyValues,
            remark
          }
        }
      })
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="visible"
    title="修改"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <template v-if="!isConfirming">
      <el-row style="margin-bottom: 30px">
        <el-col :span="8"> 订单类型: {{ content.orderType | commissionOrderTypeFilter }}</el-col>
        <el-col :span="8"> 收入类型: {{ content.type | commissionTypeFilter }}</el-col>
        <el-col :span="8"> 交易编号: {{ content.orderNo }}</el-col>
      </el-row>
      <el-form ref="form" :model="formData" label-width="70px">
        <el-form-item label="修改内容">
          <el-table :data="formData.modifyContent" size="small" style="width: 650px">
            <el-table-column align="center" label="字段" width="200px">
              <template #default="{ row }">
                {{ row.field }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="变更前" width="200px">
              <template #default="{ row }">
                <div style="margin-bottom: 20px">
                  {{ row.originValue }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" label="变更后">
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="'modifyContent.' + $index + '.value'"
                  label-width="0"
                  :rules="{ required: true, message: '请输入变更后' }"
                >
                  <el-input
                    v-model="row.value"
                    type="text"
                    autocomplete="off"
                    size="small"
                    style="width: 200px"
                  />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :rules="{ required: true, message: '请输入备注' }">
          <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注">
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <template v-else>
      <el-alert
        show-icon
        title="请确认一下修改内容是否正确，确认无误后，按确认键提交！"
        type="warning"
        :closable="false"
      />
      <el-form>
        <el-form-item label="客户" prop="before">{{ content.orgInfos.orgName }}</el-form-item>
        <el-form-item label="所属销售" prop="before">{{
          content.orgInfos.saleName | saleFilter
        }}</el-form-item>
        <el-form-item label="订单类型" prop="before">{{
          content.orderType | commissionOrderTypeFilter
        }}</el-form-item>
        <el-form-item label="收入类型" prop="before">{{
          content.type | commissionTypeFilter
        }}</el-form-item>
        <el-form-item label="收入金额" prop="before">{{ params.income }}</el-form-item>
        <el-form-item label="成本" prop="before">{{ params.cost }}</el-form-item>
        <el-form-item label="利润额" prop="before">{{ params.gross }}</el-form-item>
        <el-form-item label="预计提成" prop="before">{{ params.commission }}</el-form-item>
        <el-form-item label="原因" prop="before">{{ params.remark }}</el-form-item>
      </el-form>
    </template>
    <div class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
