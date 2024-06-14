import {ajax} from "@/api/api-tool";

export default {
  getApiServer: (data) => ajax('/ajax/wh-dev/getApiServer', data, {system: 'whitehouse'}),
}
