<script setup lang="ts">
import { ref } from 'vue'
import { useHomeStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'
import CustomNavBar from './components/CustomNavBar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import PageSkeleton from './components/PageSkeleton.vue'

// 调用仓库
const homeStore = useHomeStore()

// 滑动至底部触发
const onScrollTolower = () => {
  homeStore.getHomeGoodsGuessLike()
}

// 上拉刷新
const isTriggered = ref(false)
const onRefresherrefresh = async () => {
  isTriggered.value = true
  homeStore.resetGuessData()
  await Promise.all([
    homeStore.getBannerList(),
    homeStore.getCategoryList(),
    homeStore.getHotList(),
    homeStore.getHomeGoodsGuessLike(),
  ])
  isTriggered.value = false
}

// 骨架屏
const isLodding = ref(false)
onLoad(async () => {
  isLodding.value = true
  await Promise.all([
    homeStore.getBannerList(),
    homeStore.getCategoryList(),
    homeStore.getHotList(),
  ])
  isLodding.value = false
})
</script>

<template>
  <!-- 顶部栏 -->
  <CustomNavBar />
  <scroll-view
    scroll-y
    @scrolltolower="onScrollTolower"
    refresher-enabled
    @refresherrefresh="onRefresherrefresh"
    :refresher-triggered="isTriggered"
    class="scroll-view"
  >
    <PageSkeleton v-if="isLodding" />
    <template v-else>
      <!-- 轮播图 -->
      <XtxSwiper :list="homeStore.bannerList" />
      <!-- 前台分类 -->
      <CategoryPanel :list="homeStore.categoryList" />
      <!-- 热门推荐 -->
      <HotPanel :list="homeStore.hotList" />
      <!-- 猜你喜欢 -->
      <XtxGuess />
    </template>
  </scroll-view>
</template>

<style lang="scss">
/* #ifdef APP-PLUS */
#app,
/* #endif */
page {
  background-color: #f7f7f7;
  display: flex;
  // 只有当父容器的高度被明确指定时，子元素的百分比高度才能正确计算和应用
  height: 100%;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
