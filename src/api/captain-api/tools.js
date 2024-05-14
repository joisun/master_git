import { ajax } from '@/api/api-tool'
export default {
  async runQualRev(data) {
    const url = '/ajax/enterpriseQualification/runQualRev'
    return ajax(url, { ...data })
  }
}
