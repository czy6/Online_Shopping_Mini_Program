import { getHotRecommendAPI } from '@/services/hot'
import type { SubTypeItem } from '@/types/hot'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHotStore = defineStore('hot', () => {
  // 热门推荐页 标题和url
  const hotMap = [
    { type: '1', title: '特惠推荐', url: '/hot/preference' },
    { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
    { type: '3', title: '一站买全', url: '/hot/oneStop' },
    { type: '4', title: '新鲜好物', url: '/hot/new' },
  ]
  // banner图
  const bannerPicture = ref<string>('')
  // 分页标题
  const navigationBarTitle = ref<string>('')
  // 分类列表
  const subTypes = ref<SubTypeItem[] & { isOver?: Boolean }>([])
  // 1.请求数据
  const getSubTypes = async (type: string) => {
    const item = hotMap.find((item) => item.type === type)
    const res = await getHotRecommendAPI(item!.url, {
      // 技巧：环境变量，开发环境，修改初始页面方便测试分页结束
      page: import.meta.env.DEV ? 30 : 1,
      pageSize: 10,
    })
    // console.log(res.result)
    bannerPicture.value = res.result.bannerPicture
    navigationBarTitle.value = res.result.title
    subTypes.value = res.result.subTypes
  }

  // 2.滑动触底
  const onScrollTolower = async (index: number, type: string) => {
    const currentTypes = subTypes.value[index]
    const item = hotMap.find((item) => item.type === type)
    // 分页判断
    if (currentTypes.goodsItems.page < currentTypes.goodsItems.pages) {
      currentTypes.goodsItems.page++
    } else {
      subTypes.value.isOver = true
      return uni.showToast({
        title: '没有更多数据了~',
        icon: 'none',
      })
    }
    // 请求数据
    const res = await getHotRecommendAPI(item!.url, {
      subType: currentTypes.id,
      page: currentTypes.goodsItems.page,
      pageSize: currentTypes.goodsItems.pageSize,
    })
    // 追加数据
    currentTypes.goodsItems.items.push(...res.result.subTypes[index].goodsItems.items)
  }

  return {
    bannerPicture,
    navigationBarTitle,
    subTypes,
    getSubTypes,
    onScrollTolower,
  }
})
