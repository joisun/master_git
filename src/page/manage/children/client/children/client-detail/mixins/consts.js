import dateFormat from '@/global/filters/date-format'
import numberFilter from '@/global/filters/number-fixed'

export const userInfoColumns = [
  { name: '客户名称', key: 'orgName' },
  {
    name: '账号',
    key: 'userAccount',
    desensitization: (row) => {
      return {
        id: row.id,
        showField: 'userAccount',
        idType: 'userId'
      }
    }
  },
  { name: '公司名称', key: 'fullname' },
  {
    name: '联系电话',
    key: 'phone',
    desensitization: (row) => {
      return {
        id: row.id,
        showField: 'phone',
        idType: 'userId'
      }
    }
  },
  { name: '联系邮箱', key: 'email' },
  { name: '地址', key: 'address' },
  { name: '用户姓名', key: 'name' },
  {
    name: '行业',
    key: 'industry',
    formatter: (e, data) => `${data.industry} - ${data.industryScope}`
  },
  { name: '', key: '' },
  { name: '组织ID', key: 'orgId' },
  { name: '销售归属', key: 'saleName' },
  {
    name: '账户余额',
    key: 'balance',
    formatter: (e, data) => (data[e] ? numberFilter(data[e]) : 0)
  },
  { name: '注册时间', key: 'registerTime', formatter: (e, data) => dateFormat(data[e]) },
  { name: '最后登录时间', key: 'lastLoginTime', formatter: (e, data) => dateFormat(data[e]) },
  { name: '执照注册号', key: 'licence' },
  { name: '法人身份证号', key: 'idCardNum' },
  { name: '', key: '' },
  { name: '', key: '' }
]
