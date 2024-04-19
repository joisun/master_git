<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'

  export default {
    mixins: [DialogMixin],
    props: {
      // 历史备注
      billId: {}
    },
    data() {
      return {
        form: {
          comment: ''
        },
        rules: {
          comment: [{
            required: true,
            message: '请填写备注',
            trigger: 'blur'
          }]
        },
        // 历史备注
        comments: [],
        isLoading: false
      }
    },
    methods: {
      open() {
        this.getRemark()
      },
      close() {
        this.$refs.form.resetFields()
      },
      getRemark() {
        this.isLoading = true
        this.jaxLib.bill.remark.getRemark(this.billId).then(ret => {
          this.isLoading = false
          if (ret.success) {
            this.comments = ret.data.map(e => ({
              comment: e.content,
              createTime: e.gmtCreated,
              author: e.operator
            }))
          } else this.shortcuts.notify('订单备注加载失败！' + ret.message, '操作失败', 'error')
        }).catch(err => {
          this.isLoading = false
          console.error('订单备注加载异常:', err)
        })
      },
      onCancel() {
        this.shortcuts.confirm('想要退出备注编辑器？', () => {
          this.$emit('close')
        })
      },

      onSubmit() {
        const thiz = this

        /**
         * 提交执行器
         * @param comment {string}
         * @returns {Promise}
         */
        const actor = (comment) => new Promise((resolve, reject) => {
          this.jaxLib.bill.remark.create({
            ref_id: this.billId,
            type: 'CARD-ORDER',
            remark_content: comment
          }).then(ret => {
            if (ret.success) resolve()
            else reject(ret.message)
          }).catch(reject)
        })

        this.$refs.form.validate(valid => {
          if (valid) {
            thiz.shortcuts.confirm('确定添加备注？', async() => {
              try {
                await actor(this.form.comment)
                this.shortcuts.msg('备注添加成功！', 'success')
                this.$emit('close', true)
              } catch (err) {
                console.error('onSubmitComment:', err)
              }
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
      label-width="100px"
      label-position="right"
    >
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
            width="100">
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
