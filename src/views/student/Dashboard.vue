<template>
  <div class="dashboard-content">
    <!-- 班级作业 -->
    <div class="section">
      <t-card title="班级作业" :bordered="false">
        <t-row :gutter="[16, 16]">
          <t-col :xs="24" :sm="12" :xl="8" v-for="assignment in assignments" :key="assignment.id">
            <t-card :bordered="false" class="assignment-card" theme="poster2">
              <template #title>
                <div class="card-header">
                  <span>{{ assignment.title }}</span>
                  <t-tag theme="primary" variant="light-outline" v-if="!assignment.completed">
                    进行中
                  </t-tag>
                  <t-tag theme="success" variant="light-outline" v-else>
                    已完成
                  </t-tag>
                </div>
              </template>
              
              <t-space direction="vertical" size="small">
                <div class="text-gray">截止日期：{{ assignment.deadline }}</div>
                <div>{{ assignment.description }}</div>
              </t-space>
              
              <template #footer>
                <t-space align="center" size="small">
                  <t-button theme="primary" @click="viewAssignment(assignment)">
                    <template #icon><t-icon name="browse" /></template>
                    查看详情
                  </t-button>
                  <div class="text-gray">{{ assignment.completed ? '已提交' : '未提交' }}</div>
                </t-space>
              </template>
            </t-card>
          </t-col>
        </t-row>
      </t-card>
    </div>

    <!-- 写作分类 -->
    <div class="section">
      <t-card title="写作分类" :bordered="false">
        <t-row :gutter="[16, 16]">
          <t-col :xs="24" :sm="12" :xl="6" v-for="category in categories" :key="category.id">
            <t-collapse :value="category.expanded" @change="handleCategoryChange">
              <t-collapse-panel :value="category.id" :header="category.title" :icon="category.icon">
                <t-list>
                  <t-list-item
                    v-for="item in category.items"
                    :key="item.id"
                    @click="handleCategoryItemClick(item)"
                  >
                    {{ item.name }}
                  </t-list-item>
                </t-list>
              </t-collapse-panel>
            </t-collapse>
          </t-col>
        </t-row>
      </t-card>
    </div>

    <!-- 优秀作文推荐 -->
    <div class="section">
      <t-card title="优秀作文推荐" :bordered="false">
        <t-row :gutter="[16, 16]">
          <t-col :xs="24" :sm="12" v-for="article in articles" :key="article.id">
            <t-card :bordered="false" class="article-card" theme="poster2">
              <template #title>
                <div class="card-header">
                  <span>{{ article.title }}</span>
                </div>
              </template>
              
              <t-space direction="vertical" size="small">
                <div class="text-gray">{{ article.meta }}</div>
                <div class="article-preview">{{ article.preview }}</div>
                <t-space>
                  <t-tag v-for="tag in article.tags" :key="tag" theme="primary" variant="light">
                    {{ tag }}
                  </t-tag>
                </t-space>
              </t-space>
              
              <template #footer>
                <t-button theme="primary" block @click="readArticle(article)">
                  阅读全文
                </t-button>
              </template>
            </t-card>
          </t-col>
        </t-row>
      </t-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 班级作业数据
const assignments = ref([
  {
    id: 1,
    title: '记叙文写作练习',
    deadline: '2023-12-20',
    description: '以"难忘的一天"为主题，写一篇不少于800字的记叙文。',
    completed: false
  },
  {
    id: 2,
    title: '议论文写作练习',
    deadline: '2023-12-10',
    description: '以"诚信"为主题，写一篇不少于1000字的议论文。',
    completed: true
  }
])

// 写作分类数据
const categories = ref([
  {
    id: 'type',
    title: '按文体分类',
    icon: 'folder',
    expanded: false,
    items: [
      { id: 1, name: '记叙文' },
      { id: 2, name: '议论文' },
      { id: 3, name: '说明文' },
      { id: 4, name: '应用文' }
    ]
  },
  {
    id: 'content',
    title: '按内容分类',
    icon: 'book',
    expanded: false,
    items: [
      { id: 1, name: '写物' },
      { id: 2, name: '写人' },
      { id: 3, name: '写景' },
      { id: 4, name: '写事' }
    ]
  }
])

// 优秀作文数据
const articles = ref([
  {
    id: 1,
    title: '春天的早晨',
    meta: '类型：记叙文 | 作者：张同学',
    preview: '清晨的阳光洒在窗台上，整个世界都笼罩在金色的光芒中...',
    tags: ['写景', '抒情', '800字']
  },
  {
    id: 2,
    title: '科技改变生活',
    meta: '类型：议论文 | 作者：李同学',
    preview: '随着科技的快速发展，我们的生活方式发生了翻天覆地的变化...',
    tags: ['议论', '说理', '1200字']
  }
])

// 查看作业详情
const viewAssignment = (assignment) => {
  // TODO: 实现查看作业详情的逻辑
  console.log('查看作业:', assignment)
}

// 处理分类展开/收起
const handleCategoryChange = (value) => {
  categories.value = categories.value.map(category => ({
    ...category,
    expanded: value.includes(category.id)
  }))
}

// 处理分类项点击
const handleCategoryItemClick = (item) => {
  // TODO: 实现分类项点击的逻辑
  console.log('点击分类项:', item)
}

// 阅读文章
const readArticle = (article) => {
  // TODO: 实现阅读文章的逻辑
  console.log('阅读文章:', article)
}
</script>

<style scoped>
.dashboard-content {
  padding: 24px 0;
}

.section {
  margin-bottom: 24px;
}

.section:last-child {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-gray {
  color: var(--td-text-color-secondary);
  font-size: 14px;
}

.article-preview {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--td-text-color-secondary);
}

:deep(.t-card__title) {
  font-size: 18px;
  font-weight: 500;
}

:deep(.t-list-item) {
  cursor: pointer;
}

:deep(.t-list-item:hover) {
  background-color: var(--td-bg-color-container-hover);
}
</style> 