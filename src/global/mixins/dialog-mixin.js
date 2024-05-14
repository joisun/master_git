export default {
  computed: {
    visible() {
      return this.$parent.visible
    }
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal === true) {
        this.open()
      } else if (newVal === false) {
        this.close()
      }
    }
  },
  mounted() {
    this.open()
  },
  methods: {
    open() {
      // 需要被具体组件覆盖
    },
    close() {
      // 需要被具体组件覆盖
    }
  }
}
