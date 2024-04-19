/**
 * Created by gzj on 17/2/6.
 */

import cardOwnershipQuery from '@/api/captain-api/card-ownership-query'
import bill from './captain-api/biilajax'
import card from './captain-api/cardajax'
import customer from './captain-api/customerajax'
import single from './captain-api/singleajax'
import financial from './captain-api/financialajax'
import pool from './captain-api/poolajax'
import sale from './captain-api/sale'
import advertisement from './captain-api/advertisement'
import store from './captain-api/store'
import cost from './captain-api/cost'
import vpdn from './captain-api/vpdn'
import report from './captain-api/report'
import testCard from './captain-api/testCardajax'
import blog from './captain-api/blog'
import whitelist from './captain-api/whitelist'
import operationLog from './captain-api/operationLog'
import customerProfit from './captain-api/customerProfit'
import salesComission from './captain-api/salesComission'
import stopCardFuse from './captain-api/stopCardFuse'
import customerServices from '@/api/captain-api/customer-services'
import tools from '@/api/captain-api/tools'

import announcement from './reuter-api/announcement'
import notice from './reuter-api/notice'

import common from './common-api/common'

import crm from './crm-api'

import cpe from './ironman-api'
import flowWarning from '@/api/captain-api/flow-warning'
const ajaxHelpers = {
  bill,
  card,
  store,
  customer,
  financial,
  pool,
  announcement,
  salesComission,
  customerProfit,
  sale,
  report,
  advertisement,
  cost,
  vpdn,
  common,
  single,
  testCard,
  blog,
  crm,
  cpe,
  notice,
  whitelist,
  operationLog,
  stopCardFuse,
  cardOwnershipQuery,
  customerServices,
  flowWarning,
  tools
}

export default ajaxHelpers
