<template>
  <router-view></router-view>
</template>

<script setup>
// 根组件逻辑
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  background-color: var(--td-bg-color-page);
  color: var(--td-text-color-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  body {
    background-color: var(--td-bg-color-page);
    color: var(--td-text-color-primary);
  }
}
</style> 