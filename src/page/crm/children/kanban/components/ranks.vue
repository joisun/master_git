<template>
  <div v-loading="loading">
    <el-date-picker
      v-model="month"
      format="yyyy-MM"
      type="month"
      :picker-options="pickerOptions"
      placeholder="选择月份"
      value-format="yyyy-MM-dd"
      :clearable="false"
      @change="monthChange"
    />
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="业绩排行" name="PERFORMANCE_RANK"></el-tab-pane>
      <el-tab-pane label="新购排行" name="NEW_PURCHASE_RANK"></el-tab-pane>
      <el-tab-pane label="增长排行" name="GROWTH_RANK"></el-tab-pane>
      <el-tab-pane label="完成率排行" name="COMPLETION_RANK"></el-tab-pane>
    </el-tabs>
    <div class="rank-list">
      <div class="rank-list-title rank-col-wrap">
        <div class="flex-1">{{currentSchema.title1}}</div>
        <div class="flex-2">{{currentSchema.title2}}</div>
        <div v-if="currentSchema.title3" class="flex-3">{{currentSchema.title3}}</div>
      </div>
      <div
        v-for="(item, index) in listData"
        :key="item.saleName"
        :class="`rank-list-value rank-col-wrap ranking-${index + 1}`"
      >
        <div class="flex-1">
          <svg v-if="index ===0" t="1697439229099" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4879" width="20" height="20"><path d="M816.49 909H211.21c-1.1 0-2-0.9-2-2v-68.18c0-1.1 0.9-2 2-2h605.28c1.1 0 2 0.9 2 2V907c0 1.1-0.9 2-2 2z" fill="#FFAA22" p-id="4880">
          </path><path d="M910.24 316.23c-27.11 0-49.1 22.52-49.1 50.31 0 7.28 1.58 14.16 4.3 20.4l-176.13 80.21-147.2-258.57c14.56-8.73 24.46-24.74 24.46-43.28 0-27.79-21.98-50.31-49.1-50.31s-49.1 22.52-49.1 50.31c0 17.99 9.29 33.66 23.15 42.55l-158.16 259.3-176.13-80.21c2.71-6.25 4.3-13.12 4.3-20.4 0-27.78-21.98-50.31-49.1-50.31s-49.1 22.52-49.1 50.31c0 27.78 21.98 50.31 49.1 50.31 3.99 0 7.82-0.62 11.53-1.54l86.65 366.28h601.43l86.65-366.28c3.71 0.92 7.54 1.54 11.53 1.54 27.12 0 49.1-22.52 49.1-50.31 0.01-27.78-21.97-50.31-49.08-50.31z" fill="#FFD68D" p-id="4881"></path></svg>
          </svg>
          <svg  v-else-if="index ===1" t="1697439568990" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1542" width="20" height="20"><path d="M287.762 124.318v252.871c0 123.331 100.905 224.238 224.238 224.238 123.331 0 224.238-100.907 224.238-224.238V124.318H287.762z" fill="#82A0AF" p-id="1543"></path><path d="M379.487 124.318v149.434c0 72.882 59.63 132.513 132.513 132.513 72.882 0 132.513-59.631 132.513-132.513V124.318H379.487z" fill="#E0EAED" p-id="1544"></path><path d="M644.513 124.318v149.434c0 72.882-59.631 132.514-132.513 132.514-72.884 0-132.514-59.631-132.514-132.514V124.318h265.027m19.201-19.201H360.285v168.635c0 83.656 68.059 151.714 151.715 151.714s151.714-68.059 151.714-151.714V105.117z" fill="#FFFFFF" p-id="1545"></path><path d="M512 622.736m-339.055 0a339.055 339.055 0 1 0 678.11 0 339.055 339.055 0 1 0-678.11 0Z" fill="#9EC2F7" p-id="1546"></path><path d="M512 622.736m-250.074 0a250.074 250.074 0 1 0 500.148 0 250.074 250.074 0 1 0-500.148 0Z" fill="#DDECF7" p-id="1547"></path><path d="M512 372.662c138.112 0 250.074 111.962 250.074 250.074S650.112 872.81 512 872.81c-138.113 0-250.074-111.962-250.074-250.074S373.888 372.662 512 372.662m0-24.001c-151.126 0-274.075 122.95-274.075 274.075S360.874 896.811 512 896.811s274.075-122.95 274.075-274.076S663.126 348.661 512 348.661z" fill="#FFFFFF" p-id="1548"></path><path d="M786.015 124.319h-548.03c-17.08 0-31.055-13.975-31.055-31.055s13.975-31.055 31.055-31.055h548.029c17.08 0 31.055 13.975 31.055 31.055 0.001 17.08-13.974 31.055-31.054 31.055z" fill="#231815" p-id="1549"></path><path d="M623.478 748.689v42.438h-218.7v-34.684l128.12-130.562c13.599-13.599 23.256-25.839 28.97-36.723 5.71-10.875 8.569-22.576 8.569-35.092 0-17.949-5.241-32.233-15.708-42.836-10.477-10.613-24.685-15.915-42.639-15.915-16.594 0-30.465 4.285-41.617 12.849-11.157 8.569-19.177 20.748-24.071 36.517l-37.947-22.435c7.346-22.576 19.993-39.785 37.947-51.616 17.949-11.832 40.394-17.752 67.32-17.752 20.945 0 39.644 4.285 56.102 12.854 16.454 8.569 29.237 20.542 38.355 35.908 9.108 15.371 13.669 32.711 13.669 52.024 0 18.498-4.631 35.43-13.876 50.796-9.249 15.371-24.343 33.803-45.288 55.287l-86.09 88.944h146.884z" p-id="1550"></path></svg>
          <svg  v-else-if="index=== 2" t="1697439525678" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1332" width="20" height="20"><path d="M287.762 124.318v252.871c0 123.331 100.905 224.238 224.238 224.238 123.331 0 224.238-100.907 224.238-224.238V124.318H287.762z" fill="#BF4C19" p-id="1333"></path><path d="M379.487 124.318v149.434c0 72.882 59.63 132.513 132.513 132.513 72.882 0 132.513-59.631 132.513-132.513V124.318H379.487z" fill="#DC8C57" p-id="1334"></path><path d="M644.513 124.318v149.434c0 72.882-59.631 132.514-132.513 132.514-72.884 0-132.514-59.631-132.514-132.514V124.318h265.027m19.201-19.201H360.285v168.635c0 83.656 68.059 151.714 151.715 151.714s151.714-68.059 151.714-151.714V105.117z" fill="#FFFFFF" p-id="1335"></path><path d="M512 622.736m-339.055 0a339.055 339.055 0 1 0 678.11 0 339.055 339.055 0 1 0-678.11 0Z" fill="#FCC181" p-id="1336"></path><path d="M512 622.736m-250.074 0a250.074 250.074 0 1 0 500.148 0 250.074 250.074 0 1 0-500.148 0Z" fill="#FFE6BF" p-id="1337"></path><path d="M512 372.662c138.112 0 250.074 111.962 250.074 250.074S650.112 872.81 512 872.81c-138.113 0-250.074-111.962-250.074-250.074S373.888 372.662 512 372.662m0-24.001c-151.126 0-274.075 122.95-274.075 274.075S360.874 896.811 512 896.811s274.075-122.95 274.075-274.076S663.126 348.661 512 348.661z" fill="#FFFFFF" p-id="1338"></path><path d="M786.015 124.319h-548.03c-17.08 0-31.055-13.975-31.055-31.055s13.975-31.055 31.055-31.055h548.029c17.08 0 31.055 13.975 31.055 31.055 0.001 17.08-13.974 31.055-31.054 31.055z" fill="#231815" p-id="1339"></path><path d="M627.439 699.539c0 20.677-4.692 39.105-14.077 55.287-9.385 16.187-22.51 28.764-39.372 37.741-16.871 8.977-36.18 13.468-57.94 13.468-25.843 0-48.082-5.916-66.711-17.752-18.634-11.832-31.351-28.079-38.148-48.757l37.947-22.44c5.161 14.687 13.463 26.11 24.887 34.272 11.424 8.161 25.431 12.24 42.025 12.24 18.493 0 33.386-5.916 44.678-17.748 11.283-11.832 16.932-27.264 16.932-46.31 0-19.585-5.649-34.947-16.932-46.104-11.293-11.152-26.725-16.73-46.31-16.73-19.857 0-34.68 6.394-44.472 19.177l-28.97-31.417 108.53-113.836H424.654v-42.846h187.691v34.684l-86.91 91.804c19.585 0.272 37.131 4.894 52.633 13.871 15.507 8.977 27.606 21.423 36.316 37.333 8.7 15.914 13.055 33.938 13.055 54.063z" p-id="1340"></path></svg>
          <span v-else style="display: inline-block;width: 20px;text-align: center;color: #999">{{index + 1}}</span>
          {{ item.saleName }}
        </div>
        <div v-if="currentSchema.isPercent" class="flex-2">{{ item[currentSchema.valueKey]| rateFilter }}</div>
        <div v-else class="flex-2">{{ item[currentSchema.valueKey] | numberFilter }}</div>
        <div v-if="currentSchema.title3" class="flex-3">{{ item.cardCount }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import apis from '@/api/ajax'
import moment from 'moment'

export default {
  data() {
    return {
      loading: false,
      month: new Date(),
      activeName: 'PERFORMANCE_RANK',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      schemas: {
        PERFORMANCE_RANK: {
          title1: '姓名',
          title2: '业绩金额',
          title3: '卡数',
          isPercent: false,
          valueKey: 'totalIncome'
        },
        NEW_PURCHASE_RANK: {
          title1: '姓名',
          title2: '新购金额',
          isPercent: false,
          valueKey: 'gross'
        },
        GROWTH_RANK: {
          title1: '姓名',
          title2: '增长率',
          isPercent: true,
          valueKey: 'grossRanking'
        },
        COMPLETION_RANK: {
          title1: '姓名',
          title2: '完成率排行',
          isPercent: true,
          valueKey: 'completionRate'
        }
      },
      listData: []
    }
  },
  computed: {
    currentSchema() {
      return this.schemas[this.activeName]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      this.listData = []
      const { success, data } = await apis.crm.performanceRank({
        queryDate: moment(this.month).format('YYYY-MM-01'),
        type: this.activeName
      })
      this.loading = false
      if (!success) {
        return false
      }
      this.listData = data
    },
    monthChange() {
      this.getData()
    },
    handleClick() {
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.rank-list {
  .rank-list-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 14px;
  }
  .rank-list-value {
    padding: 8px 0;
    border-bottom: 1px solid #efefef;
  }
  .rank-col-wrap {
    display: flex;
    .flex-1 {
      flex: 2;
    }
    .flex-2 {
      flex: 2;
    }
    .flex-3 {
      flex: 1;
      text-align: center;
    }
  }
}
</style>
