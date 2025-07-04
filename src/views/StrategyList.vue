<template>
  <div class="strategy-list">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Strategy Management</h1>
          <p class="page-subtitle">Manage quota allocation strategies</p>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="showCreateDialog" :icon="Plus">
            Create Strategy
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索和过滤 -->
    <el-card class="filter-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchText"
            placeholder="Search strategies..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :span="6">
          <el-select v-model="statusFilter" placeholder="Filter by status" clearable @change="loadStrategies">
            <el-option label="All" value="" />
            <el-option label="Enabled" value="enabled" />
            <el-option label="Disabled" value="disabled" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="typeFilter" placeholder="Filter by type" clearable @change="loadStrategies">
            <el-option label="All" value="" />
            <el-option label="Single" value="single" />
            <el-option label="Periodic" value="periodic" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="loadStrategies" :icon="Refresh">Refresh</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 策略列表 -->
    <el-card>
      <el-table
        :data="filteredStrategies"
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <!-- Name列已隐藏，值将由Title自动生成 -->
        <el-table-column prop="title" label="Title" width="250" />
        <el-table-column prop="type" label="Type" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'periodic' ? 'success' : 'info'">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Amount" width="100" />
        <!-- Model列暂时隐藏，因为暂时没有实际意义 -->
        <!-- <el-table-column prop="model" label="Model" width="120" /> -->
        <el-table-column prop="status" label="Status" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="toggleStrategyStatus(scope.row)"
              :loading="scope.row.updating"
            />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="Created" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="280" fixed="right">
          <template #default="scope">
            <div class="action-buttons">
              <el-button
                type="primary"
                size="small"
                @click="viewStrategy(scope.row)"
                :icon="View"
                class="action-btn"
              >
                View
              </el-button>
              <el-button
                type="warning"
                size="small"
                @click="editStrategy(scope.row)"
                :icon="Edit"
                class="action-btn"
              >
                Edit
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="deleteStrategy(scope.row)"
                :icon="Delete"
                class="action-btn"
              >
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑策略对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <!-- Name字段已隐藏，将由Title自动生成 -->
        <el-form-item label="Title" prop="title">
          <el-input v-model="form.title" placeholder="Enter strategy title" />
        </el-form-item>

        <el-form-item label="Type" prop="type">
          <el-select v-model="form.type" placeholder="Select strategy type" style="width: 100%">
            <el-option label="Single" value="single" />
            <el-option label="Periodic" value="periodic" />
          </el-select>
        </el-form-item>

        <el-form-item label="Amount" prop="amount">
          <el-input-number v-model="form.amount" :min="1" :max="10000" style="width: 100%" />
        </el-form-item>

        <!-- Model字段暂时隐藏，因为暂时没有实际意义 -->
        <!-- <el-form-item label="Model" prop="model">
          <el-input v-model="form.model" placeholder="Enter model name (optional)" />
        </el-form-item> -->

        <el-form-item label="Condition" prop="condition">
          <el-input
            v-model="form.condition"
            type="textarea"
            :rows="3"
            placeholder="Enter strategy condition"
          />
        </el-form-item>

        <el-form-item
          v-if="form.type === 'periodic'"
          label="Schedule Setting"
          prop="periodic_expr"
        >
          <!-- 简单调度设置器 -->
          <div class="schedule-builder">
            <el-radio-group v-model="scheduleMode" @change="onScheduleModeChange" style="margin-bottom: 16px;">
              <el-radio-button value="preset">Quick Select</el-radio-button>
              <el-radio-button value="custom">Custom Builder</el-radio-button>
              <el-radio-button value="advanced">Advanced (Cron)</el-radio-button>
            </el-radio-group>

            <!-- 预设选项 - 更新为6字段格式 -->
            <div v-if="scheduleMode === 'preset'" class="preset-options">
              <el-select
                v-model="selectedPreset"
                @change="onPresetChange"
                placeholder="Select a common schedule"
                style="width: 100%"
              >
                <el-option label="Every 10 seconds" value="*/10 * * * * *" />
                <el-option label="Every 30 seconds" value="*/30 * * * * *" />
                <el-option label="Every minute" value="0 */1 * * * *" />
                <el-option label="Every 5 minutes" value="0 */5 * * * *" />
                <el-option label="Every 10 minutes" value="0 */10 * * * *" />
                <el-option label="Every 15 minutes" value="0 */15 * * * *" />
                <el-option label="Every 30 minutes" value="0 */30 * * * *" />
                <el-option label="Every hour" value="0 0 * * * *" />
                <el-option label="Every 2 hours" value="0 0 */2 * * *" />
                <el-option label="Every 6 hours" value="0 0 */6 * * *" />
                <el-option label="Daily at midnight" value="0 0 0 * * *" />
                <el-option label="Daily at 6:00 AM" value="0 0 6 * * *" />
                <el-option label="Daily at 9:00 AM" value="0 0 9 * * *" />
                <el-option label="Daily at 12:00 PM" value="0 0 12 * * *" />
                <el-option label="Daily at 6:00 PM" value="0 0 18 * * *" />
                <el-option label="Weekly on Monday 9:00 AM" value="0 0 9 * * 1" />
                <el-option label="Weekly on Friday 5:00 PM" value="0 0 17 * * 5" />
                <el-option label="Monthly on 1st at 9:00 AM" value="0 0 9 1 * *" />
                <el-option label="Monthly on 15th at 12:00 PM" value="0 0 12 15 * *" />
              </el-select>
            </div>

            <!-- 自定义构建器 -->
            <div v-if="scheduleMode === 'custom'" class="custom-builder">
              <div class="builder-row">
                <label>Frequency:</label>
                <el-select v-model="customSchedule.frequency" @change="updateCustomCron" style="width: 150px">
                  <el-option label="Every second" value="second" />
                  <el-option label="Every minute" value="minute" />
                  <el-option label="Hourly" value="hour" />
                  <el-option label="Daily" value="day" />
                  <el-option label="Weekly" value="week" />
                  <el-option label="Monthly" value="month" />
                </el-select>
              </div>

              <div v-if="customSchedule.frequency === 'second'" class="builder-row">
                <label>Every:</label>
                <el-input-number v-model="customSchedule.secondInterval" :min="1" :max="59" @change="updateCustomCron" style="width: 100px" key="second-interval" />
                <span>second(s)</span>
              </div>

              <div v-if="customSchedule.frequency === 'minute'">
                <div class="builder-row">
                  <label>Every:</label>
                  <el-input-number v-model="customSchedule.minuteInterval" :min="1" :max="59" @change="updateCustomCron" style="width: 100px" key="minute-interval" />
                  <span>minute(s)</span>
                </div>
                                <div class="builder-row builder-sub-row">
                  <label>At:</label>
                  <el-input-number
                    v-model="customSchedule.second"
                    :min="0"
                    :max="59"
                    @change="updateCustomCron"
                    style="width: 100px"
                    :controls="true"
                  />
                  <span>second(s)</span>
                </div>
              </div>

              <div v-if="customSchedule.frequency === 'hour'">
                <div class="builder-row">
                  <label>Every:</label>
                  <el-input-number v-model="customSchedule.hourInterval" :min="1" :max="23" @change="updateCustomCron" style="width: 100px" key="hour-interval" />
                  <span>hour(s)</span>
                </div>
                <div class="builder-row builder-sub-row">
                  <label>At:</label>
                  <el-input-number v-model="customSchedule.minute" :min="0" :max="59" @change="updateCustomCron" style="width: 100px" key="hour-minute" />
                  <span>minute(s)</span>
                </div>
                <div class="builder-row builder-sub-row">
                  <label>At:</label>
                  <el-input-number v-model="customSchedule.second" :min="0" :max="59" @change="updateCustomCron" style="width: 100px" key="hour-second" />
                  <span>second(s)</span>
                </div>
              </div>

              <div v-if="['day', 'week', 'month'].includes(customSchedule.frequency)" class="builder-row">
                <label>At time:</label>
                <el-time-picker
                  v-model="customSchedule.time"
                  @change="updateCustomCron"
                  format="HH:mm:ss"
                  placeholder="Select time"
                  style="width: 150px"
                />
              </div>

              <div v-if="customSchedule.frequency === 'week'" class="builder-row">
                <label>On day:</label>
                <el-select v-model="customSchedule.weekDay" @change="updateCustomCron" style="width: 150px">
                  <el-option label="Monday" :value="1" />
                  <el-option label="Tuesday" :value="2" />
                  <el-option label="Wednesday" :value="3" />
                  <el-option label="Thursday" :value="4" />
                  <el-option label="Friday" :value="5" />
                  <el-option label="Saturday" :value="6" />
                  <el-option label="Sunday" :value="0" />
                </el-select>
              </div>

              <div v-if="customSchedule.frequency === 'month'" class="builder-row">
                <label>On day:</label>
                <el-input-number v-model="customSchedule.monthDay" :min="1" :max="31" @change="updateCustomCron" style="width: 100px" key="month-day" />
              </div>
            </div>

            <!-- 高级模式（直接输入 Cron） - 更新为6字段格式 -->
            <div v-if="scheduleMode === 'advanced'" class="advanced-mode">
              <el-input
                v-model="form.periodic_expr"
                placeholder="e.g., 0 0 9 * * 1-5 (weekdays at 9:00:00 AM)"
                style="margin-bottom: 8px"
              />
              <div class="cron-help">
                <span>Format: second minute hour day month weekday</span>
                <el-button type="text" @click="showCronHelp = !showCronHelp">{{ showCronHelp ? 'Hide' : 'Show' }} Help</el-button>
              </div>
              <div v-if="showCronHelp" class="cron-examples">
                <p><strong>Examples:</strong></p>
                <ul>
                  <li><code>*/10 * * * * *</code> - Every 10 seconds</li>
                  <li><code>0 */5 * * * *</code> - Every 5 minutes</li>
                  <li><code>0 0 9 * * 1-5</code> - Weekdays at 9:00:00 AM</li>
                  <li><code>0 0 0 1 * *</code> - First day of every month at midnight</li>
                  <li><code>0 0 */2 * * *</code> - Every 2 hours</li>
                  <li><code>*/30 * * * * *</code> - Every 30 seconds</li>
                </ul>
              </div>
            </div>

            <!-- 生成的 Cron 表达式预览 -->
            <div v-if="scheduleMode !== 'advanced'" class="cron-preview">
              <div class="preview-label">Generated Cron Expression:</div>
              <el-input v-model="form.periodic_expr" readonly />
            </div>

            <!-- 下次执行时间预览 -->
            <div v-if="form.periodic_expr" class="next-execution">
              <span class="next-label">Next execution: </span>
              <span class="next-time">{{ getNextExecutionTime() }}</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="Status" prop="status">
          <div class="input-with-status">
            <el-switch v-model="form.status" />
            <span class="status-text">
              {{ form.status ? 'Enabled' : 'Disabled' }}
            </span>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          {{ isEditing ? 'Update' : 'Create' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, View, Edit, Delete } from '@element-plus/icons-vue'
import { strategyApi } from '@/services/api'

const router = useRouter()

// 响应式数据
const strategies = ref([])
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEditing = ref(false)
const searchText = ref('')
const statusFilter = ref('')
const typeFilter = ref('')

// 调度设置相关 - 更新为支持6字段
const scheduleMode = ref('preset')
const selectedPreset = ref('')
const showCronHelp = ref(false)
const customSchedule = reactive({
  frequency: 'day',
  secondInterval: 10,
  minuteInterval: 5,
  hourInterval: 1,
  second: 1,
  minute: 1,
  time: new Date(2024, 0, 1, 9, 0, 0), // 默认 9:00:00 AM
  weekDay: 1, // 周一
  monthDay: 1
})

// 表单相关
const formRef = ref()
const form = reactive({
  id: null,
  name: '',
  title: '',
  type: 'single',
  amount: 100,
  model: '',
  condition: '',
  periodic_expr: '',
  status: true
})

// 表单验证规则
const formRules = {
  // name字段验证已移除，因为它将自动生成
  title: [
    { required: true, message: 'Please enter strategy title', trigger: 'blur' }
  ],
  type: [
    { required: true, message: 'Please select strategy type', trigger: 'change' }
  ],
  amount: [
    { required: true, message: 'Please enter amount', trigger: 'blur' },
    { type: 'number', min: 1, message: 'Amount must be greater than 0', trigger: 'blur' }
  ],
  condition: [
    { required: true, message: 'Please enter strategy condition', trigger: 'blur' }
  ],
  periodic_expr: [
    {
      validator: (rule, value, callback) => {
        if (form.type === 'periodic' && !value) {
          callback(new Error('Cron expression is required for periodic strategies'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 计算属性
const dialogTitle = computed(() => isEditing.value ? 'Edit Strategy' : 'Create Strategy')

const filteredStrategies = computed(() => {
  let result = strategies.value

  // 按名称搜索
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(strategy =>
      strategy.name.toLowerCase().includes(search) ||
      strategy.title.toLowerCase().includes(search)
    )
  }

  // 按状态过滤
  if (statusFilter.value) {
    const enabled = statusFilter.value === 'enabled'
    result = result.filter(strategy => strategy.status === enabled)
  }

  // 按类型过滤
  if (typeFilter.value) {
    result = result.filter(strategy => strategy.type === typeFilter.value)
  }

  return result
})

// 方法
const loadStrategies = async () => {
  try {
    loading.value = true
    const response = await strategyApi.getStrategies()
    strategies.value = response.data.strategies || []
  } catch (error) {
    ElMessage.error('Failed to load strategies')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 搜索是实时的，由计算属性处理
}

const showCreateDialog = () => {
  isEditing.value = false
  resetForm()
  dialogVisible.value = true
}

const editStrategy = (strategy) => {
  isEditing.value = true
  Object.assign(form, strategy)

  // 根据现有的 cron 表达式智能选择模式 - 更新为6字段支持
  if (strategy.periodic_expr) {
    // 检查是否匹配预设选项 - 更新为6字段预设
    const presetOptions = [
      '*/10 * * * * *', '*/30 * * * * *', '0 */1 * * * *', '0 */5 * * * *', '0 */10 * * * *',
      '0 */15 * * * *', '0 */30 * * * *', '0 0 * * * *', '0 0 */2 * * *', '0 0 */6 * * *',
      '0 0 0 * * *', '0 0 6 * * *', '0 0 9 * * *', '0 0 12 * * *', '0 0 18 * * *',
      '0 0 9 * * 1', '0 0 17 * * 5', '0 0 9 1 * *', '0 0 12 15 * *'
    ]

    if (presetOptions.includes(strategy.periodic_expr)) {
      scheduleMode.value = 'preset'
      selectedPreset.value = strategy.periodic_expr
    } else {
      // 尝试解析为自定义设置 - 更新为6字段解析
      const cronParts = strategy.periodic_expr.split(' ')
      if (cronParts.length === 6) {
        const [second, minute, hour, day, month, weekday] = cronParts
        let parsed = false

        // 尝试解析为自定义模式
        if (second.startsWith('*/') && minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
          scheduleMode.value = 'custom'
          customSchedule.frequency = 'second'
          customSchedule.secondInterval = parseInt(second.substring(2))
          parsed = true
        } else if (second === '0' && minute.startsWith('*/') && hour === '*' && day === '*' && month === '*' && weekday === '*') {
          scheduleMode.value = 'custom'
          customSchedule.frequency = 'minute'
          customSchedule.minuteInterval = parseInt(minute.substring(2))
          customSchedule.second = parseInt(second) || 0
          parsed = true
        } else if (second !== '*' && minute !== '*' && hour.startsWith('*/') && day === '*' && month === '*' && weekday === '*') {
          scheduleMode.value = 'custom'
          customSchedule.frequency = 'hour'
          customSchedule.hourInterval = parseInt(hour.substring(2))
          customSchedule.minute = parseInt(minute) || 0
          customSchedule.second = parseInt(second) || 0
          parsed = true
        } else if (!hour.includes('*') && !minute.includes('*') && !second.includes('*') && day === '*' && month === '*' && weekday === '*') {
          scheduleMode.value = 'custom'
          customSchedule.frequency = 'day'
          const time = new Date(2024, 0, 1, parseInt(hour) || 0, parseInt(minute) || 0, parseInt(second) || 0)
          customSchedule.time = time
          parsed = true
        } else if (!hour.includes('*') && !minute.includes('*') && !second.includes('*') && day === '*' && month === '*' && !weekday.includes('*')) {
          scheduleMode.value = 'custom'
          customSchedule.frequency = 'week'
          const time = new Date(2024, 0, 1, parseInt(hour) || 0, parseInt(minute) || 0, parseInt(second) || 0)
          customSchedule.time = time
          customSchedule.weekDay = parseInt(weekday) || 0
          parsed = true
        } else if (!hour.includes('*') && !minute.includes('*') && !second.includes('*') && !day.includes('*') && month === '*' && weekday === '*') {
          scheduleMode.value = 'custom'
          customSchedule.frequency = 'month'
          const time = new Date(2024, 0, 1, parseInt(hour) || 0, parseInt(minute) || 0, parseInt(second) || 0)
          customSchedule.time = time
          customSchedule.monthDay = parseInt(day) || 1
          parsed = true
        }

        if (!parsed) {
          scheduleMode.value = 'advanced'
        }
      } else {
        scheduleMode.value = 'advanced'
      }
    }
  } else {
    scheduleMode.value = 'preset'
    selectedPreset.value = ''
  }

  dialogVisible.value = true
}

const viewStrategy = (strategy) => {
  router.push(`/strategies/${strategy.id}`)
}

const deleteStrategy = async (strategy) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete strategy "${strategy.name}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )

    await strategyApi.deleteStrategy(strategy.id)
    ElMessage.success('Strategy deleted successfully')
    loadStrategies()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete strategy')
    }
  }
}

const toggleStrategyStatus = async (strategy) => {
  try {
    strategy.updating = true
    if (strategy.status) {
      await strategyApi.enableStrategy(strategy.id)
    } else {
      await strategyApi.disableStrategy(strategy.id)
    }
    ElMessage.success(`Strategy ${strategy.status ? 'enabled' : 'disabled'} successfully`)
  } catch (error) {
    // 恢复原状态
    strategy.status = !strategy.status
    ElMessage.error('Failed to update strategy status')
  } finally {
    strategy.updating = false
  }
}

const submitForm = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true

    if (isEditing.value) {
      await strategyApi.updateStrategy(form.id, form)
      ElMessage.success('Strategy updated successfully')
    } else {
      await strategyApi.createStrategy(form)
      ElMessage.success('Strategy created successfully')
    }

    dialogVisible.value = false
    loadStrategies()
  } catch (error) {
    if (error !== false) { // 验证失败时返回false
      ElMessage.error('Failed to save strategy')
    }
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    title: '',
    type: 'single',
    amount: 100,
    model: '',
    condition: '',
    periodic_expr: '',
    status: true
  })

  // 重置调度设置 - 更新为6字段支持
  scheduleMode.value = 'preset'
  selectedPreset.value = ''
  showCronHelp.value = false
  Object.assign(customSchedule, {
    frequency: 'day',
    secondInterval: 10,
    minuteInterval: 5,
    hourInterval: 1,
    second: 1,
    minute: 0,
    time: new Date(2024, 0, 1, 9, 0, 0),
    weekDay: 1,
    monthDay: 1
  })

  formRef.value?.clearValidate()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

// 调度设置相关方法
const onScheduleModeChange = () => {
  if (scheduleMode.value === 'preset') {
    selectedPreset.value = ''
    form.periodic_expr = ''
  } else if (scheduleMode.value === 'custom') {
    updateCustomCron()
  }
}

const onPresetChange = (value) => {
  form.periodic_expr = value
}

const updateCustomCron = () => {
  let cron = ''

  switch (customSchedule.frequency) {
    case 'second':
      cron = `*/${customSchedule.secondInterval} * * * * *`
      break

    case 'minute':
      cron = `${customSchedule.second} */${customSchedule.minuteInterval} * * * *`
      break

    case 'hour':
      cron = `${customSchedule.second} ${customSchedule.minute} */${customSchedule.hourInterval} * * *`
      break

    case 'day':
      const dayHour = customSchedule.time.getHours()
      const dayMinute = customSchedule.time.getMinutes()
      const daySecond = customSchedule.time.getSeconds()
      cron = `${daySecond} ${dayMinute} ${dayHour} * * *`
      break

    case 'week':
      const weekHour = customSchedule.time.getHours()
      const weekMinute = customSchedule.time.getMinutes()
      const weekSecond = customSchedule.time.getSeconds()
      cron = `${weekSecond} ${weekMinute} ${weekHour} * * ${customSchedule.weekDay}`
      break

    case 'month':
      const monthHour = customSchedule.time.getHours()
      const monthMinute = customSchedule.time.getMinutes()
      const monthSecond = customSchedule.time.getSeconds()
      cron = `${monthSecond} ${monthMinute} ${monthHour} ${customSchedule.monthDay} * *`
      break
  }

  form.periodic_expr = cron
}

const getNextExecutionTime = () => {
  if (!form.periodic_expr) return 'Invalid expression'

  try {
    // 简单的下次执行时间计算 - 更新为6字段支持
    const now = new Date()
    const cronParts = form.periodic_expr.split(' ')

    if (cronParts.length !== 6) return 'Invalid cron format (requires 6 fields: second minute hour day month weekday)'

    // 简化版本：只处理一些常见情况
    const [second, minute, hour, day, month, weekday] = cronParts

    if (second.startsWith('*/')) {
      const interval = parseInt(second.substring(2))
      const nextSecond = Math.ceil(now.getSeconds() / interval) * interval
      const nextTime = new Date(now)
      nextTime.setSeconds(nextSecond, 0)
      if (nextTime <= now) {
        nextTime.setMinutes(nextTime.getMinutes() + 1, 0, 0)
      }
      return nextTime.toLocaleString()
    }

    if (minute.startsWith('*/')) {
      const interval = parseInt(minute.substring(2))
      const nextMinute = Math.ceil(now.getMinutes() / interval) * interval
      const nextTime = new Date(now)
      nextTime.setMinutes(nextMinute, parseInt(second) || 0, 0)
      if (nextTime <= now) {
        nextTime.setHours(nextTime.getHours() + 1, 0, parseInt(second) || 0, 0)
      }
      return nextTime.toLocaleString()
    }

    if (hour.startsWith('*/')) {
      const interval = parseInt(hour.substring(2))
      const nextHour = Math.ceil(now.getHours() / interval) * interval
      const nextTime = new Date(now)
      nextTime.setHours(nextHour, parseInt(minute) || 0, parseInt(second) || 0, 0)
      if (nextTime <= now) {
        nextTime.setDate(nextTime.getDate() + 1)
        nextTime.setHours(0, parseInt(minute) || 0, parseInt(second) || 0, 0)
      }
      return nextTime.toLocaleString()
    }

    // 对于固定时间，计算下一次执行
    const nextTime = new Date(now)
    nextTime.setHours(parseInt(hour) || 0, parseInt(minute) || 0, parseInt(second) || 0, 0)

    if (nextTime <= now) {
      nextTime.setDate(nextTime.getDate() + 1)
    }

    return nextTime.toLocaleString()
  } catch (error) {
    return 'Unable to calculate'
  }
}

/**
 * 将标题转换为kebab-case格式的名称
 * @param {string} title 标题
 * @returns {string} kebab-case格式的名称
 */
const generateNameFromTitle = (title) => {
  if (!title) return ''

  return title
    .toLowerCase()                    // 转为小写
    .trim()                          // 去除首尾空格
    .replace(/[^\w\s-]/g, '')        // 移除特殊字符（保留字母、数字、空格、连字符）
    .replace(/\s+/g, '-')            // 将空格替换为连字符
    .replace(/--+/g, '-')            // 将多个连字符替换为单个连字符
    .replace(/^-+|-+$/g, '')         // 移除首尾的连字符
}

// 监听title变化，自动生成name
watch(
  () => form.title,
  (newTitle) => {
    form.name = generateNameFromTitle(newTitle)
  },
  { immediate: true }
)

// 组件挂载时加载数据
onMounted(() => {
  loadStrategies()
})
</script>

<style scoped>
.strategy-list {
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

.filter-card {
  margin-bottom: 20px;
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

.input-with-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-text {
  color: #909399;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
}

.action-btn {
  flex: 1;
  min-width: 70px;
  max-width: 85px;
  height: 32px;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.action-btn .el-icon {
  margin-right: 4px;
}

/* 调度设置器样式 */
.schedule-builder {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 16px;
  background-color: #fafafa;
}

.preset-options {
  margin-bottom: 16px;
}

.custom-builder {
  margin-bottom: 16px;
}

.builder-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.builder-row label {
  min-width: 100px;
  font-weight: 500;
  color: #606266;
}

.builder-row span {
  color: #909399;
  font-size: 14px;
}

.builder-sub-row {
  margin-left: 0;
  margin-top: 8px;
}

.time-setting {
  display: flex;
  align-items: center;
  gap: 8px;
}

.advanced-mode {
  margin-bottom: 16px;
}

.cron-help {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.cron-examples {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  font-size: 13px;
  line-height: 1.5;
}

.cron-examples ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.cron-examples li {
  margin-bottom: 4px;
}

.cron-examples code {
  background-color: #e6effb;
  color: #409eff;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
}

.cron-preview {
  margin-bottom: 16px;
}

.preview-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 6px;
  font-weight: 500;
}

.next-execution {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  font-size: 13px;
}

.next-label {
  color: #606266;
  font-weight: 500;
}

.next-time {
  color: #1890ff;
  font-weight: 600;
  margin-left: 4px;
}
</style>