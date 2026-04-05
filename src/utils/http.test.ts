/**
 * HTTP 工具测试文件
 * 
 * 这个文件用于测试优化后的 HTTP 工具的各项功能
 * 在实际项目中，可以根据需要保留或删除此文件
 */

import { http, httpGet, httpPost, uploadFile } from './http'
import type { HttpOptions } from './http'

// 模拟测试数据类型
interface TestUser {
  id: number
  name: string
  email: string
}

interface TestResponse {
  success: boolean
  message: string
}

/**
 * 测试基本 GET 请求
 */
export const testBasicGet = async () => {
  console.log('🧪 测试基本 GET 请求...')
  
  try {
    const response = await httpGet<TestUser[]>('/api/users')
    console.log('✅ GET 请求成功:', response.result)
    return true
  } catch (error) {
    console.error('❌ GET 请求失败:', error)
    return false
  }
}

/**
 * 测试 POST 请求
 */
export const testPost = async () => {
  console.log('🧪 测试 POST 请求...')
  
  try {
    const response = await httpPost<TestResponse>('/api/users', {
      name: '测试用户',
      email: 'test@example.com'
    })
    console.log('✅ POST 请求成功:', response.result)
    return true
  } catch (error) {
    console.error('❌ POST 请求失败:', error)
    return false
  }
}

/**
 * 测试自定义配置
 */
export const testCustomConfig = async () => {
  console.log('🧪 测试自定义配置...')
  
  const options: HttpOptions = {
    url: '/api/test',
    method: 'GET',
    showLoading: false,
    showError: false,
    enableRetry: false,
    enableLog: true,
  }
  
  try {
    const response = await http<any>(options)
    console.log('✅ 自定义配置请求成功:', response.result)
    return true
  } catch (error) {
    console.error('❌ 自定义配置请求失败:', error)
    return false
  }
}

/**
 * 测试重试机制
 */
export const testRetry = async () => {
  console.log('🧪 测试重试机制...')
  
  try {
    const response = await http<any>({
      url: '/api/unstable',
      method: 'GET',
      enableRetry: true,
      retryCount: 3,
    })
    console.log('✅ 重试请求成功:', response.result)
    return true
  } catch (error) {
    console.error('❌ 重试请求失败:', error)
    return false
  }
}

/**
 * 测试错误处理
 */
export const testErrorHandling = async () => {
  console.log('🧪 测试错误处理...')
  
  try {
    // 故意请求一个不存在的端点
    await httpGet<any>('/api/nonexistent')
    console.log('❌ 错误处理测试失败: 应该抛出错误')
    return false
  } catch (error) {
    console.log('✅ 错误处理测试成功: 正确捕获了错误')
    return true
  }
}

/**
 * 测试类型安全
 */
export const testTypeSafety = async () => {
  console.log('🧪 测试类型安全...')
  
  try {
    // 这里应该有完整的类型提示和检查
    const response = await httpGet<TestUser>('/api/user/1')
    
    // TypeScript 应该能够推断出 response.result 的类型为 TestUser
    const user = response.result
    console.log('✅ 类型安全测试成功:', {
      id: user.id,
      name: user.name,
      email: user.email
    })
    return true
  } catch (error) {
    console.error('❌ 类型安全测试失败:', error)
    return false
  }
}

/**
 * 测试并发请求
 */
export const testConcurrentRequests = async () => {
  console.log('🧪 测试并发请求...')
  
  try {
    const promises = [
      httpGet<TestUser[]>('/api/users'),
      httpGet<any>('/api/posts'),
      httpGet<any>('/api/comments'),
    ]
    
    const results = await Promise.all(promises)
    console.log('✅ 并发请求测试成功:', results.length)
    return true
  } catch (error) {
    console.error('❌ 并发请求测试失败:', error)
    return false
  }
}

/**
 * 运行所有测试
 */
export const runAllTests = async () => {
  console.log('🚀 开始运行 HTTP 工具测试...')
  
  const tests = [
    { name: '基本 GET 请求', test: testBasicGet },
    { name: 'POST 请求', test: testPost },
    { name: '自定义配置', test: testCustomConfig },
    { name: '重试机制', test: testRetry },
    { name: '错误处理', test: testErrorHandling },
    { name: '类型安全', test: testTypeSafety },
    { name: '并发请求', test: testConcurrentRequests },
  ]
  
  const results = []
  
  for (const { name, test } of tests) {
    console.log(`\n📋 运行测试: ${name}`)
    const result = await test()
    results.push({ name, passed: result })
  }
  
  console.log('\n📊 测试结果汇总:')
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`)
  })
  
  const passedCount = results.filter(r => r.passed).length
  const totalCount = results.length
  
  console.log(`\n🎯 总计: ${passedCount}/${totalCount} 个测试通过`)
  
  return {
    passed: passedCount,
    total: totalCount,
    success: passedCount === totalCount
  }
}

// 导出测试函数供外部调用
export default {
  runAllTests,
  testBasicGet,
  testPost,
  testCustomConfig,
  testRetry,
  testErrorHandling,
  testTypeSafety,
  testConcurrentRequests,
}
