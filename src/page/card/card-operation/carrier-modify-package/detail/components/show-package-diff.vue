<script>
  /**
   * Create by zeter on 2019-02-27
   */
  import { beforeModifyList, afterModifyList } from '../mixins/const'
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import { CARRIER_RANKS } from '@/page/manage/children/store/mixins/consts'

  export default {
    name: 'show-package-diff',
    props: {
      content: {
        type: Object,
        default: () => {}
      },
      form: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        listRatePlan: [],
        CARRIER_RANKS,
        beforeModifyList,
        afterModifyList,
        loading: false,
        money: 0,
        innerForm: {
          volume: '',
          type: ''
        }
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      mode() {
        return Object.keys(this.content).length
      }
    },
    methods: {
      back() {
        this.$emit('back')
      },
      onTypeChange(value) {
        if (value === 'POOL') {
          this.innerForm.volume = ''
        }
      },
      async sure() {
        if (this.innerForm.volume === '' && this.innerForm.type !== 'POOL') {
          this.$message.error('请选择套餐大小')
          return false
        }
        if (this.innerForm.type === '') {
          this.$message.error('请选择套餐类型')
          return false
        }
        this.loading = true
        let rst = await this.jaxLib.card.modifyInPackageSubmit({
          iccids: iccidsTransfer(this.form.iccids, ','),
          targetDataVolume:
            this.innerForm.type === 'POOL' ? -1 : this.innerForm.volume,
          type: this.innerForm.type
        })
        this.loading = false
        if (!rst.success) return false
        this.$router.push({ name: 'carrier-modify-package-list' })
      },
      async getListRatePlan() {
        let rst = await this.jaxLib.store.listRatePlan()
        if (!rst.success) {
          return false
        }
        this.listRatePlan = rst.data.list
      }
    },
    mounted() {
      this.getListRatePlan()
    }
  }
</script>

<template>
  <div class="show-package-diff">
    <div class="flex">
      <div class="flex1 wh__card mr20">
        <div class="wh__card--header">变更前</div>
        <ul class="wh__card--body">
          <li v-for="(i, index) in beforeModifyList" :key="index">
            {{ i.name }}:
            {{ i.formatter ? i.formatter(content[i.key]) : content[i.key] }}
          </li>
        </ul>
      </div>
      <div class="flex1 wh__card">
        <div class="wh__card--header">变更后</div>
        <ul class="wh__card--body">
          <li v-for="i in afterModifyList" :key="i.key">
            {{ i.name }}:
            {{ i.formatter ? i.formatter(content[i.key]) : content[i.key] }}
          </li>
          <li>
            <span>目标套餐类型:</span>
            <el-select
              v-model="innerForm.type"
              placeholder="请选择"
              size="small"
              v-if="!id"
              @change="onTypeChange"
            >
              <el-option label="前向流量池" value="PRE_POOL"> </el-option>
              <el-option label="前向按月套餐" value="STANDARD"> </el-option>
              <el-option label="后向流量池" value="POOL"> </el-option>
            </el-select>
            <span v-else>{{ content.targetCardType }}</span>
          </li>
          <li>
            <span>目标套餐档位:</span>
            <el-select
              v-model="innerForm.volume"
              placeholder="请选择"
              size="small"
              v-if="!id"
              value-key="label"
              :disabled="innerForm.type === 'POOL'"
            >
              <el-option
                v-for="item in listRatePlan"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <span v-else>{{ content.targetDataVolume | volumeFilter }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex" :loading="loading">
      <div v-if="!id">
        <el-button @click="back">上一步</el-button>
        <el-button @click="sure" type="primary" :disabled="loading"
          >确认</el-button
        >
      </div>
      <div v-else>
        <div>操作人: {{ content.changeBy }}</div>
        <div>操作时间: {{ content.gmtCreated | dateFilter }}</div>
      </div>
    </div>
  </div>
</template>
