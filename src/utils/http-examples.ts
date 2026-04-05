/**
 * HTTP 工具使用示例
 * 
 * 这个文件展示了如何使用优化后的 HTTP 工具
 * 在实际项目中，请删除此文件
 */

import { http, httpGet, httpPost, httpPut, httpDelete, uploadFile } from './http'
import type { HttpOptions, ApiResponse } from './http'

// 示例：基本 GET 请求
export const getBasicExample = async () => {
  try {
    const response = await httpGet<{ list: any[] }>('/api/data')
    console.log('数据:', response.result.list)
  } catch (error) {
    console.error('请求失败:', error)
  }
}

// 示例：POST 请求
export const postExample = async () => {
  try {
    const response = await httpPost<{ id: number }>('/api/create', {
      name: '测试数据',
      type: 'example'
    })
    console.log('创建成功，ID:', response.result.id)
  } catch (error) {
    console.error('创建失败:', error)
  }
}

// 示例：自定义配置的请求
export const customConfigExample = async () => {
  try {
    const response = await http<any>({
      url: '/api/sensitive-data',
      method: 'GET',
      showLoading: false,        // 不显示加载提示
      showError: false,          // 不显示错误提示
      enableRetry: false,        // 禁用重试
      enableLog: false,          // 禁用日志
    })
    console.log('敏感数据:', response.result)
  } catch (error) {
    // 自定义错误处理
    console.error('获取敏感数据失败:', error)
  }
}

// 示例：文件上传
export const uploadExample = async (filePath: string) => {
  try {
    const response = await uploadFile({
      url: '/api/upload',
      filePath: filePath,
      name: 'avatar',
      formData: {
        userId: '123',
        type: 'avatar'
      },
      loadingText: '上传头像中...'
    })
    console.log('上传成功:', response.result)
  } catch (error) {
    console.error('上传失败:', error)
  }
}

// 示例：带重试的请求
export const retryExample = async () => {
  try {
    const response = await http<any>({
      url: '/api/unstable-endpoint',
      method: 'GET',
      enableRetry: true,
      retryCount: 3,             // 自定义重试次数
    })
    console.log('请求成功:', response.result)
  } catch (error) {
    console.error('重试后仍然失败:', error)
  }
}

// 示例：静默请求（不显示任何 UI 提示）
export const silentRequest = async () => {
  try {
    const response = await http<any>({
      url: '/api/background-sync',
      method: 'POST',
      data: { timestamp: Date.now() },
      showLoading: false,
      showError: false,
      enableLog: false,
    })
    return response.result
  } catch (error) {
    // 静默处理错误
    return null
  }
}

// 示例：类型安全的请求
interface UserInfo {
  id: number
  name: string
  email: string
  avatar: string
}

export const typedRequest = async (userId: number): Promise<UserInfo | null> => {
  try {
    const response = await httpGet<UserInfo>(`/api/users/${userId}`)
    return response.result
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

// 示例：批量请求
export const batchRequests = async () => {
  try {
    const [users, orders, products] = await Promise.all([
      httpGet<{ list: any[] }>('/api/users'),
      httpGet<{ list: any[] }>('/api/orders'),
      httpGet<{ list: any[] }>('/api/products'),
    ])
    
    return {
      users: users.result.list,
      orders: orders.result.list,
      products: products.result.list,
    }
  } catch (error) {
    console.error('批量请求失败:', error)
    throw error
  }
}

// 示例：条件请求
export const conditionalRequest = async (useCache: boolean = false) => {
  const options: HttpOptions = {
    url: '/api/data',
    method: 'GET',
  }
  
  if (useCache) {
    // 添加缓存相关的头部
    options.header = {
      'Cache-Control': 'max-age=300',
    }
  }
  
  return await http<any>(options)
}
