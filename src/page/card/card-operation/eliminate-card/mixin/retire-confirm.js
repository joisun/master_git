export default {
  methods: {
    async retireConfirm(data) {
      if (data === 'NOT_EXIST') return true
      const customStrArray = data.map((d) => `${d.orgName}(${d.id})`)
      const h = this.$createElement
      try {
        return (
          (await this.$confirm(
            h('p', null, [
              h('p', null, `您销卡的卡号中存在不需要销卡的卡，不需要销卡的客户为`),
              h(
                'p',
                {
                  style: 'word-break: break-all;overflow-y: auto;max-height: 50vh;font-weight: bold'
                },
                `${customStrArray.join()}`
              ),
              h('p', null, `确认则全部销卡，取消则不销卡，不销卡的卡需要手工进行驳回。`)
            ]),
            // `您销卡的卡号中存在不需要销卡的卡，不需要销卡的客户为${customStrArray.join()}确认则全部销卡，取消则不销卡，不销卡的卡需要手工进行驳回。`,
            '提示'
          )) === 'confirm'
        )
      } catch (e) {
        return false
      }
    }
  }
}
