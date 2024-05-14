/**
 * Created by zeter on 2017/4/13.
 */

import {ajax} from '../api-tool'

export default {
  listGet: (data) => ajax('/ajax/announcement/crm/list', data, {system: 'reuters'}),
  popGte: (data) =>  ajax('/ajax/announcement/crm/getPop', data, {system: 'reuters'})
}
