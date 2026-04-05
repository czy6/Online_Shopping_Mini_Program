import { getHomeGoodsGuessLikeAPI } from '@/services/home'
import type { GuessType, PageParams } from '@/types/home'
import { ref } from 'vue'

export const useGuessList = () => {
  const guessList = ref<GuessType[]>([])
  const getGuessList = async (pageParams?: PageParams) => {
    const res = await getHomeGoodsGuessLikeAPI(pageParams)
    guessList.value = res.result.items
  }
  // 分页数据提交
  const pageParams: Required<PageParams> = {
    page: 2,
    pageSize: 10,
  }
  // 标记是否刷新完所有商品数据
  const isOver = ref(false)
  const getHomeGoodsGuessLike = async () => {
    if (isOver.value) {
      return uni.showToast({
        title: '没有更多数据了~',
        icon: 'none',
      })
    }
    const res = await getHomeGoodsGuessLikeAPI(pageParams)
    console.log(res)
    // 判断是否到最后一页
    guessList.value.push(...res.result.items)
    if (pageParams.page < res.result.pages) {
      pageParams.page++
    } else {
      isOver.value = true
    }
  }
  // 重置数据(上拉刷新备用)
  const resetGuessData = () => {
    pageParams.page = 1
    guessList.value = []
  }

  return {
    guessList,
    getGuessList,
    pageParams,
    isOver,
    getHomeGoodsGuessLike,
    resetGuessData,
  }
}
