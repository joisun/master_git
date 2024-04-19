<template>
  <transition name="fade" mode="out-in">
    <keep-alive include="customer-profit-list">
      <router-view/>
    </keep-alive>
  </transition>
</template>
