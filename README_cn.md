# 🎯 Quota Manager Frontend

> 基于 Vue 3 + Element Plus 的配额管理系统前端

## 📖 项目简介

Quota Manager Frontend 是一个现代化的配额管理系统前端应用，提供直观的用户界面用于管理配额策略、审计记录和系统设置。

### ✨ 主要功能

- 🎛️ **仪表板** - 系统概览和快速操作
- 📊 **策略管理** - 配额策略的创建、编辑、删除和执行
- 🔍 **用户审计** - 配额使用记录和审计日志
- ⚙️ **系统设置** - API配置和系统参数设置

### 🛠️ 技术栈

- **框架**: Vue 3 (Composition API)
- **UI组件**: Element Plus
- **构建工具**: Vite
- **HTTP客户端**: Axios
- **路由**: Vue Router
- **样式**: CSS3 + Flexbox

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装依赖

```bash
npm install
```

### 开发环境启动

```bash
npm run dev
```

访问 `http://localhost:3000` (端口可能会自动调整)

### 生产环境构建

```bash
npm run build
```

构建文件将输出到 `dist/` 目录

## 🔧 配置管理

### 统一配置系统

项目采用统一的配置管理系统，所有配置都集中在根目录的 `app.config.js` 文件中：

#### 配置模块
- **API配置**: 后端地址、超时时间、认证等
- **UI配置**: 布局尺寸、表格设置、表单配置等
- **功能开关**: 自动刷新、暗黑模式、调试模式等
- **错误处理**: 错误消息、状态码映射等
- **缓存管理**: 存储键名、过期时间等

#### 使用方法

```javascript
// 导入配置
import { API_CONFIG, UI_CONFIG, getApiUrl } from '@config'

// 使用示例
const apiUrl = getApiUrl('/strategies')
const pageSize = UI_CONFIG.TABLE.DEFAULT_PAGE_SIZE
```

#### 工具函数

```javascript
import {
  getApiUrl,          // 构建API完整URL
  isFeatureEnabled,   // 检查功能是否启用
  getCacheValue,      // 获取缓存值
  setCacheValue,      // 设置缓存值
  getErrorMessage     // 获取标准化错误消息
} from '@config'
```

### 环境变量配置

创建 `.env.local` 文件来覆盖默认配置：

```bash
# =================================
# API 配置
# =================================
VITE_API_BASE_URL=http://localhost:8099
VITE_API_TIMEOUT=10000

# =================================
# 功能开关
# =================================
VITE_ENABLE_AUTO_REFRESH=true
VITE_ENABLE_DARK_MODE=false
VITE_DEBUG_MODE=false

# =================================
# 开发配置
# =================================
VITE_DEV_PORT=3000
```

#### 配置优先级
1. **环境变量** (最高) - `.env.local`、`.env` 文件
2. **默认配置** (最低) - `app.config.js` 中的默认值

## 📁 项目结构

```
/
├── app.config.js          # 🎯 统一配置文件
└── src/
    ├── assets/           # 静态资源
    │   ├── main.css     # 主样式文件
    │   └── base.css     # 基础样式
    ├── components/      # 公共组件
    ├── router/          # 路由配置
    ├── services/        # API服务
    │   └── api.js       # API接口定义
    ├── views/           # 页面组件
    │   ├── Dashboard.vue     # 仪表板
    │   ├── StrategyList.vue  # 策略列表
    │   ├── StrategyDetail.vue # 策略详情
    │   ├── UserAudit.vue     # 用户审计
    │   └── Settings.vue      # 系统设置
    ├── App.vue          # 根组件
    └── main.js          # 入口文件
```

## 🔌 API 接口

### 后端集成

项目通过 Axios 与后端 API 通信，所有接口都遵循统一的响应格式：

```javascript
{
  "code": "success",               // 状态码 (字符串格式)
  "message": "Operation success",   // 消息 (英文)
  "success": true,                 // 操作是否成功
  "data": { ... }                  // 响应数据 (可选)
}
```

### 主要接口

- **策略管理**: 策略的CRUD操作、启用/禁用、扫描触发
- **配额管理**: 用户配额查询、转入/转出操作
- **审计记录**: 配额使用记录和审计日志查询

## 🎨 界面设计

### 响应式布局

- ✅ 全屏显示，充满整个浏览器窗口
- ✅ 侧边栏 + 主内容区域布局
- ✅ 统一的页面头部设计
- ✅ 适配不同屏幕尺寸

### 组件样式

- **表格**: 分页、排序、筛选功能
- **表单**: 统一的标签宽度和验证样式
- **按钮**: 一致的尺寸和间距
- **消息提示**: 标准化的错误和成功提示

## 🔍 开发指南

### 推荐 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (禁用 Vetur)

### 代码规范

- 使用 Vue 3 Composition API
- 统一使用配置系统而非硬编码
- 遵循 Element Plus 组件规范
- 保持代码简洁和可读性

### 最佳实践

#### ✅ 推荐做法
- 使用根目录的配置文件 `app.config.js`
- 通过环境变量覆盖配置
- 使用 `@config` 别名导入配置
- 使用工具函数进行配置操作
- 为新配置项提供合理的默认值
- 使用语义化的变量和函数命名

#### ❌ 避免做法
- 在组件中硬编码配置值
- 直接修改配置对象
- 忽略环境变量前缀 `VITE_`
- 在生产环境开启调试模式

## 🚨 故障排查

### 常见问题

#### 1. 环境变量不生效
- ✅ 确保变量名以 `VITE_` 开头
- ✅ 重启开发服务器
- ✅ 检查 `.env.local` 文件位置

#### 2. 配置缓存问题
- ✅ 清除浏览器 LocalStorage
- ✅ 使用硬刷新 (Ctrl+Shift+R)

#### 3. 配置验证失败
- ✅ 查看浏览器控制台错误信息
- ✅ 检查必需配置项是否为空

#### 4. 接口请求失败
- ✅ 确认后端服务是否启动
- ✅ 检查 API 地址配置是否正确
- ✅ 查看网络请求的详细错误信息

### 调试技巧

```javascript
// 开发环境下打印配置信息
if (ENV_CONFIG.IS_DEV) {
  console.log('Current config:', {
    API_CONFIG,
    UI_CONFIG,
    FEATURE_CONFIG
  })
}
```

## 🚀 部署指南

### 1. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 或使用 Makefile
make dev
```

### 2. Docker 部署

#### 单独运行前端
```bash
# 构建 Docker 镜像
make docker-build

# 运行容器
make docker-run

# 访问应用
curl http://localhost:3000/health
```

#### 使用 Docker Compose
```bash
# 启动所有服务
make compose-up

# 查看日志
docker-compose logs -f

# 停止服务
make compose-down
```

### 3. Kubernetes 部署

#### 前提条件
- Kubernetes 集群已就绪
- kubectl 已配置
- 镜像已推送到容器仓库

#### 部署步骤
```bash
# 一键部署（构建、推送、部署）
make deploy

# 或分步执行
make docker-build    # 构建镜像
make docker-push     # 推送镜像
make k8s-apply       # 部署到 K8s

# 查看部署状态
kubectl get pods,svc,ingress -n shenma -l app=quota-manager-frontend

# 查看日志
kubectl logs -f -n shenma -l app=quota-manager-frontend
```

## 📁 部署文件说明

### Docker 相关
- `Dockerfile` - 多阶段构建配置
- `nginx.conf` - Nginx 服务器配置
- `docker-compose.yml` - 本地开发环境配置
- `.dockerignore` - Docker 构建忽略文件

### Kubernetes 相关
- `k8s-deployment.yaml` - K8s 部署配置，包含：
  - ConfigMap: 前端配置
  - Deployment: 应用部署
  - Service: 服务暴露
  - Ingress: 外部访问
  - HPA: 自动扩缩容

### 构建工具
- `Makefile` - 简化常用命令
- `package.json` - 包含 Docker 和 K8s 相关脚本

## 🔧 部署配置说明

### 环境变量
| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `VITE_API_BASE_URL` | 后端 API 地址 | `http://quota-manager-svc:8080` |
| `TZ` | 时区设置 | `Asia/Shanghai` |

### 资源配置
| 资源 | 请求值 | 限制值 |
|------|--------|--------|
| CPU | 100m | 500m |
| Memory | 128Mi | 512Mi |

### 网络配置
- 容器端口: 80
- 服务端口: 80
- 健康检查: `/health`

## 🌐 访问方式

### 本地开发
- 开发服务器: `http://localhost:3005`
- Docker 容器: `http://localhost:3000`

### Kubernetes 环境
- 集群内访问: `http://quota-manager-frontend-svc.shenma.svc.cluster.local`
- Ingress 访问: `http://quota-manager.shenma.local` (需配置 DNS)

## 🛠 开发工作流

### 日常开发
```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装/更新依赖
npm install

# 3. 启动开发服务器
make dev

# 4. 开发完成后构建测试
make build
```

### 发布流程
```bash
# 1. 更新版本号（在 Makefile 中）
vim Makefile

# 2. 构建和部署
make deploy

# 3. 验证部署
kubectl get pods -n shenma -l app=quota-manager-frontend
```

## 📊 监控与日志

### 查看日志
```bash
# Docker Compose
docker-compose logs -f quota-manager-frontend

# Kubernetes
kubectl logs -f -n shenma deployment/quota-manager-frontend
```

### 监控指标
- CPU 使用率
- 内存使用率
- HTTP 响应时间
- 错误率

## 🔒 安全配置

### Nginx 安全头
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Content-Security-Policy: 已配置

### 容器安全
- 使用非 root 用户运行
- 最小化镜像层
- 定期更新基础镜像

## 📈 性能优化

### 前端优化
- Gzip 压缩启用
- 静态资源缓存策略
- 代码分割和懒加载

### Kubernetes 优化
- HPA 自动扩缩容
- 资源限制配置
- 就绪和存活探针

## 🚨 部署故障排查

### 常见问题

#### 1. 构建失败
```bash
# 检查 Node.js 版本
node --version

# 清理缓存重试
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 2. Docker 运行失败
```bash
# 查看容器日志
docker logs quota-manager-frontend

# 进入容器调试
docker exec -it quota-manager-frontend sh
```

#### 3. K8s 部署失败
```bash
# 查看 Pod 状态
kubectl describe pod -n shenma -l app=quota-manager-frontend

# 查看事件
kubectl get events -n shenma --sort-by='.lastTimestamp'
```

### 健康检查
```bash
# 本地检查
curl http://localhost:3000/health

# K8s 检查
kubectl exec -n shenma deploy/quota-manager-frontend -- curl http://localhost/health
```

## 📝 更新日志

### v1.0.0 (Latest)
- ✅ 建立统一配置管理系统
- ✅ 完善界面布局和响应式设计
- ✅ 实现策略管理功能
- ✅ 添加用户审计功能
- ✅ 完善系统设置页面
- ✅ 优化用户体验和视觉设计
- ✅ 完整的 Docker 和 Kubernetes 部署支持
- ✅ 生产级 Nginx 配置和安全优化
- ✅ 自动扩缩容和监控配置

## 🆘 支持与联系

如遇问题，请联系：
- 开发团队: ShenMA AI Team
- 项目仓库: [项目地址]
- 文档地址: [文档地址]

## 📞 技术支持

### 获取帮助
- 查看浏览器控制台错误信息
- 检查网络请求状态
- 确认配置文件语法正确

### 贡献代码
欢迎提交 Issues 和 Pull Requests 来改进项目。

---

## 📄 许可证

本项目基于 Apache-2.0 许可证开源。详情请参阅 LICENSE 文件。

---

**Quota Manager Frontend** © 2025 Sangfor Technologies
