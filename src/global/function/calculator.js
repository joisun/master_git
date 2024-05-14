/*
 * @Author: SerkeyWu
 * @Date: 2021-02-24 11:46:24
 * @Description: 计算工具合集
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-25 10:36:52
 */
import numberFixed from '@/global/filters/number-fixed'
/**
 * @description: 计算毛利率
 * @param {收入} income
 * @param {成本} cost
 * @return {毛利率(保留四位有效数字）}
 */
export function calculateGPM(income, cost) {
  if (!income) {
    return '——'
  }
  return numberFixed((income - cost) / income * 100) + '%'
}
