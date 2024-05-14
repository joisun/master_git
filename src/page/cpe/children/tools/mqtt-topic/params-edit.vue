<script>
const paramsItems = { name: '', type: 'string', desc: '', example: '' }
import { typeDefaultValue } from './edit-topic'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      paramsList: [
        { ...paramsItems }
      ],
      typeDefaultValue
    }
  },
  created() {
    if (this.type === 'request') {
      this.paramsList.unshift({ name: 'id', type: 'string', example: 'EB0FF258-935C-C87C-91F4-C5D9B549DE7A', desc: '消息唯一ID，GUID生成' })
    }
  },
  watch: {
    value(val) {
      if (val.length) {
        this.paramsList = val
      }
    },
    paramsList: {
      handler: function(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {
    addRow() {
      this.paramsList.push({ ...paramsItems })
    },
    removeRow(index) {
      this.paramsList.splice(index, 1)
    }
  }
}
</script>

<template>
  <div class="params-edit">
    <el-table :data="paramsList">
      <el-table-column label="参数名">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" size="mini" placeholder="请输入参数名"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" size="mini">
            <el-option v-for="(item, key) in typeDefaultValue" :value="key" :key="key" :label="key"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="说明">
        <template slot-scope="scope">
          <el-input v-model="scope.row.desc" size="mini" placeholder="请输入参数说明"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="示例">
        <template slot-scope="scope">
          <el-input v-model="scope.row.example" size="mini" placeholder="请输入参数示例"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <div class="operation">
            <span v-if="paramsList.length > 1" class="el-icon-remove-outline" @click="removeRow(scope.$index)"></span>
            <span
              v-if="scope.$index === (paramsList.length - 1)"
              class="el-icon-circle-plus-outline"
              @click="addRow"
            >
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.operation {
  span {
    font-size: 18px;
    cursor: pointer;

    &:first-child {
      margin-right: 8px;
    }
  }
}
</style>
