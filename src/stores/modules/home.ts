import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BannerType, CategoryType, GuessType, HotType, PageParams } from '@/types/home'
import {
  getBannerAPI,
  getHomeCategoryAPI,
  getHomeHotAPI,
  getHomeGoodsGuessLikeAPI,
} from '@/services/home.ts'

// 首页数据仓库
export const useHomeStore = defineStore('home', () => {
  // 1.轮播图数据
  const bannerList = ref<BannerType[]>([])
  const getBannerList = async () => {
    const res = await getBannerAPI()
    bannerList.value = res.result
  }

  // 2.分类数据
  const categoryList = ref<CategoryType[]>([])
  const getCategoryList = async () => {
    const res = await getHomeCategoryAPI()
    categoryList.value = res.result
  }

  // 3.热门推荐数据
  const hotList = ref<HotType[]>([])
  const getHotList = async () => {
    const res = await getHomeHotAPI()
    hotList.value = res.result
  }

  // 4.猜你喜欢数据
  const guessList = ref<GuessType[]>([])
  // 分页数据提交
  const pageParams: Required<PageParams> = {
    page: 1,
    pageSize: 10,
  }
  // 标记是否刷新完所有商品数据
  const isOver = ref(false)
  // 防止重复加载
  const isLoading = ref(false)
  const getHomeGoodsGuessLike = async () => {
    if (isLoading.value) return
    if (isOver.value) {
      return uni.showToast({
        title: '没有更多数据了~',
        icon: 'none',
      })
    }
    isLoading.value = true
    const res = await getHomeGoodsGuessLikeAPI(pageParams)
    console.log(res)
    isLoading.value = false
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
    bannerList,
    getBannerList,
    categoryList,
    getCategoryList,
    hotList,
    getHotList,
    guessList,
    pageParams,
    isOver,
    getHomeGoodsGuessLike,
    resetGuessData,
  }
})
