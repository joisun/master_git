<template>
  <el-card>
    <template #header>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col style="line-height: 32px"
          >个人提成系数{{ roleInfo.superLeader ? '配置' : '' }}</el-col
        >
      </el-row>
    </template>
    <el-table :data="tableData">
      <el-table-column label="个人总收入金额(X)" prop="type">
        <template slot-scope="{ row }">
          {{ typeEnum[row.type] }}
        </template>
      </el-table-column>
      <el-table-column label="提成系数" prop="commissionCoefficient">
        <template slot-scope="{ row, $index }">
          <el-input
            v-if="currentEdit === $index"
            v-model="coefficient"
            type="number"
            style="width: 130px"
          />
          <template v-else>
            {{ row.commissionCoefficient }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="roleInfo.superLeader"
        label="操作"
        prop="commissionCoefficient"
        width="200"
      >
        <template slot-scope="{ $index, row }">
          <template v-if="currentEdit === $index">
            <el-button @click="handleCancel">取消</el-button>
            <el-button
              type="primary"
              :disabled="!coefficient && coefficient !== 0"
              @click="handleSave(row)"
              >保存</el-button
            >
          </template>
          <el-button v-else @click="handleEdit($index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  props: {
    monthDate: {
      type: String,
      default: ''
    },
    roleInfo: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },
  data() {
    return {
      coefficient: 0,
      typeEnum: {
        LESS_THAN_LOWER_LIMIT: 'X < 提成下限',
        BETWEEN_LOWER_LIMIT_AND_TARGET: '提成下限 ≤ X < 个人业绩目标',
        MORE_THAN_TARGET: '个人业绩目标 ≤ X'
      },
      currentEdit: -1,
      tableData: [],
      visible: false,
      formData: {
        lower: 0,
        upper: 100
      },
      rules: {},
      limitData: {
        min: 0,
        max: 100
      }
    }
  },
  created() {
    this.getPersonanlConfig()
  },
  methods: {
    async handleSave(row) {
      const res = await this.jaxLib.salesComission.salesCommissionConfigPersonalSave({
        ...row,
        monthDate: this.monthDate,
        commissionCoefficient: this.coefficient
      })
      if (res && res.success) {
        this.coefficient = 0
        this.currentEdit = -1
        this.$message.success('修改成功')
        await this.getPersonanlConfig()
      }
    },
    handleEdit(index) {
      this.coefficient = this.tableData[index].commissionCoefficient
      this.currentEdit = index
    },
    async getPersonanlConfig() {
      const res = await this.jaxLib.salesComission.salesCommissionConfigPersonalCoefficient({
        monthDate: this.monthDate
      })
      if (res && res.success) {
        this.tableData = res.data
      }
    },
    handleCancel() {
      this.coefficient = 0
      this.currentEdit = -1
    },
    onConfirm() {}
  }
}
</script>

<style scoped></style>
