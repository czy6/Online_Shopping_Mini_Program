import type { PageParams } from '@/types/home'
import type { HotResult } from '@/types/hot'
import { http } from '@/utils/http'

// 热门推荐
export const getHotRecommendAPI = (url: string, data?: PageParams & { subType?: string }) => {
  return http<HotResult>({
    method: 'GET',
    url,
    data,
  })
}
