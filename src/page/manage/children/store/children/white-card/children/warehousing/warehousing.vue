<template>
  <div class="white-card">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">白卡入库</h2>
      </div>
      <div class="wh__body" style="background-color: #fff; padding: 20px">
        <el-form ref="form" :rules="rules" :model="formData" label-width="120px">
          <el-form-item label="运营商" prop="carrier">
            <el-select
              v-model="formData.carrier"
              placeholder="请选择运营商"
              style="width: 150px"
              @change="onCarrierChange"
            >
              <el-option
                v-for="(key, val) in enums.carrier.maps()"
                :key="val"
                :label="key"
                :value="val"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运营商账号" prop="carrierAccountId">
            <el-select v-model="formData.carrierAccountId" @change="onCarrierAccountIdChange">
              <el-option
                v-for="item in signedCarrierList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="可开网络类型" prop="netType">
            <el-checkbox-group v-model="formData.netType">
              <el-checkbox v-for="key in Object.keys(netTypeOptions)" :key="key" :label="key">{{
                netTypeOptions[key]
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="材质" prop="cardMaterial">
            <el-radio-group v-model="formData.cardMaterial">
              <el-radio v-for="key in Object.keys(materialTypeOptions)" :key="key" :label="key">{{
                materialTypeOptions[key]
              }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="规格" prop="cardSpecification">
            <el-radio-group v-model="formData.cardSpecification">
              <el-radio
                v-for="key in Object.keys(specificationTypeOptions)"
                :key="key"
                :label="key"
                >{{ specificationTypeOptions[key] }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="卡号明细" required>
            <el-radio-group v-model="formData.iccidInputType" @change="inputTypeChange">
              <el-radio label="1">填写首尾ICCID</el-radio>
              <el-radio label="2">输入所有ICCID</el-radio>
              <el-radio label="3">上传Excel附件</el-radio>
            </el-radio-group>
          </el-form-item>
          <iccid-range-input
            v-if="formData.iccidInputType === '1'"
            :iccid-batchs="formData.iccidBatchs"
            @change="iccidRangeChange"
          />
          <el-form-item
            v-else-if="formData.iccidInputType === '2'"
            prop="iccids"
            :rules="iccidsRules"
          >
            <el-input
              v-model="formData.iccids"
              type="textarea"
              :rows="8"
              style="width: 400px"
              placeholder="可以直接复制excel中整列ICCID；手动输入多个ICCID，一行一个；最多10000个；"
            />
          </el-form-item>
          <el-form-item v-else prop="fileUrl" :rules="{ require: true }">
            <el-upload
              v-model="formData.fileUrl"
              accept=".xls,.xlsx"
              action="/ajax/common/file/upload"
              :limit="1"
              :on-success="onSuccess"
              class="wh-file-upload"
              :file-list="localFileList"
              :on-change="fileChange"
              :on-remove="fileRemove"
            >
              <el-button type="primary">点击上传</el-button>
              <div>
                <span>温馨提示：</span>
                <ol>
                  <li>请选择模版下载；</li>
                  <li>导入必须是xls、xlsx文件；</li>
                  <li>只导入EXCEL文件的第一个标签页；</li>
                  <li>文件大小最大为10MB；</li>
                </ol>
              </div>
            </el-upload>
            <el-link
              href="https://simboss-public.oss-cn-hangzhou.aliyuncs.com/wh/iccid-template.xlsx"
              type="info"
              style="position: absolute; left: 172px; top: 0"
              >下载模板</el-link
            >
          </el-form-item>
          <el-form-item label="批次号" prop="batchNo">
            <div class="flex">
              <div class="mr5">{{ batchPrefix }}-</div>
              <div class="flex1">
                <el-input
                  v-model="formData.batchNo"
                  placeholder="请输入内容"
                  style="width: 200px"
                />
              </div>
            </div>
            <span v-show="formData.iccidInputType !== '3'"
              >本批次一共入库<span style="color: red; margin: 0 2px">{{ allCount }}</span
              >张卡</span
            >
          </el-form-item>
          <!--          <el-form-item label="批次号">-->
          <!--            <span style="text-decoration: underline">{{ formData.batchNo }}</span>-->
          <!-- -->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
            <el-button :loading="loading" @click="resetAll">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import IccidRangeInput from '@/page/components/iccid-range-input'
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { safeGet } from '@/global/function/safe-operations'
export default {
  components: {
    'iccid-range-input': IccidRangeInput
  },
  data() {
    return {
      batchPrefix: '',
      loading: false,
      iccidsRules: {
        validator: (_, value, callback) => {
          if (this.inputIccidCount > 10000) {
            return callback(new Error('ICCID过多，请使用填写首尾ICCID或文件上传的方式提交'))
          }
          callback()
        },
        trigger: 'change'
      },
      localFileList: [],
      rules: {
        carrier: { required: true, message: '请选择运营商', trigger: 'change' },
        carrierAccountId: { required: true, message: '请选择运营商账号', trigger: 'change' },
        cardMaterial: { required: true, message: '请选择材质', trigger: 'change' },
        cardSpecification: { required: true, message: '请选择规格', trigger: 'change' },
        netType: { required: true, message: '请选择可开网络类型', trigger: 'change' },
        batchNo: { required: true, message: '请输入批次号', trigger: 'change' }
      },
      materialTypeOptions: {},
      netTypeOptions: {},
      specificationTypeOptions: {},
      signedCarrierList: [],
      formData: {
        batchNo: '',
        netType: [],
        carrier: '',
        iccids: '',
        fileUrl: '',
        cardMaterial: '',
        cardSpecification: '',
        iccidInputType: '1',
        carrierAccountId: '',
        iccidBatchs: [
          {
            iccidStart: '',
            iccidEnd: '',
            count: 0
          }
        ]
      }
    }
  },
  computed: {
    allCount() {
      const { iccidInputType } = this.formData
      if (iccidInputType === '1') {
        return this.formData.iccidBatchs.reduce((a, b) => {
          return a + b.count
        }, 0)
      }
      if (iccidInputType === '2') {
        return this.inputIccidCount
      }
      return 0
    },
    inputIccidCount() {
      return iccidsTransfer(this.formData.iccids, 'array').filter((item) => !!item).length
    }
  },
  created() {
    this.getEnums()
  },
  methods: {
    async onCarrierAccountIdChange(v, item) {
      this.batchPrefix = safeGet(
        this.signedCarrierList.find((s) => s.id == v),
        'batchPrefix',
        ''
      )
      // const { carrierAccountId } = this.formData
      // const { success, data } = await this.jaxLib.store.deviceBaseBlankGenBatchNo({
      //   carrierAccountId
      // })
      // if (success) {
      //   this.formData.batchNo = data
      // }
    },
    onCarrierChange() {
      this.formData.carrierAccountId = ''
      this.getSignedCarrierList()
    },
    async getSignedCarrierList() {
      const { success, data } = await this.jaxLib.store.signedCarrierListGet({
        carrier: this.formData.carrier
      })
      if (!success) return false
      console.log(data)
      this.signedCarrierList = data
    },
    async getEnums() {
      const res = await this.jaxLib.store.deviceBaseBlankEnum({})
      if (res && res.success) {
        const { materialType, netType, specificationType } = res.data
        this.materialTypeOptions = materialType
        this.netTypeOptions = netType
        this.specificationTypeOptions = specificationType
      }
    },
    inputTypeChange() {
      this.$refs.form.clearValidate(['iccids', 'fileUrl'])
    },
    fileChange(_, fileList) {
      this.localFileList = fileList
    },
    resetAll() {
      this.formData = {
        carrier: '',
        iccids: '',
        fileUrl: '',
        cardMaterial: '',
        cardSpecification: '',
        iccidInputType: '1',
        carrierAccountId: '',
        netType: [],
        iccidBatchs: [
          {
            iccidStart: '',
            iccidEnd: '',
            count: 0
          }
        ]
      }
      this.$refs.form.resetFields()
      this.localFileList = []
    },
    fileRemove() {
      this.localFileList = []
      this.formData.fileUrl = ''
    },
    onSuccess(data) {
      if (data && data.data) {
        this.formData.fileUrl = data.data.filePosition
      }
    },
    async goImport(data) {
      this.loading = true
      try {
        const res = await this.jaxLib.store.deviceBaseBlankImport(data)
        if (res && res.success) {
          this.$message.success('入库成功，请到白卡入库记录页面查看')
          this.resetAll()
        }
      } catch (e) {
        console.log('🎸 szy_279 warehousing.vue 👉', e)
      } finally {
        this.loading = false
      }
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        const {
          batchNo,
          iccidBatchs,
          iccids,
          fileUrl,
          cardMaterial,
          cardSpecification,
          iccidInputType,
          netType,
          carrierAccountId,
          carrier
        } = this.formData
        const params = {
          cardMaterial,
          cardSpecification,
          netType: netType.join(),
          carrierAccountId,
          carrier,
          batchNo: `${this.batchPrefix}-${batchNo}`
        }
        if (iccidInputType === '1') {
          params.iccidBatchs = iccidBatchs.map((item) => ({
            iccidStart: item.iccidStart,
            iccidEnd: item.iccidEnd
          }))
        }
        if (iccidInputType === '2') {
          iccidsTransfer
          params.iccids = iccidsTransfer(iccids, 'array')
            .filter((item) => !!item)
            .join()
        }
        if (iccidInputType === '3') {
          params.ossFileUrl = fileUrl
        }
        this.goImport(params)
      })
    },
    iccidRangeChange(data) {
      this.formData.iccidBatchs = data
    }
  }
}
</script>
