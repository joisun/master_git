<template>
  <div class="relation-carrier-account">
    <h3>关联运营商账号</h3>
    <el-table :data="tableData" height="calc(100vh - 260px)">
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="运营商账号">
        <template slot-scope="scope">
          <el-select v-model="scope.row.carrierAccountId" :disabled="scope.row.old"
            @change="changeAccount($event, scope.$index)" size="small" style="width: 100%;">
            <el-option :value="i.id" :label="i.name" :disabled="i.disabled" v-for="i in carrierAccountFilterList" :key="i.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="mini" class="float-right" @click="removeRow(scope.$index)" circle v-if="!scope.row.old">
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
            <el-button size="mini" @click="addRow" v-show="mode" circle>
              <i class="el-icon-plus"></i>
            </el-button>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script>
  import itemCountMixins from '../mixins/item-count'

  export default {
    mixins: [itemCountMixins],
    data() {
      return {
        carrierAccountList: [],
        tableData: [],
        baseItem: { carrierAccountId: '', carrier: this.carrier }
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
      }
    },
    computed: {
      carrierAccountFilterList() {
        let arr = []
        this.carrierAccountList.map((m) => {
          let k = this.tableData.filter(n => n.carrierAccountId === m.id).length
          if (k) arr.push({ ...m, disabled: true })
          else arr.push(m)
          return false
        })
        return arr
      }
    },
    methods: {
      async initData() {
        await this.getList()
        await this.$store.dispatch('changeAccountList', { carrier: this.carrier })
        this.carrierAccountList = this.$store.state.carrierAccount[`${this.carrier}AccountList`]
      },
      async getList() {
        if (!this.carrierCharge) return false
        let rst = await this.jaxLib.financial.getChargeCarrier({
          carrier: this.carrier,
          carrierChargeId: this.carrierCharge
        })
        if (!rst.success) return false
        this.tableData = this.initItem(rst.data || [])
      },
      changeAccount() {
        this.$forceUpdate()
        this.emitValue()
      },
      emitValue() {
        this.$emit('input', this.tableData.filter(e => !e.old && e.carrierAccountId))
      },
      async reset() {
        this.tableData = []
        await this.initData()
        this.emitValue()
      }
    },
    created() {
      this.initData()
    },
    watch: {
      carrierCharge() {
        this.reset()
      },
      mode() {
        this.reset()
      }
    }
  }
</script>
