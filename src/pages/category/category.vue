<script setup lang="ts">
import { useCategoryStore } from '@/stores/modules/category'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import PageSkeleton from './components/PageSkeleton.vue'

const categoryStore = useCategoryStore()
const activeIndex = ref(0)
const isOver = ref(false)

onLoad(async () => {
  isOver.value = true
  await Promise.all([categoryStore.getBannerList(), categoryStore.getCategoryTopList()])
  isOver.value = false
})
</script>

<template>
  <PageSkeleton v-if="isOver" />
  <view class="viewport" v-else>
    <!-- 搜索框 -->
    <view class="search">
      <view class="input">
        <text class="icon-search">女靴</text>
      </view>
    </view>
    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in categoryStore.categoryTopList"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="activeIndex = index"
        >
          <text class="name"> {{ item.name }} </text>
        </view>
      </scroll-view>
      <!-- 右侧：二级分类 -->
      <scroll-view class="secondary" scroll-y>
        <!-- 焦点图 -->
        <XtxSwiper class="banner" :list="categoryStore.bannerList" />
        <!-- 内容区域 -->
        <view
          class="panel"
          v-for="item in categoryStore.categoryTopList[activeIndex]?.children || []"
          :key="item.id"
        >
          <view class="title">
            <text class="name">{{ item.name }}</text>
            <navigator class="more" hover-class="none">全部</navigator>
          </view>
          <view class="section">
            <navigator
              v-for="goods in item.goods"
              :key="goods.id"
              class="goods"
              hover-class="none"
              :url="`/pages/goods/goods?id=${goods.id}`"
            >
              <image class="image" :src="goods.picture"></image>
              <view class="name ellipsis">{{ goods.name }}</view>
              <view class="price">
                <text class="symbol">¥</text>
                <text class="number">{{ goods.price }}</text>
              </view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss">
@import './styles/category.scss';
</style>
