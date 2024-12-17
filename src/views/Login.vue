<template>
  <div class="login-container">
    <t-card class="login-box">
      <template #title>
        <h1>AI智能写作辅导平台</h1>
      </template>
      
      <t-space direction="vertical" size="large" style="width: 100%">
        <t-button block size="large" @click="handleStudentLogin">
          <template #icon><t-icon name="user" /></template>
          学生登录
        </t-button>
        
        <t-button block size="large" theme="success" @click="handleTeacherLogin">
          <template #icon><t-icon name="user-circle" /></template>
          教师登录
        </t-button>
        
        <t-button block size="large" theme="warning" @click="handleParentLogin">
          <template #icon><t-icon name="usergroup" /></template>
          家长登录
        </t-button>
      </t-space>
    </t-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 登录处理函数
const handleStudentLogin = () => {
  router.push('/student/dashboard')
}

const handleTeacherLogin = () => {
  router.push('/teacher/dashboard')
}

const handleParentLogin = () => {
  router.push('/parent/dashboard')
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--td-brand-color) 0%, var(--td-brand-color-hover) 100%);
}

.login-box {
  width: 100%;
  max-width: 400px;
}

.login-box :deep(h1) {
  text-align: center;
  margin-bottom: 24px;
  color: var(--td-text-color-primary);
}

.login-box :deep(.t-card__body) {
  padding: 32px;
}
</style> 