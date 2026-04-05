# HTTP 工具优化说明

## 概述

这是一个为 uni-app 项目优化的 HTTP 请求工具，提供了完整的请求管理、错误处理、重试机制和类型安全支持。

## 主要优化内容

### 1. 🔧 配置管理
- 集中化配置管理（超时时间、重试次数等）
- 支持环境变量配置
- 可扩展的配置选项

### 2. 🛡️ 错误处理
- 完善的 HTTP 状态码错误映射
- 统一的错误提示机制
- 401 错误自动跳转登录
- 业务错误码处理

### 3. 🔄 重试机制
- 可配置的自动重试
- 智能重试策略（避免 401 错误重试）
- 重试延迟控制

### 4. 🚫 重复请求防护
- 自动检测并阻止重复请求
- 请求状态管理
- 内存优化的请求记录

### 5. 📝 日志系统
- 开发环境详细日志
- 请求/响应时间统计
- 错误日志记录

### 6. 🎨 用户体验
- 可控制的加载提示
- 自定义加载文本
- 可选的错误提示显示

### 7. 📁 文件上传
- 专门的文件上传函数
- 上传进度提示
- 错误处理

### 8. 🔒 类型安全
- 完整的 TypeScript 类型定义
- 泛型支持
- 接口约束

## 使用方法

### 基本请求

```typescript
import { http, httpGet, httpPost } from '@/utils/http'

// GET 请求
const data = await httpGet<UserInfo>('/api/user/123')

// POST 请求
const result = await httpPost<CreateResult>('/api/users', {
  name: '张三',
  email: 'zhangsan@example.com'
})
```

### 自定义配置

```typescript
const response = await http<any>({
  url: '/api/data',
  method: 'GET',
  showLoading: false,     // 不显示加载提示
  showError: false,       // 不显示错误提示
  enableRetry: true,      // 启用重试
  retryCount: 3,          // 重试 3 次
  enableLog: true,        // 启用日志
  loadingText: '加载中...', // 自定义加载文本
})
```

### 文件上传

```typescript
import { uploadFile } from '@/utils/http'

const result = await uploadFile({
  url: '/api/upload',
  filePath: 'path/to/file',
  name: 'avatar',
  formData: { userId: '123' },
  loadingText: '上传中...'
})
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showLoading` | boolean | true | 是否显示加载提示 |
| `loadingText` | string | '加载中...' | 加载提示文本 |
| `showError` | boolean | true | 是否显示错误提示 |
| `enableRetry` | boolean | true | 是否启用重试 |
| `retryCount` | number | 2 | 重试次数 |
| `enableLog` | boolean | true | 是否启用日志 |

## 错误处理

工具会自动处理以下错误情况：

1. **网络错误**: 显示"网络连接失败"提示
2. **401 未授权**: 自动清除用户信息并跳转登录页
3. **其他 HTTP 错误**: 根据状态码显示相应错误信息
4. **业务错误**: 根据响应中的 `msg` 字段显示错误信息

## 重试策略

- 默认重试 2 次，间隔 1 秒
- 401 错误不会重试（避免无效重试）
- 可通过配置自定义重试次数和延迟

## 类型定义

```typescript
interface HttpOptions extends UniApp.RequestOptions {
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
  enableRetry?: boolean
  retryCount?: number
  enableLog?: boolean
}

interface ApiResponse<T = any> {
  code: string
  msg: string
  result: T
}
```

## 最佳实践

1. **使用类型泛型**: 为请求指定返回数据类型
2. **合理使用重试**: 对于幂等操作启用重试，非幂等操作禁用
3. **静默请求**: 后台同步等操作使用静默模式
4. **错误处理**: 在业务层面处理特定错误情况
5. **日志控制**: 生产环境可考虑禁用详细日志

## 迁移指南

从旧版本迁移只需要：

1. 导入新的 HTTP 工具
2. 原有的 `http()` 调用保持不变
3. 可选择性地使用新的便捷方法和配置选项

旧代码完全兼容，无需修改即可享受新功能。
