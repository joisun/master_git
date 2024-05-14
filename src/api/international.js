import { ajax } from './api-tool'
const balanceAllocation = (data) => ajax('/ajax/balance/allocation', data, { system: 'superman' })
const balanceRefund = (data) => ajax('/ajax/balance/refund', data, { system: 'superman' })

export default {
  balanceAllocation,
  balanceRefund
}
