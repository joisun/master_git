<script>
/**
 * Create by zeter on 2019-02-27
 */
import { iccidsTransfer } from '@/global/function/iccids-tool'
import showDiff from './components/show-diff.vue'
import { toolsMixin } from '@/global/mixins/table-selection'

const SELECTION_STORAGE_KEY = 'whitehouse_card_manager'

export default {
  name: 'carrier-modify-package-detail',
  components: {
    'show-diff': showDiff
  },
  mixins: [toolsMixin],
  data() {
    return {
      postData: {},
      isLoading: false,
      form: {
        iccids: ''
      },
      formRule: {
        iccids: [{ required: true, message: '请输入iccid', trigger: 'blur' }]
      },
      storageKey: SELECTION_STORAGE_KEY
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
      let rst = await this.jaxLib.store.activeToInventoryList({
        id: this.id
      })
      if (!rst.success) {
        this.$router.go(-1)
        return false
      }
      this.form.iccids = rst.data.iccids
      this.postData = rst.data
    },
    submitCheckForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        let rst = await this.jaxLib.store.activeToInventoryValidate({
          iccids: iccidsTransfer(this.form.iccids)
        })
        if (!rst.success) return false
        this.postData = rst.data
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
        <h2 class="wh__header--title">激活卡恢复库存</h2>
        <span class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"> </wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div v-loading="isLoading" class="wh__body">
        <el-form
          ref="form"
          label-position="top"
          label-width="80px"
          :model="form"
          style="width: 250px"
          :rules="formRule"
        >
          <el-form-item label="ICCID" prop="iccids">
            <el-input v-model="form.iccids" rows="6" type="textarea" :disabled="mode"> </el-input>
          </el-form-item>
          <el-form-item v-if="!mode" label="">
            <el-button type="primary" @click="submitCheckForm()">下一步</el-button>
          </el-form-item>
        </el-form>
        <show-diff v-if="!!mode" :content="postData" :iccids="form.iccids" @back="resetValue" />
      </div>
    </div>
  </div>
</template>
