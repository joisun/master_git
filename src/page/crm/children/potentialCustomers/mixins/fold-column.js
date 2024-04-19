import Enumerator from '@/constant/enums/crm-enum'
import Industry from '@/constant/enums/industry-enum'
import DateTimeFormat from '@/global/filters/date-format'
import { resolveShowConfigPath } from '@babel/core/lib/config/files'

const columns = [
  { name: '企业名称', key: 'company', minWidth: 140 },
  {
    name: '注册账号',
    key: 'registerAccount',
    idType: 'orgId',
    desensitization: (row) => {
      return {
        id: row.orgId,
        showField: 'userAccount',
        idType: 'orgId',
        system: 'crm'
      }
    }
  },
  { name: 'orgId', key: 'orgId', minWidth: 120 },
  {
    name: '联系人',
    key: 'contact.name',
    formatter: (row) => {
      return row['contact'] && row['contact'][0] && row['contact'][0]['name']
    }
  },
  {
    name: '手机号',
    key: 'contact.mobile',
    desensitization: (row) => {
      return {
        id: row['contact'] && row['contact'][0] && row['contact'][0]['id'],
        showField: 'phone',
        idType: 'contactId',
        system: 'crm'
      }
    },
    minWidth: 95,
    idType: 'contactId',
    formatter: (row) => row['contact'] && row['contact'][0] && row['contact'][0]['mobile']
  },
  {
    name: '邮箱',
    key: 'contact.email',
    minWidth: 100,
    formatter: (row) => row['contact'] && row['contact'][0] && row['contact'][0]['email']
  },
  {
    name: '来源',
    key: 'source',
    formatter: (row) => Enumerator.convert('source', row['source'])
  },
  { name: '负责人', key: 'salesman', width: 80 },
  {
    name: '阶段',
    key: 'stage',
    minWidth: 100,
    formatter: (row) => Enumerator.convert('stage', row['stage'])
  },
  { name: '客户等级', key: 'rank' },
  {
    name: '跟进信息',
    key: 'lastestFollow',
    minWidth: 100,
    sortable: 'custom',
    formatter: (row) => row['lastestFollow'] && row['lastestFollow']['followPeople']
  },
  {
    name: '下次跟进时间',
    key: 'nextTime',
    minWidth: 110,
    sortable: 'custom',
    formatter: (row) =>
      row['lastestFollow'] ? DateTimeFormat(row['lastestFollow']['nextTime'], 'YYYY-MM-DD') : ''
  },
  {
    name: '地区',
    key: 'areaId',
    minWidth: 100,
    formatter: (row) => Enumerator.convert('smallRegion', row['areaId'])
  },
  {
    name: '行业',
    key: 'industry',
    formatter: (row) => {
      let [i1, i2] = (row['industry'] ? row['industry'] + '' : '').split(',')
      i1 = i1 ? Industry.convert(i1) : ''
      i2 = i2 ? Industry.convert(i2) : ''
      return `${i1}\\${i2}`
    }
  },
  { name: '跟踪标签', key: 'inputTag' },
  { name: '应用场景', key: 'useFor' },
  {
    name: '创建时间',
    key: 'createTime',
    minWidth: 120,
    sortable: 'custom',
    formatter: (row) => DateTimeFormat(row['createTime'], 'YYYY-MM-DD HH:mm')
  },
  {
    name: '创建人',
    key: 'createdPerson',
    width: 80,
    formatter: (row) => row['createdPerson'] && row['createdPerson']['realName']
  }
]
columns.precast = ['company', 'registerAccount', 'orgId']
// 默认选中的
columns.def = [
  'company',
  'contact.name',
  'registerAccount',
  'contact.mobile',
  'source',
  'orgId',
  'stage',
  'createTime',
  'nextTime'
]
columns.prefix = `QP_CRM_CUSTOMER_FILTERS`

// 线索审查
const customerCluesColumns = [
  { name: '企业名称', key: 'company', minWidth: 140 },
  {
    name: '注册账号',
    key: 'registerAccount',
    desensitization: (row) => {
      return {
        id: row.id,
        showField: 'userAccount',
        idType: 'customerId',
        system: 'crm'
      }
    }
  },
  { name: 'orgId', key: 'orgId' },
  {
    name: '联系人',
    key: 'contact.name',

    formatter: (row) => row['contact'] && row['contact'][0] && row['contact'][0]['name']
  },
  {
    name: '手机号',
    key: 'contact.mobile',
    desensitization: (row) => {
      return {
        id: row['contact'] && row['contact'][0] && row['contact'][0]['id'],
        showField: 'phone',
        idType: 'contactId',
        system: 'crm'
      }
    },
    minWidth: 95,
    formatter: (row) => row['contact'] && row['contact'][0] && row['contact'][0]['mobile']
  },
  {
    name: '邮箱',
    key: 'contact.email',
    minWidth: 100,
    formatter: (row) => row['contact'] && row['contact'][0] && row['contact'][0]['email']
  },
  {
    name: '来源',
    key: 'source',
    formatter: (row) => Enumerator.convert('source', row['source'])
  },
  { name: '邀请人', key: 'invitationCode' },
  {
    name: '阶段',
    key: 'stage',
    minWidth: 100,
    formatter: (row) => Enumerator.convert('stage', row['stage'])
  },
  { name: '客户等级', key: 'rank' },
  {
    name: '地区',
    key: 'area',
    minWidth: 100,
    formatter: (row) => Enumerator.convert('smallRegion', row['area'])
  },
  {
    name: '行业',
    key: 'industry',
    formatter: (row) => {
      let [i1, i2] = (row['industry'] ? row['industry'] + '' : '').split(',')
      i1 = i1 ? Industry.convert(i1) : ''
      i2 = i2 ? Industry.convert(i2) : ''
      return `${i1}\\${i2}`
    }
  },
  { name: '跟踪标签', key: 'inputTag' },
  {
    name: '创建时间',
    key: 'createTime',
    minWidth: 120,
    sortable: 'custom',
    formatter: (row) => DateTimeFormat(row['createTime'], 'YYYY-MM-DD HH:mm')
  },
  {
    name: '创建人',
    key: 'createdPerson',
    width: 80,
    formatter: (row) => row['createdPerson'] && row['createdPerson']['realName']
  }
]
customerCluesColumns.precast = ['company', 'orgId', 'registerAccount']
customerCluesColumns.def = [
  'company',
  'contact.name',
  'registerAccount',
  'contact.mobile',
  'source',
  'orgId',
  'stage',
  'createTime'
]
customerCluesColumns.prefix = `QP_CRM_CUSTOMER_CLUES_FILTERS`

const salesmanChangelogColumns = [
  {
    name: '修改时间',
    key: 'modifyTime',
    minWidth: 100,
    formatter: (row, { property }) => DateTimeFormat(row[property], 'YYYY-MM-DD')
  },
  {
    name: '修改人',
    key: 'modifier',
    formatter: (row, { property }) => row[property] && row[property]['realName']
  },
  {
    name: '原属销售',
    key: 'origin',
    formatter: (row, { property }) => row[property] && row[property]['realName']
  },
  {
    name: '修改后',
    key: 'target',
    formatter: (row, { property }) => row[property] && row[property]['realName']
  }
]

export { columns, customerCluesColumns, salesmanChangelogColumns }
