let CustomerDetail = null
let CustomerDetailArticle = null
let Sections = null
export default {
  methods: {
    handleCatalogSelected (catalogId) {
      let detail = CustomerDetail || (CustomerDetail = document.querySelector('.customer-detail'))
      let article = detail && (CustomerDetailArticle || (CustomerDetailArticle = detail.querySelector('.article')))
      
      if (!article) return
      let sections = Sections || (Sections = article.querySelectorAll('.section'))
      sections = Array.prototype.slice.call(sections)
      let section = sections.shift()
      while (section) {
        let targetId = section.dataset.offsetId
        if (targetId === catalogId) break
        section = sections.shift()
      }
      section.scrollIntoView()
    }
  }
}
