import { getCategoryTopAPI } from '@/services/category'
import { getBannerAPI } from '@/services/home'
import type { CategoryTopItem } from '@/types/category'
import type { BannerType } from '@/types/home'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoryStore = defineStore('category', () => {
  // 1.轮播图数据
  const bannerList = ref<BannerType[]>([])
  const getBannerList = async () => {
    const res = await getBannerAPI(2)
    bannerList.value = res.result
  }

  // 2.获取分类列表
  // 一级分类
  const categoryTopList = ref<CategoryTopItem[]>([])
  const getCategoryTopList = async () => {
    const res = await getCategoryTopAPI()
    // console.log(res)
    categoryTopList.value = res.result
  }

  return {
    bannerList,
    getBannerList,
    categoryTopList,
    getCategoryTopList,
  }
})
