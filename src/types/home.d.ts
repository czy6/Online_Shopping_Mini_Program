import XtxGuess from '@/components/XtxGuess.vue'

// 1.轮播图类型
export type BannerType = {
  // 跳转链接
  hrefUrl: string
  // id
  id: string
  // 图片链接
  imgUrl: string
  // 跳转类型
  type: number
}

// 2.分类类型
export type CategoryType = {
  // id
  id: string
  // 分类名称
  name: string
  // 展示图标
  icon: string
}

// 3.热门推荐类型
export type HotType = {
  // 推荐说明
  alt: string
  // id
  id: string
  // 图片集合
  pictures: string[]
  // 跳转地址
  target: string
  // 推荐标题
  title: string
  // 推荐类型
  type: string
}

// 4.猜你喜欢类型
export type PageResult<T> = {
  /** 列表数据 */
  items: T[]
  /** 总条数 */
  counts: number
  /** 当前页数 */
  page: number
  /** 总页数 */
  pages: number
  /** 每页条数 */
  pageSize: number
}

export type GuessType = {
  /** 商品描述 */
  desc: string
  /** 商品折扣 */
  discount: number
  /** id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品已下单数量 */
  orderNum: number
  /** 商品图片 */
  picture: string
  /** 商品价格 */
  price: number
}

// 获取XtxGuess组件类型
export type XtxGuessInstance = InstanceType<typeof XtxGuess>

// 通用分页参数类型
export type PageParams = {
  /** 页码：默认值为 1 */
  page?: number
  /** 页大小：默认值为 10 */
  pageSize?: number
}
