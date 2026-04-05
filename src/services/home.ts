import type {
  BannerType,
  CategoryType,
  GuessType,
  HotType,
  PageParams,
  PageResult,
} from '@/types/home'
import { http } from '@/utils/http'

// 1.轮播图
export const getBannerAPI = (distributionSite = 1) => {
  return http<BannerType[]>({
    method: 'GET',
    url: '/home/banner',
    data: {
      distributionSite,
    },
  })
}

// 2.前台分类
export const getHomeCategoryAPI = () => {
  return http<CategoryType[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}

// 3.热门推荐
export const getHomeHotAPI = () => {
  return http<HotType[]>({
    method: 'GET',
    url: '/home/hot/mutli',
  })
}

// 4.猜你喜欢
export const getHomeGoodsGuessLikeAPI = (data?: PageParams) => {
  return http<PageResult<GuessType>>({
    method: 'GET',
    url: '/home/goods/guessLike',
    data,
  })
}
