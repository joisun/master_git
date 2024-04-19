/**
 * Created by gzj on 17/2/13.
 */

import Vue from 'vue'
import Vuex from 'vuex'

// 模块
import overall from './modules/overall'
import show from './modules/show'
import priceOfferCategory from './modules/price-offer-category'
import carrierAccount from './modules/carrier-account'
import salesPerson from './modules/sales-person'
import ratePlan from './modules/rate-plan'
import planClassification from './modules/plan-classification'
import planRenew from './modules/plan-renew'

import salesman from './modules/salesman'
import inputTag from './modules/input-tag'
import inputMark from './modules/input-mark'
import potentialCustomers from './modules/potential-customers'
import industry from './modules/industry'
import duplicateCheck from './modules/duplicate-check'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    overall,
    show,
    priceOfferCategory,
    carrierAccount,
    salesPerson,
    ratePlan,
    planClassification,
    planRenew,

    salesman,
    inputTag,
    inputMark,
    customer: potentialCustomers,
    industry,
    duplicateCheck
  }
})
export default store
