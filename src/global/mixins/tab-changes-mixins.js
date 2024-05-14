export default {
  data() {
    return {
      activeName: ''
    }
  },
  methods: {
    changeRoute(tab, event) {
      this.$router.push({ name: tab.name.trim() })
    },
    routeChange() {
      this.activeName = this.$route.name
    }
  },
  watch: {
    $route: 'routeChange'
  },
  mounted() {
    this.routeChange()
  }
}
