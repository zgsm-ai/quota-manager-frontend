<template>
  <div id="app">
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>Quota Manager</h2>
        </div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dashboard">
            <el-icon><House /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/strategies">
            <el-icon><Document /></el-icon>
            <span>Strategy Management</span>
          </el-menu-item>
          <el-menu-item index="/user-audit">
            <el-icon><User /></el-icon>
            <span>User Audit</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>Settings</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 顶部导航 -->
        <el-header class="header">
          <div class="header-content">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
              <el-breadcrumb-item>{{ $route.meta.title || 'Page' }}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="header-right">
              <el-button @click="refreshPage" :icon="Refresh" circle />
            </div>
          </div>
        </el-header>

        <!-- 主内容 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { Refresh, House, Document, User, Setting } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const refreshPage = () => {
  location.reload()
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100%;
  display: flex;
}

.sidebar {
  background-color: #304156;
  color: #bfcbd9;
  flex-shrink: 0;
  width: 200px !important;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #434a50;
}

.logo h2 {
  color: #fff;
  margin: 0;
  font-size: 18px;
}

.el-menu-vertical {
  border-right: none;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px 0 40px;
  display: flex;
  align-items: center;
  height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.main-content {
  background-color: #f5f5f5;
  padding: 20px 20px 20px 40px;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  width: 100%;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#app {
  height: 100vh;
  width: 100vw;
}

/* 确保Element Plus容器组件正常工作 */
.el-container {
  width: 100% !important;
  height: 100% !important;
}

.el-aside {
  overflow: visible !important;
}

.el-main {
  padding: 0 !important;
}

/* 覆盖Element Plus的默认样式，为主内容区添加合适的内边距 */
.main-content.el-main {
  padding: 20px 20px 20px 40px !important;
}
</style>
