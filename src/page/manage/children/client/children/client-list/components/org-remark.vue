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
        form: {
          comment: ''
        },
        rules: {
          comment: [{ required: true, message: '请填写备注', trigger: 'blur' }]
        },
        // 历史备注
        comments: [],
        isLoading: true
      }
    },

    methods: {
      open() {
        this.getList()
        this.form.comment = ''
      },
      onCancel() {
        this.$emit('closeDialog', this.dialogName, 0)
      },
      async getList() {
        this.isLoading = true
        let rst = await this.jaxLib.bill.remark.query({ ref_id: this.orgId, type: 'ORG-REMARK' })
        this.isLoading = false
        if (!rst.success) return false
        this.comments = rst.data.map(e => ({
          comment: e.remarkContent,
          createTime: moment(e.gmtCreated.time).format('YYYY-MM-DD HH:mm:ss'),
          author: e.remarkUser
        }),
        )
      },
      onSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.shortcuts.confirm('确定添加备注？', async() => {
              let rst = await this.jaxLib.bill.remark.create({
                ref_id: this.orgId,
                type: 'ORG-REMARK',
                remark_content: this.form.comment
              })
              if (!rst.success) return false
              this.getList()
              this.form.comment = ''
            })
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

      <el-form-item>
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
