<script>
  import apis from '@/api/ajax'
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import moment from 'moment'

  export default {
    data() {
      return {
        supplierProductList: [],
        isLoading: false,
        formData: {
          productId: '',
          productionDate: '',
          warrantyPeriod: '',
          price: '',
          batchNo: '',
          macAddrs: ''
        },
        formDataRules: {
          productId: { required: true, message: '产品型号不能为空', trigger: 'change' },
          productionDate: { required: true, message: '出厂日期不能为空', trigger: 'blur' },
          warrantyPeriod: [
            { required: true, message: '保修周期不能为空', trigger: 'blur' },
            { type: 'number', min: 1, max: 9999, message: '保修周期不合法', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '产品单价不能为空', trigger: 'blur' },
            { validator: (rule, value, callback) => {
                if (!/^\d+(.\d+)?$/.test(value)) {
                  callback(new Error('产品单价不合法'))
                }
                callback()
              },
              trigger: 'blur'
            }
          ],
          batchNo: { required: true, message: '批次号不能为空', trigger: 'blur' },
          macAddrs: { required: true, message: 'Mac地址不能为空', trigger: 'blur' }
        },
        isSearchLoading: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
      }
    },
    created() {
      this.searchProduct()
    },
    methods: {
      backList() {
        this.$router.replace({ name: 'cpe-stock-list' })
      },
      async searchProduct(search) {
        this.isSearchLoading = true
        const { success, data } = await apis.cpe.supplierProductSearch({ search })
        this.isSearchLoading = false
        if (!success) {
          return false
        }
        this.supplierProductList = data
      },
      async onSubmit() {
        this.$refs.formRef.validate(async valid => {
          if (!valid) {
            return false
          }
          const macAddrs = iccidsTransfer(this.formData.macAddrs)
          const productionDate = moment(this.formData.productionDate).format('YYYY-MM-DD')
          const data = { ...this.formData, productionDate, macAddrs }
          this.isLoading = true
          const { success } = await apis.cpe.stockImport(data)
          this.isLoading = false
          if (!success) {
            return false
          }
          this.$message({ type: 'success', message: '入库成功' })
          this.backList()
        })
      }
    }
  }
</script>

<template>
  <div class="wh-app-wrap cpe-stock-in">
    <div class="wh__header">
      <div class="wh__header--title">入库</div>
      <span class="wh__header--close">
        <el-tooltip content="返回列表" placement="left" effect="dark">
          <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
        </el-tooltip>
      </span>
    </div>
    <div class="wh__body">
      <el-form label-width="120px" ref="formRef" :model="formData" :rules="formDataRules">
        <el-form-item label="型号：" prop="productId">
          <el-select
            v-model="formData.productId"
            placeholder="请输入供应商名称/供应商产品型号/商品型号"
            :loading="isSearchLoading"
            :remote-method="searchProduct"
            remote
            filterable
            clearable
          >
            <el-option
              v-for="item in supplierProductList"
              :key="item.id"
              :value="item.id"
              :label="item.supplierName + '(' + item.model + ')' + '-' + item.itemName + '(' + item.itemModel + ')'"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出厂日期：" prop="productionDate">
          <el-date-picker
            v-model="formData.productionDate"
            placeholder="请选择出厂日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="保修周期：" prop="warrantyPeriod">
          <el-input v-model.number="formData.warrantyPeriod" placeholder="请输入保修周期"></el-input>
          个月
        </el-form-item>
        <el-form-item label="产品单价：" prop="price">
          <el-input v-model.trim="formData.price" placeholder="请输入产品单价"></el-input>
          元
        </el-form-item>
        <el-form-item label="批次号：" prop="batchNo">
          <el-input v-model="formData.batchNo" placeholder="请输入批次号"></el-input>
        </el-form-item>
        <el-form-item label="Mac地址：" prop="macAddrs">
          <el-input v-model="formData.macAddrs" type="textarea" :rows="5" placeholder="请输入Mac地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="isLoading">提交</el-button>
          <el-button @click="backList">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
  .cpe-stock-in {
    .el-form {
      background-color: #fff;
      padding: 20px 0;
    }

    .el-input, .el-textarea, .el-date-editor {
      width: 380px !important;
    }
  }
</style>
