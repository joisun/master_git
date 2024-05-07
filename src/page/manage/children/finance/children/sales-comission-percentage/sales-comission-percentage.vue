<!--
 * @Author: SerkeyWu
 * @Date: 2021-02-19 10:03:01
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-20 10:33:34
-->
<template>
  <transition name="fade" mode="out-in">
    <keep-alive include="sales-comission-cost-list">
      <router-view />
    </keep-alive>
  </transition>
</template>
