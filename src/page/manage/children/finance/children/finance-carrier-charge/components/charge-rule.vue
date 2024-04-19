<template>
  <div class="charge-rule">
    <p>提示：</p>
    <p>1.联通周期：每月27日00:00:00至次月26日23:59:59</p>
    <p>2.自然月底（时间到期）：套餐用量用尽但是未到计费周期截止时间，套餐不结束；套餐从激活当月开始算，到计费周期截止月份的自然月月底。</p>
    <br>
    <el-table :data="chargeRuleList" height="calc(100vh - 260px)">
      <el-table-column label="序号" width="80px">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column v-for="item in columns"
        :key="item.key"
        :prop=item.key
        :label=item.name
        :min-width=item.width
        :align=item.align
        :class-name="item.style"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { RULE_LIST as columns } from '../mixins/const'

  export default {
    data() {
      return {
        columns
      }
    },
    props: {
      chargeRuleList: {
        type: Array,
        required: true
      }
    },
    methods: {
    },
    mounted() {
    }
  }
</script>
