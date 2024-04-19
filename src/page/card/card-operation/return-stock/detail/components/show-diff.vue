<script>
import { beforeModifyList, afterModifyList, statusMap } from '../mixins/const'
import { iccidsTransfer } from '@/global/function/iccids-tool'

export default {
  name: 'show-diff',
  props: {
    content: {
      type: Object,
      default: () => {}
    },
    iccids: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      beforeModifyList,
      afterModifyList,
      loading: false,
      statusMap,
      form: {
        status: 'level2',
        remark: '',
        resetSmsPackage: false
      }
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  methods: {
    back() {
      this.$emit('back')
    },
    async sure() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        this.loading = true
        const { status, remark, resetSmsPackage } = this.form

        const { success } = await this.jaxLib.store.activeToInventoryApply({
          iccids: iccidsTransfer(this.iccids),
          status,
          remark,
          resetSmsPackage
        })
        this.loading = false
        if (!success) return false
        await this.$router.push({ name: 'return-stock-list' })
      })
    }
  }
}
</script>

<template>
  <div class="show-diff">
    <div class="flex">
      <div class="flex1 wh__card mr20">
        <div class="wh__card--header">变更前</div>
        <div class="wh__card--body">
          <el-form label-width="150px">
            <el-form-item v-for="i in beforeModifyList" :key="i.key" :label="i.name">
              {{ i.formatter ? i.formatter(content[i.key]) : content[i.key] }}
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="flex1 wh__card">
        <div class="wh__card--header">变更后</div>
        <div class="wh__card--body">
          <el-form ref="form" :model="form" label-width="150px">
            <el-form-item v-for="i in afterModifyList" :key="i.key" :label="i.name">
              {{ i.formatter ? i.formatter(content[i.key]) : content[i.key] }}
            </el-form-item>
            <el-form-item
              label="变更后卡状态"
              prop="status"
              :rules="{ required: !id, message: '请选择变更后状态' }"
            >
              <el-select v-if="!id" v-model="form.status" placeholder="请选择" size="small">
                <el-option v-for="(key, val) in statusMap" :key="key" :label="key" :value="val">
                </el-option>
              </el-select>
              <span v-else>{{ content.targetStatus }}</span>
            </el-form-item>
            <el-form-item label="是否重置短信包" prop="resetSmsPackage" :rules="{ required: !id }">
              <el-switch
                v-if="!id"
                v-model="form.resetSmsPackage"
                active-text="是"
                inactive-text="否"
              />
              <span v-else>{{ content.resetSmsPackage ? '是' : '否' }}</span>
            </el-form-item>
            <el-form-item
              label="备注"
              prop="remark"
              :rules="[
                { required: !id, message: '请输入备注' },
                { max: 200, message: '备注字数不得多于200字' }
              ]"
            >
              <el-input v-if="!id" v-model="form.remark" type="textarea" style="width: 50%">
              </el-input>
              <span v-else>{{ content.remark }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="flex" :loading="loading">
      <div v-if="!id">
        <el-button @click="back">上一步</el-button>
        <el-button type="primary" :disabled="loading" @click="sure">确认</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
li {
  line-height: 40px;
  span {
    display: inline-block;
  }
}
</style>
