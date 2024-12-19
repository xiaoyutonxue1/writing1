// 教师工作台类
class TeacherDashboard {
    constructor() {
        this.version = 'v2.1.0';
        this.dataManager = new TeacherDataManager();
        
        // 初始化图表
        this.initCharts();
        // 初始化事件监听
        this.initEventListeners();
        // 加载初始数据
        this.loadDashboardData();
    }

    // 初始化图表
    initCharts() {
        // 初始化周数据统计图表
        this.initWeeklyStatsChart();
        // 初始化学生活跃度图表
        this.initActivityChart();
        // 初始化写作进度图表
        this.initProgressChart();
        // 初始化能力提升图表
        this.initImprovementChart();
    }

    // 初始化周数据统计图表
    initWeeklyStatsChart() {
        const ctx = document.getElementById('weeklyStatsChart');
        if (!ctx) return;

        this.weeklyStatsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                datasets: [{
                    label: '批改数量',
                    data: [12, 19, 15, 8, 20, 14, 10],
                    backgroundColor: '#60a5fa',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `批改数量: ${context.raw}篇`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            stepSize: 5
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        this.showDayDetails(index);
                    }
                }
            }
        });
    }

    // 初始化学生活跃度���表
    initActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        this.activityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                datasets: [{
                    label: '在线人数',
                    data: [15, 25, 20, 30, 35, 40, 25],
                    borderColor: '#34d399',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(52, 211, 153, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `在线人数: ${context.raw}人`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            stepSize: 10
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });

        // 定时更新数据
        setInterval(() => {
            this.updateActivityData();
        }, 300000); // 每5分钟更新一次
    }

    // 初始化写作进度图表
    initProgressChart() {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;

        this.progressChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['已完成', '进行中', '未开始'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        '#60a5fa',
                        '#fbbf24',
                        '#e5e7eb'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        this.showProgressDetails(index);
                    }
                }
            }
        });
    }

    // 初始化能力提升图表
    initImprovementChart() {
        const ctx = document.getElementById('improvementChart');
        if (!ctx) return;

        this.improvementChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['内容', '结构', '语言', '表达', '创新'],
                datasets: [{
                    label: '班级��均',
                    data: [80, 75, 85, 70, 65],
                    borderColor: '#60a5fa',
                    backgroundColor: 'rgba(96, 165, 250, 0.2)',
                    pointBackgroundColor: '#60a5fa',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#60a5fa'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        },
                        pointLabels: {
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}分`;
                            }
                        }
                    }
                }
            }
        });

        // 添加图表切换功能
        this.addImprovementChartControls();
    }

    // 更新活跃度数据
    updateActivityData() {
        const newData = this.dataManager.getRealtimeActivityData();
        if (this.activityChart && newData) {
            this.activityChart.data.datasets[0].data = newData;
            this.activityChart.update();
        }
    }

    // 显示某天的详细数据
    showDayDetails(dayIndex) {
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const data = this.weeklyStatsChart.data.datasets[0].data[dayIndex];
        
        const popup = document.createElement('div');
        popup.className = 'chart-popup';
        popup.innerHTML = `
            <div class="popup-header">
                <h4>${days[dayIndex]}批改详情</h4>
                <button class="close-popup"><i class="fas fa-times"></i></button>
            </div>
            <div class="popup-content">
                <div class="stat-item">
                    <span class="stat-label">总批改数量</span>
                    <span class="stat-value">${data}篇</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">平均批改时��</span>
                    <span class="stat-value">15分钟</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">优秀作文数</span>
                    <span class="stat-value">${Math.floor(data * 0.3)}篇</span>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // 绑定关闭按钮事件
        popup.querySelector('.close-popup').addEventListener('click', () => {
            popup.remove();
        });

        // 点击其他地方关闭弹窗
        document.addEventListener('click', (e) => {
            if (!popup.contains(e.target)) {
                popup.remove();
            }
        });
    }

    // 显示进度详情
    showProgressDetails(index) {
        const labels = ['已完成', '进行中', '未开始'];
        const data = this.progressChart.data.datasets[0].data[index];
        
        const popup = document.createElement('div');
        popup.className = 'chart-popup';
        popup.innerHTML = `
            <div class="popup-header">
                <h4>${labels[index]}作业详情</h4>
                <button class="close-popup"><i class="fas fa-times"></i></button>
            </div>
            <div class="popup-content">
                <div class="stat-item">
                    <span class="stat-label">作业数量</span>
                    <span class="stat-value">${data}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">学生人数</span>
                    <span class="stat-value">${Math.floor(data * 0.45)}人</span>
                </div>
                <div class="progress-list">
                    ${this.getProgressList(index)}
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // 绑定关闭按钮事件
        popup.querySelector('.close-popup').addEventListener('click', () => {
            popup.remove();
        });

        // 点击其他地方关闭弹窗
        document.addEventListener('click', (e) => {
            if (!popup.contains(e.target)) {
                popup.remove();
            }
        });
    }

    // 获取进度列表
    getProgressList(index) {
        const status = ['已完成', '进行中', '未开始'];
        const mockData = [
            { name: '李明', title: '春天的早晨', time: '2024-01-15' },
            { name: '张华', title: '我的理想', time: '2024-01-14' },
            { name: '王芳', title: '难忘的一天', time: '2024-01-13' }
        ];

        return mockData.map(item => `
            <div class="progress-item">
                <div class="student-info">
                    <span class="student-name">${item.name}</span>
                    <span class="assignment-title">${item.title}</span>
                </div>
                <span class="status ${status[index].replace(/\s/g, '-')}">${status[index]}</span>
                <span class="time">${item.time}</span>
            </div>
        `).join('');
    }

    // 添加能力提升图表控制
    addImprovementChartControls() {
        const container = document.querySelector('.ability-improvement');
        if (!container) return;

        const controls = document.createElement('div');
        controls.className = 'chart-controls';
        controls.innerHTML = `
            <button class="control-btn active" data-type="class">班级平均</button>
            <button class="control-btn" data-type="personal">个人成长</button>
        `;

        container.insertBefore(controls, container.firstChild.nextSibling);

        // 绑定切换事件
        controls.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.updateImprovementChart(type);
                
                // 更新按钮状态
                controls.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    // 更新能力提升图表
    updateImprovementChart(type) {
        if (!this.improvementChart) return;

        const data = type === 'class' 
            ? [80, 75, 85, 70, 65]  // 班级数据
            : [85, 80, 90, 75, 70]; // 个人数据

        this.improvementChart.data.datasets[0].data = data;
        this.improvementChart.data.datasets[0].label = type === 'class' ? '班级平均' : '个人成长';
        this.improvementChart.update();
    }

    // 初始化事件监听
    initEventListeners() {
        // 监听新作业提交
        window.addEventListener('newAssignment', (e) => {
            this.handleNewAssignment(e.detail);
        });

        // 监听进度更新
        window.addEventListener('progressUpdate', (e) => {
            this.handleProgressUpdate(e.detail);
        });

        // 监听AI建议更新
        window.addEventListener('aiSuggestionUpdate', (e) => {
            this.handleAISuggestionUpdate(e.detail);
        });

        // 绑定待办事项复选框事件
        document.querySelectorAll('.todo-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleTodoChange(e.target);
            });
        });

        // 绑定用户菜单事件
        const navUser = document.querySelector('.nav-user');
        const userMenu = document.querySelector('.user-menu');
        if (navUser && userMenu) {
            navUser.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!navUser.contains(e.target)) {
                    userMenu.classList.remove('active');
                }
            });

            // 绑定退出登录事件
            const logoutBtn = document.getElementById('logout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
            }
        }

        // 处理头像加载失败
        const avatar = document.querySelector('.user-avatar');
        if (avatar) {
            avatar.addEventListener('error', () => {
                avatar.style.display = 'none';
                const placeholder = document.querySelector('.avatar-placeholder');
                if (placeholder) {
                    placeholder.style.display = 'flex';
                }
            });
        }
    }

    // 处理退出登录
    handleLogout() {
        // 这里添加退出登录的逻辑
        if (confirm('确定要退出登录吗？')) {
            // 清除本地存储
            localStorage.clear();
            // 跳转到登录页
            window.location.href = '/login.html';
        }
    }

    // 加载仪表盘数据
    loadDashboardData() {
        // 加载快捷操作数据
        this.loadQuickActionData();
        // 加载最近动态
        this.loadRecentActivities();
        // 加载待办事项
        this.loadTodoList();
        // 加载教学日历
        this.loadTeachingCalendar();
    }

    // 加载快捷操作数据
    loadQuickActionData() {
        // 获取待批改作业数量
        const pendingCount = document.querySelector('.pending-assignments .count');
        if (pendingCount) {
            pendingCount.textContent = this.dataManager.getClassAssignments().length;
        }

        // 获取学生求助数量
        const requestCount = document.querySelector('.student-requests .count');
        if (requestCount) {
            requestCount.textContent = '5'; // 示例数据
        }

        // 获取课程通知数量
        const noticeCount = document.querySelector('.class-notices .count');
        if (noticeCount) {
            noticeCount.textContent = '3'; // 示例数据
        }

        // 获取最近访问数量
        const recentCount = document.querySelector('.recent-views .count');
        if (recentCount) {
            recentCount.textContent = '8'; // 示例数据
        }
    }

    // 加载最近动态
    loadRecentActivities() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        // 获取最近活动数据
        const activities = this.dataManager.getRecentActivities();
        
        // 清空现有内容
        activityList.innerHTML = '';

        // 添加活动项
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-text">${activity.text}</p>
                    <p class="activity-time">${this.formatTime(activity.time)}</p>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    // 加载待办事项
    loadTodoList() {
        const todoList = document.querySelector('.todo-items');
        if (!todoList) return;

        // 获取待办事项数据
        const todos = this.dataManager.getTodoList();
        
        // 清空现有内容
        todoList.innerHTML = '';

        // 添加待办项
        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = 'todo-item';
            todoItem.innerHTML = `
                <input type="checkbox" id="todo-${todo.id}" ${todo.completed ? 'checked' : ''}>
                <label for="todo-${todo.id}">${todo.text}</label>
            `;
            todoList.appendChild(todoItem);
        });
    }

    // 加载教学日历
    loadTeachingCalendar() {
        const calendar = document.getElementById('teachingCalendar');
        if (!calendar) return;

        // 获取当前日期
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDate = now.getDate();

        // 创建日历头部
        const calendarHeader = document.createElement('div');
        calendarHeader.className = 'calendar-header';
        calendarHeader.innerHTML = `
            <button class="prev-month"><i class="fas fa-chevron-left"></i></button>
            <h4>${currentYear}年${currentMonth + 1}月</h4>
            <button class="next-month"><i class="fas fa-chevron-right"></i></button>
        `;
        calendar.appendChild(calendarHeader);

        // 创建星期标题
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekHeader = document.createElement('div');
        weekHeader.className = 'calendar-week';
        weekHeader.innerHTML = weekDays.map(day => `<div class="week-day">${day}</div>`).join('');
        calendar.appendChild(weekHeader);

        // 获取当月第一天是星期几
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        // 获取当月天数
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // 创建日期网格
        const daysGrid = document.createElement('div');
        daysGrid.className = 'calendar-grid';

        // 添加空白天数
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            daysGrid.appendChild(emptyDay);
        }

        // 添加日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            if (day === currentDate) {
                dayElement.classList.add('current');
            }

            // 检查是否有教学任务
            const tasks = this.getTeachingTasks(currentYear, currentMonth + 1, day);
            if (tasks.length > 0) {
                dayElement.classList.add('has-task');
                dayElement.setAttribute('data-tasks', JSON.stringify(tasks));
            }

            dayElement.innerHTML = `
                <span class="day-number">${day}</span>
                ${tasks.length > 0 ? `<div class="task-indicator">${tasks.length}</div>` : ''}
            `;

            // 添加点击事件
            dayElement.addEventListener('click', () => {
                this.showDayTasks(dayElement, tasks);
            });

            daysGrid.appendChild(dayElement);
        }

        calendar.appendChild(daysGrid);

        // 绑定月份切换事件
        const prevButton = calendarHeader.querySelector('.prev-month');
        const nextButton = calendarHeader.querySelector('.next-month');

        prevButton.addEventListener('click', () => {
            this.changeMonth(-1);
        });

        nextButton.addEventListener('click', () => {
            this.changeMonth(1);
        });
    }

    // 获取指定日期的教学任务
    getTeachingTasks(year, month, day) {
        // 这里应该从数据管理器获取实际的教学任务数据
        // 现在使用模拟数据
        const tasks = [
            {
                date: '2024-1-15',
                tasks: [
                    { title: '批改作业', time: '14:00', type: 'correction' },
                    { title: '班级会议', time: '16:00', type: 'meeting' }
                ]
            },
            {
                date: '2024-1-20',
                tasks: [
                    { title: '写作指导课', time: '10:00', type: 'class' }
                ]
            }
        ];

        const dateStr = `${year}-${month}-${day}`;
        const dayTasks = tasks.find(t => t.date === dateStr);
        return dayTasks ? dayTasks.tasks : [];
    }

    // 显示日期任务详情
    showDayTasks(dayElement, tasks) {
        const existingPopup = document.querySelector('.task-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        if (tasks.length === 0) return;

        const popup = document.createElement('div');
        popup.className = 'task-popup';
        
        const tasksList = tasks.map(task => `
            <div class="task-item ${task.type}">
                <i class="fas ${this.getTaskIcon(task.type)}"></i>
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div class="task-time">${task.time}</div>
                </div>
            </div>
        `).join('');

        popup.innerHTML = `
            <div class="popup-header">
                <h4>教学任务</h4>
                <button class="close-popup"><i class="fas fa-times"></i></button>
            </div>
            <div class="popup-content">
                ${tasksList}
            </div>
        `;

        // 计算弹窗位置
        const rect = dayElement.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;

        document.body.appendChild(popup);

        // 绑定关闭按钮事件
        popup.querySelector('.close-popup').addEventListener('click', () => {
            popup.remove();
        });

        // 点击其他地方关闭弹窗
        document.addEventListener('click', (e) => {
            if (!popup.contains(e.target) && !dayElement.contains(e.target)) {
                popup.remove();
            }
        });
    }

    // 获取任务图标
    getTaskIcon(type) {
        const icons = {
            'correction': 'fa-edit',
            'meeting': 'fa-users',
            'class': 'fa-chalkboard-teacher'
        };
        return icons[type] || 'fa-calendar-check';
    }

    // 切换月份
    changeMonth(delta) {
        const calendar = document.getElementById('teachingCalendar');
        if (!calendar) return;

        // 清空日历
        calendar.innerHTML = '';
        
        // 更新当前显示的月份
        const currentHeader = calendar.querySelector('.calendar-header h4');
        const [year, month] = currentHeader.textContent.replace(/[年月]/g, '-').split('-');
        
        const newDate = new Date(parseInt(year), parseInt(month) - 1 + delta, 1);
        this.currentYear = newDate.getFullYear();
        this.currentMonth = newDate.getMonth();

        // 重新加载日历
        this.loadTeachingCalendar();
    }

    // 处理新作业提交
    handleNewAssignment(assignment) {
        // 更新待批改数量
        const pendingCount = document.querySelector('.pending-assignments .count');
        if (pendingCount) {
            const currentCount = parseInt(pendingCount.textContent);
            pendingCount.textContent = currentCount + 1;
        }

        // 添加到最近动态
        this.addActivity({
            type: 'assignment',
            text: `${assignment.studentName}提交了作业《${assignment.title}》`,
            time: new Date()
        });
    }

    // 处理进度更新
    handleProgressUpdate(progress) {
        // 更新进度图表
        if (this.progressChart) {
            this.progressChart.data.datasets[0].data = [
                progress.completed,
                progress.inProgress,
                progress.notStarted
            ];
            this.progressChart.update();
        }
    }

    // 处理AI建议更新
    handleAISuggestionUpdate(suggestion) {
        // 添加到最近动态
        this.addActivity({
            type: 'ai',
            text: `AI助手为《${suggestion.title}》生成了新的建议`,
            time: new Date()
        });
    }

    // 处理待办事项变更
    handleTodoChange(checkbox) {
        const todoId = checkbox.id.replace('todo-', '');
        this.dataManager.updateTodoStatus(todoId, checkbox.checked);
    }

    // 添加活动
    addActivity(activity) {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${this.getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-text">${activity.text}</p>
                <p class="activity-time">${this.formatTime(activity.time)}</p>
            </div>
        `;

        // 添加到列表开���
        activityList.insertBefore(activityItem, activityList.firstChild);

        // 如果活动超过10条，删除最后一条
        if (activityList.children.length > 10) {
            activityList.removeChild(activityList.lastChild);
        }
    }

    // 获取活动图标
    getActivityIcon(type) {
        const icons = {
            'assignment': 'fa-file-alt',
            'ai': 'fa-robot',
            'request': 'fa-question-circle',
            'notice': 'fa-bell'
        };
        return icons[type] || 'fa-info-circle';
    }

    // 格式化时间
    formatTime(time) {
        const now = new Date();
        const diff = now - new Date(time);
        
        if (diff < 60000) { // 小于1分钟
            return '刚刚';
        } else if (diff < 3600000) { // 小于1小时
            return `${Math.floor(diff / 60000)}分钟前`;
        } else if (diff < 86400000) { // 小于1天
            return `${Math.floor(diff / 3600000)}小时前`;
        } else {
            return new Date(time).toLocaleDateString();
        }
    }
}

// 等待DOM加载完成后初始化仪表盘
document.addEventListener('DOMContentLoaded', () => {
    console.log('初始化教师工作台...');
    window.teacherDashboard = new TeacherDashboard();
    console.log('教师工作台初始化完成');
}); 