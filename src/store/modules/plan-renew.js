import ajax from "@/api/ajax";
import cachify from "../cachify";
import { Message } from 'element-ui';

export default {
  state: {
    planRenewClassificationList: [],
  },
  mutations: {
    setPlanRenewClassificationList(state, data) {
      state.planRenewClassificationList = data;
    },
  },
  getters: {
    getAvalableRenewList (state) {
      return state.planRenewClassificationList.filter(e => !e.disabled)
    }
  },
  actions: {
    async getPlanRenewClassificationList({ commit, state }, params = {}) {
      const rst = await cachify(ajax.financial.plan.getClassifications, {
        force: true,
        data: state.planRenewClassificationList,
      })(params);
      if (!rst.success) {
        Message.error('获取续费分类列表失败')
        return false
      }
      const map = [
        {
          from: "allowExtendPeriod",
          to: "ALLOW_EXTEND_PERIOD",
        },
        {
          from: "allowAppendPackage",
          to: "ALLOW_APPEND_PACKAGE",
        },
        {
          from: "allowAppendPoolPackage",
          to: "ALLOW_APPEND_POOL_PACKAGE",
        },
        {
          from: "allowAutoRecharge",
          to: "ALLOW_AUTO_RECHARGE",
        },
        {
          from: "allowChangeRatePlan",
          to: "ALLOW_CHANGE_RATE_PLAN",
        },
        {
          from: "rechargeTimeLimit",
          to: "RECHARGE_TIME_LIMIT",
        },
      ];
      const tableData = rst.data.map((item) => {
        const renewRestriction = [];
        map.forEach(mapItem => {
          if (item[mapItem.from]) {
            renewRestriction.push(mapItem.to)
          }
        })
        const tagsMap = item.tagList.map(e => e.name)
        return {
          id: item.id,
          name: item.name,
          displayName: item.displayName,
          carrier: item.carrier,
          platform: item.platform,
          disabled: item.disabled,
          hide: item.hide,
          renewRestriction,
          type: item.type,
          vpdnOnly: item.vpdnOnly,
          LOCATION_SERVICE: tagsMap.includes('LOCATION_SERVICE'),
          NB_IOT: tagsMap.includes('NB_IOT'),
          rechargeTimeRange: item.rechargeTimeRange
        };
      });
      commit("setPlanRenewClassificationList", tableData);
    },
    deleteRenew({ commit, state }, params) {
      return ajax.financial.plan.deleteRenew(params)
    }
  },
};
