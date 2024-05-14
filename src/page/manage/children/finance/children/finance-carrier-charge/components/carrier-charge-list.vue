<template>
  <div class="carrier-charge-list">
    <h3>运营商列表价</h3>
    <el-table :data="tableData" height="calc(100vh - 260px)">
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="计费类型" width="150">
        <template slot-scope="scope">
          <span  v-if="scope.row.old">{{scope.row.chargeTypeName}}</span>
          <el-select v-else v-model="scope.row.chargeEntryId" size="small" @change="changeChargeType">
            <el-option :value="i.id" :label="i.chargeTypeName" v-for="i in chargeRuleList" :key="i.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="计费规格" min-width="200">
        <template slot-scope="scope">
          <span v-if="!mode">{{scope.row.chargeSpecificationName}}</span>
          <template v-else>
            <span v-if="chargeItem[scope.$index].hidden">请先选择计费类型</span>
            <template>
              <el-input
                v-model="scope.row.chargeSpecification"
                size="small"
                type="number"
                @change="emitValue"
                v-if="chargeItem[scope.$index].chargeSpecification === 'POSITIVE'">
                <el-select
                  v-model="scope.row.chargeUnit"
                  slot="append"
                  size="small"
                  @change="emitValue"
                  style="width:100px;">
                  <el-option :label="name.replace('（API）', '')" :value="key" v-for="(name, key) in chargeItem[scope.$index].chargeUnitMap" :key="key">
                  </el-option>
                </el-select>
              </el-input>
              <template v-if="chargeItem[scope.$index].chargeSpecification === 'NUMBER'">
                <el-input
                  v-model="scope.row.chargeSpecification"
                  size="small"
                  :disabled="scope.row.infinite"
                  type="number"
                  @change="emitValue">
                  <el-select v-model="scope.row.infinite" @change="emitValue" slot="prepend"
                    style="width:70px;" placeholder="请选择">
                    <el-option label="数值" :value="false">
                    </el-option>
                    <el-option label="无限大" :value="true">
                    </el-option>
                  </el-select>
                  <el-select
                    v-model="scope.row.chargeUnit"
                    slot="append"
                    size="small"
                    @change="emitValue"
                    style="width:70px;">
                    <el-option :label="name.replace('（API）', '')" :value="key" v-for="(name, key) in chargeItem[scope.$index].chargeUnitMap" :key="key">
                    </el-option>
                  </el-select>
                </el-input>
              </template>
              <el-input v-model="scope.row.chargeSpecification" size="small"
                v-if="chargeItem[scope.$index].chargeSpecification === 'VALUE'" @change="emitValue">
              </el-input>
              <span v-if="chargeItem[scope.$index].chargeSpecification === 'NOTHING'"> 无</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="计费周期" min-width="150">
        <template slot-scope="scope">
          <span v-if="!mode">{{scope.row.chargePeriodRegulationName}}</span>
          <template v-else>
            <span  v-if="chargeItem[scope.$index].hidden">请先选择计费类型</span>
            <!-- 暂时隐藏短信包的自然月和个月选择 -->
            <!-- <template size="small" v-if="scope.row.chargeTypeName === '短信包费用'">
              <el-select
                v-model="regulationForm.chargePeriodRegulationName"
                v-if="regulationForm.chargePeriodRegulationName === '自然月'"
                slot="append"
                size="small"
                style="width:120px;">
                <el-option :label="item.name" :value="item.name" v-for="(item, index) in regulationList" :key="index">
                </el-option>
              </el-select>
              <el-input
                step="1"
                type="number"
                min="1"
                placeholder="请输入月份"
                size="small"
                v-model="scope.row.chargeValidity"
                v-else>
                <el-select
                  v-model="regulationForm.chargePeriodRegulationName"
                  slot="append"
                  size="small"
                  @change="smsRegulationChange"
                  style="width:80px;">
                  <el-option :label="item.name" :value="item.name" v-for="(item, index) in regulationList" :key="index">
                  </el-option>
                </el-select>
              </el-input>
            </template> -->
             <template size="small">
              <span v-if="!chargeItem[scope.$index].needValidity">
                {{chargeItem[scope.$index].chargePeriodRegulationName}}
              </span>
              <el-input step="1" type="number" min="1" placeholder="请输入月份" size="small"
                v-model="scope.row.chargeValidity" v-else @change="emitValue">
                <template slot="append">个月</template>
              </el-input>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="订购周期" min-width="80">
        <template slot-scope="scope">
          <span v-if="!mode">{{scope.row.cardPeriod}}</span>
          <el-input v-else step="1" type="number" min="1" size="small"
            v-model="scope.row.cardPeriod" :disabled="!chargeItem[scope.$index].allowCardPeriod" @change="emitValue">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="列表价(元)" width="120">
        <template slot-scope="scope">
          <span  v-if="!mode">{{scope.row.officialPrice}}</span>
          <template v-else>
            <span  v-if="chargeItem[scope.$index].hidden">请先选择计费类型</span>
            <el-input step="0.0001" type="number" v-model="scope.row.officialPrice" size="small" v-else @change="emitValue">
            </el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="mini" class="float-right" v-if="mode" @click="removeRow(scope.$index)" circle>
            <i class="el-icon-minus"></i>
          </el-button>
          <el-button v-if="scope.$index + 1 === tableData.length && mode" size="mini" circle
            class="float-right mr10" @click="addRow">
            <i class="el-icon-plus"></i>
          </el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="tac mb10"   v-if="tableData.length === 0">
          <el-button size="mini" @click="addRow" circle v-show="mode">
            <i class="el-icon-plus"></i>
          </el-button>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script>
  import itemCountMixins from '../mixins/item-count'
  import regexps from '@/constant/regexps'

  export default {
    mixins: [itemCountMixins],
    data() {
      return {
        regexps,
        tableData: [],
        baseItem: { chargeEntryId: '', chargeSpecification: '', chargeUnit: '', chargeValidity: 1, officialPrice: '', infinite: false, cardPeriod: 1 }
        // regulationList: [{ name: '自然月', value: 'mouthly'}, { name: '个月', value: 'yearly'}]
      }
    },
    props: {
      carrierCharge: {
        required: ''
      },
      carrier: {
        type: String,
        default: 'cmcc'
      },
      mode: {
        required: true,
        default: true
      },
      chargeRuleList: {
        type: Array,
        required: true
      }
    },
    computed: {
      chargeItem() {
        return this.tableData.map(m => {
          if (m.chargeEntryId) return this.chargeRuleList.find(n => m.chargeEntryId === n.id)
          return { hidden: true }
        })
      },
      chargePeriodRegulationMap() {
        return this.$store.state.overall.enum.chargePeriodRegulation || {}
      }
    },
    methods: {
      emitValue() {
        this.$emit('input', this.transferList(this.tableData))
      },
      transferList(data) {
        return data.map(e => {
          let rule = this.chargeRuleList.find(i => i.id === e.chargeEntryId)
          if (!rule) return e
          if (!rule.needValidity) e.chargeValidity = 1
          if (rule.chargeSpecification === 'NOTHING') e.chargeUnit = ''
          if (rule.chargeSpecification === 'NUMBER') {
            if (e.infinite) e.chargeSpecification = '-1'
          }
          return e
        })
      },
      changeChargeType() {
        this.$forceUpdate()
        this.emitValue()
      },
      async getList() {
        const transferName = (k, m) => {
          if (k.chargeSpecification === 'POSITIVE') {
            return `${m.chargeSpecification}${k.chargeUnitMap[m.chargeUnit]}`
          }
          if (k.chargeSpecification === 'NOTHING') {
            return '无'
          }
          if (k.chargeSpecification === 'NUMBER') {
            if (m.chargeSpecification === '-1') return '无限大'
            else return `${m.chargeSpecification}${k.chargeUnitMap[m.chargeUnit]}`
          }
          return m.chargeSpecification
        }
        if (!this.carrierCharge) return false
        let rst = await this.jaxLib.financial.getChargeDetail({
          carrier: this.carrier,
          carrierChargeId: this.carrierCharge
        })
        if (!rst.success) return false
        rst.data = rst.data ? rst.data.map(m => {
          let k = this.chargeRuleList.find(n => n.id === m.chargeEntryId)
          return {
            ...m,
            officialPrice: m.officialPrice / 10000,
            chargeTypeName: k.chargeTypeName,
            chargePeriodRegulationName: k.needValidity
              ? `${m.chargeValidity}个月(${m.chargeValidity}*30天)` : k.chargePeriodRegulationName,
            chargeSpecificationName: transferName(k, m),
            infinite: m.chargeSpecification === '-1'
          }
        }) : []
        this.tableData = this.initItem(rst.data)
      },
      async initData() {
        this.tableData = []
        await this.getList()
        this.emitValue()
      }
    },
    created() {
      this.initData()
    },
    watch: {
      carrierCharge() {
        this.initData()
      },
      mode() {
        this.initData()
      }
    }
  }
</script>
