import store from '@/store/'

const statusMap = {
  ACTIVE: '启用',
  DEACTIVE: '弃用'
}
export const columns = [
  { key: 'username', label: '用户名', width: '100' },
  { key: 'status', label: '状态', width: '76', formatter: (row, { property }) => statusMap[row[property]] },
  { key: 'description', label: '描述', width: '120' },
  { key: 'batchPrefix', label: '批次前缀', width: '120' },
  { key: 'vpdnAccount', label: 'VPDN账号', width: '76', formatter: (row, { property }) => (row[property] ? '是' : '否') },
  { key: 'apiUrl', label: 'apiUrl', width: '160' },
  { key: 'type',
    label: '类型',
    formatter: (row, { property }) => {
      let objectKeys = store.state.overall.enum[`${row.carrier}APIType`]
      return objectKeys[row[property]] || ''
    }
  }
]
