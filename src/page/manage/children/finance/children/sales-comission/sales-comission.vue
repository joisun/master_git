<!--
 * @Author: SerkeyWu
 * @Date: 2021-02-19 10:03:01
 * @Description: Do not edit
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-19 16:37:46
-->
<template>
  <transition name="fade" mode="out-in">
    <keep-alive include="sales-comission-list">
      <router-view/>
    </keep-alive>
  </transition>
</template>
