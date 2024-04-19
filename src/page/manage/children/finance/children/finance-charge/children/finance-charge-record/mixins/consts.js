import enums from '@/constant/enums'

export const columns = [
  {
    key: 'id',
    name: 'ID',
    width: '60'
  }, {
    key: 'orgId',
    name: '组织ID',
    width: '76',
  }, {
    key: 'orgName',
    name: '组织名称',
    width: '100'
  }, {
    key: 'money',
    name: '变更金额',
    sort: 'custom',
    width: '110'
  }, {
    key: 'type',
    name: '变更类型',
    width: '100',
    formatter: (row, { property }) => enums.tradeType.get(row[property]),
  }, {
    key: 'cause',
    name: '变更原因',
    width: '190'
  }, {
    key: 'balance',
    name: '账户余额',
    width: '80'
  }, {
    key: 'gmtCreated',
    name: '变更时间',
    width: '100',
    sort: 'custom'
  }, {
    key: 'description',
    name: '备注',
    width: '100'
  }
]
