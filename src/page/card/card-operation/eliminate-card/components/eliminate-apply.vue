<script>
/**
 * Create by zeter on 2017/12/25
 */
import { iccidsTransfer } from '@/global/function/iccids-tool'
import { toolsMixin } from '@/global/mixins/table-selection'
import retireConfirm from '../mixin/retire-confirm'
import { safeGet } from '@/global/function/safe-operations'

const SELECTION_STORAGE_KEY = 'whitehouse_card_manager'

export default {
  mixins: [toolsMixin, retireConfirm],
  data() {
    return {
      form: {
        iccid: '',
        reason: '',
        cardRetiringType: '',
        doRefund: '',
        approvalProcessId: ''
      },
      cardList: [],
      storageKey: SELECTION_STORAGE_KEY,
      pageConfig: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
      },
      formRule: {
        iccid: [
          {
            type: 'string',
            required: true,
            transform(value) {
              return value.trim()
            },
            message: '请输入iccid',
            trigger: 'blur'
          }
        ],
        reason: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 150) {
                callback(new Error('申请原因不能超过150个字'))
              } else {
                callback()
              }
            },
            message: '请输入申请原因',
            trigger: 'blur'
          }
        ],
        cardRetiringType: [{ required: true, type: 'string', message: '请选择销卡类型' }],
        doRefund: [{ required: true, type: 'boolean', message: '请选择是否退费' }],
        approvalProcessId: [{ required: true, type: 'string', message: '请填写审批流程号' }]
      }
    }
  },
  computed: {
    cardRetiringTypeMap() {
      return this.$store.state.overall.enum.cardRetiringType
    }
  },
  created() {
    if (this.$route.query.from === 'card-list') {
      const selected = this.getSelected('iccid')
      if (selected.length) {
        this.form.iccid = selected.join('\n')
      }
    }
  },
  methods: {
    iccidChange() {
      this.cardList = []
      this.pageConfig = {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
      }
    },
    onPageSizeChange(val) {
      this.pageConfig.pageSize = val
      this.getCardList()
    },
    handleCurrPage(val) {
      this.pageConfig.pageIndex = val
      this.getCardList(true)
    },
    async getCardList() {
      this.loading = true
      try {
        const res = await this.jaxLib.cardOwnershipQuery.getList({
          iccids: iccidsTransfer(this.form.iccid)
            .filter((item) => !!item)
            .join(','),
          pageIndex: this.pageConfig.pageIndex,
          pageSize: this.pageConfig.pageSize
        })
        this.loading = false

        if (!res.success) {
          this.cardList = []
          this.pageConfig.totalCount = 0
          this.loading = false
          return
        }
        this.cardList = safeGet(res, 'data.list', [])
        this.pageConfig.totalCount = safeGet(res, 'data.page.allCount', 0)
      } catch (e) {}
    },
    onSubmit() {
      const alert = (title, data) => {
        const h = this.$createElement
        this.$alert(
          h('p', null, [
            h('p', null, `以下${data.count}张卡为重复提交，已自动删除`),
            h(
              'p',
              { style: 'word-break: break-all;overflow-y: auto;max-height: 50vh;' },
              `${data.iccid.join(',')}`
            )
          ]),
          title,
          {
            confirmButtonText: '确定',
            callback: (action) => {}
          }
        )
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const checkRes = await this.jaxLib.card.retiring.checkNoRetiredIccid({
            iccids: iccidsTransfer(this.form.iccid).join(',')
          })
          if (!checkRes.success) {
            this.$message.error(checkRes.message)
            return
          }
          if (!(await this.retireConfirm(checkRes.data))) return
          let rst = await this.jaxLib.card.retiring.apply({
            iccids: iccidsTransfer(this.form.iccid).join(','),
            cause: this.form.reason.trim(),
            cardRetiringType: this.form.cardRetiringType,
            doRefund: this.form.doRefund,
            approvalProcessId: this.form.doRefund ? this.form.approvalProcessId : ''
          })
          if (!rst.success) {
            if (rst.data && rst.data.count) {
              alert('提交失败、重复销卡提醒', rst.data)
            }
          } else if (rst.data && rst.data.count) {
            alert('提交成功、重复销卡提醒', rst.data)
          } else {
            this.$message.success('提交成功, 请到我的申请下查看状态')
            this.onReset()
          }
        }
      })
    },
    onReset() {
      this.form = {
        iccid: '',
        reason: ''
      }
    }
  }
}
</script>

<template>
  <div class="eliminate-apply">
    <div class="tool__info">
      <div class="tool__info--title">提示</div>
      本工具可以向供应链提出销卡的申请。<br />
      操作时，请输入iccid和销卡原因，批量输入请用换行或者逗号分隔
    </div>
    <el-form ref="form" :model="form" :rules="formRule" label-width="120px">
      <el-form-item label="ICCID" prop="iccid">
        <el-input
          v-model="form.iccid"
          type="textarea"
          rows="6"
          style="width: 400px"
          @change="iccidChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button :disabled="!form.iccid.length" @click="getCardList">查询卡归属</el-button>
      </el-form-item>
      <el-form-item v-if="cardList.length" style="width: 720px">
        <el-table :data="cardList" :fit="false">
          <el-table-column label="iccid" prop="iccid" width="200px" />
          <el-table-column label="客户(ID)" width="200px" align="center">
            <template #default="{ row }">
              <span>{{ row.orgId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售" width="200px" align="center">
            <template #default="{ row }">
              <span>{{ row.saleName | saleFilter }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pageConfig.pageIndex"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="pageConfig.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="pageConfig.totalCount"
          class="wh__body--page"
          @size-change="onPageSizeChange"
          @current-change="handleCurrPage"
        >
        </el-pagination>
      </el-form-item>
      <el-form-item label="销卡类型" prop="cardRetiringType">
        <el-select v-model="form.cardRetiringType" placeholder="选择销卡类型">
          <el-option
            v-for="(key, value) in cardRetiringTypeMap"
            :key="value"
            :label="key"
            :value="value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否退费" prop="doRefund">
        <el-select v-model="form.doRefund" placeholder="请选择是否退费">
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.doRefund === true" label="审批流程号" prop="approvalProcessId">
        <el-input v-model="form.approvalProcessId" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="销卡原因" prop="reason">
        <el-input v-model="form.reason" type="textarea" style="width: 400px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="onReset">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
