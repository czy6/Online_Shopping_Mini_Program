import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getMemberOrderAPI } from '@/services/orderList'

export const useOrderListStore = defineStore('orderList', () => {
  // 1.tabs 数据
  const orderTabs = ref([
    { orderState: 0, title: '全部' },
    { orderState: 1, title: '待付款' },
    { orderState: 2, title: '待发货' },
    { orderState: 3, title: '待收货' },
    { orderState: 4, title: '待评价' },
  ])

  return {
    orderTabs,
  }
})
