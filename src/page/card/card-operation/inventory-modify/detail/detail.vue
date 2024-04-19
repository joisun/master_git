<script>
import { iccidsTransfer } from '@/global/function/iccids-tool'
import inventoryChangeBlock from './components/inventory-change-block.vue'
import inventoryChangeDiff from './components/inventory-diff.vue'
import { toolsMixin } from '@/global/mixins/table-selection'

const SELECTION_STORAGE_KEY = 'whitehouse_card_manager'

/**
 * Create by zeter on 2019/12/25
 */
export default {
  name: 'inventory-modify-detail',
  components: {
    'inventory-change-block': inventoryChangeBlock,
    'inventory-diff': inventoryChangeDiff
  },
  mixins: [toolsMixin],
  data() {
    return {
      loading: false,
      postData: {},
      showDiffData: {},
      mode: false,
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
      let rst = await this.jaxLib.store.inventoryChangeDetail({
        id: Number(this.id)
      })
      if (!rst.success) {
        this.$router.go(-1)
        return false
      }
      this.form.iccids = rst.data.currCardInputDataVO.iccids
      this.showDiffData = rst.data
      this.mode = true
    },
    submitCheckForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        let rst = await this.jaxLib.store.inventoryChangeValidate({
          iccids: iccidsTransfer(this.form.iccids, ',')
        })
        if (!rst.success) return false
        this.postData = rst.data
        this.mode = true
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
  <div class="inventory-modify-detail">
    <div class="wh__warp">
      <div class="wh__header">
        <h2 class="wh__header--title">未出库卡信息修改</h2>
        <span class="wh__header--close">
          <el-tooltip content="返回列表" placement="left" effect="dark">
            <wh-std-icon sign="xe6aa" @click="backList"> </wh-std-icon>
          </el-tooltip>
        </span>
      </div>
      <div v-loading="loading" class="wh__body">
        <div>
          仅可对未出库的卡进行修改。不允许选择了不同沉默期到期时间、不同批次号、不同关联分类、不同特殊和不同测试期的卡在同一批次进行操作。
        </div>
        <el-form ref="form" label-position="top" label-width="80px" :model="form" :rules="formRule">
          <el-form-item label="ICCID" prop="iccids">
            <el-input
              v-model="form.iccids"
              rows="6"
              type="textarea"
              :disabled="mode"
              style="width: 250px"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-if="!mode" label="">
            <el-button type="primary" @click="submitCheckForm()">下一步</el-button>
          </el-form-item>
        </el-form>
        <inventory-change-block
          v-if="!!mode && !id"
          :input-data="postData"
          :iccids="form.iccids"
          @back="resetValue"
        >
        </inventory-change-block>
        <inventory-diff
          v-if="id && Object.keys(showDiffData).length"
          :before-modify-object="showDiffData.preCardInputDataVO"
          :after-modify-object="showDiffData.currCardInputDataVO"
        >
        </inventory-diff>
      </div>
    </div>
  </div>
</template>
