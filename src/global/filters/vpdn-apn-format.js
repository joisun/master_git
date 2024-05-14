const vpdnApnFormat = function (val) {
  const map = {
    'apn-firewall': 'APN1',
    'apn-router-lagecy': 'APN1',
    'apn-router-reborn': 'APN2'
  }
  return map[val]
}

export default vpdnApnFormat
