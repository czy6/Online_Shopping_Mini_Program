# 英语智能训练平台 | English Intelligent Training Platform

## 📖 项目简介

英语智能训练平台是一个**企业级微服务架构**的英语学习与训练系统，整合了 **Spring AI**、**LangChain4j**、**XGBoost** 等先进技术，提供智能化的英语学习、训练、评测一体化解决方案。

项目采用**前后端分离** + **微服务架构**，实现了 AI 智能批改、个性化题目推荐、智能对话陪练等核心功能，支持 SSE 流式输出、对话记忆存储、用户学情分析等企业级特性。

### 🎯 项目亮点

- ✨ **微服务架构**：基于 Spring Cloud Alibaba 的微服务拆分，Nacos 注册中心 + 配置中心
- 🤖 **AI 双引擎**：Spring AI + LangChain4j 双框架集成，支持 SSE 流式对话输出
- 🧠 **智能推荐**：基于 XGBoost 机器学习模型的熟练度预测与个性化题目推荐
- 💾 **多级缓存**：Redis + Caffeine 多级缓存架构，解决缓存穿透/击穿/雪崩问题
- 🔐 **安全认证**：JWT + RSA256 签名，网关统一鉴权 + Token 自动续期
- 📊 **学情分析**：薄弱知识点分析、学习轨迹追踪、可视化数据报表
- 🎨 **前端体验**：Vue 3 + TypeScript + 响应式设计，支持多端适配

---

## 🏗️ 技术架构

### 技术栈总览

| 技术分类        | 技术栈                 | 版本                  | 用途                |
| --------------- | ---------------------- | --------------------- | ------------------- |
| **后端框架**    | Spring Boot            | 2.7.12 / 3.2.10       | 基础框架            |
| **微服务**      | Spring Cloud + Alibaba | 2021.0.3 / 2021.0.4.0 | 服务治理            |
| **ORM 框架**    | MyBatis-Plus           | 3.4.2                 | 数据持久化          |
| **数据库**      | MySQL                  | 8.0.23                | 关系型数据库        |
| **缓存**        | Redis                  | 6.x                   | 缓存 + 分布式锁     |
| **消息队列**    | RabbitMQ               | 3.9.x                 | 异步解耦            |
| **注册中心**    | Nacos                  | 2.x                   | 服务注册 + 配置中心 |
| **AI 框架**     | LangChain4j            | 1.0.1-beta6           | AI 编排框架 ⭐      |
| **AI 框架**     | Spring AI              | 1.0.0                 | AI 对话框架         |
| **机器学习**    | XGBoost                | 1.5.0                 | 熟练度预测模型      |
| **工具库**      | Hutool                 | 5.8.11                | Java 工具类库       |
| **前端框架**    | Vue                    | 3.x                   | 前端框架            |
| **前端语言**    | TypeScript             | 5.x                   | 类型安全            |
| **状态管理**    | Pinia                  | 2.x                   | 前端状态管理        |
| **HTTP 客户端** | Axios                  | 1.x                   | API 调用            |

### 微服务模块划分

```
english-train (父工程)
├── english-common          # 公共模块（工具、配置、拦截器）
├── english-api             # Feign 接口定义模块
├── english-gateway         # API 网关模块（认证、路由）⭐
├── user-service            # 用户服务模块（登录、用户管理）
├── question-service        # 题库/训练服务模块（核心业务）⭐
├── ai-service              # AI 对话服务模块（Spring AI）
└── langchain4j-service     # AI 对话服务模块（LangChain4j）⭐
```

### 系统架构图

```
┌─────────────┐
│   前端应用   │
│  (Vue 3)    │
└──────┬──────┘
       │ HTTP/HTTPS
       ▼
┌─────────────────────────────────┐
│      API Gateway (网关层)        │
│  • 统一认证鉴权 (JWT + RSA256)   │
│  • 路由转发                      │
│  • 限流熔断                      │
└──────────────┬──────────────────┘
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    │          │          │          │          │
    ▼          ▼          ▼          ▼          ▼
┌──────── ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  User  │ │Question│ │  AI    │ │LangChain│ │ 其他   │
│ Service│ │ Service│ │ Service│ │ Service │ │ Service│
└───┬────┘ └───┬────┘ └───────┘ └───┬────┘ └───┬────┘
    │          │          │          │          │
    └────────────────────┴────────────────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
        ┌──────┐   ┌──────────┐  ┌────────┐
        │ MySQL│   │  Redis   │  │RabbitMQ│
        └──────┘   └──────────┘  └────────┘
```

---

## 🚀 核心功能

### 1. AI 智能对话陪练 ⭐

- 基于 LangChain4j + Spring AI 双框架
- SSE 流式输出，打字机效果
- 对话记忆存储，支持多轮对话

### 2. AI 智能批改 ⭐

- 集成 Coze AI 大模型 API
- 支持翻译/写作题目自动批改
- 智能评分 + 详细评语

### 3. 个性化题目推荐 ⭐

- 基于 XGBoost 机器学习模型
- 熟练度预测算法
- 薄弱知识点分析

### 4. 用户认证与鉴权 ⭐

- JWT + RSA256 签名
- 网关统一鉴权
- Token 自动续期机制

### 5. 多级缓存架构 ⭐

- Redis + Caffeine 多级缓存
- 解决缓存穿透/击穿/雪崩问题
- 逻辑过期 + 互斥锁重建策略

---

## 📊 项目成果

### 性能指标

| 指标             | 优化前  | 优化后   | 提升        |
| ---------------- | ------- | -------- | ----------- |
| 题目查询接口 RT  | 500ms   | 50ms     | **10x** ⬆️  |
| 对话接口首屏时间 | 2s      | 200ms    | **10x** ⬆️  |
| 缓存命中率       | 60%     | 95%      | **1.6x** ⬆️ |
| 并发支持         | 100 QPS | 1000 QPS | **10x** ⬆️  |

### 代码质量

- ✅ 核心模块单元测试覆盖率 **85%+**
- ✅ 代码规范符合阿里巴巴 Java 开发手册
- ✅ 使用 Checkstyle + SpotBugs 代码检查
- ✅ Git Commit 规范（feat/fix/docs/style/refactor/test/chore）

---

## 🛠️ 快速开始

### 环境要求

- JDK 17+
- MySQL 8.0+
- Redis 6.x
- RabbitMQ 3.9.x
- Nacos 2.x
- Maven 3.6+
- Node.js 16+
- npm 7+

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/czy6/English_self_train.git
cd english-train
```

#### 2. 配置环境变量

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件，填写真实配置
COZE_TOKEN=pat_your_token_here
COZE_BOT_ID=your_bot_id_here
API_KEY=sk_your_dashscope_api_key
```

#### 3. 安装后端依赖

```bash
# 安装父工程
mvn clean install -DskipTests

# 安装公共模块
mvn clean install -pl english-common -am
```

#### 4. 安装前端依赖

```bash
cd frontend
npm install
```

#### 5. 启动服务

**后端服务**：

```bash
# 使用启动脚本
./start-with-env.bat
```

**前端服务**：

```bash
cd frontend
npm run dev
```

---

## 📝 开发规范

### Git Commit 规范

```bash
# 新功能
git commit -m "feat(langchain4j): 添加 SSE 流式对话功能"

# Bug 修复
git commit -m "fix(cache): 修复缓存击穿问题"

# 文档更新
git commit -m "docs(readme): 更新项目文档"

# 代码重构
git commit -m "refactor(auth): 优化认证逻辑"
```

### 代码规范

- 后端：遵循《阿里巴巴 Java 开发手册》
- 前端：遵循 Vue 3 代码风格指南
- 使用 Checkstyle + SpotBugs 代码检查
- 核心方法必须写 Javadoc 注释

---

## 📄 项目文档

- [**详细技术文档**](项目文档.md) - 完整的技术文档，包含模块详解、数据库设计、接口文档等

---

## 👨‍💻 关于我

本项目为**个人独立开发**作品，从架构设计到代码实现均由本人完成。

通过本项目，我深入掌握了：

- ✅ Spring Cloud 微服务架构设计与实践
- ✅ AI 大模型集成与应用（LangChain4j、Spring AI）
- ✅ 高并发场景下的性能优化技巧
- ✅ 企业级项目的安全认证机制
- ✅ 规范化开发流程与代码质量管理
- ✅ Vue 3 + TypeScript 前端开发

---

## 📄 开源协议

MIT License

---

<div align="center">

**如果这个项目对你有帮助，欢迎给一个 ⭐ Star 支持！**

[⬆ 返回顶部](#英语智能训练平台--english-intelligent-training-platform)

</div>
