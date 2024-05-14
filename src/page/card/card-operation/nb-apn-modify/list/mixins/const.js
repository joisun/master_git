import dateFormat from '@/global/filters/date-format'

function displayIccids(iccids, count) {
  if (!count) {
    return '-'
  }
  if (count === 1) {
    return iccids
  } else {
    const arr = iccids.split(',')
    return `${arr[0]}等共${count}张`
  }
}

const columns = [
  { key: 'id', name: 'ID', width: '80' },
  {
    name: 'iccid',
    width: '150',
    formatter: (row) => displayIccids(row.iccids, row['iccidCount']),
  },
  { name: '修改后APN', width: '89', formatter: (row) => {
    const target = row.targets
    try {
      const result = JSON.parse(target)
      return result.newApnName || ''
    } catch {
      return ''
    }
  } },
  { key: 'successCount', name: '成功卡数', width: '49' },
  { key: 'failCount', name: '失败卡数', width: '49' },
  {
    name: '失败卡号',
    width: '150',
    formatter: (row) => displayIccids(row['failIccids'], row['failCount']),
  },
  { key: 'operator', name: '操作人', width: '80' },
  {
    name: '操作时间',
    width: '150',
    formatter: (row, { property }) => dateFormat(row.operationTime),
  },
]

export { columns }
