import type { InputNumberBoxEvent } from '@/components/vk-data-input-number-box/vk-data-input-number-box'
import {
  deleteMemberCartAPI,
  getMemberCartAPI,
  putmemberCartBySkuIdAPI,
  putmemberCartSelectedAPI,
} from '@/services/cart'
import type { CartItem } from '@/types/cart'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 1.获取购物车数据
  const cartList = ref<CartItem[]>([])
  const getCartList = async () => {
    const res = await getMemberCartAPI()
    // console.log(res)
    cartList.value = res.result
  }

  // 2.购物车删除单品
  const deleteCart = (skuId: string) => {
    uni.showModal({
      content: '您确定要删除该商品么？',
      success: async (res) => {
        if (res.confirm) {
          await deleteMemberCartAPI({
            ids: [skuId],
          })
          // console.log(res)
          getCartList()
        }
      },
    })
  }

  // 3.修改单品个数
  const onChangeCount = (e: InputNumberBoxEvent) => {
    putmemberCartBySkuIdAPI(e.index, { count: e.value })
  }

  // 4.单选、全选
  // 单选
  const onChangeSelected = (item: CartItem) => {
    item.selected = !item.selected
    putmemberCartBySkuIdAPI(item.skuId, { selected: item.selected })
  }
  // 全选 -- 计算属性使 isSelectedAll 活起来
  const isSeletedAll = computed(() => {
    return cartList.value.length && cartList.value.every((item) => item.selected)
  })
  const onChangeSelectedAll = () => {
    const _isSeletedAll = !isSeletedAll.value
    cartList.value.map((item) => (item.selected = _isSeletedAll))
    putmemberCartSelectedAPI({ selected: _isSeletedAll })
  }

  // 5.合计、总数
  // 选中的列表项
  const selectedCartList = computed(() => {
    return cartList.value.filter((item) => item.selected)
  })
  // 选中的商品总数
  const totalSelectedNumber = computed(() => {
    return selectedCartList.value.reduce((sum, item) => sum + item.count, 0)
  })
  // 选中的商品总价
  const totalSelectedPrice = computed(() => {
    return selectedCartList.value.reduce((sum, item) => sum + item.count * item.price, 0).toFixed(2)
  })

  // 6.去支付
  // 点击去结算按钮
  const onGoToPay = () => {
    if (totalSelectedNumber.value === 0) {
      uni.showToast({
        icon: 'none',
        title: '请选择商品',
      })
      return
    }
    uni.navigateTo({ url: '/pagesOrder/pay/pay' })
  }

  return {
    cartList,
    getCartList,
    deleteCart,
    onChangeCount,
    onChangeSelected,
    isSeletedAll,
    onChangeSelectedAll,
    totalSelectedNumber,
    totalSelectedPrice,
    onGoToPay,
  }
})
