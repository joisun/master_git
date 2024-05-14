import { ajax } from '../api-tool'

export default {
  // 新增任务
  async addTask(data) {
    const url = '/ajax/flow/warning/addTask'
    return ajax(url, data)
  },
  // 执行任务
  async executeTask(data) {
    const url = '/ajax/flow/warning/executeTask'
    return ajax(url, data)
  },
  // 查询任务列表
  async getTaskList(data) {
    const url = '/ajax/flow/warning/getTaskList'
    return ajax(url, data)
  },
  // 更新任务列表
  async updateTaskById(data) {
    const url = '/ajax/flow/warning/updateTaskById'
    return ajax(url, data)
  },
  // 下载文件
  async getOsskey(data) {
    const url = '/ajax/flow/warning/getOsskey'
    return ajax(url, data)
  },
  // 查看下载列表
  async getDownLoadList(data) {
    const url = '/ajax/flow/warning/getDownLoadList'
    return ajax(url, data)
  },
  // 状态变更
  async updateStatus(data) {
    const url = '/ajax/flow/warning/updateStatus'
    return ajax(url, data)
  }
}
