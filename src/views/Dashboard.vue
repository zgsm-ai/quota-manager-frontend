<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Quota Manager Dashboard</h1>
      <p>Welcome to the Quota Management System</p>
    </div>

            <!-- Statistics Cards Area -->
    <div class="stats-section">
      <div class="stats-grid">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon size="40" color="#409EFF"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalStrategies }}</div>
              <div class="stat-label">Total Strategies</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon size="40" color="#67C23A"><Check /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.enabledStrategies }}</div>
              <div class="stat-label">Enabled Strategies</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon size="40" color="#E6A23C"><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalExecutions }}</div>
              <div class="stat-label">Total Executions</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

        <!-- Quick Actions Area -->
    <div class="actions-section">
      <div class="actions-grid">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>Quick Actions</h3>
            </div>
          </template>
          <div class="action-buttons">
            <el-button
              type="primary"
              :icon="Document"
              @click="goToStrategies"
              size="large"
            >
              Manage Strategies
            </el-button>
            <el-button
              type="success"
              :icon="Refresh"
              @click="refreshData"
              :loading="loading"
              size="large"
            >
              Refresh Data
            </el-button>
            <el-button
              type="info"
              :icon="User"
              @click="goToUserAudit"
              size="large"
            >
              User Audit
            </el-button>
            <el-button
              type="warning"
              :icon="Setting"
              @click="goToSettings"
              size="large"
            >
              Settings
            </el-button>
          </div>
        </el-card>

        <el-card>
          <template #header>
            <div class="card-header">
              <h3>System Status</h3>
            </div>
          </template>
          <div class="status-info">
            <div class="status-item">
              <span class="status-label">API Status:</span>
              <el-tag :type="apiStatusType" size="small">{{ apiStatus }}</el-tag>
            </div>
            <div class="status-item">
              <span class="status-label">Last Updated:</span>
              <span>{{ lastUpdated }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">System Version:</span>
              <span>v1.0.0</span>
            </div>
            <div class="status-item">
              <span class="status-label">Environment:</span>
              <el-tag size="small">Development</el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="activity-section">
      <el-card class="activity-card">
        <template #header>
          <div class="card-header">
            <h3>Recent Activity</h3>
            <el-button text @click="refreshData">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="activity in recentActivities"
            :key="activity.id"
            :timestamp="activity.timestamp"
            type="primary"
          >
            {{ activity.description }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Document,
  Check,
  TrendCharts,
  Refresh,
  User,
  Setting
} from '@element-plus/icons-vue'
import { strategyApi } from '@/services/api'

const router = useRouter()

// Reactive data
const stats = ref({
  totalStrategies: 0,
  enabledStrategies: 0,
  totalExecutions: 0
})

const apiStatus = ref('Loading...')
const lastUpdated = ref('')
const loading = ref(false)
const recentActivities = ref([
  {
    id: 1,
    description: 'System initialized successfully',
    timestamp: new Date().toLocaleString()
  }
])

// Computed properties
const apiStatusType = computed(() => {
  if (apiStatus.value === 'Connected') return 'success'
  if (apiStatus.value === 'Loading...') return 'info'
  return 'danger'
})

// Load statistics data
const loadStats = async () => {
  try {
    const response = await strategyApi.getStrategies()
    const strategies = response.data.strategies || []

    stats.value.totalStrategies = strategies.length
    stats.value.enabledStrategies = strategies.filter(s => s.status).length
    stats.value.totalExecutions = Math.floor(Math.random() * 1000) // Sample data

    apiStatus.value = 'Connected'
    lastUpdated.value = new Date().toLocaleString()

    // Add activity record
    addActivity('Dashboard data loaded successfully')

  } catch (error) {
    console.error('Failed to load stats:', error)
    apiStatus.value = 'Connection Failed'
    ElMessage.error('Failed to load dashboard data')
    addActivity('Failed to load dashboard data')
  }
}

// Refresh data
const refreshData = async () => {
  loading.value = true
  try {
    await loadStats()
    ElMessage.success('Data refreshed successfully')
  } catch (error) {
    ElMessage.error('Failed to refresh data')
  } finally {
    loading.value = false
  }
}

// Add activity record
const addActivity = (description) => {
  recentActivities.value.unshift({
    id: Date.now(),
    description,
    timestamp: new Date().toLocaleString()
  })

  // Limit the number of displayed activities
  if (recentActivities.value.length > 5) {
    recentActivities.value = recentActivities.value.slice(0, 5)
  }
}

// Navigation methods
const goToStrategies = () => {
  router.push('/strategies')
  addActivity('Navigated to Strategy Management')
}

const goToUserAudit = () => {
  router.push('/user-audit')
  addActivity('Navigated to User Audit')
}

const goToSettings = () => {
  router.push('/settings')
  addActivity('Navigated to Settings')
}

// Load data when component is mounted
onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  min-height: calc(100vh - 140px);
  width: 100%;
  padding: 0 24px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.dashboard-header h1 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 8px;
  font-weight: 600;
}

.dashboard-header p {
  font-size: 16px;
  color: #606266;
}

.stats-section {
  margin-bottom: 30px;
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
}

.stat-card {
  height: 120px;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 24px;
}

.stat-icon {
  margin-right: 20px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.actions-section, .activity-section {
  margin-bottom: 30px;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #303133;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.status-info {
  space-y: 12px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.status-label {
  font-weight: 500;
  color: #606266;
}

.activity-card {
  width: 100%;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 0 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (min-width: 1201px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .stat-number {
    font-size: 36px;
  }
}
</style>