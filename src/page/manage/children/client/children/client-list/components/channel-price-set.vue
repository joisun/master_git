<script>
/**
   * Create by zeter on 2017/5/31
   */
  import { validateNumber } from '../mixin/validate'
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    props: {
      orgId: {
        default: String
      },
      pointOrgName: {
        default: String
      },
      dialogName: {
        default: String
      }
    },
    data() {
      return {
        priceForm: {
          cm: 0, // 移动单价
          cu: 0, // 联通单价
          ch: 0, // 电信单价
          description: ''
        },
        temPriceForm: {
          cm: 0, // 移动单价
          cu: 0, // 联通单价
          ch: 0 // 电信单价
        },
        priRules: {
          cu: [
            { validator: validateNumber, trigger: 'blur' }
          ],
          ch: [
            { validator: validateNumber, trigger: 'blur' }
          ]
        },
        formLabelWidth: '78px',
        priceCuON: false,
        priceChON: false
      }
    },
    watch: {
      priceCuON(val) {
        if (!val) {
          this.priceForm.cu = 0
        }
      },
      priceChON(val) {
        if (!val) {
          this.priceForm.ch = 0
        }
      }
    },
    methods: {
      // 打开
      async open() {
        let postData = {}
        postData.org_id = this.orgId
        this.jax('/ajax/customers/get_price', postData)
          .then(res => {
            if (res.success && res.data) {
              if (res.data.realUnicomPrice) {
                this.priceCuON = true
                this.priceForm.cu = res.data.realUnicomPrice
                this.temPriceForm.cu = res.data.realUnicomPrice
              }

              if (res.data.realChinanetPrice) {
                this.priceChON = true
                this.priceForm.ch = res.data.realChinanetPrice
                this.temPriceForm.ch = res.data.realChinanetPrice
              }
            }
          })
      },
      // 校验定制价格
      doModifyPrice() {
        if ((this.priceForm.cu === 0 && this.temPriceForm.cu > 0) || (this.priceForm.ch === 0 && this.temPriceForm.ch > 0)) {
          this.msg('很危险的操作哦', 'error')
          this.$notify({
            title: '警告',
            message: '这样随便关掉某个定价可能就要扣你工资了！所以我们还是别关了。',
            type: 'error'
          })
          return
        }
        this.$refs.priceForm.validate(valid => {
          if (valid) {
            this.postModifyPrice()
          }
        })
      },
      // 发送定制价格
      postModifyPrice() {
        let postData = {}
        postData.org_id = this.orgId
        postData.cmcc_price = 0
        postData.unicom_price = this.priceForm.cu
        postData.chinanet_price = this.priceForm.ch
        postData.description = this.priceForm.description

        this.jax('/ajax/customers/set_price', postData)
          .then(res => {
            if (res.success) {
              this.msg(`${this.pointOrgName}价格定制成功!`, 'success')
              this.$emit('closeDialog', this.dialogName, false)
            }
          })
      },
      // 关闭
      close() {
        this.priceVisible = false
        this.priceChON = false
        this.priceCuON = false
        this.priceForm = {
          cm: 0, // 移动单价
          cu: 0, // 联通单价
          ch: 0, // 电信单价
          description: ''
        }
        this.$emit('closeDialog', this.dialogName, false)
      }
    }

  }
</script>

<template>
  <div class="ChannelPrice">
    <el-form :model="priceForm" ref="priceForm" style="width: 440px" :rules="priRules">
      <el-form-item label="联通流量" :label-width="formLabelWidth">
        <el-switch on-text="" off-text="" v-model="priceCuON">
        </el-switch>
      </el-form-item>
      <el-form-item v-if="priceCuON" label="联通价格" :label-width="formLabelWidth" prop="cu">
        <el-input placeholder="请输入联通价格" v-model="priceForm.cu">
          <template slot="append">元/G</template>
        </el-input>
      </el-form-item>
      <el-form-item label="电信流量" :label-width="formLabelWidth">
        <el-switch on-text="" off-text="" v-model="priceChON">
        </el-switch>
      </el-form-item>
      <el-form-item v-if="priceChON" label="电信价格" :label-width="formLabelWidth" prop="ch">
        <el-input placeholder="请输入电信价格" v-model="priceForm.ch">
          <template slot="append">元/G</template>
        </el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="priceForm.description">
        </el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="wh-dialog-footer">
      <el-button type="text" @click.native="close">取 消</el-button>
      <el-button type="primary" @click.native="doModifyPrice">确 定</el-button>
    </span>
  </div>
</template>
