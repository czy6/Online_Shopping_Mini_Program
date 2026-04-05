// 快捷登录登录类型
export type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}

// 公共类型
type sameType = {
  /** 账户名 */
  account: string
  /** 头像 */
  avatar: string
  /** 用户ID */
  id: number
  /** 昵称 */
  nickname?: string
}

/** 小程序登录 登录用户信息 */
export type LoginResult = sameType & {
  /** 手机号 */
  mobile: string
  /** 登录凭证 */
  token: string
}

/** 用户信息详情 */
export type ProfileDetail = sameType & {
  // 性别
  gender?: Gender
  // 生日
  birthday?: string
  // 省市区
  fullLocation?: string
  // 职业
  profession?: string
}

export type Gender = '男' | '女'

export type ProfileParams = Pick<
  ProfileDetail,
  'nickname' | 'gender' | 'birthday' | 'profession'
> & {
  provinceCode?: string
  cityCode?: string
  countyCode?: string
}
