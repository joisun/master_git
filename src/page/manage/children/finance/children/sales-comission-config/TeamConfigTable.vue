<template>
  <el-card>
    <template #header>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col style="line-height: 32px"
          >团队提成百分比{{ roleInfo.superLeader ? '配置' : '' }}</el-col
        >
        <el-col v-if="roleInfo.superLeader" style="text-align: right">
          <el-button v-if="!isEditing" type="primary" size="small" @click="onEdit">修改</el-button>
          <template v-else>
            <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
            <el-button :loading="loading" @click="onCancel">取消</el-button>
          </template>
        </el-col>
      </el-row>
    </template>
    <el-table :data="tableData">
      <el-table-column label="团队目标完成率(X)" min-width="200" align="center">
        <template slot-scope="{ row, $index }">
          <div style="white-space: nowrap">
            <el-input-number
              v-if="isEditing"
              v-model="row.lowerLimit"
              :controls="false"
              style="width: 80px"
              :min="0"
              :max="row.upperLimit - 1"
              @change="onLowerChange($index, row.lowerLimit)"
            />
            <span v-else-if="!hideLowerLimit($index)">{{ row.lowerLimit }}</span>
            <span v-if="!hideLowerLimit($index)">%</span>
            <span style="margin: 0 10px">
              <span v-if="!hideLowerLimit($index)">≤</span> X
              <span v-if="!hideUpperLimit(row)">&#60;</span>
            </span>
            <el-input-number
              v-if="isEditing"
              :ref="`uppers-${$index}`"
              v-model="row.upperLimit"
              style="width: 80px"
              :controls="false"
              :min="row.lowerLimit + 1"
              @keyup.enter.native="handeEnter($index, row)"
              @change="onUpperChange($index, row.upperLimit)"
            />
            <span v-else-if="!isEditing && row.upperLimit && !hideUpperLimit(row)">{{
              row.upperLimit
            }}</span>
            <span v-if="!hideUpperLimit(row)">%</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收入提成百分比" prop="basicSalary">
        <template slot-scope="{ row }">
          <el-input-number
            v-if="isEditing"
            v-model="row.commissionPercentage"
            :controls="false"
            style="width: 80px"
          />
          <span v-else>{{ row.commissionPercentage }}</span>
          %
        </template>
      </el-table-column>
      <el-table-column v-if="isEditing && roleInfo.superLeader" label="操作" width="100">
        <template slot-scope="{ row, $index }">
          <el-button icon="el-icon-minus" circle @click="handleDelete($index)" />
          <el-button
            v-if="canInsert($index, row)"
            icon="el-icon-plus"
            circle
            @click="handleInsert($index, row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import moment from 'moment'

const DEFAULT_ITEM = {
  lowerLimit: undefined,
  commissionPercentage: 1,
  upperLimit: undefined
}
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
      loading: false,
      uppers: [],
      isEditing: false,
      changePosition: -1,
      changeType: 'insert',
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
  computed: {
    tableLen() {
      return this.tableData.length
    }
  },
  created() {
    this.getTeamConfig()
  },
  methods: {
    hideUpperLimit(row) {
      return !this.isEditing && !row.upperLimit
    },
    hideLowerLimit(index) {
      // 只有一条时需要展示
      return !this.isEditing && index === 0 && this.tableLen !== 1
    },
    canInsert(index) {
      const { tableLen, tableData } = this
      return (
        // !(index === tableLen - 1 && row.upperLimit === 100) &&
        !(
          index !== tableLen - 1 &&
          tableData[index + 1].upperLimit - tableData[index + 1].lowerLimit === 1
        )
      )
    },
    onCancel() {
      this.isEditing = false
      this.getTeamConfig()
    },
    onEdit() {
      this.isEditing = true
      this.insertOneIfEmpty()
    },
    insertOneIfEmpty() {
      if (this.tableLen === 0) {
        this.tableData = [DEFAULT_ITEM]
      }
    },
    async handleSave() {
      this.loading = true
      try {
        const configs = this.tableData.map((item) => {
          return {
            ...item,
            monthDate: item.monthDate ? moment(item.monthDate).format('YYYY-MM-DD') : this.monthDate
          }
        })
        const res = await this.jaxLib.salesComission.salesCommissionConfigTeamSave({ configs })
        if (res && res.success) {
          this.$message.success('保存成功')
          this.isEditing = false
          await this.getTeamConfig()
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    onLowerChange(index, value) {
      if (index !== 0) {
        const item = this.tableData[index - 1]
        if (item.lowerLimit >= value) {
          item.lowerLimit = undefined
        }
        item.upperLimit = value
      }
    },
    onUpperChange(index, value) {
      // 同步更新下一条的下限
      if (index !== this.tableLen - 1) {
        const item = this.tableData[index + 1]
        item.lowerLimit = value
        if (item.upperLimit <= value) {
          item.upperLimit = undefined
        }
      }
      // 如果直接填了100 则移除下方所有条件
      // if (value === 100) {
      //   this.tableData.splice(index + 1, this.tableLen - 1)
      // }
    },
    handeEnter(index, row) {
      if (this.$refs[`uppers-${index + 1}`]) {
        this.focusNext(index)
        return
      }
      this.handleInsert(index, row)
    },
    handleInsert(index, row) {
      if (!this.canInsert(index, row)) return
      this.changePosition = index
      this.changeType = 'insert'
      const { tableData } = this
      const current = tableData[index]
      if (tableData[index + 1]) {
        tableData[index + 1].lowerLimit = undefined
      }
      tableData.splice(index + 1, 0, {
        lowerLimit: current.upperLimit,
        commissionPercentage: 1,
        upperLimit: undefined
      })
      this.focusNext(index)
    },
    focusNext(index) {
      this.$nextTick(() => {
        const ref = this.$refs[`uppers-${index + 1}`]
        ref && ref.focus()
      })
    },
    handleDelete(index) {
      const { tableLen, tableData } = this
      const [removeItem] = tableData.splice(index, 1)
      // 删除当前条目时，需要将下一条下限设置为当前条目的下限
      // 如果只有一条，则不操作
      // 如果为最后一条，则不操作
      if (tableLen > 1 && removeItem.lowerLimit && index !== tableLen - 1) {
        tableData[index].lowerLimit = removeItem.lowerLimit
      }
      this.insertOneIfEmpty()
    },
    async getTeamConfig() {
      const res = await this.jaxLib.salesComission.salesCommissionConfigTeamPercentage({
        monthDate: this.monthDate
      })
      if (res && res.success) {
        this.tableData = res.data
      }
    }
  }
}
</script>

<style scoped></style>
