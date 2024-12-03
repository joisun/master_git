import { ajax } from './api-tool'
const balanceAllocation = (data) => ajax('/ajax/balance/allocation', data, { system: 'superman' })
const balanceRefund = (data) => ajax('/ajax/balance/refund', data, { system: 'superman' })
const distributionConfigQuery = (data) => ajax('/ajax/distributionConfig/query', data, { system: 'superman' })
const distributionConfigAdd = (data) => ajax('/ajax/distributionConfig/add', data, { system: 'superman' })

export default {
  balanceAllocation,
  balanceRefund,
  distributionConfigQuery,
  distributionConfigAdd
}
