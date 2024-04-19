<template>
  <el-table :data="tableData" class="table">
    <el-table-column label="材质" width="160">
      <template slot-scope="scope">
        <el-select v-model="scope.row.material" @change="scope.row.size = []" :disabled="isOfferSetting">
          <el-option
            v-for="item in options.material"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            :disabled="tableData.map(i => i.material).includes(item.value)"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="规格" width="300px">
      <template slot-scope="scope">
        <el-select
          v-model="scope.row.size"
          multiple
          :disabled="!scope.row.material || isOfferSetting"
          style="width: 180px"
          @change="onSizeChange(scope.row, $event)"
        >
          <el-option
            label="标准卡"
            :value="1"
            v-show="['plasticStick', 'ceramicsStick'].indexOf(scope.row.material) === -1"
          />
          <el-option
            label="Micro"
            :value="2"
            v-show="['plasticPlug', 'ceramicsPlug', 'epoxy', 'vehicle'].indexOf(scope.row.material) > -1"
          />
          <el-option
            label="Nano"
            :value="3"
            v-show="['plasticPlug', 'ceramicsPlug', 'epoxy', 'vehicle'].indexOf(scope.row.material) > -1"
          />
          <el-option label="5*5mm" :value="4" v-show="['epoxy', 'vehicle'].indexOf(scope.row.material) > -1"/>
          <el-option label="5*6mm" :value="5" v-show="['plasticStick', 'ceramicsStick', 'epoxy', 'vehicle'].indexOf(scope.row.material) > -1"/>
          <el-option label="2*2mm" :value="6" v-show="['plasticStick', 'ceramicsStick', 'epoxy', 'vehicle'].indexOf(scope.row.material) > -1" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="报价">
      <template slot-scope="scope">
        <el-input-number
          :min="0"
          v-model="scope.row.offerPrice"
          :controls="false"
          :disabled="isOfferSetting && !scope.row.status"
        /> </template
      >元
    </el-table-column>
    <el-table-column label="有效报价">
      <template slot-scope="scope">
        <el-select v-model="scope.row.validOfferPrice" multiple :disabled="isOfferSetting">
          <el-option v-for="item in offerPriceIdList" :key="item" :value="item">
            {{ item }}
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="70">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.status" :disabled="isOfferSetting"/>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="90" v-if="!isOfferSetting">
      <template slot-scope="scope">
        <el-button
          icon="el-icon-minus"
          circle
          size="mini"
          v-show="tableData.length > 1"
          @click="onDeleteClick(scope.row.id)"
        />
        <el-button icon="el-icon-plus" circle size="mini" @click="onAddClick" v-show="tableData.length < 4 && scope.$index === tableData.length - 1"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props: {
      offerPriceIdList: {
        required: true,
        type: Array
      },
      isOfferSetting: {
        required: false,
        type: Boolean
      },
      data: {
        default: [],
        required: true
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
        }
      }
    },
    methods: {
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
      getMaxMaterialPrice () {
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
          if (
            !item.material ||
            !item.size.length ||
            (!item.offerPrice && item.offerPrice !== 0)
          ) {
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
        const maxId = this.tableData.length
          ? this.tableData[this.tableData.length - 1].id
          : 0
        this.tableData.push({
          id: maxId + 1,
          material: '',
          size: '',
          offerPrice: '',
          validOfferPrice: [],
          disabled: false
        })
      }
    },
    computed: {
      tableData() {
        if (!this.data.length) {
          return [
            {
              id: 0,
              material: '',
              size: [],
              offerPrice: '',
              validOfferPrice: [],
              status: true
            }
          ]
        }
        return this.data
      }
    }
  }
</script>
