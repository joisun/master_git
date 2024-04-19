export const IPListColumns = [
  { key: 'carrierAccountName', name: '运营商账号', width: '130' },
  { key: 'apn', name: 'APN' },
  { key: 'startIp', name: '起始IP' },
  { key: 'endIp', name: '结束IP' },
  { key: 'lastIp', name: '最后提卡IP' },
  { key: 'routerIp', name: '路由器IP' },
  { key: 'mappingCount', name: '映射中个数', width: '70' },
  { key: 'okCount', name: '成功个数', width: '60', downloadRenderKey: 'okCount' },
  { key: 'failCount', name: '失败个数', width: '60', downloadRenderKey: 'failCount' },
  {
    key: 'restIps',
    name: '剩余个数',
    width: '60'
    // formatter: (row) => {
    //   let toIp = row.endIp;
    //   let fromIp;
    //   if (!row.lastIp) {
    //     fromIp = row.startIp;
    //   } else {
    //     fromIp = row.lastIp;
    //   }
    //   let count = toDecimal(convertLastNetworkSegment(toIp)) - toDecimal(fromIp);
    //   if (count < 0) {
    //     return 0;
    //   }
    //   if (!row.lastIp) {
    //     return count + 1;
    //   }
    //   return count;
    // },
  }
  // {key: 'exhaust', name: '是否用完', width: '120',formatter: (row, {property}) => {}},
]

export const IPMapping = [
  { key: 'iccid', name: 'ICCID', width: '130' },
  { key: 'apn', name: 'APN' },
  { key: 'ip', name: 'IP' },
  { key: 'routerIp', name: '路由器IP' },
  {
    key: 'status',
    name: '映射状态',
    width: '80',
    formatter: (row) => ({ OK: '成功', FAIL: '失败', MAPPING: '进行中' }[row.status])
  }
]
