import { useMemberStore } from '@/stores'

// 配置常量
const CONFIG = {
  baseURL: 'https://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout: 10000, // 10秒超时
  retryCount: 2, // 重试次数
  retryDelay: 1000, // 重试延迟(ms)
} as const

// 错误状态码映射
const ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '没有权限访问',
  404: '请求的资源不存在',
  405: '请求方法不允许',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
}

// 扩展请求选项接口
interface HttpOptions extends UniApp.RequestOptions {
  /** 是否显示加载提示 */
  showLoading?: boolean
  /** 加载提示文本 */
  loadingText?: string
  /** 是否显示错误提示 */
  showError?: boolean
  /** 是否启用重试 */
  enableRetry?: boolean
  /** 自定义重试次数 */
  retryCount?: number
  /** 是否打印日志 */
  enableLog?: boolean
}

// 响应数据接口
interface ApiResponse<T = any> {
  code: string
  msg: string
  result: T
}

// 请求状态管理
class RequestManager {
  private pendingRequests = new Map<string, boolean>()

  // 生成请求唯一标识
  private generateRequestKey(options: HttpOptions): string {
    return `${options.method || 'GET'}_${options.url}_${JSON.stringify(options.data || {})}`
  }

  // 检查是否为重复请求
  isDuplicateRequest(options: HttpOptions): boolean {
    const key = this.generateRequestKey(options)
    return this.pendingRequests.has(key)
  }

  // 添加请求到待处理列表
  addRequest(options: HttpOptions): void {
    const key = this.generateRequestKey(options)
    this.pendingRequests.set(key, true)
  }

  // 从待处理列表移除请求
  removeRequest(options: HttpOptions): void {
    const key = this.generateRequestKey(options)
    this.pendingRequests.delete(key)
  }
}

const requestManager = new RequestManager()

// 日志工具
const logger = {
  info: (message: string, data?: any) => {
    // @ts-ignore
    if (import.meta.env?.DEV || typeof window !== 'undefined') {
      console.log(`[HTTP] ${message}`, data || '')
    }
  },
  error: (message: string, error?: any) => {
    // @ts-ignore
    if (import.meta.env?.DEV || typeof window !== 'undefined') {
      console.error(`[HTTP] ${message}`, error || '')
    }
  },
}

// 延迟函数
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非 http 开头的请求，拼接 baseURL
    if (!options.url.startsWith('http')) {
      options.url = CONFIG.baseURL + options.url
    }

    // 2. 设置请求超时时间
    options.timeout = options.timeout || CONFIG.timeout

    // 3. 添加小程序端请求头标识
    options.header = {
      'Content-Type': 'application/json',
      'source-client': 'miniapp',
      ...options.header,
    }

    // 4. 添加 token 请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

// 错误处理函数
const handleError = (statusCode: number, data: any, showError = true): void => {
  const message = ERROR_MESSAGES[statusCode] || data?.msg || '请求失败'

  if (showError) {
    uni.showToast({
      icon: 'none',
      title: message,
      duration: 2000,
    })
  }

  logger.error(`请求错误 ${statusCode}:`, { statusCode, message, data })
}

// 处理 401 未授权错误
const handle401Error = (): void => {
  const memberStore = useMemberStore()
  memberStore.clearProfile()

  uni.showModal({
    title: '登录过期',
    content: '您的登录已过期，请重新登录',
    showCancel: false,
    confirmText: '去登录',
    success: () => {
      uni.navigateTo({ url: '/pages/login/login' })
    },
  })
}

// 执行单次请求
const executeRequest = <T>(options: HttpOptions): Promise<ApiResponse<T>> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    // 显示加载提示
    if (options.showLoading !== false) {
      uni.showLoading({
        title: options.loadingText || '加载中...',
        mask: true,
      })
    }

    // 记录请求日志
    if (options.enableLog !== false) {
      logger.info('发起请求:', {
        url: options.url,
        method: options.method || 'GET',
        data: options.data,
        header: options.header,
      })
    }

    uni.request({
      ...options,
      success(res) {
        const duration = Date.now() - startTime

        // 记录响应日志
        if (options.enableLog !== false) {
          logger.info(`请求完成 (${duration}ms):`, {
            url: options.url,
            statusCode: res.statusCode,
            data: res.data,
          })
        }

        // 处理响应
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const responseData = res.data as ApiResponse<T>

          // 检查业务状态码
          if (responseData.code === '1' || responseData.code === '200') {
            resolve(responseData)
          } else {
            // 业务错误
            const error = new Error(responseData.msg || '业务处理失败')
            if (options.showError !== false) {
              uni.showToast({
                icon: 'none',
                title: responseData.msg || '操作失败',
              })
            }
            reject(error)
          }
        } else if (res.statusCode === 401) {
          handle401Error()
          reject(new Error('登录已过期'))
        } else {
          handleError(res.statusCode, res.data, options.showError)
          reject(new Error(`HTTP ${res.statusCode}`))
        }
      },
      fail(err) {
        const duration = Date.now() - startTime

        logger.error(`请求失败 (${duration}ms):`, {
          url: options.url,
          error: err,
        })

        // 网络错误处理
        if (options.showError !== false) {
          uni.showToast({
            icon: 'none',
            title: '网络连接失败，请检查网络设置',
          })
        }

        reject(err)
      },
      complete() {
        // 隐藏加载提示
        if (options.showLoading !== false) {
          uni.hideLoading()
        }

        // 移除请求记录
        requestManager.removeRequest(options)
      },
    })
  })
}

// 带重试的请求函数
const requestWithRetry = async <T>(
  options: HttpOptions,
  currentRetry = 0,
): Promise<ApiResponse<T>> => {
  const maxRetries = options.enableRetry !== false ? options.retryCount || CONFIG.retryCount : 0

  try {
    return await executeRequest<T>(options)
  } catch (error) {
    // 如果还有重试次数且不是 401 错误，则重试
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (currentRetry < maxRetries && errorMessage !== '登录已过期') {
      logger.info(`请求失败，${CONFIG.retryDelay}ms 后进行第 ${currentRetry + 1} 次重试`)
      await delay(CONFIG.retryDelay)
      return requestWithRetry<T>(options, currentRetry + 1)
    }

    throw error
  }
}

// 主要的 HTTP 请求函数
export const http = async <T = any>(options: HttpOptions): Promise<ApiResponse<T>> => {
  // 设置默认值
  const requestOptions: HttpOptions = {
    method: 'GET',
    showLoading: true,
    showError: true,
    enableRetry: true,
    enableLog: true,
    ...options,
  }

  // 检查重复请求
  if (requestManager.isDuplicateRequest(requestOptions)) {
    logger.info('检测到重复请求，已忽略:', requestOptions.url)
    throw new Error('重复请求')
  }

  // 添加到请求管理器
  requestManager.addRequest(requestOptions)

  try {
    return await requestWithRetry<T>(requestOptions)
  } catch (error) {
    // 确保移除请求记录
    requestManager.removeRequest(requestOptions)
    throw error
  }
}

// 便捷方法
export const httpGet = <T = any>(url: string, options?: Omit<HttpOptions, 'url' | 'method'>) => {
  return http<T>({ ...options, url, method: 'GET' })
}

export const httpPost = <T = any>(
  url: string,
  data?: any,
  options?: Omit<HttpOptions, 'url' | 'method' | 'data'>,
) => {
  return http<T>({ ...options, url, method: 'POST', data })
}

export const httpPut = <T = any>(
  url: string,
  data?: any,
  options?: Omit<HttpOptions, 'url' | 'method' | 'data'>,
) => {
  return http<T>({ ...options, url, method: 'PUT', data })
}

export const httpDelete = <T = any>(url: string, options?: Omit<HttpOptions, 'url' | 'method'>) => {
  return http<T>({ ...options, url, method: 'DELETE' })
}

// 文件上传
export const uploadFile = (options: {
  url: string
  filePath: string
  name?: string
  formData?: Record<string, any>
  showLoading?: boolean
  loadingText?: string
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (options.showLoading !== false) {
      uni.showLoading({
        title: options.loadingText || '上传中...',
        mask: true,
      })
    }

    uni.uploadFile({
      url: options.url.startsWith('http') ? options.url : CONFIG.baseURL + options.url,
      filePath: options.filePath,
      name: options.name || 'file',
      formData: options.formData,
      success(res) {
        try {
          const data = JSON.parse(res.data)
          if (data.code === '1' || data.code === '200') {
            resolve(data)
          } else {
            uni.showToast({
              icon: 'none',
              title: data.msg || '上传失败',
            })
            reject(new Error(data.msg || '上传失败'))
          }
        } catch (error) {
          reject(new Error('响应数据解析失败'))
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '上传失败，请重试',
        })
        reject(err)
      },
      complete() {
        if (options.showLoading !== false) {
          uni.hideLoading()
        }
      },
    })
  })
}

// 导出类型
export type { HttpOptions, ApiResponse }
