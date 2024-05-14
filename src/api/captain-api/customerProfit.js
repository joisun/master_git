import { ajax } from "../api-tool";

export default {
  query: (data) => ajax("/ajax/customer/profit/list", data),
  export: (data) => ajax("/ajax/customer/profit/export", data),
  detailQuery: (data) => ajax("/ajax/customer/profit/detail/list", data),
  detailExport: (data) => ajax("/ajax/customer/profit/detail/export", data),
};
