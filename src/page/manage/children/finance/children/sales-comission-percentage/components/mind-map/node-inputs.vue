<template>
  <span>
    <div v-if="type === 'RECHARGE' && childNode.level === 3" style="width: 100px; font-size: 12px">
      <span v-if="childNode.rangeValues[1] === 1">首年（0-425天）</span>
      <span v-if="childNode.rangeValues[1] === 2">次年（426-790天）</span>
      <span v-if="childNode.rangeValues[1] === 3">两年以上（大于790天）</span>
      <span v-if="childNode.rangeValues[1] === Infinity">[0, ∞]</span>
    </div>
    <span v-else-if="childNode.rangeValues" style="display: inline-block; width: 400px">
      <template v-if="childNode.level === 2">
        <div style="display: inline-block">
          <el-input-number
            v-model="childNode.rangeValues[0]"
            :disabled="!isEditing"
            :controls="false"
            :style="{ width: isEditing ? '80px' : '100px' }"
            placeholder="下限"
            size="mini"
          />
          <el-select
            v-model="childNode.incomeLeft"
            :disabled="!isEditing"
            placeholder=""
            clearable
            style="width: 60px"
            size="mini"
          >
            <el-option
              v-for="d in openOrCloseOptions"
              :key="d.label"
              :value="d.label"
              :label="d.label"
              >{{ d.label }}</el-option
            >
          </el-select>
          ,
        </div>
        <div style="display: inline-block">
          <el-select
            v-model="childNode.incomeRight"
            :disabled="!isEditing"
            placeholder=""
            clearable
            style="width: 60px"
            size="mini"
          >
            <el-option v-for="d in openOrCloseOptions" :key="d.label" :value="d.label">{{
              d.label
            }}</el-option>
          </el-select>
          <el-input-number
            v-model="childNode.rangeValues[1]"
            :style="{ width: isEditing ? '80px' : '100px' }"
            :disabled="!isEditing"
            :controls="false"
            placeholder="上限"
            size="mini"
          />
        </div>
      </template>
      <template v-else>
        <div style="display: inline-block">
          <el-input-number
            v-model="childNode.rangeValues[0]"
            :disabled="!isEditing"
            :controls="false"
            :style="{ width: '60px' }"
            placeholder="下限"
            size="mini"
          />
          <el-select
            v-model="childNode.profitLeft"
            placeholder=""
            clearable
            :disabled="!isEditing"
            style="width: 60px"
            size="mini"
          >
            <el-option
              v-for="d in openOrCloseOptions"
              :key="d.label"
              :value="d.label"
              :label="d.label"
              >{{ d.label }}</el-option
            >
          </el-select>
          ,
        </div>
        <div style="display: inline-block">
          <el-select
            v-model="childNode.profitRight"
            placeholder=""
            clearable
            :disabled="!isEditing"
            style="width: 60px"
            size="mini"
          >
            <el-option v-for="d in openOrCloseOptions" :key="d.label" :value="d.label">{{
              d.label
            }}</el-option>
          </el-select>
          <el-input-number
            v-model="childNode.rangeValues[1]"
            :style="{ width: '60px' }"
            :disabled="!isEditing"
            :controls="false"
            placeholder="上限"
            size="mini"
          />
        </div>
      </template>
      <template v-if="isEditing">
        <el-button
          v-if="parentNode.children.length !== 1"
          icon="el-icon-delete"
          size="mini"
          @click="deleteNode(parentNode, childIndex)"
        />
        <el-button
          icon="el-icon-plus"
          style="margin-left: 0px"
          size="mini"
          @click="addChild(parentNode, childIndex, childNode)"
        />
      </template>
    </span>
    <span v-if="!childNode.children">
      <el-input-number
        v-model="childNode.incomeCommission"
        :disabled="!isEditing"
        :controls="false"
        style="width: 80px"
        :precision="2"
        :step="0.01"
        placeholder="收入提成比例"
        size="mini"
      />
      <el-input-number
        v-model="childNode.profitCommission"
        size="mini"
        :controls="false"
        :disabled="!isEditing"
        :precision="2"
        :step="0.01"
        style="width: 80px; margin-left: 50px"
        placeholder="毛利提成比例"
      />
    </span>
  </span>
</template>
<script>
import { levelWidths } from '@/page/manage/children/finance/children/sales-comission-percentage/components/mind-map/utils'
const openOrCloseOptions = [
  {
    label: '<'
  },
  {
    label: '<='
  }
]
function copyByCurrent(data) {
  const node = { ...data }
  ;['incomeCommission', 'profitCommission'].forEach((key) => {
    if (node.key) {
      node[key] = undefined
    }
  })
  if (node.children && node.children.length) {
    node.children = [copyByCurrent(node.children[0])]
  }
  if (node.rangeValues) {
    node.rangeValues = [undefined, undefined]
  }
  node.key = `${node.key}-${Date.now()}`
  return node
}
function copyByCurrentLevelRechargeLevel(data) {
  const node = { ...data }
  ;['incomeCommission', 'profitCommission'].forEach((key) => {
    if (node.key) {
      node[key] = undefined
    }
  })
  if (node.children && node.children.length) {
    node.children =
      node.level === 2
        ? JSON.parse(
            JSON.stringify(node.children.map((item) => copyByCurrentLevelRechargeLevel(item)))
          )
        : [copyByCurrent(node.children[0])]
  }
  if (node.rangeValues && node.level !== 3) {
    node.rangeValues = [undefined, undefined]
  }
  node.key = `${node.key}-${Date.now()}`
  return node
}
export default {
  filters: {
    rangeMark(val, side) {
      const map = {
        right: {
          '<': ')',
          '<=': ']'
        },
        left: {
          '<': '(',
          '<=': '['
        }
      }
      return map[side][val]
    }
  },
  props: {
    childNode: Object,
    parentNode: Object,
    childIndex: Number,
    type: String,
    isEditing: Boolean
  },
  data() {
    return {
      openOrCloseOptions,
      levelWidths: levelWidths
    }
  },
  computed: {},
  methods: {
    deleteNode(parentNode, childIndex) {
      parentNode.children.splice(childIndex, 1)
    },
    addChild(parentNode, index, childNode) {
      let copyData = { ...copyByCurrent(childNode) }
      if (childNode.level === 2 && this.type === 'RECHARGE') {
        copyData = { ...copyByCurrentLevelRechargeLevel(childNode) }
      }
      parentNode.children.splice(index + 1, 0, copyData)
    }
  }
}
</script>
