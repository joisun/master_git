<script>
/**
   * Create by zeter on 2017/5/31
   */
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import regexps from '@/constant/regexps'
  import apis from '@/api/ajax'
  import dateFormat from '@/global/filters/date-format'
  const injectionPrice = (o, content) => ({ ...o, simbossPrice: content.price, bottomPrice: content.bottomPrice })
  const dateRule = [{ required: true, message: '请选择时间', trigger: 'blur' }]
  const moneyRule = [
    { pattern: regexps.money, required: true, message: '请输入正确金额', trigger: 'blur' }]
  export default {
    name: 'edit-condition',
    mixins: [DialogMixin],
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
      orgId: {
        default: Number
      }
    },
    data() {
      return {
        dateRule,
        moneyRule,
        loading: false,
        form: {
          table: []
        }
      }
    },
    methods: {
      open() {
        const baseTable = { 'dateStart': '2000-01-01 00:00:00', 'dateEnd': '2999-12-31 23:59:59', 'price': this.content.price, 'commission': this.content.profitMoney || 0 }
        const invalid = !this.content.conditions.length || (this.content.conditions[0].invalid)
        if (invalid) {
          this.form.table.push(injectionPrice(baseTable, this.content))
        } else {
          this.form.table = this.content.conditions.map(e => injectionPrice({ ...e, dateStart: dateFormat(e.dateStart), dateEnd: dateFormat(e.dateEnd) }, this.content))
        }
      },
      save() {
        this.$refs.form.validate(async valid => {
          if (!valid) return false
          for (const i in this.form.table) {
            if (i !== '0') {
              this.form.table[i].dateStart = this.form.table[i - 1].dateEnd
            }
          }
          this.loading = true
          const { success } = await apis.customer.updateCustomConditionPrice({
            orgId: this.orgId,
            sysOfferId: this.content.id,
            conditions: this.form.table
          })
          if (!success) return false
          this.$message.success('修改条件报价成功')
          this.$emit('closeDialog', this.dialogName, true)
        })
      },
      close() {
        this.$emit('closeDialog', this.dialogName, false)
        this.form.table = []
      },
      addItem(index) {
        console.log(index)
        let createItem 
        if (this.form.table.length === 1) {
          createItem = { 'dateStart': '', 'dateEnd': this.form.table[index].dateEnd, 'price': this.content.price, 'commission': this.content.profitMoney || 0 }
          this.form.table[index].dateEnd = ''
        } else {
          createItem = { 'dateStart': '', 'dateEnd': '', 'price': this.content.price, 'commission': this.content.profitMoney || 0 }
        }
        this.form.table.splice(index + 1, 0, injectionPrice(createItem, this.content))
      }
    }
  }
</script>

<template>
  <div class="edit-price">
    <div class="wh__dialog--header">
      <span class="wh__dialog--header-title">报价ID: {{content.id}}</span>&nbsp;&nbsp;&nbsp;
      <span class="wh__dialog--header-title">客户: {{orgName}}</span>
    </div>
    <div class="wh__dialog--body">
      <el-form
        :model="form"
        :inline="true"
        ref="form">
        <el-table
          size="mini"
          :data="form.table"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="条件设置"
            min-width="600">
            <template slot-scope="scope">
              <template>
                <el-form-item v-if="scope.$index === 0">
                  <el-date-picker
                    v-model="scope.row.dateStart"
                    :disabled="true"
                    type="datetime"
                    size="mini"
                    style="width:180px;"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-else>
                  <el-date-picker
                    v-model="form.table[scope.$index - 1].dateEnd"
                    type="datetime"
                    size="mini"
                    style="width:180px;"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                  </el-date-picker>
                </el-form-item>
              </template>
              ≤卡购买时间＜
              <el-form-item :rules="dateRule" :prop="`table.${scope.$index}.dateEnd`">
                <el-date-picker
                  v-model="scope.row.dateEnd"
                  type="datetime"
                  :disabled="(scope.$index === (form.table.length - 1) || form.table.length === 1)"
                  size="mini"
                  style="width:180px;"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="00:00:00">
                </el-date-picker>
                <template v-if="['package', 'pool-package'].indexOf(content.offerType) < 0">
                  <el-button icon="el-icon-plus" circle @click="addItem(scope.$index)" size="mini"
                     v-if="form.table.length === 1 || (scope.$index !== (form.table.length - 1)) && form.table.length < 4">
                  </el-button>
                </template>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="simbossPrice"
            label="平台报价">
          </el-table-column>
          <el-table-column
            prop="bottomPrice"
            label="销售底价">
          </el-table-column>
          <el-table-column
            min-width="130"
            label="报价">
            <template slot-scope="scope">
              <el-form-item :rules="moneyRule" :prop="`table.${scope.$index}.price`">
                <el-input
                  v-model="scope.row.price"
                  size="mini"
                  placeholder="请输入服务费销售报价"
                  type="number"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            min-width="130"
            label="返佣金额">
            <template slot-scope="scope">
              <el-form-item :rules="moneyRule" :prop="`table.${scope.$index}.commission`">
                <el-input
                  v-model="scope.row.commission"
                  size="mini"
                  placeholder="请输入服务费销售报价"
                  type="number"
                />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div class="wh__dialog--footer">
      <el-button type="primary" @click="save" class="">提交</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>
