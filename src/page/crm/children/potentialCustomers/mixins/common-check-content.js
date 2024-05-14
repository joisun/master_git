export default {
  methods: {
    check (content) {
      let that = this
      let flag = true
      Object.keys(content).forEach(key => {
        switch (key) {
          case 'hasCompetitor': 
            if (content[key] === null || content[key] === '') {
              that.$message.error('有无竞品必选')
              flag = false
            } 
            break
          case 'competitor': 
            if (content.hasCompetitor && (!content[key] || !content[key].length)) {
              that.$message.error('竞品名不能为空')
              flag = false
            }
            break
          case 'otherCompetitor':
            if (content.hasCompetitor && content.competitor.some(item => item === '1') && (!content[key] || !content[key].length)) {
              that.$message.error('其他竞品名不能为空')
              flag = false
            }
            break
          case 'notice': 
            if (content.hasCompetitor && content.competitor && (!content[key] || !content[key].length)) {
              that.$message.error('竞品存在的问题不能为空')
              flag = false
            }
            break
          case 'firstIncome':
            if (!content[key]) {
              that.$message.error('首单收入不能为空')
              flag = false
            } else if (!/^\d+(\.)*(\d)*$/.test(content[key])) {
              that.$message.error('首单收入只能是数据')
              flag = false
            }
            break
          case 'yearIncome':
            if (!content[key]) {
              that.$message.error('年度总收入不能为空')
              flag = false
            } else if (!/^\d+(\.)*(\d)*$/.test(content[key])) {
              that.$message.error('年度总收入只能是数据')
              flag = false
            }
            break
          case 'useMeal': 
            if (!content[key] || !content[key].length) {
              that.$message.error('意向套餐不能为空')
              flag = false
            }
            break
        }
      })
      return flag
    }
  }
}
