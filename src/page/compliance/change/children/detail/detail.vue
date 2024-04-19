<script>
/**
 * Create by zeter on 2017/12/25
 */
import { iccidsTransfer } from '@/global/function/iccids-tool'

const SELECTION_STORAGE_KEY = 'whitehouse_card_manager'

export default {
  data() {
    return {
      limitData: [
        {
          key: 'ICCID_BIND_IMEI',
          label: '机卡绑定'
        },
        {
          key: 'REGIONAL_RESTRICTIONS',
          label: '区域限制'
        },
        {
          key: 'VOLUME_LIMIT',
          label: '人联网'
        },
        {
          key: 'PERSONAL_REAL_NAME',
          label: '个人实名'
        },
        {
          key: 'INTERNET_OF_PEOPLE_RESTRICTIONS',
          label: '限额'
        }
      ],
      form: {
        iccid: ''
      },
      limitValue: [],
      storageKey: SELECTION_STORAGE_KEY,
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
        ]
        // approvalProcessId: [{ required: true, type: 'string', message: '请填写审批流程号' }]
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
    genLimitations(originValue = [], newValue) {
      return newValue.map((item) => {
        return {
          action: 'ADD',
          type: item,
          val: item === 'VOLUME_LIMIT' ? this.form.limitAmount : ''
        }
      })
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
        const limitations = this.genLimitations([], this.limitValue)
        if (valid) {
          const res = await this.jaxLib.whitelist.cardLimitationChangeCreate({
            iccids: iccidsTransfer(this.form.iccid).join(','),
            limitations
          })
          if (!res || !res.success) {
            this.$message.error(res.message)
            return
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
      1.
      本操作不会对实际的合规做操作，仅作为运营商操作后的数据变更记录、合规状态同步的标记和供售后与客户进行查询<br />
      2. 仅允许同一个运营商账号里已出库的卡进行提交，其他没有限制
    </div>
    <el-form ref="form" :model="form" :rules="formRule" label-width="120px">
      <el-form-item label="ICCID" prop="iccid">
        <el-input v-model="form.iccid" type="textarea" rows="6" style="max-width: 500px" />
      </el-form-item>
      <el-form-item label="限制">
        <div style="line-height: 0">
          <el-transfer v-model="limitValue" :data="limitData" :titles="['可选限制', '已选限制']" />
        </div>
      </el-form-item>
      <el-form-item label="限额">
        <el-input v-model="form.limitAmount" type="text" style="width: 200px" placeholder="100">
          <template slot="append">MB</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="onReset">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
