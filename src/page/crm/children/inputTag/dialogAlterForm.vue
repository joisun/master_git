<script type="text/jsx">
  import DialogMixin from '@/global/mixins/dialog-mixin'

  const form = {
    inputTag: ''
  }
  const rules = {
    inputTag: [{required: true, message: '标签名不能为空'}]
  }
  export default {
    props: ['content'],
    mixins: [DialogMixin],
    data () {
      return {
        form: {...form},
        rules: {...rules}
      }
    },
    methods: {
      async open () {
        let {content} = this
        if (content) {
          this.form = {...content}
        }
      },
      close () {
        this.$refs.form.resetFields()
        this.form = {...form}
      },
      cancel () {
        this.$emit('closeDialog', false)
      },
      confirm () {
        this.$refs.form.validate(valid => {
          if (!valid) return
          let { tagId, inputTag } = this.form
          this.$emit('closeDialog', true, { tagId, inputTag })
        })
      }
    },
    render () {
      return <el-form
        ref="form"
        model={this.form}
        rules={this.rules}
        label-width="80px">
        <el-form-item label="标签名" prop="inputTag">
          <el-input
            value={this.form.inputTag}
            onInput={val => this.form.inputTag = val}>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button on-click={this.cancel}>取消</el-button>
          <el-button type="primary" on-click={this.confirm}>确定</el-button>
        </el-form-item>
      </el-form>
    }
  }
</script>
