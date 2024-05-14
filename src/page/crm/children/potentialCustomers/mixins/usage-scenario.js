import apis from '@/api/ajax'

export default {
  data() {
    return {
      flatUsageScenarioList: {},
      usageScenarioList: []
    }
  },
  created() {
    this.getUsageScenarioList()
  },
  methods: {
    async getUsageScenarioList() {
      const { success, data } = await apis.crm.usageScenarioListGet()
      if (!success) {
        return false
      }
      const relation = {}
      data.forEach(item => {
        this.flatUsageScenarioList[item.id] = item.scenario
        if (item.parentId === -1) {
          if (relation[item.id]) {
            relation[item.id] = { ...relation[item.id], value: item.id, label: item.scenario }
          } else {
            relation[item.id] = { value: item.id, label: item.scenario, children: [] }
          }
        } else {
          if (relation[item.parentId]) {
            relation[item.parentId].children.push({ value: item.id, label: item.scenario })
          } else {
            relation[item.parentId] = { children: [{ value: item.id, label: item.scenario }] }
          }
        }
      })
      const usageScenarioList = []
      // eslint-disable-next-line no-unused-vars
      for (const key in relation) {
        usageScenarioList.push(relation[key])
      }
      this.usageScenarioList = usageScenarioList
    }
  }
}
