<template>
  <el-dialog
    class="compliance-detail-modal"
    :visible.sync="visible"
    destroy-on-close
    :title="!isAdd ? '修改任务' : '新建任务'"
    :before-close="onReset"
  >
    <div v-if="visible" class="eliminate-apply">
      <el-form ref="form" :model="formData" :rules="formRule" label-width="160px">
        <el-form-item label="预警任务名称" prop="taskName">
          <el-input
            v-model="formData.taskName"
            placeholder="用于内部使用，不超过15个字"
            :max-length="15"
          />
        </el-form-item>
        <el-form-item label="运营商" prop="carrier">
          <el-select
            v-model="formData.carrier"
            placeholder="运营商"
            style="width: 100px"
            clearable
            @change="carrierChange"
          >
            <el-option
              v-for="(value, key) in enums.carrier.maps()"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="归属运营商" prop="signCarrierId">
          <el-select
            v-model="formData.signCarrierId"
            placeholder="请选择归属运营商"
            style="width: 160px"
            clearable
            size="small"
            @change="signedCarrierChange"
          >
            <el-option
              v-for="item in signedCarrierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="carrierAccountId" label="运营商账号">
          <wh-carrier-account-select
            v-model="formData.carrierAccountId"
            :carrier="formData.carrier"
            size="small"
            :signed-carrier-id="formData.signCarrierId"
            @change="carrierAccountChange"
          />
        </el-form-item>
        <el-form-item label="运营商侧套餐大小" prop="carrierVolumeSize">
          <el-select
            v-model="formData.carrierVolumeSize"
            placeholder="请选择运营商侧套餐大小"
            style="width: 160px"
            clearable
            size="small"
          >
            <el-option
              v-for="item in poolList"
              :key="item.id"
              :value="item.poolSpecification"
              :label="
                item.poolSpecification !== -1 ? volumeFormat(item.poolSpecification) : '全套餐'
              "
            />
          </el-select>
        </el-form-item>
        <el-form-item label="卡片材质" prop="material">
          <el-radio-group v-model="formData.material">
            <el-radio label="plug">插拔卡</el-radio>
            <el-radio label="paster">贴片卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户侧套餐" prop="customerVolumeSize">
          <el-select v-model="formData.sign" placeholder="" style="width: 80px">
            <el-option
              v-for="item in signOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
          <wh-volume-input v-model="formData.customerVolumeSize" />
        </el-form-item>
        <el-form-item prop="isPool" label="客户侧是否流量池卡" required>
          <el-radio-group v-model="formData.isPool">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排除重点客户" prop="excludeOssKey">
          <el-upload
            ref="upload"
            v-model="formData.excludeOssKey"
            accept=".pdf,.xlsx,.docx"
            :limit="1"
            drag
            list-type="list"
            action="/ajax/common/file/upload"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            class="wh-file-upload"
            :file-list="localFileList"
            :on-remove="fileRemove"
          >
            <i slot="default" class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">
              <p>
                <el-button type="text" @click="downloadTemplate">模版文件</el-button>
              </p>
            </div>
            <div
              slot="file"
              slot-scope="{ file }"
              style="display: flex; justify-content: space-between"
            >
              <span style="cursor: pointer" @click="downloadFile">
                <i class="el-icon-download"></i> {{ file.name }}</span
              >
              <i class="el-icon-close" @click="removeFile"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="目前管控措施" prop="currentControl">
          <el-checkbox-group v-model="formData.currentControl">
            <el-checkbox
              v-for="item in limitDataAll"
              :key="item.key"
              :label="item.key"
              name="type"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="预警条件" required>
          <!--          <el-form-item prop="recentDays" label-width="0">-->
          <!--            最近&nbsp;<el-input-number-->
          <!--              v-model="formData.recentDays"-->
          <!--              :min="0"-->
          <!--              label=""-->
          <!--              :controls="false"-->
          <!--            />-->
          <!--            &nbsp; 天平均用量（去掉为0的数据）-->
          <!--          </el-form-item>-->
          <div style="display: flex">
            <el-form-item prop="predictDays" label-width="0">
              预计在 &nbsp;<el-input-number
                v-model="formData.predictDays"
                :min="0"
                label=""
                :controls="false"
              />&nbsp;天内，
            </el-form-item>
            <el-form-item prop="monthFlow">
              当月总量达到
              <el-input-number
                v-model="formData.monthFlow"
                :min="0"
                label=""
                :controls="false"
              />&nbsp;MB
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="onReset">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select'
import moment from 'moment'
import whVolumeInput from '@/page/components/wh-volume-input'
import volumeFormat from '@/global/filters/volume-format'
import ajax from '@/api/ajax'
class FormObject {
  constructor() {
    this.taskName = '' // 任务名称
    this.carrier = ''
    this.signCarrierId = ''
    this.carrierAccountId = ''
    this.carrierVolumeSize = '' // ---运营商侧套餐大小 （全套餐传-1）
    this.customerVolumeSize = undefined // 客户侧套餐大小
    this.sign = '>=' // [ <,<=,=,>,>=]
    this.material = ''
    this.isPool = 0
    this.excludeOssKey = ''
    this.currentControl = []
    // this.recentDays = undefined
    this.predictDays = undefined
    this.monthFlow = undefined
    this.saveType = 1
  }
}
export const limitMap = {
  VPDN: 'VPDN',
  REGIONAL_RESTRICTIONS: '区域限制',
  VOLUME_LIMIT: '限额',
  WHITELIST: '公网白名单'
}
export default {
  components: {
    'wh-carrier-account-select': whCarrierAccountSelect,
    'wh-volume-input': whVolumeInput
  },
  data() {
    const customerVolumeSizeVal = (rule, value, callback) => {
      const { customerVolumeSize } = this.formData
      if (!customerVolumeSize) {
        callback(new Error('请输入客户侧套餐'))
      } else {
        callback()
      }
    }
    return {
      content: {},
      isAdd: true,
      volumeFormat,
      poolList: [],
      localFileList: [],
      visible: false,
      signedCarrierList: [],
      volumeOptions: [
        {
          key: 'MB',
          label: 'MB'
        },
        {
          key: 'GB',
          label: 'GB'
        }
      ],
      signOptions: [
        {
          label: '≥',
          key: '>='
        },
        {
          label: '>',
          key: '>'
        },
        {
          label: '<',
          key: '<'
        },
        {
          label: '≤',
          key: '<='
        }
      ],
      limitDataAll: [
        {
          key: 'VOLUME_LIMIT',
          label: '限额'
        },
        {
          key: 'REGIONAL_RESTRICTIONS',
          label: '区域限制'
        },
        {
          key: 'WHITELIST',
          label: '公网白名单'
        },
        {
          key: 'VPDN',
          label: 'VPDN'
        }
      ],
      limitMap,
      formData: new FormObject(),
      formRule: {
        taskName: {
          required: true,
          message: '请输入任务名称'
        },
        carrier: {
          required: true,
          message: '请选择运营商'
        },
        signCarrierId: {
          required: true,
          message: '请选择归属运营商'
        },
        carrierAccountId: {
          required: true,
          message: '请选择运营商账号'
        },
        carrierVolumeSize: {
          required: true,
          message: '请选择运营商侧套餐大小'
        },
        material: {
          required: true,
          message: '请选择卡片材质'
        },
        customerVolumeSize: [
          {
            required: true,
            validator: customerVolumeSizeVal,
            trigger: 'blur'
          }
        ],
        currentControl: {
          required: true,
          message: '请选择目前管控措施'
        },
        // recentDays: {
        //   required: true,
        //   message: '请输入'
        // },
        predictDays: {
          required: true,
          message: '请输入'
        },
        monthFlow: {
          required: true,
          message: '请输入'
        }
      }
    }
  },
  methods: {
    carrierChange() {
      this.signedCarrierList = []
      this.formData.signCarrierId = ''
      this.formData.carrierVolumeSize = ''
      this.getSignedCarrierList()
      this.getPoolList()
    },
    signedCarrierChange() {
      this.formData.carrierVolumeSize = ''
      this.getPoolList()
    },
    carrierAccountChange() {
      this.getPoolList()
    },
    beforeUpload() {
      return true
    },
    fileRemove() {
      this.formData.excludeOssKey = ''
    },
    onSuccess(data) {
      if (data && data.data) {
        this.formData.excludeOssKey = data.data.filePosition
      }
    },
    async cardTableChange(page) {
      this.page = {
        ...this.page,
        currentPage: page
      }
      await this.getDetail()
    },
    initFormDataByContent(content) {
      const { carrier, carrierAccountId, conditions, signCarrierId, taskName, fileKey } = content
      const {
        excludeOssKey,
        material,
        sign,
        carrierVolumeSize,
        customerVolumeSize,
        currentControl,
        monthFlow,
        // recentDays,
        predictDays,
        type
      } = conditions
      this.formData = {
        ...this.formData,
        carrier,
        carrierAccountId,
        signCarrierId,
        taskName,
        isPool: type.includes('POOL') ? 1 : 0,
        material: material.some((item) => item === 'PASTER') ? 'paster' : 'plug',
        sign,
        carrierVolumeSize,
        customerVolumeSize,
        currentControl,
        monthFlow,
        // recentDays,
        predictDays,
        excludeOssKey
      }
      if (excludeOssKey) {
        this.localFileList = [{ name: excludeOssKey, url: '' }]
      }
      this.getSignedCarrierList()
    },
    removeFile() {
      this.$refs.upload.clearFiles()
    },
    async downloadFile() {
      const {
        success,
        data: { fileUrl }
      } = await ajax.common.getDownloadUrlByNode({ fileKey: this.formData.excludeOssKey })
      if (!success) return false
      window.open(fileUrl)
    },
    downloadTemplate() {
      window.open('https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/orgId.xlsx')
    },
    async open(content) {
      this.isAdd = !content
      this.content = content
      if (!this.isAdd) {
        this.initFormDataByContent(content)
      }
      this.visible = true
    },
    genLimitations(addValue, delValue) {
      return [
        ...addValue.map((item) => {
          return {
            action: 'ADD',
            type: item,
            val: item === 'VOLUME_LIMIT' ? this.formData.limitAmount : ''
          }
        }),
        ...delValue.map((item) => {
          return {
            action: 'DEL',
            type: item,
            val: ''
          }
        })
      ]
    },
    // 加载流量池套餐数据
    async getPoolList() {
      const { carrier, carrierAccountId, signCarrierId } = this.formData
      if (!carrier) return false
      this.loading = true
      let postData = {
        carrier,
        carrierAccountId,
        signedCarrierId: signCarrierId,
        month: moment().format('YYYY-MM-01')
      }
      const sortFun = (a, b) => {
        a.useRate = a.totalVolume ? a.useVolume / a.totalVolume : 0
        a.groupUseRate = a.groupTotalVolume ? a.groupUseVolume / a.groupTotalVolume : 0
        a.useRate = a.useRate > a.groupUseRate ? a.useRate : a.groupUseRate
        b.useRate = b.totalVolume ? b.useVolume / b.totalVolume : 0
        b.groupUseRate = b.groupTotalVolume ? b.groupUseVolume / b.groupTotalVolume : 0
        b.useRate = b.useRate > b.groupUseRate ? b.useRate : b.groupUseRate
        if (b.useRate === a.useRate) return b.useVolume - a.useVolume
        return b.useRate - a.useRate
      }
      let rst = await this.jaxLib.pool.list(postData)
      if (!rst.success) return false
      let { list } = rst.data
      this.poolList = list.sort(sortFun)
      this.loading = false
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        console.log('🎸 DEBUG_444 edit-dialog.vue 👉', this.formData)
        if (!valid) return
        const {
          taskName,
          carrier,
          carrierAccountId,
          signCarrierId,
          signCarrierName,
          carrierVolumeSize,
          customerVolumeSize,
          sign,
          material,
          isPool,
          excludeOssKey,
          currentControl,
          // recentDays,
          predictDays,
          monthFlow,
          saveType
        } = this.formData
        const api = this.isAdd ? 'addTask' : 'updateTaskById'
        const params = {
          taskName,
          carrier,
          carrierAccountId,
          signCarrierId,
          signCarrierName,
          carrierVolumeSize,
          customerVolumeSize,
          sign,
          material: material === 'plug' ? ['PLASTIC', 'CERAMICS'] : ['PLASTIC_PASTER', 'PASTER'],
          type: isPool ? ['POOL'] : ['STANDARD', 'CUSTOM'],
          excludeOssKey,
          currentControl,
          // recentDays,
          predictDays,
          monthFlow,
          saveType
        }

        if (!this.isAdd) {
          params.id = this.content.id
        }
        const res = await this.jaxLib.flowWarning[api](params)
        if (!res || !res.success) {
          this.$message.error(res.message)
          return
        }
        this.onReset()
        this.$emit('confirm')
      })
    },
    onReset() {
      this.formData = new FormObject()
      this.$refs.form.clearValidate()
      this.visible = false
    },
    async getSignedCarrierList() {
      if (!this.formData.carrier) return false
      let res = await this.jaxLib.store.signedCarrierListGet({ carrier: this.formData.carrier })
      if (!res.success) return false
      this.signedCarrierList = res.data
    }
  }
}
</script>

<style lang="scss">
.compliance-detail-modal {
  .el-transfer-panel__body {
    height: 170px;
  }
}
</style>
