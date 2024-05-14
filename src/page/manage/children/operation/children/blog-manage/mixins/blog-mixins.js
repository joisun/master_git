import moment from 'moment'

export default {
  data() {
    return {
      categoryList: [
        {
          name: '',
          id: null
        }
      ],
      typeList: [
        {
          name: '',
          id: null
        }
      ],
      articleList: [],
      imgUrls: {},
      articleItem: {},
      movieTag: -1,
      relatedTag: -1,
      keywordTag: -1
    }
  },
  methods: {
    typeFilter(ids) {
      let idArray = ids.toString().split(',')
      let name = ''
      idArray.forEach((element) => {
        const eltype = this.typeList.filter((item) => item.id == element)
        if (eltype.length > 0) {
          name = name + (name.length > 0 ? '、' : '') + eltype[0].name
        }
      })
      return name
    },
    categoryFilter(ids) {
      let idArray = ids.toString().split(',')
      let name = ''
      idArray.forEach((element) => {
        const eltype = this.categoryList.filter((item) => item.id == element)
        if (eltype.length > 0) name = name + (name.length > 0 ? '、' : '') + eltype[0].name
      })
      return name
    },
    resetType() {
      let newList = []
      this.typeList.forEach((item) => {
        let sizeStr = ''
        let size = {}
        switch (item.name) {
          case '滚动banner':
            sizeStr = '843*354'
            size = { width: 843 / 2, height: 354 / 2 }
            break
          case '强推banner':
            sizeStr = '554*360'
            size = { width: 554 / 2, height: 360 / 2 }
            break
          case '视频推荐':
            sizeStr = '660*280'
            size = { width: 660 / 2, height: 280 / 2 }
            this.movieTag = item.id
            break
          case '本周推荐':
            sizeStr = '644*412'
            size = { width: 644 / 2, height: 412 / 2 }
            break
          case '更多精彩推荐':
            sizeStr = '554*360'
            size = { width: 554 / 2, height: 360 / 2 }
            this.relatedTag = item.id
            break
          case '关键词位':
            this.keywordTag = item.id
            break
          default:
            break
        }
        newList.push({
          ...item,
          sizeStr: sizeStr,
          size: size,
          imageUrl: this.imgUrls ? this.imgUrls[item.id] : ''
        })
      })
      this.typeList = newList
    },
    setTypeListImgUrl(typeId, urlStr) {
      this.typeList.forEach((item) => {
        if (typeId == item.id) {
          item.imageUrl = urlStr
        }
      })
      if (this.imgUrls) {
        this.imgUrls[typeId] = urlStr
      }
    },
    getTypeListImgUrl(typeId) {
      this.typeList.forEach((item) => {
        if (typeId == item.id) {
          return item.imageUrl
        }
      })
    },
    isLoadImg(imgDic, selectTypes) {
      let isSave = true
      selectTypes.forEach((item) => {
        if (!imgDic[item] && item !== this.keywordTag) isSave = false
      })
      return isSave
    },
    setEditItem(row) {
      try {
        let idTypeArray = []
        let idRelatedArray = []
        if (row.type.length > 0) idTypeArray = row.type.toString().split(',')
        if (row.related.length > 0) idRelatedArray = row.related.toString().split(',')
        let idCategory = row.category.toString().split(',')[0] // 之前可能存在多个分类的数据
        let typeArray = []
        let relatedList = []
        idTypeArray.forEach((item) => {
          typeArray.push(Number(item))
        })
        idRelatedArray.forEach((item) => {
          relatedList.push(Number(item))
        })
        return {
          ...row,
          type: typeArray,
          related: relatedList,
          category: Number(idCategory),
          attachments: row.attachments ? JSON.parse(row.attachments) : { videoUrl: '' }
        }
      } catch (e) {
        return {
          ...row
        }
      }
    },

    formatTime(time) {
      return moment(time).format('YYYY.MM.DD')
    }
  }
}
