/**
 * Created by gzj on 17/2/13.
 */

import { buildPathORM } from '@/global/function/misc'

const mutations = buildPathORM([
], { prefix: '/mutation', case: 'upper' })

export default mutations
