<script>
  import ImageUpload from '../components/image-upload.vue'
  import SpecsEdit from '../../components/specs-edit.vue'
  import apis from '@/api/ajax'
  import { mapState } from 'vuex'
  const priceValidator = (rule, value, callback) => {
    if (!/^\d+(.\d{1,4})?$/.test(value)) return callback('请输入正确的金额')
    return callback()
  }
  const refItemFields = {
    buyCount: '',
    itemName: '',
    itemNo: '',
    itemVariety: 'INTELLIGENT_HARDWARE',
    usePool: false,
    isItemNoChecked: false,
    itemMessage: '',
    isPoolCard: false
  }
  const refItemFieldsRules = {
    itemName: { required: true, message: '套餐名称不能为空', trigger: 'blur' },
    buyCount: { required: true, message: '数量不能为空', trigger: 'blur' },
    itemNo: { required: true, message: '商品ID不能为空', trigger: 'blur' }
  }
  export default {
    data() {
      return {
        formData: {
          status: 'off',
          isThreeInOneCard: false,
          refItemROList: [{ ...refItemFields }, { ...refItemFields }]
        },
        refGoodsCount: 2,
        formRules: {
          itemName: { required: true, message: '套餐名称不能为空', trigger: 'blur' },
          minBuyCount: { required: true, message: '最小购买数量不能为空', trigger: 'blur' },
          maxBuyCount: { required: true, message: '最大购买数量不能为空', trigger: 'blur' },
          volume: { required: true, message: '流量规格不能为空', trigger: 'blur' },
          productPrice: { required: true, validator: priceValidator, trigger: 'blur' },
          price: { required: true, validator: priceValidator, trigger: 'blur' },
          reservePrice: { required: true, validator: priceValidator, trigger: 'blur' },
          reserveRenewPrice: { required: true, validator: priceValidator, trigger: 'blur' },
          refItemROList: [{ ...refItemFieldsRules }, { ...refItemFieldsRules }]
        },
        isBtnLoading: false,
        parameters: [],
        picUrls: [],
        flowUnit: 'GB'
      }
    },
    components: {
      ImageUpload,
      SpecsEdit
    },
    computed: {
      ...mapState({
        itemVariety: state => state.overall.cpeEnum.itemVariety
      }),
      isEdit() {
        return !!this.$route.query.itemNo
      }
    },
    created() {
      const itemNo = this.$route.query.itemNo
      if (itemNo) {
        this.getPackageDetail(itemNo)
      }
    },
    methods: {
      async getPackageDetail(itemNo) {
        const { success, data } = await apis.cpe.getPackageDetail({ itemNo })
        if (!success) return false
        this.flowUnit = data.volume >= 1024 ? 'GB' : 'MB'
        this.formData = {
          ...data,
          isThreeInOneCard: data.isThreeInOneCard || false,
          volume: data.volume >= 1024 ? data.volume / 1024 : data.volume
        }
        if (data.refItemROList) {
          this.refGoodsCount = data.refItemROList.length
        }
        if (data.parameters) {
          this.parameters = JSON.parse(data.parameters)
        }
        if (data.picUrls) {
          this.picUrls = data.picUrls.split(';')
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
        let hasError = false
        const refItemROList = this.formData.refItemROList.map(item => {
          if (!item.isItemNoChecked) hasError = true
          return {
            buyCount: item.buyCount,
            itemName: item.itemName,
            itemNo: item.itemNo,
            itemVariety: item.itemVariety
          }
        })
        if (!this.isEdit && hasError) {
          return this.$message({ type: 'error', message: '请检查商品ID配置' })
        }
        this.$refs.form.validate(async valid => {
          if (!valid) return false
          if (Number(this.formData.maxBuyCount) < Number(this.formData.minBuyCount)) {
            return this.$message({ type: 'error', message: '最大订购数量不得小于最小订购数量' })
          }
          const volume = Number(this.formData.volume)
          const formData = {
            ...this.formData,
            volume: this.flowUnit === 'GB' ? volume * 1024 : volume,
            refItemROList,
            picUrls: picArr.join(';'),
            parameters: JSON.stringify(specsConfig)
          }
          this.isBtnLoading = true
          const { success } = formData.itemNo ? await apis.cpe.updatePackage(formData) : await apis.cpe.addPackage(formData)
          this.isBtnLoading = false
          if (success) {
            this.$message({ type: 'success', message: formData.itemNo ? '修改成功' : '添加成功' })
            this.$router.replace({ name: 'cpe-goods-list' })
          }
        })
      },
      refGoodsCountChange(val) {
        let currentGoodsCount = this.formData.refItemROList.length
        if (val > currentGoodsCount) {
          for (; currentGoodsCount < val; currentGoodsCount++) {
            this.formData.refItemROList.push({ ...refItemFields })
            this.formRules.refItemROList.push({ ...refItemFieldsRules })
          }
        } else if (currentGoodsCount > val) {
          for (; currentGoodsCount > val; currentGoodsCount--) {
            this.formData.refItemROList.pop()
            this.formRules.refItemROList.pop()
          }
        }
      },
      async checkItemNo(item) {
        const { itemVariety, itemNo } = item
        if (!itemNo) return false
        if (itemVariety === 'INTELLIGENT_HARDWARE') {
          const { success, data } = await apis.cpe.getDeviceDetail({ itemNo })
          if (success) {
            item.itemMessage = data.itemName
            item.isItemNoChecked = true
          } else {
            item.itemMessage = '未找到设备'
            item.isItemNoChecked = false
          }
        } else {
          const { success, data } = await this.jaxLib.financial.plan.get({ id: itemNo })
          if (success && data) {
            const card = data.find(i => i.id === Number(item.itemNo))
            if (!card) {
              item.isItemNoChecked = false
              item.itemMessage = '物联网卡不存在'
              return false
            }
            item.itemMessage = card.name
            item.isItemNoChecked = true
            item.isPoolCard = card.sharable
          } else {
            item.isItemNoChecked = false
            item.itemMessage = '物联网卡不存在'
          }
        }
      },
      onCardTypeChange(val) {
        if (val) {
          this.refGoodsCount = 4
          this.refGoodsCountChange(4)
        }
      }
    }
  }
</script>

<template>
  <div class="wh-app-wrap cpe-package-edit">
    <div class="wh__header">
      <div class="wh__header--title">{{isEdit ? '编辑套餐' : '新增套餐'}}</div>
      <span class="wh__header--close">
        <el-tooltip content="返回列表" placement="left" effect="dark">
          <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
        </el-tooltip>
      </span>
    </div>
    <div class="wh__body">
      <el-form label-width="120px" ref="form" :inline="true" :model="formData" :rules="formRules">
        <div>
          <el-form-item label="套餐名称：" prop="itemName">
            <el-input :disabled="isEdit" placeholder="请输入套餐名称" v-model="formData.itemName"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="套餐价格：">
            <div class="price-edit">
              <div class="price-edit-item">
                <p>套餐标准价（元）</p>
                <p>
                  <el-form-item prop="productPrice">
                    <el-input
                      v-model="formData.productPrice"
                      type="number"
                      class="input-small"
                      placeholder="套餐标准价">
                    </el-input>
                  </el-form-item>
                </p>
              </div>
              <div class="price-edit-item">
                <p>套餐报价（元）</p>
                <p>
                  <el-form-item prop="price">
                    <el-input v-model="formData.price" type="number" class="input-small" placeholder="套餐报价"></el-input>
                  </el-form-item>
                </p>
              </div>
              <div class="price-edit-item">
                <p>套餐底价（元）</p>
                <p>
                  <el-form-item prop="reservePrice">
                    <el-input
                      v-model="formData.reservePrice"
                      type="number"
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
                      v-model="formData.reserveRenewPrice"
                      type="number"
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
              <el-input
                v-model="formData.maxBuyCount"
                :controls="false"
                class="input-small"
                :step="1"
                :min="1"
                :precision="0"
                placeholder="最大订购数量"
              >
              </el-input>
            </el-form-item>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="流量规格：">
            <el-form-item prop="volume">
              <el-input
                :disabled="isEdit"
                class="input-small"
                v-model="formData.volume"
                placeholder="流量规格"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-select :disabled="isEdit" class="input-small" v-model="flowUnit">
                <el-option value="GB">GB</el-option>
                <el-option value="MB">MB</el-option>
              </el-select>
            </el-form-item>
            <div class="color-grey-999">说明：套餐有效期内、流量每个自然月统计、结算、清零；套餐有效期外，流量不再统计且剩余流量清零。</div>
            <div class="color-grey-999">一年=12个月=365天，不区分闰年。</div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="套餐状态：">
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
          <el-form-item label="套餐类型：" prop="isThreeInOneCard">
            <el-radio-group :disabled="isEdit" v-model="formData.isThreeInOneCard" @change="onCardTypeChange">
              <el-radio :label="false">普通卡</el-radio>
              <el-radio :label="true">三合一卡</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="关联商品：">
            <el-radio-group :disabled="isEdit" v-model="refGoodsCount" @change="refGoodsCountChange">
              <el-radio :label="2" :disabled="formData.isThreeInOneCard">2个</el-radio>
              <el-radio :label="3" :disabled="formData.isThreeInOneCard">3个</el-radio>
              <el-radio :label="4">4个</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="relation-goods">
          <div class="relation-goods-item" v-for="(item, index) in formData.refItemROList" :key="index">
            <div class="title">商品{{index + 1}}</div>
            <div>
              <el-form-item label="商品名称：" :prop="`refItemROList.${index}.itemName`">
                <el-input :disabled="isEdit" v-model="item.itemName" placeholder="请输入商品名称"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="商品种类：">
                <el-radio-group :disabled="isEdit" v-model="item.itemVariety" @change="checkItemNo(item)">
                  <el-radio v-for="item in itemVariety" :label="item.id" :key="item.id">{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="商品ID：" :prop="`refItemROList.${index}.itemNo`">
                <el-input
                  :disabled="isEdit"
                  v-model="item.itemNo"
                  @blur="checkItemNo(item)"
                  @keyup.native.enter="checkItemNo(item)"
                  placeholder="请输入商品ID"
                >
                </el-input>
                <span :class="{'color-danger': !item.isItemNoChecked}">{{item.itemMessage}}</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="数量：" :prop="`refItemROList.${index}.buyCount`">
                <el-input-number
                  :disabled="isEdit"
                  :controls="false"
                  :step="1"
                  :min="1"
                  :precision="0"
                  v-model="item.buyCount"
                  placeholder="请输入数量"
                >
                </el-input-number>
              </el-form-item>
            </div>
          </div>
        </div>
        <div>
          <el-form-item label="商品五图：">
            <image-upload ref="imgRef" :picUrls="picUrls"></image-upload>
            <p class="color-grey-999">上传说明：</p>
            <p class="color-grey-999">1、图片格式位PNG或JPG；2、图片大小不超过2M；3、图片最佳尺寸为210*210；4、第一张图作为商品首页图。至少上传一张图片；5、最多上传5张图片</p>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品参数：">
            <specs-edit ref="specsRef" :parameters="parameters"></specs-edit>
          </el-form-item>
        </div>
        <div>
          <el-form-item label=" ">
            <el-button v-loading="isBtnLoading" type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
  .cpe-package-edit {
    .el-form {
      background-color: #fff;
      padding: 20px 0;
    }

    .el-input {
      width: 300px;
    }

    .input-small {
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

    .relation-goods {
      border: 1px solid #efefef;
      padding: 15px 0;
      margin-bottom: 25px;

      &-item {
        border-bottom: 1px dashed #efefef;
        margin-bottom: 15px;

        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .title {
          padding-left: 38px;
          margin-bottom: 15px;
          font-weight: bold;
          font-size: 15px;
        }
      }
    }
  }
</style>
