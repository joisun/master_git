<script type="text/ecmascript-6">

import moment from 'moment'
import DialogMixin from '@/global/mixins/dialog-mixin'

export default {
  mixins: [DialogMixin],
  props: {
    orgId: {
      default: String
    },
    pointOrgName: {
      default: String
    },
    orgContent: {
      default: Object
    },
    dialogName: {
      default: String
    }
  },

  data() {
    return {
      activeTab: 'remark',
      form: {
        cmccMccRequirement: false,
        telecomUpperLimit: undefined,
        priceOfferColorRelation: [
          {
            priceOfferId: '',
            cardColor: ''
          }
        ],
        otherRequirement: '',
        comment: '',
      },
      rules: {
        comment: [{required: true, message: '请填写备注', trigger: 'blur'}]
      },
      // 历史备注
      comments: [],
      requirementList: [],
      isLoading: true
    }
  },

  methods: {
    addRow() {
      this.form.priceOfferColorRelation.push({priceOfferId: '', cardColor: ''});
    },
    removeRow(index) {
      if (this.form.priceOfferColorRelation.length > 1) {
        this.form.priceOfferColorRelation.splice(index, 1);
      }
    },
    open() {
      this.getList()
      this.getReqList()
      this.form.comment = ''
    },
    onCancel() {
      this.$emit('closeDialog', this.dialogName, 0)
    },
    async getList() {
      this.isLoading = true
      let rst = await this.jaxLib.bill.remark.query({ref_id: this.orgId, type: 'ORG-REMARK'})
      this.isLoading = false
      if (!rst.success) return false
      this.comments = rst.data.map(e => ({
            comment: e.remarkContent,
            createTime: moment(e.gmtCreated.time).format('YYYY-MM-DD HH:mm:ss'),
            author: e.remarkUser
          }),
      )
    },
    async getReqList() {
      this.isLoading = true
      let rst = await this.jaxLib.bill.remark.deliveryRequirementQuery({orgId: this.orgId})
      this.isLoading = false
      if (!rst.success) return false
      this.requirementList = rst.data;
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.activeTab === 'remark')  {
            this.shortcuts.confirm('确定添加备注？', async () => {
              let rst = await this.jaxLib.bill.remark.create({
                ref_id: this.orgId,
                type: 'ORG-REMARK',
                remark_content: this.form.comment
              })
              if (!rst.success) return false
              this.getList()
              this.form.comment = ''
            })
            return
          }
          if (this.activeTab === 'requirement') {
            this.shortcuts.confirm('确定添加发货要求？', async () => {
              const {telecomUpperLimit, otherRequirement, cmccMccRequirement,priceOfferColorRelation} = this.form
              let rst = await this.jaxLib.bill.remark.deliveryRequirementCreate({
                orgId: this.orgId,
                priceOfferColorRelation,
                telecomUpperLimit,
                otherRequirement,
                cmccMccRequirement: Number(cmccMccRequirement)
              })
              if (!rst.success) return false
              this.getReqList()
              this.form = {
                cmccMccRequirement: false,
                telecomUpperLimit: undefined,
                priceOfferColorRelation: [
                  {
                    priceOfferId: '',
                    cardColor: ''
                  }
                ],
                otherRequirement: '',
                comment: '',
              }
            })
          }

        }
      })
    }
  }
}
</script>

<template>
  <div class="bill-comment-editor">
    <el-form
        v-loading="isLoading"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="80px"
        label-position="right">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="客户备注" name="remark">
          <template  v-if="activeTab === 'remark'">
            <el-form-item label="备注历史">
              <el-table :data="comments" class="dialog-table">
                <el-table-column
                    prop="createTime"
                    label="时间"
                    width="170">
                </el-table-column>
                <el-table-column
                    prop="author"
                    label="操作人"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="comment"
                    label="备注"
                    class="">
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="备注" prop="comment">
              <el-input
                  type="textarea"
                  v-model="form.comment"
                  placeholder="输入备注信息">
              </el-input>
            </el-form-item>
          </template>

        </el-tab-pane>
        <el-tab-pane label="发货要求" name="requirement">
          <template v-if="activeTab === 'requirement'">
            <el-form-item label="变更历史">
              <el-table :data="requirementList" class="dialog-table">
                <el-table-column
                    prop="gmtCreated"
                    label="时间"
                    width="170">
                  <template #default="{row}">
                    {{ row.gmtCreated | dateFilter }}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="manageAccount"
                    label="操作人"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="remarks"
                    label="备注">
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="发卡颜色:" prop="priceOfferColorRelation">
              <el-table
                  :data="form.priceOfferColorRelation"
                  style="width: 100%"
              >
                <el-table-column
                    prop="index"
                    label="序号"
                    width="50"
                    align="center"
                    type="index"
                ></el-table-column>
                <el-table-column
                    prop="priceOfferId"
                    label="套餐ID"
                    width="180"
                    align="center"
                >
                  <template slot-scope="scope">
                    <el-form-item :prop="'priceOfferColorRelation.' + scope.$index + '.priceOfferId'">
                      <el-input v-model="scope.row.priceOfferId"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="color"
                    label="颜色要求"
                    width="180"
                    align="center"
                >
                  <template slot-scope="scope">
                    <el-form-item :prop="'priceOfferColorRelation.' + scope.$index + '.cardColor'"

                    >
                      <el-select v-model="scope.row.cardColor" placeholder="选择颜色">
                        <el-option
                            v-for="(key, val) in enums.cardColor.maps()"
                            :key="val"
                            :label="key"
                            :value="val"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100"
                    align="center"
                >
                  <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-plus" @click="addRow"></el-button>
                    <el-button type="text" @click="removeRow(scope.$index)" icon="el-icon-minus" v-if="form.priceOfferColorRelation.length > 1"/>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item prop="telecomUpperLimit" label="电信阈值要求"  label-width="200">
              <el-input v-model="form.telecomUpperLimit" style="width: 200px"/> MB
            </el-form-item>
            <el-form-item label="移动号段（IMSI的第4、5位）要求" prop="cmccMccRequirement" label-width="200">
              <el-radio-group v-model="form.cmccMccRequirement">
                <el-radio :label="false">无要求</el-radio>
                <el-radio :label="true">要求：08</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="其他发货备注" prop="otherRequirement"  label-width="200">
              <el-input
                  type="textarea"
                  v-model="form.otherRequirement"
                  placeholder="输入其他发货备注">
              </el-input>
            </el-form-item>
          </template>
        </el-tab-pane>
      </el-tabs>

      <el-form-item>
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
