<script>
  import DialogMixin from '@/global/mixins/dialog-mixin'
  import {cloneDeep} from 'lodash'

  const form = {
    // reason: [{value: []}],
    reasonNotice: ''
  }

  export default {
    inject: ['tuple'],
    mixins: [DialogMixin],

    data () {
      return {
        // cascaderProps: {
        //   label: 'name',
        //   value: 'id'
        // },
        form: cloneDeep(form)
      }
    },

    // computed: {
    //   noticeRequired () {
    //     return this.form.reason.some(e => {
    //       return e.value.some(i => i === '18' || i === '19' || i === '20' || i === '24' || i === '25')
    //     })
    //   }
    // },

    methods: {
      close () {
        this.form = cloneDeep(form)
        this.$refs.form.resetFields()
      },

      // addReason () {
      //   this.form.reason.push({value: []})
      // },

      // deleteReason (index) {
      //   this.form.reason.splice(index, 1)
      // },

      cancel () {
        this.$emit('onClose', { type: 'abandon', refreshable: false })
      },

      confirm () {
        // this.$refs.form.validate(valid => {
        //   if (!valid) return
        //   let hash = cloneDeep(this.form)
        //   hash.reason = ''
        //   // hash.reason = JSON.stringify(hash.reason.map(item => item.value.join(',')))
        // })
        let hash = cloneDeep(this.form)
        hash.reason = ''
        this.$emit('onClose', { type: 'abandon', refreshable: true, data: hash })
      }
    }
  }
</script>
<template>
  <div class="abandon-customer">
    <el-form
      ref="form"
      :model="form"
      label-width="90px">
      <el-form-item
        label="说明"
        prop="reasonNotice"
      >
        <el-input v-model="form.reasonNotice" type="textarea"></el-input>
      </el-form-item>

      <el-form-item>
        <!--<el-button @click="addReason">新增原因</el-button>-->
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确认</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
