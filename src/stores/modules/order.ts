import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  deleteMemberOrderAPI,
  getMemberOrderByIdAPI,
  getMemberOrderCancelByIdAPI,
  getMemberOrderConsignmentByIdAPI,
  getMemberOrderLogisticsByIdAPI,
  getPayMockAPI,
  getPayWxPayMiniPayAPI,
  putMemberOrderReceiptByIdAPI,
} from '@/services/order'
import type { LogisticItem, OrderResult } from '@/types/order'

export const useOrderStore = defineStore('order', () => {
  // 1.取消原因列表
  const cancelReasonList = ref([
    '商品无货',
    '不想要了',
    '商品信息填错了',
    '地址信息填写错误',
    '商品降价',
    '其它',
  ])
  // 订单取消原因
  const cancelReason = ref('')

  // 2.枚举订单状态
  enum OrderState {
    /** 待付款 */
    DaiFuKuan = 1,
    /** 待发货 */
    DaiFaHuo = 2,
    /** 待收货 */
    DaiShouHuo = 3,
    /** 待评价 */
    DaiPingJia = 4,
    /** 已完成 */
    YiWanCheng = 5,
    /** 已取消 */
    YiQuXiao = 6,
  }
  // 订单状态列表
  const orderStateList = [
    { id: 0, text: '' },
    { id: 1, text: '待付款' },
    { id: 2, text: '待发货' },
    { id: 3, text: '待收货' },
    { id: 4, text: '待评价' },
    { id: 5, text: '已完成' },
    { id: 6, text: '已取消' },
  ]

  // 3.复制内容
  const onCopy = (id: string) => {
    // 设置系统剪贴板的内容
    uni.setClipboardData({ data: id })
  }

  // 4.获取订单详情
  const detailOrder = ref<OrderResult>()
  const getDetailOrder = async (id: string) => {
    const res = await getMemberOrderByIdAPI(id)
    detailOrder.value = res.result
  }

  // 5.超时取消
  // 倒计时时间到触发事件
  const onTimeup = () => {
    // 支付超时修改订单状态为：已取消
    detailOrder.value!.orderState = OrderState.YiQuXiao
  }

  // 6.订单支付
  // 订单支付
  const onOrderPay = async (id: string) => {
    // 通过环境变量区分开发环境
    if (import.meta.env.DEV) {
      // 开发环境：模拟支付，修改订单状态为已支付
      await getPayMockAPI({ orderId: id })
    } else {
      // 生产环境：获取支付参数 + 发起微信支付
      const res = await getPayWxPayMiniPayAPI({ orderId: id })
      await wx.requestPayment(res.result)
    }
    detailOrder.value!.orderState = OrderState.DaiFaHuo
    uni.showToast({
      title: '支付成功',
      icon: 'success',
    })
    // 关闭当前页，再跳转支付结果页
    setTimeout(() => uni.redirectTo({ url: `/pagesOrder/payment/payment?id=${id}` }), 1000)
  }

  // 7.模拟发货
  const isDev = import.meta.env.DEV
  const onOrderSend = async (id: string) => {
    if (isDev) {
      await getMemberOrderConsignmentByIdAPI(id)
      uni.showToast({ title: '发货成功', icon: 'success' })
      detailOrder.value!.orderState = OrderState.DaiShouHuo
      // 物流信息
      await getMemberOrderLogisticsByIdData(id)
    }
  }

  // 8.确定收货
  const onOrderReceipt = (id: string) => {
    uni.showModal({
      content: '为保障您的权益，请收到货并确认无误后，再确认收货',
      success: async ({ confirm }) => {
        if (confirm) {
          const res = await putMemberOrderReceiptByIdAPI(id)
          uni.showToast({
            title: '确定收货成功',
            icon: 'success',
          })
          detailOrder.value = res.result
          // 物流信息
          await getMemberOrderLogisticsByIdData(id)
        }
      },
    })
  }

  // 9.物流信息(待收货，待评价，已完成)
  // 获取物流信息
  const logisticList = ref<LogisticItem[]>([])
  const getMemberOrderLogisticsByIdData = async (id: string) => {
    const res = await getMemberOrderLogisticsByIdAPI(id)
    logisticList.value = res.result.list
  }

  // 10.删除订单
  const onOrderDelete = (id: string) => {
    uni.showModal({
      content: '您确定要删除该订单？',
      success: async ({ confirm }) => {
        if (confirm) {
          await deleteMemberOrderAPI({ ids: [id] })
          uni.showToast({
            title: '删除订单成功',
            icon: 'success',
          })
          setTimeout(() => uni.redirectTo({ url: '/pagesOrder/orderList/orderList' }), 1000)
        }
      },
    })
  }

  // 11.取消订单
  const onOrderCancel = (id: string) => {
    uni.showModal({
      content: '您确定要取消该订单？',
      success: async ({ confirm }) => {
        if (confirm) {
          if (cancelReason.value === '') {
            uni.showToast({
              title: '请选择取消原因',
              icon: 'none',
            })
            return
          }
          await getMemberOrderCancelByIdAPI(id, { cancelReason: cancelReason.value })
          uni.showToast({
            title: '取消订单成功',
            icon: 'success',
          })
          setTimeout(() => uni.redirectTo({ url: `/pagesOrder/pay/pay?orderId=${id} ` }), 1000)
        }
      },
    })
  }

  return {
    cancelReasonList,
    cancelReason,
    OrderState,
    orderStateList,
    onCopy,
    detailOrder,
    getDetailOrder,
    onTimeup,
    onOrderPay,
    isDev,
    onOrderSend,
    onOrderReceipt,
    logisticList,
    onOrderDelete,
    onOrderCancel,
    getMemberOrderLogisticsByIdData,
  }
})
