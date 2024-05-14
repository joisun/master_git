<script type="text/jsx">
/**
   * Create by zeter on 2017/3/8
   */
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    data() {
      return {
        // 用户选择
        activeCardList: [],
        // 无效
        unValidator: [],
        // 加载状态
        loading: false,
        // 有效
        multiple: []
      }
    },
    props: {
      dialogName: {
        type: String,
        default: ''
      },
      // 多选栏值
      multipleSelection: {
        default: '',
        required: true,
        type: String
      }
    },
    methods: {
      // 关闭
      close() {
        this.$emit('closeDialog', this.dialogName)
      },
      // 检测激活卡
      async matchIccid(iccids) {
        let rst = await this.jaxLib.pool.validatorPoolCard(iccidsTransfer(iccids, ','))
        if (!rst.success) return false
        this.unValidator = rst.data.invalidIccids
        this.multiple = rst.data.validIccids.slice()
        this.activeCardList = rst.data.validIccids.slice()
      },
      // 激活请求
      async handleActive() {
        if (this.activeCardList.length !== 0) {
          this.loading = true
          let iccids = this.activeCardList.join(',')
          let rst = await this.jaxLib.pool.activePoolCard(iccids)
          this.loading = false
          if (!rst.success) return false
          this.showResult({
            good: rst.data.successIccids.join(','),
            bad: rst.data.faildIccids.join(','),
            unValidator: this.unValidator.join(',')
          })
          this.$emit('closeDialog', this.dialogName)
        } else {
          this.$message.warning('请选择需要激活的设备')
        }
      },
      showResult(obj) {
        const messageNode = (h, tip) => (<div>
        <div class="pool-list__result--item">
                激活成功: {tip.good}</div>
        <div class="pool-list__result--item">
                激活失败: {tip.bad}</div>
        <div class="pool-list__result--item" v-if="cardshowTip.bad!==''">无效ICCID: {tip.unvalitor}</div>
      </div>
      )
        this.$msgbox({
          title: '操作提示',
          message: messageNode(this.$createElement, obj),
          showCancelButton: false,
          confirmButtonText: '确定'
        }).then(action => {})
      },
      open() {
        this.matchIccid(this.multipleSelection, true)
      }
    }
  }
</script>

<template>
  <div class="activecard">
    <div class="wh__dialog--body">
      <el-tabs type="border-card" class="smalltabs">
        <el-tab-pane :label="'有效ICCID('+ multiple.length + ')'">
          <div>ICCID数据:</div>
          <div class="IccidDorad">
            <div class="iccid__box">
              <el-checkbox-group v-model="activeCardList">
                <el-checkbox v-for="item of multiple" :label="item"
                  :key="item" class="choseactivecaed">
                </el-checkbox>
                <div v-if="multiple.length === 0">暂无可以选择的卡片</div>
              </el-checkbox-group>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'无效ICCID('+ unValidator.length + ')'">
          <div>仅库存状态的物联网卡支持激活</div>
          <div>ICCID数据:</div>
          <div class="IccidDorad">
            <div class="iccid__box">
              <span class="recharge__invalid" v-for="item of unValidator" :key="item">
                {{item}}
              </span>
              <span v-if="unValidator.length === 0">没有无效的ICCID</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="wh__dialog--footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleActive" :disabled="loading">确认</el-button>
    </div>
  </div>
</template>
