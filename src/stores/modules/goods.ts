import type {
  SkuPopupEvent,
  SkuPopupLocaldata,
} from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'
import { getGoodsByIdAPI, postMemberCartAPI } from '@/services/goods'
import type { GoodsResult } from '@/types/goods'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGoodsStore = defineStore('goods', () => {
  // 1.商品详情
  const goodsDetail = ref<GoodsResult>()
  const getGoodsDetail = async (id: string) => {
    const res = await getGoodsByIdAPI(id)
    // console.log(res)
    goodsDetail.value = res.result
    // sku数据处理
    localdata.value = {
      _id: res.result.id,
      name: res.result.name,
      goods_thumb: res.result.mainPictures[0],
      spec_list: res.result.specs.map((item) => ({
        name: item.name,
        list: item.values,
      })),
      sku_list: res.result.skus.map((item) => ({
        _id: item.id,
        goods_id: res.result.id,
        goods_name: res.result.name,
        image: item.picture,
        price: item.price * 100,
        sku_name_arr: item.specs.map((it) => it.valueName),
        stock: item.inventory,
      })),
    }
  }

  // 2.Sku组件
  // 是否显示
  const isShowSku = ref(false)
  // 数据
  const localdata = ref({} as SkuPopupLocaldata)
  // 按钮
  enum SkuMode {
    Both = 1,
    Cart = 2,
    Buy = 3,
  }
  const mode = ref<SkuMode>(SkuMode.Both)
  // 打开
  const openSkuPopup = (skuMode: SkuMode) => {
    isShowSku.value = true
    mode.value = skuMode
  }

  // 3.加入购物车
  const onAddCart = async (e: SkuPopupEvent) => {
    await postMemberCartAPI({ skuId: e._id, count: e.buy_num })
    uni.showToast({
      title: '加入购物车成功',
      icon: 'success',
    })
    isShowSku.value = false
  }

  // 4.立即购买
  const onBuyNow = async (ev: SkuPopupEvent) => {
    // 跳转页面并传参
    uni.navigateTo({ url: `/pagesOrder/pay/pay?skuId=${ev._id}&count=${ev.buy_num}` })
    // 关闭 SKU 组件
    isShowSku.value = false
  }

  return {
    goodsDetail,
    getGoodsDetail,
    isShowSku,
    localdata,
    SkuMode,
    mode,
    openSkuPopup,
    onAddCart,
    onBuyNow,
  }
})
