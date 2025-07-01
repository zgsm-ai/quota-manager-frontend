<template>
  <div class="strategy-detail">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Strategy Detail</h1>
          <p class="page-subtitle">View and manage strategy information</p>
        </div>
        <div class="header-right">
          <el-button @click="goBack" :icon="ArrowLeft">Back to Strategies</el-button>
        </div>
      </div>
    </div>

    <!-- 策略信息 -->
    <el-card class="strategy-info-card" v-loading="strategyLoading">
      <template #header>
        <div class="card-header">
          <span>Strategy Information</span>
          <el-button type="primary" @click="editStrategy" :icon="Edit">Edit</el-button>
        </div>
      </template>

      <el-row :gutter="20" v-if="strategy">
        <el-col :span="12">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="ID">{{ strategy.id }}</el-descriptions-item>
            <el-descriptions-item label="Name">{{ strategy.name }}</el-descriptions-item>
            <el-descriptions-item label="Title">{{ strategy.title }}</el-descriptions-item>
            <el-descriptions-item label="Type">
              <el-tag :type="strategy.type === 'periodic' ? 'success' : 'info'">
                {{ strategy.type }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Amount">{{ strategy.amount }}</el-descriptions-item>
            <el-descriptions-item label="Model">{{ strategy.model || 'N/A' }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="12">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Status">
              <el-switch
                v-model="strategy.status"
                @change="toggleStatus"
                :loading="statusUpdating"
              />
              <span style="margin-left: 10px;">
                {{ strategy.status ? 'Enabled' : 'Disabled' }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="Cron Expression" v-if="strategy.type === 'periodic'">
              {{ strategy.periodic_expr || 'N/A' }}
            </el-descriptions-item>
            <el-descriptions-item label="Created">
              {{ formatDate(strategy.create_time) }}
            </el-descriptions-item>
            <el-descriptions-item label="Updated">
              {{ formatDate(strategy.update_time) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <el-row v-if="strategy && strategy.condition">
        <el-col :span="24">
          <div class="condition-section">
            <h4>Condition:</h4>
            <el-input
              v-model="strategy.condition"
              type="textarea"
              :rows="3"
              readonly
            />
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 执行记录 -->
    <el-card class="execution-records-card">
      <template #header>
        <div class="card-header">
          <span>Execution Records</span>
          <div class="header-actions">
            <el-input
              v-model="searchUser"
              placeholder="Search by user..."
              style="width: 200px; margin-right: 10px;"
              clearable
            />
            <el-button @click="loadExecutions" :icon="Refresh">Refresh</el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="filteredExecutions"
        v-loading="executionsLoading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user" label="User ID" min-width="150" />
        <el-table-column prop="batch_number" label="Batch Number" min-width="200" />
        <el-table-column prop="status" label="Status" width="120">
          <template #default="scope">
            <el-tag
              :type="getStatusTagType(scope.row.status)"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expiry_date" label="Expiry Date" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.expiry_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="Created" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="Updated" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.update_time) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalExecutions"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit, Refresh } from '@element-plus/icons-vue'
import { strategyApi } from '@/services/api'

const route = useRoute()
const router = useRouter()

// 响应式数据
const strategy = ref(null)
const strategyLoading = ref(false)
const statusUpdating = ref(false)
const executions = ref([])
const executionsLoading = ref(false)
const searchUser = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalExecutions = ref(0)

// 策略ID
const strategyId = computed(() => route.params.id)

// 过滤后的执行记录
const filteredExecutions = computed(() => {
  if (!searchUser.value) {
    return executions.value
  }
  const search = searchUser.value.toLowerCase()
  return executions.value.filter(execution =>
    execution.user.toLowerCase().includes(search)
  )
})

// 方法
const loadStrategy = async () => {
  try {
    strategyLoading.value = true
    const response = await strategyApi.getStrategy(strategyId.value)
    strategy.value = response.data
  } catch (error) {
    ElMessage.error('Failed to load strategy details')
    goBack()
  } finally {
    strategyLoading.value = false
  }
}

const loadExecutions = async () => {
  try {
    executionsLoading.value = true
    const response = await strategyApi.getStrategyExecutions(strategyId.value, {
      page: currentPage.value,
      page_size: pageSize.value
    })
    executions.value = response.data.records || []
    totalExecutions.value = response.data.total || 0
  } catch (error) {
    ElMessage.error('Failed to load execution records')
  } finally {
    executionsLoading.value = false
  }
}

const toggleStatus = async () => {
  try {
    statusUpdating.value = true
    if (strategy.value.status) {
      await strategyApi.enableStrategy(strategy.value.id)
    } else {
      await strategyApi.disableStrategy(strategy.value.id)
    }
    ElMessage.success(`Strategy ${strategy.value.status ? 'enabled' : 'disabled'} successfully`)
  } catch (error) {
    // 恢复原状态
    strategy.value.status = !strategy.value.status
    ElMessage.error('Failed to update strategy status')
  } finally {
    statusUpdating.value = false
  }
}

const editStrategy = () => {
  router.push('/strategies')
  // 这里可以添加编辑功能，或者跳转到编辑页面
}

const goBack = () => {
  router.push('/strategies')
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  loadExecutions()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadExecutions()
}

const getStatusTagType = (status) => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'processing':
      return 'warning'
    case 'failed':
      return 'danger'
    default:
      return 'info'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

// 监听分页变化
watch([currentPage, pageSize], () => {
  loadExecutions()
})

// 组件挂载时加载数据
onMounted(() => {
  loadStrategy()
  loadExecutions()
})
</script>

<style scoped>
.strategy-detail {
  min-height: calc(100vh - 120px);
}

.page-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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

.strategy-info-card {
  margin-bottom: 20px;
}

.execution-records-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.condition-section {
  margin-top: 20px;
}

.condition-section h4 {
  margin-bottom: 10px;
  color: #303133;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>