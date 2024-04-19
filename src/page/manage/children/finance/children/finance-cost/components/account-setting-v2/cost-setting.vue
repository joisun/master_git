<script>
/**
   * Create by zeter on 2017/12/11
   */
  import otherForm from './other-form.vue'
  import whCarrierAccountSelect from '@/page/components/wh-carrier-account-select.vue'

  export default {
    data() {
      return {
        carrierAccount: '',
        carrier: 'cmcc'
      }
    },
    components: {
      'other-form': otherForm,
      'wh-carrier-account-select': whCarrierAccountSelect
    }
  }
</script>

<template>
  <div class="cost-setting">
    <div class="wh__tools">
      <div class="wh__tools--mix">
        <el-select v-model="carrier" style="margin-right: 10px;" placeholder="请选择运营商">
          <el-option v-for="(val, key) in enums.carrier.maps()" :label="val" :value="key" :key="key">
          </el-option>
        </el-select>
        <wh-carrier-account-select v-model="carrierAccount" :carrier="carrier" placeholder="请选择运营商账号">
        </wh-carrier-account-select>
      </div>
    </div>
    <other-form :carrierAccount="carrierAccount" :carrier="carrier" v-if="carrierAccount">
    </other-form>
    <span v-else>请先选择对应运营商账号</span>
  </div>
</template>
