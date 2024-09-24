<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    @close="cancel"
  >
    <PackageListDialog ref="packageListDialog" @confirm="packageConfrm" />
    <el-form ref="form" label-width="130px" :model="formData" :rules="rules">
      <el-form-item v-if="!isAdd" label="组合套餐ID" prop="id">
        {{ formData.id }}
      </el-form-item>
      <el-form-item label="自定义套餐名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入自定义套餐名称" style="width: 200px" />
      </el-form-item>
      <el-form-item label="移动套餐ID" prop="cmccOfferId">
        <el-input
          :disabled="!isAdd"
          style="width: 200px"
          :value="formData.cmccOfferText"
          :placeholder="isAdd ? '请选择套餐' : ''"
          readonly
          @click.native="choosePackage('cmcc')"
        />
        <el-button v-if="formData.cmccOfferId && isAdd" type="text" @click="packageClear('cmcc')"
          >清除</el-button
        >
      </el-form-item>
      <el-form-item label="联通套餐ID" prop="unicomOfferId">
        <el-input
          :disabled="!isAdd"
          style="width: 200px"
          :value="formData.unicomOfferText"
          :placeholder="isAdd ? '请选择套餐' : ''"
          readonly
          @click.native="choosePackage('unicom')"
        />
        <el-button
          v-if="formData.unicomOfferId && isAdd"
          type="text"
          @click="packageClear('unicom')"
          >清除</el-button
        >
      </el-form-item>
      <el-form-item label="电信套餐ID" prop="chinanetOfferId">
        <el-input
          :disabled="!isAdd"
          style="width: 200px"
          :value="formData.chinanetOfferText"
          :placeholder="isAdd ? '请选择套餐' : ''"
          readonly
          @click.native="choosePackage('chinanet')"
        />
        <el-button
          v-if="formData.chinanetOfferId && isAdd"
          type="text"
          @click="packageClear('chinanet')"
          >清除</el-button
        >
      </el-form-item>
      <el-form-item label="套餐标签" prop="offerTag">
        <el-select v-model="formData.offerTag" placeholder="选择套餐标签" clearable >
          <el-option :label="key" :value="val" v-for="(key, val) in enums.combineOfferTag.maps()" :key="val">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button v-loading="sureLoading" type="primary" @click="onSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import cardFunctionOptions from '@/constant/options/cardFunction'
import { safeGet } from '@/global/function/safe-operations'
import PackageListDialog from './packageListDialog'
import tagExtract from '@/global/directive/tag-extract'
import filterQueryParams from '@/global/function/filterQueryParams'

export default {
  components: {
    PackageListDialog
  },
  data() {
    const priceOfferIdvalidator = (rule, value, callback) => {
      const { cmccOfferId, chinanetOfferId, unicomOfferId } = this.formData
      if (
        !value &&
        [cmccOfferId, chinanetOfferId, unicomOfferId].filter((item) => !!item).length < 2
      ) {
        return callback(new Error('组合套餐至少包含两个套餐'))
      }
      callback()
    }
    return {
      visible: false,
      sureLoading: false,
      rules: {
        name: [{ required: true, message: '自定义套餐名称不能为空' }],
        cmccOfferId: [{ required: false, validator: priceOfferIdvalidator, trigger: 'submit' }],
        unicomOfferId: [{ required: false, validator: priceOfferIdvalidator, trigger: 'submit' }],
        chinanetOfferId: [{ required: false, validator: priceOfferIdvalidator, trigger: 'submit' }]
      },
      formData: {
        id: '',
        name: '',
        offerTag: '',
        unicomOfferId: '',
        chinanetOfferId: '',
        cmccOfferId: '',
        cmccOfferText: '',
        chinanetOfferText: '',
        unicomOfferText: ''
      },
      options: cardFunctionOptions,
      content: {}
    }
  },
  computed: {
    isAdd() {
      return !safeGet(this.content, 'id', undefined)
    },
    title() {
      return this.isAdd ? '新增' : '编辑'
    }
  },
  methods: {
    packageConfrm(row) {
      this.formData[`${row.carrier}OfferId`] = row.id
      this.formData[`${row.carrier}OfferText`] = `${tagExtract(null, {
        value: {
          offerType: row.offerType,
          validity: row.validity,
          validityUnit: row.validityUnit,
          volume: row.volume,
          unlimited: row.unlimitedVolume,
          useCountAsVolume: row.useCountAsVolume,
          cardPeriod: 1 // 期限不显示（其实就是订购周期），传1
        }
      })}(${row.id})`
    },
    packageClear(carrier) {
      this.formData[`${carrier}OfferId`] = ''
      this.formData[`${carrier}OfferText`] = ''
    },
    choosePackage(carrier) {
      if (!this.isAdd) return
      this.$refs.packageListDialog.open({ carrier })
    },
    open(content) {
      this.content = content
      this.formData = {
        ...this.formData,
        ...content
      }
      if (!this.isAdd) {
        this.formData = {
          ...this.formData,
          chinanetOfferText: `${content.chinanetOfferName}`,
          unicomOfferText: `${content.unicomOfferName}`,
          cmccOfferText: `${content.cmccOfferName}`
        }
      }
      this.visible = true
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        const { id, name, cmccOfferId, chinanetOfferId, unicomOfferId, offerTag } = this.formData
        const params = {
          id,
          name,
          cmccOfferId,
          chinanetOfferId,
          unicomOfferId,
          offerTag
        }
        const res = await this.jaxLib.financial.combine[this.isAdd ? 'save' : 'update'](
          filterQueryParams(params)
        )
        if (safeGet(res, 'success', false)) {
          this.$message.success('操作成功')
          this.reset()
          this.$emit('confirm', { isAdd: this.isAdd })
          this.visible = false
        }
      })
    },
    reset() {
      this.formData = {
        id: '',
        name: '',
        unicomOfferId: '',
        chinanetOfferId: '',
        cmccOfferId: '',
        cmccOfferText: '',
        chinanetOfferText: '',
        unicomOfferText: ''
      }
      const form = this.$refs.form
      form.resetFields()
    },
    cancel() {
      this.reset()
      this.visible = false
    }
  }
}
</script>
