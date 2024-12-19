// 头像管理类
class AvatarManager {
    constructor() {
        // 动漫头像API数组
        this.avatarApis = [
            'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=',
            'https://api.dicebear.com/7.x/bottts/svg?seed=',
            'https://api.dicebear.com/7.x/fun-emoji/svg?seed=',
            'https://api.dicebear.com/7.x/pixel-art/svg?seed='
        ];
        
        // 用户头像缓存
        this.userAvatars = new Map();
        
        // 随机种子字符集
        this.seedChars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    }

    // 生成随机种子
    generateRandomSeed(length = 10) {
        let seed = '';
        for(let i = 0; i < length; i++) {
            seed += this.seedChars.charAt(Math.floor(Math.random() * this.seedChars.length));
        }
        return seed;
    }

    // 获取随机头像URL
    getRandomAvatarUrl() {
        const randomApiIndex = Math.floor(Math.random() * this.avatarApis.length);
        const randomSeed = this.generateRandomSeed();
        return `${this.avatarApis[randomApiIndex]}${randomSeed}`;
    }

    // 获取或生成用户头像URL
    getUserAvatarUrl(userId) {
        if (!this.userAvatars.has(userId)) {
            this.userAvatars.set(userId, this.getRandomAvatarUrl());
        }
        return this.userAvatars.get(userId);
    }
}

// 批改中心类
class CorrectionCenter {
    constructor() {
        // 初始化头像管理器
        this.avatarManager = new AvatarManager();
        
        // 初始化数据管理器
        this.dataManager = new TeacherDataManager();
        
        // 初始化筛选条件
        this.filters = {
            class: '',
            status: '',
            time: ''
        };
        
        // 初始化排序方式
        this.sortOrder = 'time-desc';
        
        // 初始化页面元素
        this.initializeElements();
        
        // 初始化事件监听
        this.initializeEventListeners();
        
        // 加载作业列表
        this.loadAssignments();
    }

    // 初始化页面元素
    initializeElements() {
        // 筛选器
        this.classFilter = document.getElementById('classFilter');
        this.statusFilter = document.getElementById('statusFilter');
        this.timeFilter = document.getElementById('timeFilter');
        this.searchInput = document.querySelector('.search-box input');

        // 作业列表
        this.assignmentList = document.querySelector('.assignment-list');

        // 进度条
        this.progressCount = document.querySelector('.progress-count');
        this.progressFill = document.querySelector('.progress-fill');
    }

    // 初始化事件监听
    initializeEventListeners() {
        // 筛选器变化事件
        this.classFilter.addEventListener('change', () => this.handleFilterChange('class'));
        this.statusFilter.addEventListener('change', () => this.handleFilterChange('status'));
        this.timeFilter.addEventListener('change', () => this.handleFilterChange('time'));

        // 搜索输入事件
        this.searchInput.addEventListener('input', this.debounce(() => this.handleSearch(), 300));

        // 排序按钮点击事件
        document.querySelector('.sort-btn').addEventListener('click', () => this.handleSort());

        // 批量操作按钮点击事件
        document.querySelector('.batch-btn').addEventListener('click', () => this.handleBatchOperation());
    }

    // 加载作业列表
    loadAssignments() {
        // 从数据管理器获取作业列表
        this.assignments = Array.from(this.dataManager.assignments.values());
        this.renderAssignments();
    }

    // 渲染作业列表
    renderAssignments() {
        // 清空现有列表
        this.assignmentList.innerHTML = '';

        // 应用筛选和排序
        let filteredAssignments = this.filterAssignments(this.assignments);
        filteredAssignments = this.sortAssignments(filteredAssignments);

        // 渲染作业卡片
        filteredAssignments.forEach(assignment => {
            const card = this.createAssignmentCard(assignment);
            this.assignmentList.appendChild(card);
        });

        // 更新进度条
        this.updateProgress(filteredAssignments);
    }

    // 创建作业卡片
    createAssignmentCard(assignment) {
        const card = document.createElement('div');
        card.className = 'assignment-card';
        
        // 获取学生头像URL
        const studentAvatarUrl = this.avatarManager.getUserAvatarUrl(assignment.studentId);
        
        card.innerHTML = `
            <div class="card-header">
                <div class="student-info">
                    <img src="${studentAvatarUrl}" alt="Student" class="student-avatar" onerror="this.src='../assets/avatar-placeholder.png'">
                    <div class="info-text">
                        <h3>${assignment.studentName}</h3>
                        <span class="class-name">${assignment.className}</span>
                    </div>
                </div>
                <div class="assignment-status ${assignment.status}">${this.getStatusText(assignment.status)}</div>
            </div>
            <div class="card-content">
                <h4 class="assignment-title">${assignment.title}</h4>
                <p class="assignment-preview">${assignment.content.substring(0, 100)}...</p>
                <div class="assignment-meta">
                    <span><i class="fas fa-clock"></i>${assignment.submitTime}</span>
                    <span><i class="fas fa-file-alt"></i>${assignment.wordCount}字</span>
                    <span><i class="fas fa-redo"></i>第${assignment.draft}稿</span>
                </div>
            </div>
            <div class="card-footer">
                <div class="ai-suggestion">
                    <i class="fas fa-robot"></i>
                    <span>AI建议：重点关注文章结构和细节描写</span>
                </div>
                <button class="correction-btn" data-id="${assignment.id}">开始批改</button>
            </div>
        `;

        // 绑定批改按钮点击事件
        const correctionBtn = card.querySelector('.correction-btn');
        correctionBtn.addEventListener('click', () => this.startCorrection(assignment.id));

        return card;
    }

    // 开始批改
    startCorrection(assignmentId) {
        // 跳转到批改页面
        window.location.href = `correction-page.html?id=${assignmentId}`;
    }

    // 获取状态文本
    getStatusText(status) {
        switch (status) {
            case 'pending':
                return '待批改';
            case 'correcting':
                return '批改中';
            case 'completed':
                return '已完成';
            default:
                return '未知状态';
        }
    }

    // 筛选作业
    filterAssignments(assignments) {
        return assignments.filter(assignment => {
            // 班级筛选
            if (this.filters.class && !assignment.className.includes(this.filters.class)) {
                return false;
            }

            // 状态筛选
            if (this.filters.status && assignment.status !== this.filters.status) {
                return false;
            }

            // 时间筛选
            if (this.filters.time) {
                const submitTime = new Date(assignment.submitTime);
                switch (this.filters.time) {
                    case 'today':
                        if (!this.isToday(submitTime)) return false;
                        break;
                    case 'week':
                        if (!this.isThisWeek(submitTime)) return false;
                        break;
                    case 'month':
                        if (!this.isThisMonth(submitTime)) return false;
                        break;
                }
            }

            // 搜索筛选
            const searchText = this.searchInput.value.toLowerCase();
            if (searchText) {
                const searchTarget = `${assignment.studentName} ${assignment.title}`.toLowerCase();
                if (!searchTarget.includes(searchText)) {
                    return false;
                }
            }

            return true;
        });
    }

    // 排序作业
    sortAssignments(assignments) {
        return assignments.sort((a, b) => {
            const timeA = new Date(a.submitTime).getTime();
            const timeB = new Date(b.submitTime).getTime();
            return this.sortOrder === 'time-desc' ? timeB - timeA : timeA - timeB;
        });
    }

    // 更新进度条
    updateProgress(assignments) {
        const total = assignments.length;
        const completed = assignments.filter(a => a.status === 'completed').length;
        
        this.progressCount.textContent = `${completed}/${total}`;
        this.progressFill.style.width = `${(completed / total) * 100}%`;
    }

    // 处理筛选器变化
    handleFilterChange(filterType) {
        this.filters[filterType] = this[`${filterType}Filter`].value;
        this.renderAssignments();
    }

    // 处理搜索
    handleSearch() {
        this.renderAssignments();
    }

    // 处理排序
    handleSort() {
        const sortBtn = document.querySelector('.sort-btn');
        if (this.sortOrder === 'time-desc') {
            this.sortOrder = 'time-asc';
            sortBtn.innerHTML = '<i class="fas fa-sort-amount-up"></i>排序';
        } else {
            this.sortOrder = 'time-desc';
            sortBtn.innerHTML = '<i class="fas fa-sort-amount-down"></i>排序';
        }
        this.renderAssignments();
    }

    // 处理批量操作
    handleBatchOperation() {
        // TODO: 实现批量操作逻辑
        alert('批量操作功能开发中...');
    }

    // 检查是否是今天
    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    // 检查是否是本周
    isThisWeek(date) {
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDay = new Date(firstDay);
        lastDay.setDate(lastDay.getDate() + 6);

        return date >= firstDay && date <= lastDay;
    }

    // 检查是否是本月
    isThisMonth(date) {
        const today = new Date();
        return date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 初始化批改中心
document.addEventListener('DOMContentLoaded', () => {
    const correctionCenter = new CorrectionCenter();
});

// 处理头像加载和用户菜单
document.addEventListener('DOMContentLoaded', function() {
    // 处理头像加载
    const userAvatar = document.querySelector('.user-avatar');
    const avatarPlaceholder = document.querySelector('.avatar-placeholder');
    const userName = document.querySelector('.user-name').textContent;

    // 果头像加载失败，显示占位符
    userAvatar.onerror = function() {
        this.style.display = 'none';
        avatarPlaceholder.style.display = 'flex';
        // 设置占位符文字为用户名的第一个字
        avatarPlaceholder.querySelector('span').textContent = userName.charAt(0);
    };

    // 处理用户菜单
    const navUser = document.querySelector('.nav-user');
    const userMenu = document.querySelector('.user-menu');

    navUser.addEventListener('click', function(e) {
        userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
        e.stopPropagation();
    });

    // 点击页面其他地方时关闭用户菜单
    document.addEventListener('click', function() {
        userMenu.style.display = 'none';
    });

    // 处理退出登录
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        // TODO: 实现退出登录逻辑
        alert('退出登录');
    });
}); 