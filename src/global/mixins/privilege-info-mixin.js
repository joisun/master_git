import {mapState} from 'vuex'

export default {
  data () {
    return {}
  },

  computed: {
    ...mapState({
      user: state => state.overall.user,
      regions: state => state.overall.crmEnum.entities.region,
      businesses: state => state.overall.crmEnum.entities.business
    }),

    selectRegions () {
      let list = this.regions || []
      if (this.user.category === 'seller' || this.user.category === 'leader') {
        if (this.user.regions && this.user.regions.length) {
          list = this.user.regions
        }
      }
      return list
    },

    selectBusinesses () {
      let list = this.businesses || []
      if (this.user.category === 'seller' || this.user.category === 'leader') {
        if (this.user.business && this.user.business.length) {
          list = this.user.business
        }
      }
      return list
    },

    salesmanList () {
      return this.user.salesman && this.user.salesman.length ? this.user.salesman : []
    },

    isAllSalesman () {
      return this.user.salesman && this.user.salesman.length
    }
  }
}
