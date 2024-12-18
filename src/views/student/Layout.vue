<template>
  <t-layout>
    <t-header>
      <t-head-menu>
        <template #logo>
          <router-link to="/student/dashboard" class="logo">
            AI智能写作辅导平台
          </router-link>
        </template>
        
        <template #default>
          <t-menu-item value="dashboard" to="/student/dashboard">
            <template #icon><t-icon name="home" /></template>
            首页
          </t-menu-item>
          
          <t-menu-item value="creation" to="/student/creation">
            <template #icon><t-icon name="edit" /></template>
            创作中心
          </t-menu-item>
          
          <t-menu-item value="learning" to="/student/learning">
            <template #icon><t-icon name="book" /></template>
            学习中心
          </t-menu-item>
          
          <t-menu-item value="messages" to="/student/messages">
            <template #icon><t-icon name="chat" /></template>
            消息中心
          </t-menu-item>
          
          <t-menu-item value="profile" to="/student/profile">
            <template #icon><t-icon name="user-circle" /></template>
            个人中心
          </t-menu-item>
        </template>
        
        <template #operations>
          <t-button theme="default" variant="text" @click="handleLogout">
            <template #icon><t-icon name="logout" /></template>
            退出登录
          </t-button>
        </template>
      </t-head-menu>
    </t-header>

    <t-content>
      <div class="container">
        <router-view></router-view>
      </div>
    </t-content>
  </t-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  // 这里可以添加登出逻辑
  router.push('/')
}
</script>

<style scoped>
.logo {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--td-text-color-primary);
  text-decoration: none;
  white-space: nowrap;
}

:deep(.t-head-menu) {
  padding: 0 24px;
}

:deep(.t-menu__operations) {
  padding-right: 0;
}
</style> 