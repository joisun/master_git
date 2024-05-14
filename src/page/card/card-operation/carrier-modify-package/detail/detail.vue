<script>
/**
 * Create by zeter on 2019-02-27
 */
import { iccidsTransfer } from '@/global/function/iccids-tool'
import showPackageDiff from './components/show-package-diff.vue'
import { toolsMixin } from '@/global/mixins/table-selection'
import { safeGet } from '@/global/function/safe-operations'

const SELECTION_STORAGE_KEY = 'whitehouse_card_manager'
export default {
  name: 'carrier-modify-package-detail',
  components: {
    'show-package-diff': showPackageDiff
  },
  mixins: [toolsMixin],
  data() {
    return {
      postData: {},
      form: {
        iccids: ''
      },
      formRule: {
        iccids: [{ required: true, message: '请输入iccid', trigger: 'blur' }]
      },
      storageKey: SELECTION_STORAGE_KEY,
      loading: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    mode() {
      return !!Object.keys(this.postData).length
    }
  },
  created() {
    if (this.$route.query.from === 'card-list') {
      const selected = this.getSelected('iccid')
      if (selected.length) {
        this.form.iccids = selected.join('\n')
      }
    }
  },
  mounted() {
    if (this.id) {
      this.getData()
    } else {
      this.postData = {}
    }
  },
  methods: {
    async getData() {
      let rst = await this.jaxLib.card.modifyPackageList({
        id: this.id
      })
      if (!rst.success || !rst.data.page.allCount) {
        this.$router.go(-1)
        return false
      }
      this.form.iccids = safeGet(rst, 'data.list.0.iccids', '')
      this.postData = safeGet(rst, 'data.list.0', {})
    },
    submitCheckForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        let rst = await this.jaxLib.card.modifyInPackageCheck({
          iccids: iccidsTransfer(this.form.iccids, ','),
          targetPriceOfferId: this.form.planId
        })
        if (!rst.success) return false
        this.postData = rst.data
        this.form.iccids = rst.data.iccids
      })
    },
    resetValue() {
      this.postData = {}
    },
    backList() {
      window.history.go(-1)
    }
  }
}
</script>

<template>
  <div class="modify-package-detail">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">运营商套餐变更申请</h2>
        <span class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"></wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div v-loading="loading" class="wh__body">
        <div>请输入同-运营商账号下，同一套餐类型和档位的卡号，限制10000张。</div>
        <el-form
          ref="form"
          label-position="top"
          label-width="80px"
          :model="form"
          style="width: 250px"
          :rules="formRule"
        >
          <el-form-item label="ICCID" prop="iccids">
            <el-input v-model="form.iccids" rows="6" type="textarea" :disabled="mode"></el-input>
          </el-form-item>
          <el-form-item v-if="!mode" label="">
            <el-button type="primary" @click="submitCheckForm()">下一步</el-button>
          </el-form-item>
        </el-form>
        <show-package-diff v-if="!!mode" :content="postData" :form="form" @back="resetValue">
        </show-package-diff>
      </div>
    </div>
  </div>
</template>
