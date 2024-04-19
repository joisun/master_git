<template>
  <el-table :data="tableData" class="table">
    <el-table-column label="材质" width="160">
      <template slot-scope="scope">
        <el-select v-model="scope.row.material" disabled @change="scope.row.size = []">
          <el-option
            v-for="item in options.material"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="规格" width="300px">
      <template slot-scope="scope">
        <el-select
          v-model="scope.row.size"
          multiple
          disabled
          style="width: 180px"
          @change="onSizeChange(scope.row, $event)"
        >
          <el-option
            v-show="['plasticStick', 'ceramicsStick'].indexOf(scope.row.material) === -1"
            label="标准卡"
            :value="1"
          />
          <el-option
            v-show="
              ['plasticPlug', 'ceramicsPlug', 'epoxy', 'vehicle'].indexOf(scope.row.material) > -1
            "
            label="Micro"
            :value="2"
          />
          <el-option
            v-show="
              ['plasticPlug', 'ceramicsPlug', 'epoxy', 'vehicle'].indexOf(scope.row.material) > -1
            "
            label="Nano"
            :value="3"
          />
          <el-option
            v-show="['epoxy', 'vehicle'].indexOf(scope.row.material) > -1"
            label="5*5mm"
            :value="4"
          />
          <el-option
            v-show="
              ['plasticStick', 'ceramicsStick', 'epoxy', 'vehicle'].indexOf(scope.row.material) > -1
            "
            label="5*6mm"
            :value="5"
          />
          <el-option
            v-show="
              ['plasticStick', 'ceramicsStick', 'epoxy', 'vehicle'].indexOf(scope.row.material) > -1
            "
            label="2*2mm"
            :value="6"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="报价">
      <template slot-scope="scope">
        <el-input-number
          v-model="scope.row.offerPrice"
          :min="0"
          :controls="false"
          :disabled="!scope.row.status || isUnique || isUniPirce"
        /> </template
      >元
    </el-table-column>
    <el-table-column label="有效报价">
      <template slot-scope="scope">
        <el-tag
          v-for="item in scope.row.validOfferPrice"
          :key="item"
          style="margin: 4px"
          :value="item"
          type="success"
          :closable="scope.row.validOfferPrice.length > 1"
          @close="onOfferClose(scope.row, item)"
        >
          {{ item }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="70">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.status" disabled />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { cloneDeep, without } from 'lodash'

export default {
  props: {
    isUniPirce: {
      required: true,
      type: Boolean,
      default: false
    },
    offerPriceIdList: {
      required: true,
      type: Array
    },
    data: {
      default: () => [],
      required: true
    },
    isUnique: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      options: {
        minActivateTime: [1, 2, 3, 4, 5, 6],
        maxActivateTime: [1, 2, 3, 4, 5, 6],
        material: [
          {
            value: 'plasticPlug',
            label: '塑料插拔卡'
          },
          {
            value: 'plasticStick',
            label: '塑料贴片卡'
          },
          {
            value: 'ceramicsPlug',
            label: '陶瓷插拔卡'
          },
          {
            value: 'ceramicsStick',
            label: '陶瓷贴片卡'
          },
          {
            value: 'epoxy',
            label: '环氧树脂'
          },
          {
            value: 'vehicle',
            label: '车规级'
          }
        ]
      },
      tableData: []
    }
  },
  watch: {
    data(v) {
      if (!v.length) {
        this.tableData = [
          {
            id: 0,
            material: '',
            size: [],
            offerPrice: '',
            validOfferPrice: [],
            status: true
          }
        ]
      } else {
        this.tableData = cloneDeep(this.data)
      }
    }
  },
  methods: {
    // 材质规格有效报价关闭时调用
    onOfferClose(row, index) {
      const cloneRow = cloneDeep(row)
      cloneRow.validOfferPrice = [index]
      row.validOfferPrice = without(row.validOfferPrice, index)
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === row.id) {
          this.tableData.splice(i + 1, 0, cloneRow)
          break
        }
      }
    },
    onDeleteClick(id) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id === id && this.tableData.length > 1) {
          this.tableData.splice(i, 1)
          break
        }
      }
    },
    resetTable() {
      this.tableData.splice(0, this.tableData.length)
      this.onAddClick()
    },
    getMaxMaterialPrice() {
      let maxPrice = this.tableData[0].offerPrice
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].offerPrice > maxPrice) {
          maxPrice = this.tableData[i].offerPrice
        }
      }
      return maxPrice
    },
    // 表格校验
    validate() {
      // 判断所有报价都有对应的材质
      let valid = true

      // 判断每个报价是否都有对应材质
      let tableOfferPrice = []
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i]
        if (item.status) {
          tableOfferPrice = tableOfferPrice.concat(item.validOfferPrice)
        }
        if (!item.material || !item.size.length || (!item.offerPrice && item.offerPrice !== 0)) {
          valid = false
          this.msg('材质规格表存在部分字段未填写，请填写', 'error')
          break
        }
      }

      if (valid) {
        for (let i = 0; i < this.offerPriceIdList.length; i++) {
          if (!tableOfferPrice.includes(this.offerPriceIdList[i])) {
            valid = false
            this.msg('每个报价都需要对应材质，请重新选择', 'error')
            break
          }
        }
      }
      return valid
    },
    getTableData() {
      return this.tableData
    },
    onSizeChange(row, $event) {
      if (row.material === 'plastic' && $event.includes(4)) {
        if ($event[0] === 4 && $event.length > 1) {
          row.size.shift()
        } else {
          row.size = [4]
        }
      }
      if (row.material === 'ceramics') {
        if (row.size.length > 1) {
          row.size.shift()
        }
      }
    },
    onAddClick() {
      const maxId = this.tableData.length ? this.tableData[this.tableData.length - 1].id : 0
      this.tableData.push({
        id: maxId + 1,
        material: '',
        size: '',
        offerPrice: '',
        validOfferPrice: [],
        disabled: false
      })
    }
  }
}
</script>
