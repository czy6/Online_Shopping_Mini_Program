<script setup lang="ts">
import { useAddressStore } from '@/stores/modules/address'
import { onLoad } from '@dcloudio/uni-app'
import type { UniFormsInstance } from '@uni-helper/uni-ui-types'
import { ref } from 'vue'

const addressStore = useAddressStore()
const formRef = ref<UniFormsInstance>()

const onSubmit = async () => {
  try {
    await formRef.value?.validate?.()
    addressStore.onSubmit(query.id)
  } catch (err) {
    uni.showToast({ icon: 'error', title: '请填写完整信息' })
  }
}

const query = defineProps<{
  id: string
}>()

uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新增地址' })

onLoad(() => {
  if (!query.id) {
    addressStore.resetAddressForm()
  } else {
    addressStore.getMemberAddressById(query.id)
  }
})
</script>

<template>
  <view class="content">
    <uni-forms :model="addressStore.form" :rules="addressStore.rules" ref="formRef">
      <!-- 表单内容 -->
      <uni-forms-item name="receiver" class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="addressStore.form.receiver" />
      </uni-forms-item>
      <uni-forms-item name="contact" class="form-item">
        <text class="label">手机号码</text>
        <input
          class="input"
          placeholder="请填写收货人手机号码"
          v-model="addressStore.form.contact"
        />
      </uni-forms-item>
      <uni-forms-item name="fullLocation" class="form-item">
        <text class="label">所在地区</text>
        <picker
          class="picker"
          mode="region"
          :value="addressStore.form.fullLocation.split(' ')"
          @change="addressStore.onFullLocationChange"
        >
          <view v-if="addressStore.form.fullLocation">{{ addressStore.form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="address" class="form-item">
        <text class="label">详细地址</text>
        <input class="input" placeholder="街道、楼牌号等信息" v-model="addressStore.form.address" />
      </uni-forms-item>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch
          @change="addressStore.onSwitchChange"
          class="switch"
          color="#27ba9b"
          :checked="addressStore.form.isDefault === 1"
        />
      </view>
    </uni-forms>
  </view>
  <!-- 提交按钮 -->
  <button @tap="onSubmit" class="button">保存并使用</button>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx 40rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
