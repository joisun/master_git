import * as Cookies from '@/global/function/cookie-tool'
import apis from '@/api/ajax'
import isMobile from '@/global/function/is-mobile'

const cpeUserLogin = async (item, { system = {}, netboxPath = '' }) => {
  try {
    const { data } = await apis.common.getManageInfo({})
    Cookies.setItem('netbox-userAccount', item.orgName, { domain: '.simboss.com', expires: 1 })
    const match = window.location.host.match(
      /simboss-whitehouse-([a-zA-Z0-9\-]+)\.test-ack\.simboss\.com/
    )
    let url = ''
    if (match && match[1]) {
      url = `https://simboss-banner-${match[1]}.test-ack.simboss.com/api/superLogin?orgId=${item.orgId}&superToken=${system.token}&key=${data}&netboxUrl=simboss-banner-${match[1]}.test-ack.simboss.com`
    } else {
      const netboxHost =
        window.location.host.indexOf('prepare') > -1
          ? 'simboss-banner.prepare.simboss.com'
          : 'netbox.simboss.com'
      url = `${system.url}/api/superLogin?orgId=${item.orgId}&superToken=${system.token}&key=${data}&netboxUrl=${netboxHost}${netboxPath}`
    }
    if (isMobile()) {
      window.location.href = url
    } else {
      window.open(url)
    }
  } catch (e) {
    console.log('CPE superLogin', e)
  }
}

export default cpeUserLogin
