import axios from 'axios'
import { API_CONFIG, getApiUrl, getDynamicApiConfig } from '@config'
import { ElMessage } from 'element-plus'

// 获取动态配置
let dynamicConfig = getDynamicApiConfig()

// 创建axios实例
const api = axios.create({
  baseURL: dynamicConfig.BASE_URL,
  timeout: dynamicConfig.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 更新API配置的方法
export function updateApiConfig() {
  dynamicConfig = getDynamicApiConfig()

  // 更新axios实例的配置
  api.defaults.baseURL = dynamicConfig.BASE_URL
  api.defaults.timeout = dynamicConfig.TIMEOUT

  console.log('API configuration updated:', {
    baseURL: dynamicConfig.BASE_URL,
    timeout: dynamicConfig.TIMEOUT
  })
}

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 这里可以添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    const data = response.data
    if (data.success) {
      return data
    } else {
      ElMessage.error(data.message || 'Request failed')
      return Promise.reject(new Error(data.message || 'Request failed'))
    }
  },
  error => {
    const message = error.response?.data?.message || error.message || 'Network error'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 策略相关API
export const strategyApi = {
  // 获取策略列表
  getStrategies(params = {}) {
    return api.get(getApiUrl('/strategies'), { params })
  },

  // 获取单个策略
  getStrategy(id) {
    return api.get(getApiUrl(`/strategies/${id}`))
  },

  // 创建策略
  createStrategy(data) {
    return api.post(getApiUrl('/strategies'), data)
  },

  // 更新策略
  updateStrategy(id, data) {
    return api.put(getApiUrl(`/strategies/${id}`), data)
  },

  // 删除策略
  deleteStrategy(id) {
    return api.delete(getApiUrl(`/strategies/${id}`))
  },

  // 启用策略
  enableStrategy(id) {
    return api.post(getApiUrl(`/strategies/${id}/enable`))
  },

  // 禁用策略
  disableStrategy(id) {
    return api.post(getApiUrl(`/strategies/${id}/disable`))
  },

  // 触发策略扫描
  triggerScan() {
    return api.post(getApiUrl('/strategies/scan'))
  },

  // 获取策略执行记录
  getStrategyExecutions(id, params = {}) {
    return api.get(getApiUrl(`/strategies/${id}/executions`), { params })
  }
}

// 配额相关API
export const quotaApi = {
  // 获取用户配额
  getUserQuota() {
    return api.get(getApiUrl('/quota'))
  },

  // 获取用户配额审计记录
  getQuotaAuditRecords(params = {}) {
    return api.get(getApiUrl('/quota/audit'), { params })
  },

  // 管理员查询指定用户配额审计记录
  getUserQuotaAuditRecords(userId, params = {}) {
    return api.get(getApiUrl(`/quota/audit/${userId}`), { params })
  },

  // 转出配额
  transferOut(data) {
    return api.post(getApiUrl('/quota/transfer-out'), data)
  },

  // 转入配额
  transferIn(data) {
    return api.post(getApiUrl('/quota/transfer-in'), data)
  }
}

// 系统相关API
export const systemApi = {
  // 移除了健康检查功能
}

export default api