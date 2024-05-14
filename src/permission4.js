import {router} from './router'
import commonApis from "@/api/common-api/common";


const whiteList = ['/login'] // no redirect whitelist
console.log('🎸 DEBUG_6 permission.js 👉', router)
router.beforeEach(async(to, from, next) => {
  const currentURL = new URL(window.location.href);
  const searchParams = currentURL.searchParams;
  const code = searchParams.get('code')
  if (code) {
    const res = await commonApis.auth.getToken({ code });
    if (!res.success) {
      window.location.replace("./login");
    } else {
      window.location.reload()
    }
  }
  // determine whether the user has logged in
  const hasToken = localStorage.getItem('ak')

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const res = await commonApis.auth.getAuth({})
      const hasUser = store.state.overall.user
      if (hasUser) {
        next()
      } else {
        try {
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // get user info
          await store.dispatch('loadUser')

          const accessRoutes = await commonApis.auth.getAuth({})

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          // await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
})
