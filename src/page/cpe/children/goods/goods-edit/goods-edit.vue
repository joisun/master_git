<script>
  import ImageUpload from '../components/image-upload.vue'
  import SpecsEdit from '../../components/specs-edit.vue'
  import { mapState } from 'vuex'
  import apis from '@/api/ajax'
  const priceValidator = (rule, value, callback) => {
    if (!/^\d+(.\d{1,4})?$/.test(value)) return callback('请输入正确的金额')
    return callback()
  }
  export default {
    data() {
      return {
        formData: {
          type: '',
          color: [],
          period: 'YEAR',
          material: [],
          status: 'off',
          band: 'SINGLE_BAND'
        },
        formRules: {
          itemName: { required: true, message: '商品名称不能为空', trigger: 'blur' },
          itemModel: { required: true, message: '商品型号不能为空', trigger: 'blur' },
          itemType: { required: true, message: '商品类型不能为空', trigger: 'blur' },
          color: { required: true, message: '商品颜色不能为空', trigger: 'blur' },
          material: { required: true, message: '商品材质不能为空', trigger: 'blur' },
          minBuyCount: { required: true, message: '最小购买数量不能为空', trigger: 'blur' },
          maxBuyCount: { required: true, message: '最大购买数量不能为空', trigger: 'blur' },
          productPrice: { required: true, validator: priceValidator, trigger: 'blur' },
          price: { required: true, validator: priceValidator, trigger: 'blur' },
          reservePrice: { required: true, validator: priceValidator, trigger: 'blur' },
          serviceName: { required: true, message: '服务名称不能为空', trigger: 'blur' },
          serviceFee: { required: true, validator: priceValidator, trigger: 'blur' },
          serviceUnit: { required: true, message: '计费周期不能为空', trigger: 'blur' },
          reserveServiceFee: { required: true, validator: priceValidator, trigger: 'blur' },
          reserveRenewPrice: { required: true, validator: priceValidator, trigger: 'blur' }
        },
        isBtnLoading: false,
        parameters: [],
        picUrls: []
      }
    },
    components: {
      ImageUpload,
      SpecsEdit
    },
    computed: {
      ...mapState({
        chargePeriod: state => state.overall.cpeEnum.chargePeriod,
        deviceColor: state => state.overall.cpeEnum.deviceColor,
        deviceMaterial: state => state.overall.cpeEnum.deviceMaterial,
        deviceType: state => state.overall.cpeEnum.deviceType
      }),
      isEdit() {
        return !!this.$route.query.itemNo
      }
    },
    created() {
      const itemNo = this.$route.query.itemNo
      if (itemNo) {
        this.getDeviceDetail(itemNo)
      }
    },
    methods: {
      async getDeviceDetail(itemNo) {
        const { success, data } = await apis.cpe.getDeviceDetail({ itemNo })
        if (!success) return false
        const serviceUnit = data.serviceUnit.split(':')
        if (data.parameters) {
          this.parameters = JSON.parse(data.parameters)
        }
        if (data.picUrls) {
          this.picUrls = data.picUrls.split(';')
        }
        const itemSku = data.itemSku.split(';')
        this.formData = {
          ...data,
          period: serviceUnit[0],
          serviceUnit: serviceUnit[1],
          material: itemSku[0].split(','),
          color: itemSku[1].split(',')
        }
      },
      backList() {
        this.$router.replace({ name: 'cpe-goods-list' })
      },
      onSubmit() {
        const picArr = this.$refs.imgRef.submit()
        if (!picArr.length) {
          return this.$message({ type: 'error', message: '请至少上传一张图片' })
        }
        const specsConfig = this.$refs.specsRef.submit()
        if (!specsConfig) {
          return false
        }
        this.$refs.form.validate(async valid => {
          if (!valid) return false
          if (Number(this.formData.maxBuyCount) < Number(this.formData.minBuyCount)) {
            return this.$message({ type: 'error', message: '最大订购数量不得小于最小订购数量' })
          }
          const formData = {
            ...this.formData,
            itemSku: this.formData.material.join(',') + ';' + this.formData.color.join(','),
            serviceUnit: this.formData.period + ':' + this.formData.serviceUnit,
            picUrls: picArr.join(';'),
            parameters: JSON.stringify(specsConfig)
          }
          this.isBtnLoading = true
          const { success } = formData.itemNo ? await apis.cpe.updateDevice(formData) : await apis.cpe.addDevice(formData)
          this.isBtnLoading = false
          if (success) {
            this.$message({ type: 'success', message: formData.itemNo ? '修改成功' : '添加成功' })
            this.$router.replace({ name: 'cpe-goods-list' })
          }
        })
      }
    }
  }
</script>

<template>
  <div class="wh-app-wrap cpe-goods-edit">
    <div class="wh__header">
      <div class="wh__header--title">{{isEdit ? '编辑商品' : '新增商品'}}</div>
      <span class="wh__header--close">
        <el-tooltip content="返回列表" placement="left" effect="dark">
          <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
        </el-tooltip>
      </span>
    </div>
    <div class="wh__body">
      <el-form label-width="120px" ref="form" :model="formData" :rules="formRules" :inline="true">
        <div>
          <el-form-item label="商品名称：" prop="itemName">
            <el-input :disabled="isEdit" v-model="formData.itemName" placeholder="请输入商品名称"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品型号：" prop="itemModel">
            <el-input :disabled="isEdit" v-model="formData.itemModel" placeholder="请输入商品型号"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品类型：" prop="itemType">
            <el-select :disabled="isEdit" v-model="formData.itemType" placeholder="请选择商品类型">
              <el-option v-for="item in deviceType" :value="item.id" :key="item.id" :label="item.name">{{item.name}}
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品颜色：" prop="color">
            <el-checkbox-group :disabled="isEdit" v-model="formData.color">
              <el-checkbox v-for="item in deviceColor" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品材质：" prop="material">
            <el-checkbox-group :disabled="isEdit" v-model="formData.material">
              <el-checkbox v-for="item in deviceMaterial" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <template v-if="formData.itemType === 'CPE' || formData.itemType === 'ROUTER'">
          <div>
            <el-form-item label="工作频段：" prop="band">
              <el-radio-group :disabled="isEdit" v-model="formData.band">
                <el-radio label="SINGLE_BAND">2.4G</el-radio>
                <el-radio label="DUAL_BAND">2.4G/5G</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </template>
        <div>
          <el-form-item label="订购数量：">
            <el-form-item prop="minBuyCount">
              <el-input-number
                v-model="formData.minBuyCount"
                :controls="false"
                class="input-small"
                :step="1"
                :min="1"
                :precision="0"
                placeholder="最小订购数量"
              >
              </el-input-number>
            </el-form-item>
            <el-form-item prop="maxBuyCount">
              <el-input-number
                v-model="formData.maxBuyCount"
                class="input-small"
                type="number"
                :controls="false"
                :step="1"
                :min="1"
                :precision="0"
                placeholder="最大订购数量">
              </el-input-number>
            </el-form-item>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品价格：">
            <div class="price-edit">
              <div class="price-edit-item">
                <p>商品标准价（元）</p>
                <p>
                  <el-form-item prop="productPrice">
                    <el-input
                      type="number"
                      v-model="formData.productPrice"
                      class="input-small"
                      placeholder="商品标准价格"
                    >
                    </el-input>
                  </el-form-item>
                </p>
              </div>
              <div class="price-edit-item">
                <p>商品报价（元）</p>
                <p>
                  <el-form-item prop="price">
                    <el-input type="number" v-model="formData.price" class="input-small" placeholder="商品报价"></el-input>
                  </el-form-item>
                </p>
              </div>
              <div class="price-edit-item">
                <p>销售底价（元）</p>
                <p>
                  <el-form-item prop="reservePrice">
                    <el-input
                      type="number"
                      v-model="formData.reservePrice"
                      class="input-small"
                      placeholder="销售底价"
                    >
                    </el-input>
                  </el-form-item>
                </p>
              </div>
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="服务名称：">
            <div class="service-edit">
              <div class="service-edit-item">
                <el-form-item prop="serviceName">
                  <el-input :disabled="isEdit" v-model="formData.serviceName" placeholder="请输入服务名称"></el-input>
                </el-form-item>
              </div>
              <div class="service-edit-item">
                计费周期：
                <el-form-item prop="serviceUnit">
                  <el-input :disabled="isEdit" placeholder="请输入计费周期" v-model="formData.serviceUnit">
                    <el-select
                      :disabled="isEdit"
                      v-model="formData.period"
                      class="service-edit-item-select"
                      slot="append"
                    >
                      <el-option
                        v-for="item in chargePeriod"
                        :value="item.id"
                        :label="item.name"
                        :key="item.id"
                      >
                        {{item.name}}
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="price-edit">
              <div class="price-edit-item">
                <p>服务报价（元）</p>
                <p>
                  <el-form-item prop="serviceFee">
                    <el-input
                      type="number"
                      v-model="formData.serviceFee"
                      class="input-small"
                      placeholder="服务报价">
                    </el-input>
                  </el-form-item>
                </p>
              </div>
              <div class="price-edit-item">
                <p>销售底价（元）</p>
                <p>
                  <el-form-item prop="reserveServiceFee">
                    <el-input
                      type="number"
                      v-model="formData.reserveServiceFee"
                      class="input-small"
                      placeholder="销售底价"
                    >
                    </el-input>
                  </el-form-item>
                </p>
              </div>
              <div class="price-edit-item">
                <p>续费底价（元）</p>
                <p>
                  <el-form-item prop="reserveRenewPrice">
                    <el-input
                      type="number"
                      v-model="formData.reserveRenewPrice"
                      class="input-small"
                      placeholder="续费底价"
                    >
                    </el-input>
                  </el-form-item>
                </p>
              </div>
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品状态：">
            <el-switch
              v-model="formData.status"
              active-text="上架"
              inactive-text="下架"
              active-value="on"
              inactive-value="off"
            >
            </el-switch>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品五图：">
            <image-upload ref="imgRef" :picUrls="picUrls"></image-upload>
            <p>上传说明：</p>
            <p>1、图片格式位PNG或JPG；2、图片大小不超过2M；3、图片最佳尺寸为210*210；4、第一张图作为商品首页图。至少上传一张图片；5、最多上传5张图片</p>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品参数：">
            <specs-edit ref="specsRef" :parameters="parameters"></specs-edit>
          </el-form-item>
        </div>
        <div>
          <el-form-item label=" ">
            <el-button type="primary" @click="onSubmit" v-loading="isBtnLoading">提交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
  .cpe-goods-edit {
    .el-form {
      background-color: #fff;
      padding: 20px 0;
    }

    .el-input {
      width: 300px;
    }

    .input-small, .el-input-number {
      width: 120px;
      .el-input {
        width: 100%;
      }
    }

    .price-edit {
      &-item {
        display: inline-block;
        width: 130px;
      }
    }

    .service-edit {
      &-item {
        display: inline-block;
        margin-right: 30px;

        &-select .el-input {
          width: 90px;
        }
      }
    }
  }
</style>
