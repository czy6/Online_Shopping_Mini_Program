<script setup lang="ts">
import type { BannerType } from '@/types/home'
import { ref } from 'vue'

// 1.指示点改变
const activeIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (e) => {
  activeIndex.value = e.detail?.current
}

// 2.接收数据
defineProps<{
  list: BannerType[]
}>()
</script>

<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
      <swiper-item v-for="item in list" :key="item.id">
        <navigator :url="item.hrefUrl" hover-class="none" class="navigator">
          <image mode="aspectFill" class="image" :src="item.imgUrl"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="indicator">
      <text
        v-for="(item, index) in list"
        :key="item.id"
        class="dot"
        :class="{ active: index === activeIndex }"
      ></text>
    </view>
  </view>
</template>

<style lang="scss">
@import '@/components/styles/XtxSwiper.scss';
</style>
