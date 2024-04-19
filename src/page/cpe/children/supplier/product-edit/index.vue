<script>
  import { mapState } from 'vuex'
  import apis from '@/api/ajax'
  import SpecsEdit from '../../components/specs-edit.vue'

  export default {
    data() {
      return {
        supplierList: [],
        goodsList: [],
        isBtnLoading: false,
        formData: {
          name: '',
          category: 'SMART_HARDWARE',
          sort: 'ROUTER',
          type: 'SINGLE_CARD_4G_ROUTER',
          supplierId: '',
          model: '',
          band: 'SINGLE_BAND',
          platform: ''
        },
        formRules: {
          name: { required: true, message: '产品名称不能为空', trigger: 'blur' },
          category: { required: true, message: '产品种类不能为空', trigger: 'blur' },
          sort: { required: true, message: '产品类别不能为空', trigger: 'blur' },
          type: { required: true, message: '产品类型不能为空', trigger: 'blur' },
          model: { required: true, message: '产品型号不能为空', trigger: 'blur' },
          band: { required: true, message: '支持频段不能为空', trigger: 'blur' },
          supplierId: { required: true, message: '产品厂家不能为空', trigger: 'blur' },
          itemNo: { required: true, message: '关联商品不能为空', trigger: 'blur' },
          platform: { required: true, message: '平台类型不能为空', trigger: 'blur' }
        }
      }
    },
    components: {
      SpecsEdit
    },
    created() {
      const id = this.$route.query.id
      if (id) {
        this.getProductDetail(id)
      }
      this.getSupplierList()
      this.getGoodsList()
    },
    computed: {
      isEdit() {
        return !!this.formData.id
      },
      ...mapState({
        productCategory: state => state.overall.cpeEnum.productCategory,
        productSort: state => state.overall.cpeEnum.productSort,
        productType: state => state.overall.cpeEnum.productType
      })
    },
    methods: {
      backList() {
        this.$router.replace({ name: 'cpe-supplier-product' })
      },
      async getProductDetail(id) {
        const { success, data } = await apis.cpe.supplierProductGet({ id })
        if (!success) {
          return false
        }
        if (data.extend) {
          const extend = JSON.parse(data.extend)
          data.property = JSON.parse(data.property)
          delete data.extend
          this.formData = { ...data, ...extend }
        }
      },
      async getSupplierList() {
        const { success, data } = await apis.cpe.supplierList()
        if (!success) {
          return false
        }
        this.supplierList = data
      },
      async getGoodsList() {
        const { success, data: { list } } = await apis.cpe.getItemList({
          itemType: 'DEVICE',
          pageIndex: 1,
          pageSize: 1000
        })
        if (!success) {
          return false
        }
        this.goodsList = list
      },
      submit() {
        const specsConfig = this.$refs.specsRef.submit()
        if (!specsConfig) {
          return false
        }
        this.$refs.form.validate(async valid => {
          if (!valid) {
            return false
          }
          const data = { ...this.formData, property: JSON.stringify(specsConfig) }
          if (data.sort !== 'ROUTER') {
            delete data.type
          } else {
            data.extend = JSON.stringify({
              band: data.band,
              platform: data.platform
            })
          }
          delete data.band
          delete data.platform
          this.isBtnLoading = true
          const { success } = await apis.cpe.supplierProductSave(data)
          this.isBtnLoading = false
          if (!success) {
            return false
          }
          this.$message({ type: 'success', message: data.id ? '编辑成功' : '新增成功' })
          this.backList()
        })
      }
    }
  }
</script>

<template>
  <div class="wh-app-wrap cpe-supplier-product-edit">
    <div class="wh__header">
      <div class="wh__header--title">{{isEdit ? '编辑供应商产品' : '新增供应商产品'}}</div>
      <span class="wh__header--close">
        <el-tooltip content="返回列表" placement="left" effect="dark">
          <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
        </el-tooltip>
      </span>
    </div>
    <div class="wh__body">
      <el-form label-width="120px" ref="form" :inline="true" :model="formData" :rules="formRules">
        <div>
          <el-form-item label="产品名称：" prop="name">
            <el-input :disabled="isEdit" placeholder="请输入产品名称" v-model.trim="formData.name"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="产品种类：" prop="category">
            <el-radio
              v-model="formData.category"
              v-for="item in productCategory"
              :key="item.id"
              :label="item.id"
              :disabled="isEdit"
            >
              {{item.name}}
            </el-radio>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="产品类别：" prop="sort">
            <el-radio
              v-model="formData.sort"
              v-for="item in productSort"
              :key="item.id"
              :label="item.id"
              :disabled="isEdit || item.id !== 'ROUTER'"
            >
              {{item.name}}
            </el-radio>
          </el-form-item>
        </div>
        <div v-if="formData.sort === 'ROUTER'">
          <el-form-item label="产品类型：" prop="type">
            <el-radio
              v-model="formData.type"
              v-for="item in productType"
              :key="item.id"
              :label="item.id"
              :disabled="isEdit"
            >
              {{item.name}}
            </el-radio>
          </el-form-item>
        </div>
        <div v-if="formData.sort === 'ROUTER'">
          <el-form-item label="支持频段：" prop="band">
            <el-radio-group :disabled="isEdit" v-model="formData.band">
              <el-radio label="SINGLE_BAND">2.4G</el-radio>
              <el-radio label="DUAL_BAND">2.4G/5G</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-if="formData.sort === 'ROUTER'">
          <el-form-item label="平台类型：" prop="platform">
            <el-select v-model="formData.platform" :disabled="isEdit" placeholder="请选择平台类型">
              <el-option label="AC_LINK" value="AC_LINK"/>
              <el-option label="LUCI" value="LUCI"/>
              <el-option label="JARVIS" value="JARVIS"/>
              <el-option label="ZBT_OS" value="ZBT_OS"/>
              <el-option label="TZKW" value="TZKW"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="产品厂家：" prop="supplierId">
            <el-select v-model="formData.supplierId" :disabled="isEdit">
              <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="产品型号：" prop="model">
            <el-input v-model="formData.model" placeholder="请输入产品型号" :disabled="isEdit"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="关联商品：" prop="itemNo">
            <el-select v-model="formData.itemNo" :disabled="isEdit">
              <el-option
                v-for="item in goodsList"
                :key="item.itemNo"
                :value="item.itemNo"
                :label="item.itemName + '(' + item.itemModel +')'"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="参数：">
            <specs-edit ref="specsRef" :parameters="formData.property"></specs-edit>
          </el-form-item>
        </div>
        <div>
          <el-form-item label=" ">
            <el-button type="primary" @click="submit" v-loading="isBtnLoading">提交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
  .cpe-supplier-product-edit {
    .el-form {
      background-color: #fff;
      padding: 20px 0;

      .el-input {
        width: 260px;
      }
    }
  }
</style>
