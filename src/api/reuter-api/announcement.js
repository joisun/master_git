/**
 * Created by zeter on 2017/4/13.
 */

import {ajax} from '../api-tool'

export default {
  query:(data) => ajax('/ajax/announcement/list', data, {system: 'reuters'}),
  save: (data) =>  ajax('/ajax/announcement/saveAndUpdate', data, {system: 'reuters'}),
  delete: (id) => ajax('/ajax/announcement/delete', { id }, {system: 'reuters'}),
}
