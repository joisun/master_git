import routes, {router} from '@/router'
import commonApis from '@/api/common-api/common'
import appFrame from '@/page/app.vue'
import Router from 'vue-router'
import { STORE_KEY } from '@/page/components/wh-global-search/wh-global-search.vue'
import { Message } from 'element-ui'
import { safeParse } from '@/global/function/safe-operations'
import Login from "@/page/login.vue";
const whiteList = ['/login', '/auth-redirect']
// const initRouter = () => {
//   return new Router({
//     routes: [
//       {
//         path: '/login',
//         name: 'login',
//         component: Login
//       },
//    ],
//     mode: 'hash'
//   })
// }

const isTestOrDev =
  window.location.href.indexOf('8090') !== -1 || window.location.href.indexOf('test') !== -1


router.beforeEach(async(to, from, next) => {
  // determine whether the user has logged in
  if (to.query.code) {
    const res = await commonApis.getToken({ code: to.query.code });
    if (res.success) {
      next()
    } else {
      window.location.replace("./login");
    }
    await getAuthAndAddRoutes()
  }
})


export async function getAuthAndAddRoutes() {
  const res = await commonApis.auth.getAuth({})
  const map = getRouterCodeMap(res.data)
  const r = isTestOrDev ? routes : genAuthRoutes(routes, map)
  console.log('🎸 DEBUG_30 permission.js 👉', r)
  const router = initRouter()
  router.addRoute({
    path: '/',
    name: 'frame',
    redirect: {
      name: 'client-list',
      query: {
        enter: true
      }
    },
    component: appFrame,
    children: [
      ...r,
      {
        path: '*',
        redirect: {
          name: 'client-list',
          query: {
            enter: true
          }
        }
      }
    ]
  })
  router.beforeEach(async (to, from, next) => {
    if (to.query.code) {
      const res = await commonApis.getToken({ code: to.query.code });
      if (res.success) {
        window.location.replace("./consumer");
      } else {
        window.location.replace("./login");
      }
    }
    try {
      const { name } = from
      if (name) {
        const { commonAccess } = safeParse(localStorage.getItem(STORE_KEY))
        if (commonAccess[name]) {
          commonAccess[name]++
        } else {
          commonAccess[name] = 1
        }
        localStorage.setItem(
          STORE_KEY,
          JSON.stringify({
            ...JSON.parse(localStorage.getItem(STORE_KEY)),
            commonAccess
          })
        )
      }
    } catch (e) {
      console.log('🎸 DEBUG_64 permission.js 👉', e)
    }
    if (!map[to.name] && !isTestOrDev) {
      Message.error('无权限访问此页面，请联系管理员')
      return false
    }
    next()
  })
  return router
}

function getRouterCodeMap(lists) {
  const map = {}
  let list = []
  lists.forEach((item) => {
    list = [...list, ...item]
  })
  list.forEach((item) => {
    const parts = item.nodePath.split('/')
    const code = parts[parts.length - 1]
    map[code] = 1
  })
  return map
}

function genAuthRoutes(list, authCodeMap) {
  return list.filter((item) => {
    if (item.children && item.children.length) {
      item.children = genAuthRoutes(item.children, authCodeMap)
    }
    return (item.children && item.children.length) || !!authCodeMap[item.name]
  })
}
