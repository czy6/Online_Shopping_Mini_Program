<script setup lang="ts">
import type { CategoryType } from '@/types/home'

// 定义 props 接收数据
defineProps<{
  list: CategoryType[]
}>()
</script>

<template>
  <view class="category">
    <navigator
      class="category-item"
      hover-class="none"
      url="/pages/index/index"
      v-for="item in list"
      :key="item.id"
    >
      <image class="icon" :src="item.icon"></image>
      <view class="text">{{ item.name }}</view>
    </navigator>
  </view>
</template>

<style lang="scss">
@import './styles/CategoryPanel.scss';
</style>
