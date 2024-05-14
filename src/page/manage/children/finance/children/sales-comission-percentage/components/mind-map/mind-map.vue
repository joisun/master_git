<template>
  <div v-loading="loading" class="mind-map">
    <div style="margin: 10px; text-align: right">
      <template v-if="!isEditing">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </template>
      <el-button v-if="isEditing" type="primary" @click="submit">保存</el-button>
      <el-button v-if="isEditing" @click="cancelEdit">取消</el-button>
    </div>
    <div class="mind-map-header">
      <div class="header-item">订单类型</div>
      <div class="header-item" style="width: 350px">收入金额区间</div>
      <div v-if="type === 'RECHARGE'" class="header-item" style="width: 160px">续费时间</div>
      <div class="header-item" style="width: 350px">毛利率区间(%)</div>
      <div class="header-item" style="padding-left: 30px">收入提成比例(%)</div>
      <div class="header-item" style="padding-left: 30px">毛利提成比例(%)</div>
    </div>
    <template v-for="(node, index) in nodes">
      <div :key="node.key" class="node" :style="{ background: index % 2 ? '#fff' : '#fff' }">
        <div style="width: 50px; font-size: 12px">
          {{ node.key | commissionOrderTypeFilter }}
        </div>
        <div v-if="node.children.length > 0" :key="node.key" class="children" style="border: none">
          <mind-map-node
            v-for="(childNode, childIndex) in node.children"
            :key="childNode.key"
            :index="childIndex"
            :level="2"
            :node="childNode"
            :parent-node="node"
            :is-editing="isEditing"
            :type="type"
          >
            <template #default="{ childNode, childIndex }">
              <node-inputs
                :is-editing="isEditing"
                :child-node="childNode"
                :child-index="childIndex"
                :parent-node="node"
                :type="type"
              />
            </template>
          </mind-map-node>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import MindMapNode from './mind-map-node.vue'
import {
  collectByParent,
  convertHierarchicalDataToFlatArray,
  convertHierarchicalDataToFlatArrayRecharge,
  findNonContinuousRanges,
  levelWidths
} from '@/page/manage/children/finance/children/sales-comission-percentage/components/mind-map/utils'
import NodeInputs from '@/page/manage/children/finance/children/sales-comission-percentage/components/mind-map/node-inputs.vue'

function removeItemFromArrayByKey(array, itemKey) {
  const index = array.findIndex((item) => item.key === itemKey)
  if (index !== -1) {
    array.splice(index, 1) // Remove 1 element at the found index
  }
}

export const NEW_ORDER_CHILD_DEFAULT_ROW_LEVE_2 = (parentKey, orderType) => {
  const key = `${parentKey}_${Date.now()}`
  return JSON.stringify({
    parentKey,
    key,
    orderType,
    rangeValues: [],
    children: [
      {
        profitCommission: '',
        children: []
      }
    ]
  })
}
export const NEW_ORDER_CHILD_DEFAULT_ROW_LEVE_1 = (parentKey, orderType) => {
  const key = `${parentKey}_${Date.now()}`
  return JSON.stringify({
    parentKey,
    key,
    orderType,
    label: '收入金额区间',
    rangeValues: [],
    children: [JSON.parse(NEW_ORDER_CHILD_DEFAULT_ROW_LEVE_2(key, orderType))]
  })
}
export default {
  components: {
    NodeInputs,
    MindMapNode
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    type: String,
    monthDate: String
  },
  data() {
    return {
      levelWidths: levelWidths,
      nodes: [],
      isEditing: false,
      loading: false
    }
  },
  watch: {
    list: {
      handler(value) {
        this.nodes = collectByParent(
          value,
          this.type === 'INCOME'
            ? ['orderType', 'incomeLimit', 'profitLimit']
            : ['orderType', 'incomeLimit', 'rechargeLimit', 'profitLimit']
        )
        console.log('🎸 DEBUG_124 mind-map.vue 👉', this.nodes)
      },
      immediate: true
    }
  },
  methods: {
    cancelEdit() {
      this.isEditing = false
      this.$emit('refresh')
    },
    handleEdit() {
      this.isEditing = true
    },
    async submit() {
      if (findNonContinuousRanges(this.nodes).length) {
        this.$message.error(' 存在不连续区间，或者重复区间请检查')
        return
      }
      const list =
        this.type === 'INCOME'
          ? convertHierarchicalDataToFlatArray(this.nodes)
          : convertHierarchicalDataToFlatArrayRecharge(this.nodes)
      const hasEmpty = list.some((item) => {
        const keys = [
          'profitCommission',
          'profitLimit',
          'rechargeLimit',
          'incomeCommission',
          'incomeLimit'
        ]
        for (let i = 0; i < keys.length; i++) {
          if (!item[keys[i]] && item[keys[i]] !== 0) {
            return true
          }
        }
      })
      if (hasEmpty) {
        return this.$message.error('请完整填写表单')
      }
      this.loading = true
      const res = await this.jaxLib.salesComission.saveSalesComissionPercentage({
        list: list.map((item) => {
          return {
            ...item,
            profitCommission: (item.profitCommission / 100).toFixed(4),
            incomeCommission: (item.incomeCommission / 100).toFixed(4),
            profitLimit: (item.profitLimit / 100).toFixed(2),
            rechargeLimit:
              item.orderType === 'GENERAL' && +item.rechargeLimit === 3 ? -1 : item.rechargeLimit
          }
        }),
        monthDate: this.monthDate,
        type: this.type
      })
      this.loading = false
      if (!res.success) return
      this.isEditing = false
      this.$message.success('保存成功')
      this.$emit('save')
    }
  }
}
</script>

<style>
.mind-map {
  .mind-map-header {
    margin-bottom: 10px;
    padding: 10px 5px;
    font-size: 14px;
    background-color: #fff;
    display: flex;
    .header-item {
      text-align: center;
      &:first-child {
        width: 70px;
      }
    }
  }
}

.mind-map .node {
  align-items: center;
  display: flex;
  padding: 5px;
  margin: 10px 0;
}

.mind-map .children {
  margin-left: 5px;
  position: relative;
  padding: 0 5px;
  border: 1px dashed #cdcdcd;
}

</style>
