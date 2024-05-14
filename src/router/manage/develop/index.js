import develop from '@/page/manage/children/develop/develop.vue'
import developTool from '@/page/manage/children/develop/children/develop-tool/develop-tool.vue'

export default {
  path: 'develop',
  name: 'develop',
  component: develop,
  children: [
    {
      path: 'develop-tool',
      name: 'develop-tool',
      component: developTool
    }
  ]
}
