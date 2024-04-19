<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    title="报价设置"
    class="wh__dialog"
    width="640px"
    @close="closeDialog"
  >
    <div class="edit-price">
      <el-table size="mini" :data="table">
        <el-table-column prop="date" label="条件" min-width="500px">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.condition.dateStart"
              type="datetime"
              :disabled="scope.$index === 0"
              size="mini"
              style="width: 180px"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              @change="onDateStartChange(scope.$index)"
            >
            </el-date-picker>
            ≤卡购买时间＜
            <el-date-picker
              v-model="scope.row.condition.dateEnd"
              :disabled="scope.$index === table.length - 1"
              type="datetime"
              size="mini"
              style="width: 180px"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              picker-options=""
              @change="onDateEndChange(scope.$index)"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.$index === table.length - 1 && table.length < 4"
              icon="el-icon-plus"
              circle
              size="mini"
              @click="addItem(scope.$index)"
            />
            <el-button
              v-if="table.length > 1"
              icon="el-icon-minus"
              circle
              size="mini"
              @click="deleteItem(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import regexps from '@/constant/regexps'
import apis from '@/api/ajax'
import dateFormat from '@/global/filters/date-format'
const dateRule = [{ required: true, message: '请选择时间', trigger: 'blur' }]
export default {
  name: 'EditCondition',
  props: {
    orgName: {
      default: String
    },
    content: {
      default: Object
    },
    dialogName: {
      default: String
    },
    visible: {
      type: Boolean,
      required: true
    },
    id: {
      default: ''
    }
  },
  data() {
    return {
      dateRule
    }
  },
  computed: {
    table() {
      return this.content
    },
    orgId() {
      return this.$route.query.orgId
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false)
    },
    validateTable() {
      let valid = true
      for (let i = 0; i < this.table.length; i++) {
        const condition = this.table[i].condition
        if (!condition.dateStart || !condition.dateEnd) {
          valid = false
          break
        }
      }
      return valid
    },
    async save() {
      const valid = this.validateTable()
      if (valid) {
        this.$emit('updateTable', this.table)
        this.closeDialog()
      } else {
        this.$message.error('表格未填写完整，请重新填写')
      }
    },
    addItem(index) {
      const createItem = {
        price: undefined,
        commission: undefined,
        condition: {
          dateEnd: '',
          dateStart: ''
        }
      }
      this.table.splice(index + 1, 0, createItem)
      this.$nextTick(() => {
        this.table[0].condition.dateStart = '2000-01-01 00:00:00'
        if (this.table.length > 1) {
          for (let i = 0; i < this.table.length - 1; i++) {
            if (this.table[i].condition.dateEnd === '2999-12-31 23:59:59') {
              this.table[i].condition.dateEnd = ''
            }
          }
        }
        this.table[this.table.length - 1].condition.dateEnd = '2999-12-31 23:59:59'
      })
    },
    onDateEndChange(index) {
      if (this.table.length !== 1) {
        this.table[index + 1].condition.dateStart = this.table[index].condition.dateEnd
      }
    },
    onDateStartChange(index) {
      if (this.table.length !== 1) {
        this.table[index - 1].condition.dateEnd = this.table[index].condition.dateStart
      }
    },
    deleteItem(index) {
      if (index !== 0 && index !== this.table.length - 1) {
        this.table[index + 1].condition.dateStart = this.table[index - 1].condition.dateEnd
      }
      this.table.splice(index, 1)
      this.table[0].condition.dateStart = '2000-01-01 00:00:00'
      this.table[this.table.length - 1].condition.dateEnd = '2999-12-31 23:59:59'
    }
  }
}
</script>