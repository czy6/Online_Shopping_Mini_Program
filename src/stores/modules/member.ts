import type { LoginResult } from '@/types/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// Token仓库
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref<LoginResult>()

    // 保存会员信息，登录时使用
    const setProfile = (val: LoginResult) => {
      profile.value = val
    }

    // 修改头像信息
    const setAvator = (value: string) => {
      profile.value!.avatar = value
    }

    // 修改昵称信息
    const setNickname = (value: string) => {
      profile.value!.nickname = value
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      setProfile,
      setAvator,
      setNickname,
      clearProfile,
    }
  },
  // TODO: 持久化
  {
    // 网页端
    // persist: true,
    // 小程序端 -- Pinia持久化
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
