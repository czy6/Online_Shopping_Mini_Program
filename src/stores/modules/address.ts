import {
  deleteMemberAddressByIdAPI,
  getMemberAddressAPI,
  getMemberAddressByIdAPI,
  postMemberAddressAPI,
  putMemberAddressById,
} from '@/services/address'
import type { AddressItem } from '@/types/goods'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAddressStore = defineStore('address', () => {
  // 表单数据
  const form = ref({
    receiver: '', // 收货人
    contact: '', // 联系方式
    fullLocation: '', // 省市区(前端展示)
    provinceCode: '', // 省份编码(后端参数)
    cityCode: '', // 城市编码(后端参数)
    countyCode: '', // 区/县编码(后端参数)
    address: '', // 详细地址
    isDefault: 0, // 默认地址，1为是，0为否
  })

  // 1.城市修改
  const onFullLocationChange: UniHelper.RegionPickerOnChange = (e) => {
    form.value.fullLocation = e.detail.value.join('')
    const [provinceCode, cityCode, countyCode] = e.detail.code!
    // 整合，如果源对象中有相同的属性，后面的源对象的属性将覆盖前面的源对象的属性。
    Object.assign(form.value, { provinceCode, cityCode, countyCode })
  }

  // 2.默认地址
  const onSwitchChange: UniHelper.SwitchOnChange = (e) => {
    form.value.isDefault = e.detail.value ? 1 : 0
    // console.log(form.value.isDefault)
  }

  // 3.新增 or 编辑提交
  // 提交表单
  const onSubmit = async (id: string) => {
    if (id) {
      await putMemberAddressById(id, form.value) // 有id：修改地址
    } else {
      await postMemberAddressAPI(form.value) // 无id：新建地址
    }
    // 成功提示
    uni.showToast({ icon: 'success', title: id ? '修改成功' : '添加成功' })
    setTimeout(() => {
      uni.navigateBack()
    }, 500)
  }

  // 4.获取地址列表
  const addressList = ref<AddressItem[]>([])
  const getAddressList = async () => {
    const res = await getMemberAddressAPI()
    addressList.value = res.result
  }

  // 5.渲染编辑地址
  const getMemberAddressById = async (id: string) => {
    const res = await getMemberAddressByIdAPI(id)
    Object.assign(form.value, res.result)
  }

  // 6.重置地址栏
  const resetAddressForm = () => {
    form.value = {
      receiver: '', // 收货人
      contact: '', // 联系方式
      fullLocation: '', // 省市区(前端展示)
      provinceCode: '', // 省份编码(后端参数)
      cityCode: '', // 城市编码(后端参数)
      countyCode: '', // 区/县编码(后端参数)
      address: '', // 详细地址
      isDefault: 0, // 默认地址，1为是，0为否
    }
  }

  // 7.表单校验
  const rules: UniHelper.UniFormsRules = {
    receiver: {
      rules: [{ required: true, errorMessage: '请输入非空收获人名称' }],
    },
    contact: {
      rules: [
        { required: true, errorMessage: '请输入非空手机号' },
        { pattern: /^1[3-9]\d{9}$/, errorMessage: '请输入正确的手机号' },
      ],
    },
    fullLocation: {
      rules: [{ required: true, errorMessage: '请输入非空省市区' }],
    },
    address: {
      rules: [{ required: true, errorMessage: '请输入非空详细地址' }],
    },
  }

  // 8.删除地址
  const onDeleteAddress = (id: string) => {
    uni.showModal({
      content: '您确定要删除改地址',
      async success({ confirm }) {
        if (confirm) {
          await deleteMemberAddressByIdAPI(id)
          getAddressList()
          uni.showToast({
            title: '删除成功',
            icon: 'success',
          })
        }
      },
    })
  }

  // 9.选择地址
  const selectedAddress = ref<AddressItem>()
  const onSelectAddress = (item: AddressItem, isBack: number) => {
    selectedAddress.value = item
    if (isBack == 1) {
      uni.navigateBack()
    }
  }

  return {
    form,
    onFullLocationChange,
    onSwitchChange,
    onSubmit,
    addressList,
    getAddressList,
    getMemberAddressById,
    resetAddressForm,
    rules,
    onDeleteAddress,
    selectedAddress,
    onSelectAddress,
  }
})
