<template>
  <div class="user-audit">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">User Audit</h1>
      <p class="page-subtitle">Query user quota recharge records</p>
    </div>

    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" @submit.prevent="searchRecords">
        <el-form-item label="User ID">
          <el-input
            v-model="searchForm.userId"
            placeholder="Enter user ID"
            style="width: 300px;"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchRecords" :loading="loading" :icon="Search">
            Search
          </el-button>
          <el-button @click="clearSearch" :icon="RefreshLeft">Clear</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 审计记录 -->
    <el-card v-if="searched">
      <template #header>
        <div class="card-header">
          <span>Audit Records for User: {{ searchForm.userId }}</span>
          <div class="header-info">
            <el-tag v-if="totalRecords > 0" type="info">
              Total: {{ totalRecords }} records
            </el-tag>
          </div>
        </div>
      </template>

      <el-table
        :data="auditRecords"
        v-loading="loading"
        stripe
        style="width: 100%"
        empty-text="No records found"
      >
        <el-table-column prop="amount" label="Amount" width="120">
          <template #default="scope">
            <span :class="getAmountClass(scope.row.amount)">
              {{ scope.row.amount > 0 ? '+' : '' }}{{ scope.row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="Operation" width="150">
          <template #default="scope">
            <el-tag :type="getOperationTagType(scope.row.operation)">
              {{ scope.row.operation }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="strategy_name" label="Strategy" min-width="150">
          <template #default="scope">
            {{ scope.row.strategy_name || 'N/A' }}
          </template>
        </el-table-column>
        <el-table-column prop="related_user" label="Related User" min-width="150">
          <template #default="scope">
            {{ scope.row.related_user || 'N/A' }}
          </template>
        </el-table-column>
        <el-table-column prop="voucher_code" label="Voucher Code" min-width="200">
          <template #default="scope">
            <span v-if="scope.row.voucher_code" class="voucher-code">
              {{ scope.row.voucher_code.substring(0, 20) }}...
            </span>
            <span v-else>N/A</span>
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
        <el-table-column label="Details" width="100">
          <template #default="scope">
            <el-button
              v-if="scope.row.details"
              type="primary"
              size="small"
              @click="showDetails(scope.row)"
              :icon="View"
            >
              View
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="totalRecords > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecords"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      title="Record Details"
      v-model="detailsDialogVisible"
      width="600px"
    >
      <div v-if="selectedRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Operation">{{ selectedRecord.operation }}</el-descriptions-item>
          <el-descriptions-item label="Amount">{{ selectedRecord.amount }}</el-descriptions-item>
          <el-descriptions-item label="Strategy">{{ selectedRecord.strategy_name || 'N/A' }}</el-descriptions-item>
          <el-descriptions-item label="Related User">{{ selectedRecord.related_user || 'N/A' }}</el-descriptions-item>
          <el-descriptions-item label="Expiry Date" :span="2">
            {{ formatDate(selectedRecord.expiry_date) }}
          </el-descriptions-item>
          <el-descriptions-item label="Create Time" :span="2">
            {{ formatDate(selectedRecord.create_time) }}
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="selectedRecord.details" class="details-section">
          <h4>Operation Details:</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Total Amount">
              {{ selectedRecord.details.summary.total_amount }}
            </el-descriptions-item>
            <el-descriptions-item label="Total Items">
              {{ selectedRecord.details.summary.total_items }}
            </el-descriptions-item>
            <el-descriptions-item label="Successful Items" v-if="selectedRecord.details.summary.successful_items !== undefined">
              {{ selectedRecord.details.summary.successful_items }}
            </el-descriptions-item>
            <el-descriptions-item label="Failed Items" v-if="selectedRecord.details.summary.failed_items !== undefined">
              {{ selectedRecord.details.summary.failed_items }}
            </el-descriptions-item>
            <el-descriptions-item label="Earliest Expiry">
              {{ selectedRecord.details.summary.earliest_expiry_date }}
            </el-descriptions-item>
          </el-descriptions>

          <div v-if="selectedRecord.details.items && selectedRecord.details.items.length > 0" class="items-section">
            <h4>Items:</h4>
            <el-table :data="selectedRecord.details.items" size="small">
              <el-table-column prop="amount" label="Amount" width="100" />
              <el-table-column prop="expiry_date" label="Expiry Date" width="180" />
              <el-table-column prop="status" label="Status" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 'SUCCESS' ? 'success' : 'danger'" size="small">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="failure_reason" label="Failure Reason" min-width="150">
                <template #default="scope">
                  {{ scope.row.failure_reason || 'N/A' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div v-if="selectedRecord.voucher_code" class="voucher-section">
          <h4>Voucher Code:</h4>
          <el-input
            :value="selectedRecord.voucher_code"
            type="textarea"
            :rows="3"
            readonly
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, RefreshLeft, View } from '@element-plus/icons-vue'
import { quotaApi } from '@/services/api'

// 响应式数据
const searchForm = reactive({
  userId: ''
})

const auditRecords = ref([])
const loading = ref(false)
const searched = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)

const detailsDialogVisible = ref(false)
const selectedRecord = ref(null)

// 方法
const searchRecords = async () => {
  if (!searchForm.userId.trim()) {
    ElMessage.warning('Please enter a user ID')
    return
  }

  try {
    loading.value = true
    searched.value = true
    currentPage.value = 1

    const response = await quotaApi.getUserQuotaAuditRecords(
      searchForm.userId.trim(),
      {
        page: currentPage.value,
        page_size: pageSize.value
      }
    )

    auditRecords.value = response.data.records || []
    totalRecords.value = response.data.total || 0

    if (auditRecords.value.length === 0) {
      ElMessage.info('No records found for this user')
    } else {
      ElMessage.success(`Found ${totalRecords.value} records`)
    }
  } catch (error) {
    ElMessage.error('Failed to search audit records')
    auditRecords.value = []
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchForm.userId = ''
  auditRecords.value = []
  totalRecords.value = 0
  searched.value = false
  currentPage.value = 1
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  searchRecords()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  searchRecords()
}

const showDetails = (record) => {
  selectedRecord.value = record
  detailsDialogVisible.value = true
}

const getAmountClass = (amount) => {
  return amount > 0 ? 'amount-positive' : 'amount-negative'
}

const getOperationTagType = (operation) => {
  switch (operation) {
    case 'RECHARGE':
      return 'success'
    case 'TRANSFER_IN':
      return 'primary'
    case 'TRANSFER_OUT':
      return 'warning'
    default:
      return 'info'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.user-audit {
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

.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.amount-positive {
  color: #67c23a;
  font-weight: bold;
}

.amount-negative {
  color: #f56c6c;
  font-weight: bold;
}

.voucher-code {
  font-family: monospace;
  font-size: 12px;
  color: #909399;
}

.details-section {
  margin-top: 20px;
}

.details-section h4 {
  margin-bottom: 10px;
  color: #303133;
}

.items-section {
  margin-top: 15px;
}

.voucher-section {
  margin-top: 15px;
}
</style>