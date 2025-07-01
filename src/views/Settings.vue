<template>
  <div class="settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Configure system settings</p>
    </div>

    <!-- API配置 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>API Configuration</span>
        </div>
      </template>

      <el-form
        ref="apiFormRef"
        :model="apiForm"
        :rules="apiFormRules"
        label-width="150px"
        @submit.prevent="saveApiSettings"
      >
        <el-form-item label="Base URL" prop="baseUrl">
          <el-input
            v-model="apiForm.baseUrl"
            placeholder="http://localhost:8080"
          />
          <div class="form-tip">
            The base URL of quota-manager backend service
          </div>
        </el-form-item>

        <el-form-item label="API Prefix" prop="apiPrefix">
          <el-input
            v-model="apiForm.apiPrefix"
            placeholder="/quota-manager/api/v1"
          />
          <div class="form-tip">
            API path prefix
          </div>
        </el-form-item>

        <el-form-item label="Request Timeout" prop="timeout">
          <div class="input-with-unit">
            <el-input-number
              v-model="apiForm.timeout"
              :min="1000"
              :max="60000"
              :step="1000"
              style="width: 200px;"
            />
            <span class="unit-text">milliseconds</span>
          </div>
          <div class="form-tip">
            HTTP request timeout in milliseconds
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveApiSettings" :loading="saving">
            Save Settings
          </el-button>
          <el-button @click="resetApiSettings">Reset to Default</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 应用配置 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>Application Configuration</span>
        </div>
      </template>

      <el-form
        ref="appFormRef"
        :model="appForm"
        :rules="appFormRules"
        label-width="150px"
        @submit.prevent="saveAppSettings"
      >
        <el-form-item label="Page Size" prop="pageSize">
          <el-select v-model="appForm.pageSize" style="width: 200px;">
            <el-option label="10" :value="10" />
            <el-option label="20" :value="20" />
            <el-option label="50" :value="50" />
            <el-option label="100" :value="100" />
          </el-select>
          <div class="form-tip">
            Default page size for data tables
          </div>
        </el-form-item>

        <el-form-item label="Auto Refresh" prop="autoRefresh">
          <div class="input-with-status">
            <el-switch v-model="appForm.autoRefresh" />
            <span class="status-text">
              {{ appForm.autoRefresh ? 'Enabled' : 'Disabled' }}
            </span>
          </div>
          <div class="form-tip">
            Automatically refresh data every few minutes
          </div>
        </el-form-item>

        <el-form-item label="Refresh Interval" prop="refreshInterval" v-if="appForm.autoRefresh">
          <div class="input-with-unit">
            <el-input-number
              v-model="appForm.refreshInterval"
              :min="30"
              :max="600"
              :step="30"
              style="width: 200px;"
            />
            <span class="unit-text">seconds</span>
          </div>
          <div class="form-tip">
            Data refresh interval when auto refresh is enabled
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveAppSettings" :loading="saving">
            Save Settings
          </el-button>
          <el-button @click="resetAppSettings">Reset to Default</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 系统信息 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>System Information</span>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="Frontend Version">{{ systemInfo.frontendVersion }}</el-descriptions-item>
        <el-descriptions-item label="Current API URL" :span="2">
          {{ currentApiUrl }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 环境变量说明 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>Environment Variables</span>
        </div>
      </template>

      <div class="env-description">
        <p>You can also configure the API settings using environment variables:</p>
        <el-table :data="envVariables" style="width: 100%">
          <el-table-column prop="name" label="Variable Name" width="250" />
          <el-table-column prop="description" label="Description" />
          <el-table-column prop="example" label="Example" width="200" />
        </el-table>
        <div class="env-note">
          <el-alert
            title="Note"
            type="info"
            :closable="false"
            description="Environment variables take precedence over settings stored in localStorage. Refresh the page after changing environment variables."
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { API_CONFIG } from '@config'
import { updateApiConfig } from '@/services/api.js'

// 响应式数据
const apiFormRef = ref()
const appFormRef = ref()
const saving = ref(false)

// API配置表单
const apiForm = reactive({
  baseUrl: '',
  apiPrefix: '',
  timeout: 10000
})

// 应用配置表单
const appForm = reactive({
  pageSize: 10,
  autoRefresh: false,
  refreshInterval: 60
})

// 系统信息
const systemInfo = reactive({
  frontendVersion: '1.0.0'
})

// 环境变量说明
const envVariables = [
  {
    name: 'VITE_API_BASE_URL',
    description: 'Quota manager backend base URL',
    example: 'http://localhost:8080'
  }
]

// 表单验证规则
const apiFormRules = {
  baseUrl: [
    { required: true, message: 'Please enter base URL', trigger: 'blur' },
    { type: 'url', message: 'Please enter a valid URL', trigger: 'blur' }
  ],
  apiPrefix: [
    { required: true, message: 'Please enter API prefix', trigger: 'blur' }
  ],
  timeout: [
    { required: true, message: 'Please enter timeout', trigger: 'blur' },
    { type: 'number', min: 1000, max: 60000, message: 'Timeout must be between 1000-60000ms', trigger: 'blur' }
  ]
}

const appFormRules = {
  pageSize: [
    { required: true, message: 'Please select page size', trigger: 'change' }
  ],
  refreshInterval: [
    { required: true, message: 'Please enter refresh interval', trigger: 'blur' },
    { type: 'number', min: 30, max: 600, message: 'Interval must be between 30-600 seconds', trigger: 'blur' }
  ]
}

// 计算属性
const currentApiUrl = computed(() => {
  return `${apiForm.baseUrl}${apiForm.apiPrefix}`
})

// 方法
const loadSettings = () => {
  // 加载API设置
  apiForm.baseUrl = localStorage.getItem('api_base_url') || API_CONFIG.BASE_URL
  apiForm.apiPrefix = localStorage.getItem('api_prefix') || API_CONFIG.API_PREFIX
  apiForm.timeout = parseInt(localStorage.getItem('api_timeout')) || API_CONFIG.TIMEOUT

  // 加载应用设置
  appForm.pageSize = parseInt(localStorage.getItem('app_page_size')) || 10
  appForm.autoRefresh = localStorage.getItem('app_auto_refresh') === 'true'
  appForm.refreshInterval = parseInt(localStorage.getItem('app_refresh_interval')) || 60
}

const saveApiSettings = async () => {
  try {
    await apiFormRef.value.validate()
    saving.value = true

    // 保存到localStorage
    localStorage.setItem('api_base_url', apiForm.baseUrl)
    localStorage.setItem('api_prefix', apiForm.apiPrefix)
    localStorage.setItem('api_timeout', apiForm.timeout.toString())

    // 立即更新API配置，无需刷新页面
    updateApiConfig()

    ElMessage.success('API settings saved and applied successfully!')
  } catch (error) {
    if (error !== false) {
      ElMessage.error('Failed to save API settings')
    }
  } finally {
    saving.value = false
  }
}

const saveAppSettings = async () => {
  try {
    await appFormRef.value.validate()
    saving.value = true

    // 保存到localStorage
    localStorage.setItem('app_page_size', appForm.pageSize.toString())
    localStorage.setItem('app_auto_refresh', appForm.autoRefresh.toString())
    localStorage.setItem('app_refresh_interval', appForm.refreshInterval.toString())

    ElMessage.success('Application settings saved successfully')
  } catch (error) {
    if (error !== false) {
      ElMessage.error('Failed to save application settings')
    }
  } finally {
    saving.value = false
  }
}

const resetApiSettings = () => {
  apiForm.baseUrl = API_CONFIG.BASE_URL
  apiForm.apiPrefix = API_CONFIG.API_PREFIX
  apiForm.timeout = API_CONFIG.TIMEOUT
}

const resetAppSettings = () => {
  appForm.pageSize = 10
  appForm.autoRefresh = false
  appForm.refreshInterval = 60
}

// 组件挂载时加载设置
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings {
  min-height: calc(100vh - 120px);
}

.page-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.page-title {
  font-size: 24px;
  color: #303133;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.page-subtitle {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.settings-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-tip {
  font-size: 13px;
  color: #909399;
  margin-top: 12px;
  line-height: 1.4;
  font-style: italic;
  background-color: #f9f9f9;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid #e4e7ed;
  display: block;
  width: 100%;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-with-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.unit-text, .status-text {
  color: #909399;
  font-size: 14px;
}

.env-description {
  color: #606266;
}

.env-description p {
  margin-bottom: 15px;
}

.env-note {
  margin-top: 15px;
}
</style>