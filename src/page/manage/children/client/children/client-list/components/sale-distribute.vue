<script>
/**
   * Create by zeter on 2017/5/31
   */
  import { validateSell } from '../mixin/validate'
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import whSalesSelect from '@/page/components/wh-sales-select.vue'

  export default {
    mixins: [DialogMixin],
    props: {
      orgId: {
        default: String
      },
      pointOrgName: {
        default: String
      },
      orgContent: {
        default: Object
      },
      dialogName: {
        default: String
      }
    },
    data() {
      return {
        saleList: [],
        saleForm: {
          dcName: '',
          saleName: '',
          saleRemark: ''
        },
        choseName: '',
        choseId: '',
        setRule: {
          dcName: [
            { validator: validateSell, trigger: 'change' }
          ],
          saleName: [
            { validator: validateSell, trigger: 'change' }
          ]
        },
        dctitle: '请选择'
      }
    },
    async mounted() {
      let sellerList = await this.jaxLib.customer.sell.sellerList()
      if (sellerList.success) {
        this.saleList = sellerList.data
        this.dctitle = '您无权选择该项'
        this.saleForm.saleName = 'liuli'
      }
    },
    methods: {
      open() {
        let org = this.orgContent
        if (org.saleName !== '') {
          // 销售归属优化 去除dcName 默认传空
          this.saleForm.dcName = ''
          this.saleForm.saleRemark = org.saleRemark || ''
        }
        this.choseName = org.orgName
      },
      sureSell() {
        this.$refs.saleForm.validate((valid) => {
          if (valid) {
            this.changSell()
          }
        })
      },
      async changSell() {
        let sellArrange = await this.jaxLib.customer.sell.sellchange(this.orgId, this.saleForm)
        if (sellArrange.success) {
          this.$message.success('分配成功了哦~😯')
          this.$emit('closeDialog', this.dialogName, true)
        } else {
          this.$message.error(sellArrange.message)
        }
      },
      close() {
        this.choseName = ''
        this.saleForm = {
          dcName: '',
          saleName: 'liuli',
          saleRemark: ''
        }
        this.$refs.saleForm.resetFields()
        this.$emit('closeDialog', this.dialogName, false)
      }
    },
    components: {
      'wh-sales-select': whSalesSelect
    }
  }
</script>

<template>
  <div class="sale-distribute">
    <el-form :model="saleForm" style="width: 350px" :rules="setRule" ref="saleForm" label-width="90px">
      <div class="tipTitle">您要把 {{choseName}} 客户分配给:</div>
      <el-form-item label="客户销售" prop="saleName">
        <wh-sales-select v-model="saleForm.saleName" disabled/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="saleForm.saleRemark">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="wh-dialog-footer">
      <el-button type="text" @click="close">取 消</el-button>
      <el-button type="primary" @click.native="sureSell">确 定</el-button>
    </span>
  </div>
</template>
