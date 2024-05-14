<script>
  import Enumerator from '@/constant/enums/crm-enum'

  export default {
    props: ['stage', 'beforeFailStage'],
    data () {
      return {
        isSpecialFocus: false,
        stageList: [],
        stageState: []
      }
    },

    created () {
      this.stageChange()
    },

    watch: {
      'stage': function () {
        this.stageChange()
      }
    },

    methods: {
      stageChange () {
        this.stageState = []
        let allStage = { ...Enumerator.get('stage') }

        switch (this.stage) {
          // '3': 报备冲突
          case '3':
            delete allStage['4']
            delete allStage['11']
            break
          // '3': 输单
          case '11':
            delete allStage['3']
            delete allStage['12']
            break
          default:
            delete allStage['3']
            delete allStage['11']
        }

        for (let key in allStage) {
          this.stageState.push({
            name: allStage[key],
            key: key
          })
        }
      },

      isActive (key) {
        // if (key === '9' || key === '10') {
        //   return +key <= +this.stage && this.stage !== '11'
        // } else {
        //   return +key <= +this.stage || (key === '13' && this.stage === '12')
        // }
        if (this.stage === '11' && this.beforeFailStage.length) {
          return +key <= +this.beforeFailStage
        } else {
          return +key <= +this.stage || (key === '13' && this.stage === '12')
        }
      },

      isConflict (key) {
        return key === '3' && this.stage === '3'
      },

      isFailure (key) {
        return (key === '11' && this.stage === '11') || (key === '15' && this.stage === '15')
      }
    }
  }
</script>
<template>
  <div class="detail-stage-flow">
    <div class="stage-flow-box">
      <div class="stage-flow-item" v-for="(state, index) in stageState" :key="index"
           :class="{'stage-flow-item': true, 'active': isActive(state.key), 'conflict': isConflict(state.key), 'failure': isFailure(state.key)}">
        <p class="stage-text">{{state.name}}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .detail-stage-flow {
    .stage-flow-box {
      display: flex;

      .stage-flow-item {
        line-height: 28px;
        height: 28px;
        background: #BFBFBF;
        box-sizing: border-box;
        position: relative;
        width: 103px;
        padding-left: 20px;

        &:first-child {
          padding-left: 0px;
        }

        .stage-text {
          color: #fff;
          text-align: center;
        }

        &:after {
          content: "";
          border: 1px solid #fff;
          border-bottom: none;
          border-left: none;
          background-color: #BEBEBE;
          height: 19px;
          width: 19px;
          position: absolute;
          display: block;
          top: 4px;
          right: -10px;
          z-index: 10;
          transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
        }

        &.active {
          background-color: #1890FF;

          &:after {
            background-color: #1890FF;
          }
        }

        &.conflict {
          background-color: #F5A623;

          &:after {
            background-color: #F5A623;
          }
        }

        &.failure {
          background-color: #FF0000;

          &:after {
            background-color: #FF0000;
          }
        }
      }
    }
  }

</style>
