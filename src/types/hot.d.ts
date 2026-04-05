import type { PageResult, GoodsItem } from './global'

/** 热门推荐-子类选项--第二层 */
export type SubTypeItem = {
  /** 子类id */
  id: string
  /** 子类标题 */
  title: string
  /** 子类对应的商品集合--第三层 */
  goodsItems: PageResult<GoodsItem>
}

/** 热门推荐--第一层 */
export type HotResult = {
  /** id信息 */
  id: string
  /** 活动图片 */
  bannerPicture: string
  /** 活动标题 */
  title: string
  /** 子类选项 */
  subTypes: SubTypeItem[]
}
