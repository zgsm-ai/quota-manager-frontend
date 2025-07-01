# 🎯 Quota Manager Frontend

> A quota management system frontend based on Vue 3 + Element Plus

## 📖 Project Overview

Quota Manager Frontend is a modern quota management system frontend application that provides an intuitive user interface for managing quota policies, audit records, and system settings.

### ✨ Key Features

- 🎛️ **Dashboard** - System overview and quick actions
- 📊 **Strategy Management** - Create, edit, delete, and execute quota policies
- 🔍 **User Audit** - Quota usage records and audit logs
- ⚙️ **System Settings** - API configuration and system parameter settings

### 🛠️ Technology Stack

- **Framework**: Vue 3 (Composition API)
- **UI Components**: Element Plus
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: Vue Router
- **Styling**: CSS3 + Flexbox

## 🚀 Quick Start

### Requirements

- Node.js >= 16
- npm >= 8

### Install Dependencies

```bash
npm install
```

### Start Development Environment

```bash
npm run dev
```

Visit `http://localhost:3000` (port may be automatically adjusted)

### Production Build

```bash
npm run build
```

Build files will be output to the `dist/` directory

## 🔧 Configuration Management

### Unified Configuration System

The project uses a unified configuration management system with all configurations centralized in the `app.config.js` file in the root directory:

#### Configuration Modules
- **API Configuration**: Backend address, timeout, authentication, etc.
- **UI Configuration**: Layout dimensions, table settings, form configuration, etc.
- **Feature Switches**: Auto refresh, dark mode, debug mode, etc.
- **Error Handling**: Error messages, status code mapping, etc.
- **Cache Management**: Storage key names, expiration times, etc.

#### Usage

```javascript
// Import configuration
import { API_CONFIG, UI_CONFIG, getApiUrl } from '@config'

// Usage example
const apiUrl = getApiUrl('/strategies')
const pageSize = UI_CONFIG.TABLE.DEFAULT_PAGE_SIZE
```

#### Utility Functions

```javascript
import {
  getApiUrl,          // Build complete API URL
  isFeatureEnabled,   // Check if feature is enabled
  getCacheValue,      // Get cache value
  setCacheValue,      // Set cache value
  getErrorMessage     // Get standardized error message
} from '@config'
```

### Environment Variable Configuration

Create a `.env.local` file to override default configurations:

```bash
# =================================
# API Configuration
# =================================
VITE_API_BASE_URL=http://localhost:8099
VITE_API_TIMEOUT=10000

# =================================
# Feature Switches
# =================================
VITE_ENABLE_AUTO_REFRESH=true
VITE_ENABLE_DARK_MODE=false
VITE_DEBUG_MODE=false

# =================================
# Development Configuration
# =================================
VITE_DEV_PORT=3000
```

#### Configuration Priority
1. **Environment Variables** (Highest) - `.env.local`, `.env` files
2. **Default Configuration** (Lowest) - Default values in `app.config.js`

## 📁 Project Structure

```
/
├── app.config.js          # 🎯 Unified configuration file
└── src/
    ├── assets/           # Static resources
    │   ├── main.css     # Main style file
    │   └── base.css     # Base styles
    ├── components/      # Common components
    ├── router/          # Route configuration
    ├── services/        # API services
    │   └── api.js       # API interface definitions
    ├── views/           # Page components
    │   ├── Dashboard.vue     # Dashboard
    │   ├── StrategyList.vue  # Strategy list
    │   ├── StrategyDetail.vue # Strategy details
    │   ├── UserAudit.vue     # User audit
    │   └── Settings.vue      # System settings
    ├── App.vue          # Root component
    └── main.js          # Entry file
```

## 🔌 API Interface

### Backend Integration

The project communicates with backend APIs through Axios, with all interfaces following a unified response format:

```javascript
{
  "code": "success",               // Status code (string format)
  "message": "Operation success",   // Message (English)
  "success": true,                 // Whether operation was successful
  "data": { ... }                  // Response data (optional)
}
```

### Main Interfaces

- **Strategy Management**: CRUD operations for strategies, enable/disable, scan triggering
- **Quota Management**: User quota queries, transfer in/out operations
- **Audit Records**: Quota usage records and audit log queries

## 🎨 UI Design

### Responsive Layout

- ✅ Full-screen display, filling the entire browser window
- ✅ Sidebar + main content area layout
- ✅ Unified page header design
- ✅ Adaptation to different screen sizes

### Component Styles

- **Tables**: Pagination, sorting, filtering functionality
- **Forms**: Unified label width and validation styles
- **Buttons**: Consistent size and spacing
- **Message Prompts**: Standardized error and success messages

## 🔍 Development Guide

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)

### Code Standards

- Use Vue 3 Composition API
- Use unified configuration system instead of hard-coding
- Follow Element Plus component standards
- Keep code clean and readable

### Best Practices

#### ✅ Recommended Practices
- Use the configuration file `app.config.js` in the root directory
- Override configuration with environment variables
- Use `@config` alias to import configuration
- Use utility functions for configuration operations
- Provide reasonable default values for new configuration items
- Use semantic variable and function naming

#### ❌ Avoid These Practices
- Hard-coding configuration values in components
- Directly modifying configuration objects
- Ignoring environment variable prefix `VITE_`
- Enabling debug mode in production

## 🚨 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Taking Effect
- ✅ Ensure variable names start with `VITE_`
- ✅ Restart development server
- ✅ Check `.env.local` file location

#### 2. Configuration Cache Issues
- ✅ Clear browser LocalStorage
- ✅ Use hard refresh (Ctrl+Shift+R)

#### 3. Configuration Validation Failed
- ✅ Check browser console for error messages
- ✅ Verify required configuration items are not empty

#### 4. API Request Failures
- ✅ Confirm backend service is running
- ✅ Check API address configuration is correct
- ✅ Review detailed error information in network requests

### Debugging Tips

```javascript
// Print configuration information in development environment
if (ENV_CONFIG.IS_DEV) {
  console.log('Current config:', {
    API_CONFIG,
    UI_CONFIG,
    FEATURE_CONFIG
  })
}
```

## 🚀 Deployment Guide

### 1. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Or use Makefile
make dev
```

### 2. Docker Deployment

#### Run Frontend Standalone
```bash
# Build Docker image
make docker-build

# Run container
make docker-run

# Access application
curl http://localhost:3000/health
```

#### Using Docker Compose
```bash
# Start all services
make compose-up

# View logs
docker-compose logs -f

# Stop services
make compose-down
```

### 3. Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster ready
- kubectl configured
- Images pushed to container registry

#### Deployment Steps
```bash
# One-click deployment (build, push, deploy)
make deploy

# Or execute step by step
make docker-build    # Build image
make docker-push     # Push image
make k8s-apply       # Deploy to K8s

# Check deployment status
kubectl get pods,svc,ingress -n shenma -l app=quota-manager-frontend

# View logs
kubectl logs -f -n shenma -l app=quota-manager-frontend
```

## 📁 Deployment File Descriptions

### Docker Related
- `Dockerfile` - Multi-stage build configuration
- `nginx.conf` - Nginx server configuration
- `docker-compose.yml` - Local development environment configuration
- `.dockerignore` - Docker build ignore file

### Kubernetes Related
- `k8s-deployment.yaml` - K8s deployment configuration, including:
  - ConfigMap: Frontend configuration
  - Deployment: Application deployment
  - Service: Service exposure
  - Ingress: External access
  - HPA: Auto-scaling

### Build Tools
- `Makefile` - Simplify common commands
- `package.json` - Contains Docker and K8s related scripts

## 🔧 Deployment Configuration Description

### Environment Variables
| Variable Name | Description | Default Value |
|---------------|-------------|---------------|
| `NODE_ENV` | Runtime environment | `production` |
| `VITE_API_BASE_URL` | Backend API address | `http://quota-manager-svc:8080` |
| `TZ` | Timezone setting | `Asia/Shanghai` |

### Resource Configuration
| Resource | Request | Limit |
|----------|---------|-------|
| CPU | 100m | 500m |
| Memory | 128Mi | 512Mi |

### Network Configuration
- Container port: 80
- Service port: 80
- Health check: `/health`

## 🌐 Access Methods

### Local Development
- Development server: `http://localhost:3005`
- Docker container: `http://localhost:3000`

### Kubernetes Environment
- Cluster internal access: `http://quota-manager-frontend-svc.shenma.svc.cluster.local`
- Ingress access: `http://quota-manager.shenma.local` (requires DNS configuration)

## 🛠 Development Workflow

### Daily Development
```bash
# 1. Pull latest code
git pull origin main

# 2. Install/update dependencies
npm install

# 3. Start development server
make dev

# 4. Build test after development
make build
```

### Release Process
```bash
# 1. Update version number (in Makefile)
vim Makefile

# 2. Build and deploy
make deploy

# 3. Verify deployment
kubectl get pods -n shenma -l app=quota-manager-frontend
```

## 📊 Monitoring and Logging

### View Logs
```bash
# Docker Compose
docker-compose logs -f quota-manager-frontend

# Kubernetes
kubectl logs -f -n shenma deployment/quota-manager-frontend
```

### Monitoring Metrics
- CPU usage
- Memory usage
- HTTP response time
- Error rate

## 🔒 Security Configuration

### Nginx Security Headers
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Content-Security-Policy: Configured

### Container Security
- Run as non-root user
- Minimize image layers
- Regular base image updates

## 📈 Performance Optimization

### Frontend Optimization
- Gzip compression enabled
- Static resource caching strategy
- Code splitting and lazy loading

### Kubernetes Optimization
- HPA auto-scaling
- Resource limit configuration
- Readiness and liveness probes

## 🚨 Deployment Troubleshooting

### Common Issues

#### 1. Build Failure
```bash
# Check Node.js version
node --version

# Clean cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 2. Docker Run Failure
```bash
# View container logs
docker logs quota-manager-frontend

# Enter container for debugging
docker exec -it quota-manager-frontend sh
```

#### 3. K8s Deployment Failure
```bash
# View Pod status
kubectl describe pod -n shenma -l app=quota-manager-frontend

# View events
kubectl get events -n shenma --sort-by='.lastTimestamp'
```

### Health Check
```bash
# Local check
curl http://localhost:3000/health

# K8s check
kubectl exec -n shenma deploy/quota-manager-frontend -- curl http://localhost/health
```

## 📝 Changelog

### v1.0.0 (Latest)
- ✅ Established unified configuration management system
- ✅ Improved interface layout and responsive design
- ✅ Implemented strategy management functionality
- ✅ Added user audit functionality
- ✅ Enhanced system settings page
- ✅ Optimized user experience and visual design
- ✅ Complete Docker and Kubernetes deployment support
- ✅ Production-grade Nginx configuration and security optimization
- ✅ Auto-scaling and monitoring configuration

## 🆘 Support and Contact

If you encounter issues, please contact:
- Development Team: ShenMA AI Team
- Project Repository: [Project URL]
- Documentation: [Documentation URL]

## 📞 Technical Support

### Getting Help
- Check browser console for error messages
- Check network request status
- Ensure configuration file syntax is correct

### Contributing Code
Welcome to submit Issues and Pull Requests to improve the project.

---

**Made with ❤️ by ShenMA AI Team**