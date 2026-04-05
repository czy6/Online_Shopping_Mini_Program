import {
  getMemberOrderPreAPI,
  getMemberOrderRepurchaseByIdAPI,
  getOrderPreNowAPI,
  postMemberOrderAPI,
} from '@/services/pay'
import type { AddressItem } from '@/types/goods'
import type { OrderPreGoods, OrderPreResult } from '@/types/pay'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAddressStore } from './address'

export const usePayStore = defineStore('pay', () => {
  // 1.订单备注
  const buyerMessage = ref('')

  // 2.配送时间
  const deliveryList = ref([
    { type: 1, text: '时间不限 (周一至周日)' },
    { type: 2, text: '工作日送 (周一至周五)' },
    { type: 3, text: '周末配送 (周六至周日)' },
  ])
  // 当前配送时间下标
  const activeIndex = ref(0)
  // 当前配送时间
  const activeDelivery = computed(() => deliveryList.value[activeIndex.value])
  // 修改配送时间
  const onChangeDelivery: UniHelper.SelectorPickerOnChange = (ev) => {
    activeIndex.value = ev.detail.value
  }

  // 3.获取支付列表
  const payGoodsList = ref<OrderPreGoods[]>([])
  const paySummary = ref<{
    totalPrice: number
    postFee: number
    totalPayPrice: number
  }>({ totalPrice: 0, postFee: 0, totalPayPrice: 0 })
  const payAddressesList = ref<AddressItem[]>([])
  // 购物车进入
  const getCartDetailOrder = async () => {
    const res = await getMemberOrderPreAPI()
    payGoodsList.value = res.result.goods
    paySummary.value = res.result.summary
    payAddressesList.value = res.result.userAddresses
  }
  // 立即购买进入
  const getBuyNowDetailOrder = async (skuId: string, count: string) => {
    const res = await getOrderPreNowAPI({
      skuId,
      count,
    })
    payGoodsList.value = res.result.goods
    paySummary.value = res.result.summary
    payAddressesList.value = res.result.userAddresses
  }
  // 再次购买进入
  const getAgainBuyDetailOrder = async (orderId: string) => {
    const res = await getMemberOrderRepurchaseByIdAPI(orderId)
    payGoodsList.value = res.result.goods
    paySummary.value = res.result.summary
    payAddressesList.value = res.result.userAddresses
  }

  // 4.选择地址
  const addressStore = useAddressStore()
  const receiveAddress = computed(() => {
    return addressStore.selectedAddress || addressStore.addressList.find((item) => item.isDefault)
  })

  // 5.提交订单
  const onSubmitOrder = async () => {
    if (!receiveAddress.value?.id) return uni.showToast({ icon: 'none', title: '请选择收货地址' })
    const res = await postMemberOrderAPI({
      addressId: receiveAddress.value.id,
      deliveryTimeType: activeDelivery.value.type,
      buyerMessage: buyerMessage.value,
      goods: payGoodsList.value.map((item) => ({ count: item.count, skuId: item.skuId })),
      payChannel: 2,
      payType: 1,
    })
    uni.redirectTo({ url: `/pagesOrder/detailOrder/detailOrder?id=${res.result.id}` })
  }

  return {
    buyerMessage,
    deliveryList,
    activeIndex,
    activeDelivery,
    onChangeDelivery,
    payGoodsList,
    paySummary,
    payAddressesList,
    getCartDetailOrder,
    getBuyNowDetailOrder,
    getAgainBuyDetailOrder,
    receiveAddress,
    onSubmitOrder,
  }
})
