<script>
  import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'
  import { iccidsTransfer } from '@/global/function/iccids-tool'
  import dateFormat from '@/global/filters/date-format'
  import { cardTagMap } from '../mixin/consts'

  class EditForm {
    constructor() {
      this.env = ''
      this.ips = ''
      this.iccids = ''
      this.carrier = ''
      this.cardType = ''
      this.ratePlan = ''
      this.locationNo = ''
      this.testDeadline = ''
      this.testCardTags = []
      this.testDataVolume = ''
      this.carrierAccountId = ''
    }
  }

  export default {
    components: {
      whCarrierAccountSelect
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      cardTagList: {
        type: Array,
        default: () => []
      },
      type: {
        type: String,
        default: 'add'
      },
      content: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        testPeriod: true,
        isShowDialog: false,
        form: new EditForm(),
        rules: {
          env: [
            { required: true, message: '请选择环境', trigger: 'blur' }
          ],
          carrier: [
            { required: true, message: '请选择运营商', trigger: 'blur' }
          ],
          carrierAccountId: [
            { required: true, message: '请选择运营商账号', type: 'number', trigger: 'blur' }
          ],
          cardType: [
            { required: true, message: '请选择套餐分类', trigger: 'blur' }
          ],
          iccids: [
            { required: true, message: 'iccid不能为空', trigger: 'blur' }
          ],
          testDataVolume: [
            { required: true, message: '测试期流量不能为空', trigger: 'blur' }
          ],
          testDeadline: [
            { required: true, type: 'date', message: '测试期结束时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      envMap() {
        return this.$store.state.overall.enum.env || []
      },
      cardCarrierType() {
        return this.$store.state.overall.enum.cardCarrierType || []
      },
      isEdit() {
        return this.type === 'edit'
      }
    },
    methods: {
      closeDialog() {
        this.$emit('close', 'edit')
      },
      handleTestPeriodChange() {
        this.updateRules()
      },
      open() {
        this.form = new EditForm()
        this.testPeriod = true
        if (this.type === 'add') return true
        Object.keys(this.form).forEach(key => {
          if (key === 'testCardTags') {
            cardTagMap.forEach(item => {
              if (this.content[item.key]) {
                const tag = this.cardTagList.find(t => t.desc === item.name)
                if (tag) {
                  this.form.testCardTags.push(tag.name)
                }
              }
            })
          } else {
            this.form[key] = this.content[key]
          }
        })
        this.form.iccids = this.content.iccid
        this.form.ips = this.content.ip
        if (!this.content.testDataVolume || !this.content.testDeadline) {
          this.testPeriod = false
          this.form.testDataVolume = ''
          this.form.testDeadline = ''
        } else {
          this.form.testDeadline = new Date(dateFormat(this.form.testDeadline, 'YYYY-MM-DD'))
        }
        this.updateRules()
      },
      updateRules() {
        if (this.testPeriod) {
          this.rules.testDataVolume = [
            { required: true, message: '测试期流量不能为空', trigger: 'blur' }
          ]
          this.rules.testDeadline = [
            { required: true, type: 'date', message: '测试期结束时间不能为空', trigger: 'blur' }
          ]
        } else {
          delete this.rules.testDataVolume
          delete this.rules.testDeadline
        }
      },
      async submit() {
        const {
          env, ips, iccids,
          carrier, cardType, ratePlan, testDeadline, testCardTags, testDataVolume, carrierAccountId, locationNo
        } = this.form
        const postData = {
          env,
          carrier,
          cardType,
          ratePlan: ratePlan,
          testDataVolume: Number(testDataVolume),
          carrierAccountId,
          locationNo,
          testDeadline,
          ips: iccidsTransfer(ips, ','),
          iccids: iccidsTransfer(iccids, ','),
          testCardTags: testCardTags.join(',')
        }
        if (!this.testPeriod) {
          delete postData.testDataVolume
          delete postData.testDeadline
        }
        this.$refs.editForm.validate(async valid => {
          if (valid) {
            let res = {}
            let actionText = ''
            if (this.type === 'add') {
              actionText = '新增'
              res = await this.jaxLib.testCard.addTestCard(postData)
            } else {
              actionText = '更新'
              res = await this.jaxLib.testCard.updateTestCard(postData)
            }
            if (!res.success) return false
            this.$message({ type: 'success', message: `${actionText}成功` })
            this.$emit('close', 'edit')
          }
        })
      }
    }
  }
</script>

<template>
  <div class="test-card-edit-dialog">
    <el-dialog
      :title="type === 'add' ? '新增' : '修改'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @open="open"
      :show-close="false">
      <el-form :inline="true" :model="form" :rules="rules" ref="editForm">
        <el-form-item prop="env">
          <el-select placeholder="选择环境" v-model="form.env" size="small">
            <el-option v-for="(val, key) in envMap" :label="val" :value="key" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="carrier">
          <el-select placeholder="选择运营商" v-model="form.carrier" size="small">
            <el-option v-for="(val, key) in enums.carrier.maps()" :label="val" :value="key" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="carrierAccountId">
          <wh-carrier-account-select
            size="small"
            v-model="form.carrierAccountId"
            :carrier="form.carrier">
          </wh-carrier-account-select>
        </el-form-item>
        <el-form-item prop="cardType">
          <el-select placeholder="选择套餐分类" v-model="form.cardType" size="small">
            <el-option v-for="(val, key) in cardCarrierType" :label="val" :value="key" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="套餐规格" v-model="form.ratePlan" class="form-input" size="small">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="编号" v-model="form.locationNo" class="form-input" size="small">
          </el-input>
        </el-form-item>
        <div class="test-period">
          <span class="title">测试期</span>
          <el-radio-group v-model="testPeriod" @change="handleTestPeriodChange">
            <el-radio :label="true">有</el-radio>
            <el-radio :label="false">无</el-radio>
          </el-radio-group>
          <el-form-item prop="testDataVolume">
            <el-input
              placeholder="测试期流量"
              :disabled="!testPeriod"
              v-model="form.testDataVolume"
              class="form-input"
              type="number"
              size="small">
            </el-input>
          </el-form-item>
          <el-form-item prop="testDeadline">
            <el-date-picker
              type="date"
              :disabled="!testPeriod"
              v-model="form.testDeadline"
              placeholder="测试期结束时间"
              size="small">
            </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item class="card-tag-item">
          <el-checkbox-group v-model="form.testCardTags">
            <el-checkbox
              v-for="item in cardTagList"
              :label="item.name"
              :key="item.name"
              :class="{ 'search-checkbox--checked': form.testCardTags.indexOf(item.name) > -1 }"
              class="search-checkbox">
              {{ item.desc }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div class="textarea-wrapper">
          <div class="textarea-wrapper--item">
            <span class="title">ICCID</span>
            <el-form-item class="textarea-item" prop="iccids">
              <el-input type="textarea" :disabled="isEdit" v-model="form.iccids" placeholder="请输入iccid, 一行一个iccid">
              </el-input>
            </el-form-item>
          </div>
          <div class="textarea-wrapper--item">
            <span class="title">IP地址</span>
            <el-input
              type="textarea"
              :disabled="isEdit"
              v-model="form.ips"
              placeholder="请输入ip地址, 一行一个ip地址，IP地址与同一行iccid对应">
            </el-input>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss">
  .test-card-edit-dialog {
    .form-input {
      width: 175px;
    }

    .el-dialog {
      width: 980px;

      .test-period {
        .title {
          margin-right: 10px;
        }

        .el-radio-group {
          margin-right: 10px;
        }
      }

      .card-tag-item {
        .el-form-item__content {
          line-height: normal;
        }
      }

      .textarea-item {
        width: 100%;

        .el-form-item__content {
          width: 100%;
        }
      }

      .textarea-wrapper {
        display: flex;
        justify-content: space-between;
        font-size: 0;

        &--item {
          width: 49%;

          .title {
            display: inline-block;
            height: 25px;
            font-size: 14px;
          }

          textarea {
            height: 200px;
            resize: none;
          }
        }
      }
    }
  }
</style>
