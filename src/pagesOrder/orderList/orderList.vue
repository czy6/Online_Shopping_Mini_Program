<script setup lang="ts">
import { useOrderListStore } from '@/stores/modules/orderList'
import { ref } from 'vue'
import OrderType from './components/OrderType.vue'

const orderListStore = useOrderListStore()

const query = defineProps<{
  type?: string
}>()

// tab高亮
const activeIndex = ref(
  orderListStore.orderTabs.findIndex((item) => item.orderState === Number(query.type)),
)
</script>

<template>
  <view class="viewport">
    <!-- tabs -->
    <view class="tabs">
      <text
        class="item"
        v-for="(item, index) in orderListStore.orderTabs"
        @tap="activeIndex = index"
        :key="item.orderState"
      >
        {{ item.title }}
      </text>
      <!-- 游标 -->
      <view class="cursor" :style="{ left: activeIndex * 20 + '%' }"></view>
    </view>
    <!-- 滑动容器 -->
    <!-- current -- 当前所在滑块的 index (上动下动) -->
    <!-- current 改变时会触发 change 事件，event.detail = {current: current, source: source} (下滑上动) -->
    <swiper :current="activeIndex" @change="activeIndex = $event.detail.current" class="swiper">
      <!-- 滑动项 -->
      <swiper-item v-for="item in orderListStore.orderTabs" :key="item.orderState">
        <OrderType :orderState="item.orderState"></OrderType>
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

// tabs
.tabs {
  display: flex;
  justify-content: space-around;
  line-height: 60rpx;
  margin: 0 10rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 28rpx;
    color: #262626;
  }

  .cursor {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 20%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: #27ba9b;
    /* 过渡效果 */
    transition: all 0.4s;
  }
}

// swiper
.swiper {
  background-color: #f7f7f8;
}
</style>
