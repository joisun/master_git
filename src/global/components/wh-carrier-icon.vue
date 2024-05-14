<template>
  <wh-std-icon :sign="signValue">
  </wh-std-icon>
</template>

<script>
  import stdIcon from './std-icon.vue'

  export default {
    name: 'wh-carrier-icon',
    components: {
      'wh-std-icon': stdIcon
    },
    props: {
      carrier: {
        default: 'cmcc',
        require: true
      },
      color: {
        default: false
      }
    },
    computed: {
      signValue() {
        return this.carrier === 'cmcc' ? '&#xe642;' : this.carrier === 'unicom' ? '&#xe655;' : '&#xe61a;'
      }
    }
  }
</script>
