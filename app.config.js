/**
 * Unified Configuration Management File
 * Centralized management of all configuration items in the project
 */

// =================================
// Basic Configuration
// =================================
export const BASE_CONFIG = {
  // Application information
  APP_NAME: 'Quota Manager',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Quota Management System',

  // Developer information
  AUTHOR: 'Sangfor Team',
  COPYRIGHT: '© 2025 Sangfor Technologies',
}

// =================================
// API Configuration
// =================================
export const API_CONFIG = {
  // Backend service address (supports environment variable override)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8099',

  // API path prefix
  API_PREFIX: '/quota-manager/api/v1',

  // Request configuration
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,

  // Authentication configuration
  TOKEN_KEY: 'quota_manager_token',
  TOKEN_HEADER: 'Authorization',
  TOKEN_PREFIX: 'Bearer ',

  // Response configuration
  SUCCESS_CODES: [200, 201, 204],
  ERROR_CODES: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  }
}

// =================================
// UI Configuration
// =================================
export const UI_CONFIG = {
  // Layout configuration
  LAYOUT: {
    SIDEBAR_WIDTH: '200px',
    HEADER_HEIGHT: '60px',
    MAIN_PADDING: '20px 20px 20px 40px',
    HEADER_PADDING: '0 20px 0 40px'
  },

  // Table configuration
  TABLE: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZES: [10, 20, 50, 100],
    MAX_PAGE_SIZE: 100,
    STRIPE: true,
    BORDER: true
  },

  // Form configuration
  FORM: {
    LABEL_WIDTH: '150px',
    SIZE: 'default',
    VALIDATE_ON_RULE_CHANGE: false
  },

  // Button configuration
  BUTTON: {
    ACTION_BUTTON_MIN_WIDTH: '70px',
    ACTION_BUTTON_HEIGHT: '32px',
    ACTION_BUTTONS_GAP: '8px'
  },

  // Message configuration
  MESSAGE: {
    DURATION: 3000,
    SHOW_CLOSE: true,
    CENTER: false
  }
}

// =================================
// Feature Configuration
// =================================
export const FEATURE_CONFIG = {
  // Feature switches
  FEATURES: {
    AUTO_REFRESH: import.meta.env.VITE_ENABLE_AUTO_REFRESH !== 'false',
    DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
    DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
    API_MOCK: import.meta.env.VITE_API_MOCK === 'true'
  },

  // Auto refresh configuration
  AUTO_REFRESH: {
    DEFAULT_ENABLED: false,
    DEFAULT_INTERVAL: 60, // seconds
    MIN_INTERVAL: 30,
    MAX_INTERVAL: 600
  },

  // Strategy configuration
  STRATEGY: {
    TYPES: ['single', 'periodic'],
    DEFAULT_TYPE: 'single',
    DEFAULT_AMOUNT: 100,
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 10000
  }
}

// =================================
// Environment Configuration
// =================================
export const ENV_CONFIG = {
  // Current environment
  NODE_ENV: import.meta.env.NODE_ENV || 'development',

  // Environment detection
  IS_DEV: import.meta.env.NODE_ENV === 'development',
  IS_PROD: import.meta.env.NODE_ENV === 'production',
  IS_TEST: import.meta.env.NODE_ENV === 'test',

  // Development configuration
  DEV: {
    PORT: 3000,
    HOT_RELOAD: true,
    SOURCE_MAP: true
  }
}

// =================================
// Error Handling Configuration
// =================================
export const ERROR_CONFIG = {
  // Error messages
  MESSAGES: {
    NETWORK_ERROR: 'Network connection failed, please try again',
    SERVER_ERROR: 'Server error, please contact administrator',
    TIMEOUT_ERROR: 'Request timeout, please try again',
    UNAUTHORIZED: 'Authentication failed, please login again',
    FORBIDDEN: 'No permission to access this resource',
    NOT_FOUND: 'Requested resource not found'
  },

  // Error code mapping
  CODE_MAPPING: {
    'ECONNABORTED': 'TIMEOUT_ERROR',
    'ENOTFOUND': 'NETWORK_ERROR',
    'ECONNREFUSED': 'NETWORK_ERROR'
  }
}

// =================================
// Route Configuration
// =================================
export const ROUTE_CONFIG = {
  // Default route
  DEFAULT_ROUTE: '/dashboard',

  // Route meta information
  META: {
    REQUIRE_AUTH: true,
    KEEP_ALIVE: false
  },

  // Page title template
  TITLE_TEMPLATE: '{title} - Quota Manager'
}

// =================================
// Cache Configuration
// =================================
export const CACHE_CONFIG = {
  // LocalStorage key names
  KEYS: {
    API_BASE_URL: 'api_base_url',
    API_PREFIX: 'api_prefix',
    API_TIMEOUT: 'api_timeout',
    APP_PAGE_SIZE: 'app_page_size',
    APP_AUTO_REFRESH: 'app_auto_refresh',
    APP_REFRESH_INTERVAL: 'app_refresh_interval',
    USER_SETTINGS: 'user_settings'
  },

  // Cache expiration time (milliseconds)
  EXPIRES: {
    USER_DATA: 24 * 60 * 60 * 1000, // 24 hours
    SETTINGS: 7 * 24 * 60 * 60 * 1000, // 7 days
    TEMP_DATA: 60 * 60 * 1000 // 1 hour
  }
}

// =================================
// Utility Functions
// =================================

/**
 * Get dynamic API configuration with correct priority
 * Priority: User settings (localStorage) > Environment variables > Default config
 * @returns {Object} API configuration
 */
export function getDynamicApiConfig() {
  return {
    BASE_URL: localStorage.getItem('api_base_url') || API_CONFIG.BASE_URL,
    API_PREFIX: localStorage.getItem('api_prefix') || API_CONFIG.API_PREFIX,
    TIMEOUT: parseInt(localStorage.getItem('api_timeout')) || API_CONFIG.TIMEOUT
  }
}

/**
 * Get dynamic UI configuration with correct priority
 * Priority: User settings (localStorage) > Environment variables > Default config
 * @returns {Object} UI configuration
 */
export function getDynamicUIConfig() {
  return {
    ...UI_CONFIG,
    TABLE: {
      ...UI_CONFIG.TABLE,
      DEFAULT_PAGE_SIZE: parseInt(localStorage.getItem('app_page_size')) || UI_CONFIG.TABLE.DEFAULT_PAGE_SIZE
    }
  }
}

/**
 * Get dynamic feature configuration
 * Priority: User settings (localStorage) > Environment variables > Default config
 * @returns {Object} Feature configuration
 */
export function getDynamicFeatureConfig() {
  return {
    ...FEATURE_CONFIG,
    AUTO_REFRESH: {
      ...FEATURE_CONFIG.AUTO_REFRESH,
      DEFAULT_ENABLED: localStorage.getItem('app_auto_refresh') === 'true' || FEATURE_CONFIG.AUTO_REFRESH.DEFAULT_ENABLED,
      DEFAULT_INTERVAL: parseInt(localStorage.getItem('app_refresh_interval')) || FEATURE_CONFIG.AUTO_REFRESH.DEFAULT_INTERVAL
    }
  }
}

/**
 * Get the complete API URL
 * @param {string} path - API path
 * @returns {string} Complete URL
 */
export function getApiUrl(path = '') {
  const config = getDynamicApiConfig()
  return `${config.BASE_URL}${config.API_PREFIX}${path}`
}

/**
 * Get environment variable value
 * @param {string} key - Environment variable key
 * @param {any} defaultValue - Default value
 * @returns {any} Environment variable value or default value
 */
export function getEnvValue(key, defaultValue = null) {
  return import.meta.env[key] || defaultValue
}

/**
 * Check if feature is enabled
 * @param {string} feature - Feature name
 * @returns {boolean} Whether enabled
 */
export function isFeatureEnabled(feature) {
  return FEATURE_CONFIG.FEATURES[feature] || false
}

/**
 * Get cache value
 * @param {string} key - Cache key
 * @param {any} defaultValue - Default value
 * @returns {any} Cache value or default value
 */
export function getCacheValue(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Set cache value
 * @param {string} key - Cache key
 * @param {any} value - Cache value
 */
export function setCacheValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to set cache value:', error)
  }
}

/**
 * Get error message
 * @param {string|Error} error - Error object or error code
 * @returns {string} Error message
 */
export function getErrorMessage(error) {
  if (typeof error === 'string') {
    return ERROR_CONFIG.MESSAGES[error] || error
  }

  if (error?.code && ERROR_CONFIG.CODE_MAPPING[error.code]) {
    const messageKey = ERROR_CONFIG.CODE_MAPPING[error.code]
    return ERROR_CONFIG.MESSAGES[messageKey]
  }

  return error?.message || ERROR_CONFIG.MESSAGES.SERVER_ERROR
}

// =================================
// Configuration Validation
// =================================

/**
 * Validate configuration integrity
 */
export function validateConfig() {
  const errors = []

  // Validate API configuration
  if (!API_CONFIG.BASE_URL) {
    errors.push('API_CONFIG.BASE_URL is required')
  }

  if (!API_CONFIG.API_PREFIX) {
    errors.push('API_CONFIG.API_PREFIX is required')
  }

  // Validate UI configuration
  if (UI_CONFIG.TABLE.DEFAULT_PAGE_SIZE <= 0) {
    errors.push('UI_CONFIG.TABLE.DEFAULT_PAGE_SIZE must be greater than 0')
  }

  if (errors.length > 0) {
    console.error('Configuration validation failed:', errors)
    return false
  }

  return true
}

// Validate configuration in development environment
if (ENV_CONFIG.IS_DEV) {
  validateConfig()
}

// =================================
// Export Default Configuration Object
// =================================
export default {
  BASE_CONFIG,
  API_CONFIG,
  UI_CONFIG,
  FEATURE_CONFIG,
  ENV_CONFIG,
  ERROR_CONFIG,
  ROUTE_CONFIG,
  CACHE_CONFIG,

  // Utility functions
  getApiUrl,
  getEnvValue,
  isFeatureEnabled,
  getCacheValue,
  setCacheValue,
  getErrorMessage,
  validateConfig,

  // Dynamic configuration functions
  getDynamicApiConfig,
  getDynamicUIConfig,
  getDynamicFeatureConfig
}