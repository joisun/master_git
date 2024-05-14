<script>
/**
 * Create by zeter on 2017/12/25
 */
import { iccidsTransfer } from '@/global/function/iccids-tool'
import CardTable from './card-table'

export default {
  components: {
    'card-table': CardTable
  },
  data() {
    const iccidValidator = (rule, value, callback) => {
      const { iccid, msisdns, imsis } = this.form
      if (!iccid && !msisdns && !imsis) {
        callback(new Error('iccid, msisdns, imsis 不能全为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      limitDataAll: [
        {
          key: 'ICCID_BIND_IMEI',
          label: '机卡绑定'
        },
        {
          key: 'REGIONAL_RESTRICTIONS',
          label: '区域限制'
        },
        {
          key: 'INTERNET_OF_PEOPLE_RESTRICTIONS',
          label: '人联网'
        },
        {
          key: 'PERSONAL_REAL_NAME',
          label: '个人实名'
        },
        {
          key: 'VOLUME_LIMIT',
          label: '限额'
        }
      ],
      limitMap: {
        ICCID_BIND_IMEI: '机卡绑定',
        REGIONAL_RESTRICTIONS: '区域限制',
        VOLUME_LIMIT: '限额',
        PERSONAL_REAL_NAME: '个人实名',
        INTERNET_OF_PEOPLE_RESTRICTIONS: '人联网'
      },
      form: {
        iccid: '',
        limitAmount: '',
        msisdns: '',
        imsis: ''
      },
      addLimitValue: [],
      delLimitValue: [],
      formRule: {
        iccid: [
          {
            type: 'string',
            transform(value) {
              return value && value.trim()
            },
            validator: iccidValidator,
            trigger: 'blur'
          }
        ],
        msisdns: [
          {
            type: 'string',
            transform(value) {
              return value && value.trim()
            },
            validator: iccidValidator,
            trigger: 'blur'
          }
        ],
        imsis: [
          {
            type: 'string',
            transform(value) {
              return value && value.trim()
            },
            validator: iccidValidator,
            trigger: 'blur'
          }
        ],
        limitAmount: [
          {
            type: 'string',
            required: true,
            message: '请输入限额',
            trigger: 'blur'
          }
        ]
      },
      detail: {},
      page: {
        totalCount: 0,
        currentPage: 1,
        rowsPerPage: 10
      }
    }
  },
  computed: {
    isViewOnly() {
      return !!this.detail.id
    },
    addLimitData() {
      return this.limitDataAll.filter((item) => !this.delLimitValue.includes(item.key))
    },
    delLimitData() {
      return this.limitDataAll.filter((item) => !this.addLimitValue.includes(item.key))
    }
  },
  methods: {
    async cardTableChange(page) {
      this.page = {
        ...this.page,
        currentPage: page
      }
      await this.getDetail()
    },
    async open(id) {
      this.detail = {}
      if (id) {
        this.id = id
        await this.getDetail()
      }
      this.visible = true
    },
    async getDetail() {
      const res = await this.jaxLib.whitelist.cardLimitationChangeDetail({
        id: this.id,
        ...this.page
      })
      if (!res || !res.success) {
        return
      }
      const { limitations } = res.data
      const addLimit = limitations.filter((item) => item.action === 'ADD')
      const delLimit = limitations.filter((item) => item.action === 'DEL')
      this.detail = {
        ...res.data,
        addLimit,
        delLimit
      }
      this.page = {
        ...this.page,
        currentPage: res.data.page.currentPage,
        totalCount: res.data.page.allCount
      }
    },
    genLimitations(addValue, delValue) {
      return [
        ...addValue.map((item) => {
          return {
            action: 'ADD',
            type: item,
            val: item === 'VOLUME_LIMIT' ? this.form.limitAmount : ''
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
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        const limitations = this.genLimitations(this.addLimitValue, this.delLimitValue)
        if (valid) {
          const { iccid, imsis, msisdns } = this.form
          const res = await this.jaxLib.whitelist.cardLimitationChangeCreate({
            iccids: iccidsTransfer(iccid).join(','),
            imsis: iccidsTransfer(imsis).join(','),
            msisdns: iccidsTransfer(msisdns).join(','),
            limitations
          })
          if (!res || !res.success) {
            this.$message.error(res.message)
            return
          }
          this.onReset()
          this.$emit('confirm')
        }
      })
    },
    onReset() {
      this.form = {
        iccid: '',
        limitAmount: '',
        imsis: '',
        msisdns: ''
      }
      this.page = {
        totalCount: 0,
        currentPage: 1,
        rowsPerPage: 10
      }
      this.addLimitValue = []
      this.delLimitValue = []
      this.visible = false
    }
  }
}
</script>

<template>
  <el-dialog
    class="compliance-detail-modal"
    :visible.sync="visible"
    destroy-on-close
    :title="isViewOnly ? '变更详情' : '发起变更'"
    :before-close="onReset"
  >
    <div v-if="visible" class="eliminate-apply">
      <el-alert v-if="!isViewOnly" type="info" :closable="false" style="margin-bottom: 15px">
        <template #title>
          <div class="tool__info--title">提示</div>
          1.
          本操作不会对实际的合规做操作，仅作为运营商操作后的数据变更记录、合规状态同步的标记和供售后与客户进行查询<br />
          2. ICCID, msisdns, imsis 至少填写一项，如果同时填写，按照优先级ICCID > msisdns > imsis
          取值
        </template>
      </el-alert>
      <el-form
        ref="form"
        :model="form"
        :rules="formRule"
        label-width="120px"
        :label-position="isViewOnly ? 'left' : 'top'"
      >
        <card-table
          v-if="isViewOnly"
          :list="detail.iccids"
          :page="page"
          @change="cardTableChange"
        />
        <template v-else>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="ICCID" prop="iccid">
                <el-input v-model="form.iccid" type="textarea" rows="6" style="max-width: 500px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="msisdns" prop="msisdns">
                <el-input
                  v-model="form.msisdns"
                  type="textarea"
                  rows="6"
                  style="max-width: 500px"
                /> </el-form-item
            ></el-col>
            <el-col :span="8">
              <el-form-item label="imsis" prop="imsis">
                <el-input
                  v-model="form.imsis"
                  type="textarea"
                  rows="6"
                  style="max-width: 500px"
                /> </el-form-item
            ></el-col>
          </el-row>
        </template>
        <template v-if="isViewOnly">
          <el-form-item label="增加限制">
            <el-row v-if="detail.addLimit.length">
              <el-col v-for="item in detail.addLimit" :key="item.id" :span="24">
                限制： {{ limitMap[item.type] }} {{ item.val ? `${item.val}` : '' }}
              </el-col>
            </el-row>
            <template v-else>无</template>
          </el-form-item>
          <el-form-item label="减少限制">
            <el-row v-if="detail.delLimit.length">
              <el-col v-for="item in detail.delLimit" :key="item.id" :span="24">
                限制： {{ limitMap[item.type] }}
              </el-col>
            </el-row>
            <template v-else>无</template>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="增加限制">
            <div style="line-height: 0">
              <el-transfer
                v-model="addLimitValue"
                :data="addLimitData"
                :titles="['可选限制', '增加限制']"
              />
            </div>
          </el-form-item>
          <el-form-item
            v-if="addLimitValue.indexOf('VOLUME_LIMIT') !== -1"
            label="限额"
            prop="limitAmount"
          >
            <el-input
              v-model="form.limitAmount"
              type="text"
              style="width: 200px"
              placeholder="请输入限额"
            >
              <template slot="append">MB</template>
            </el-input>
          </el-form-item>
          <el-form-item label="减少限制">
            <div style="line-height: 0">
              <el-transfer
                v-model="delLimitValue"
                :data="delLimitData"
                :titles="['可选限制', '减少限制']"
              />
            </div>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <span v-if="!isViewOnly" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="onReset">取消</el-button>
    </span>
  </el-dialog>
</template>

<style lang="scss">
.compliance-detail-modal {
  .el-transfer-panel__body {
    height: 170px;
  }
}
</style>
