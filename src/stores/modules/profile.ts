import { getMemberProfileAPI, putMemberProfileAPI } from '@/services/member'
import type { Gender, ProfileDetail } from '@/types/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMemberStore } from './member'

export const useProfileStore = defineStore('profile', () => {
  // 1.获取数据
  const memberProfile = ref({} as ProfileDetail)
  const getMemberProfile = async () => {
    const res = await getMemberProfileAPI()
    memberProfile.value = res.result
  }

  // 2.修改头像
  const onAvatarChange = () => {
    // #ifdef MP-WEIXIN
    // 选择拍照or相册
    uni.chooseMedia({
      // 选择的文件个数
      count: 1,
      // 选择的文件类型
      mediaType: ['image'],
      // 选中后
      success(res) {
        const { tempFilePath } = res.tempFiles[0]
        // 上传文件 -- 阿里云OSS库已满 无法上传至服务器 修改本地数据
        // uni.uploadFile({
        //   url: '/member/profile/avatar',
        //   // 参数名称
        //   name: 'file',
        //   // 参数
        //   filePath: tempFilePath,
        //   success(res) {
        //     console.log(res)
        //   },
        // })
        memberProfile.value!.avatar = tempFilePath
        const memberStore = useMemberStore()
        memberStore.setAvator(tempFilePath)
        uni.showToast({
          title: '修改成功',
          icon: 'success',
        })
      },
    })
    // #endif

    // #ifdef H5 || APP-PLUS
    uni.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        memberProfile.value!.avatar = tempFilePath
        const memberStore = useMemberStore()
        memberStore.setAvator(tempFilePath)
        uni.showToast({
          title: '修改成功',
          icon: 'success',
        })
      },
    })
    // #endif
  }

  // 3.修改性别
  const onGenderChange: UniHelper.RadioGroupOnChange = (e) => {
    memberProfile.value.gender = e.detail.value as Gender
  }

  // 4.修改生日
  const onBirthdayChange: UniHelper.DatePickerOnChange = (e) => {
    memberProfile.value.birthday = e.detail.value
  }

  // 5.修改地区
  const fullLocationCode = ref<[string, string, string]>(['', '', ''])
  const onFullLocationChange: UniHelper.RegionPickerOnChange = (e) => {
    memberProfile.value.fullLocation = e.detail.value.join(' ')
    fullLocationCode.value = e.detail.code!
  }

  // 6.提交修改
  const onSubmit = async () => {
    const { nickname, gender, birthday, profession } = memberProfile.value
    const [provinceCode, cityCode, countyCode] = fullLocationCode.value
    const res = await putMemberProfileAPI({
      nickname,
      gender,
      birthday,
      profession,
      provinceCode,
      cityCode,
      countyCode,
    })
    if (res.code === '1') {
      const memberStore = useMemberStore()
      memberStore.setNickname(memberProfile.value!.nickname!)
    }
    console.log(res)
    uni.showToast({
      title: '修改成功',
      icon: 'success',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 500)
  }

  return {
    memberProfile,
    getMemberProfile,
    onAvatarChange,
    onGenderChange,
    onBirthdayChange,
    onFullLocationChange,
    onSubmit,
  }
})
