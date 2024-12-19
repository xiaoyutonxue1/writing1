// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initDashboard();
    initCharts();
    initNotifications();
    initCardAnimations();
    initErrorHandling();
    initAIAssistant();
});

// 初始化仪表盘数据
async function initDashboard() {
    try {
        // 这里应该是从后端API获取数据
        const dashboardData = await fetchDashboardData();
        updateDashboardData(dashboardData);
    } catch (error) {
        handleError('加载仪表盘数据失败', error);
    }
}

// 模拟获取仪表盘数据
async function fetchDashboardData() {
    // 实际项目中这里应该调用后端API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                parentName: '张三',
                todayHomework: '2项待完成',
                weeklyWriting: '完成3篇',
                teacherFeedback: '1条新反馈',
                abilityGrowth: '+3分'
            });
        }, 500);
    });
}

// 更新仪表盘数据
function updateDashboardData(data) {
    const elements = {
        parentName: document.getElementById('parentName'),
        todayHomework: document.getElementById('todayHomework'),
        weeklyWriting: document.getElementById('weeklyWriting'),
        teacherFeedback: document.getElementById('teacherFeedback'),
        abilityGrowth: document.getElementById('abilityGrowth')
    };

    // 使用动画效果更新数据
    Object.entries(elements).forEach(([key, element]) => {
        if (element && data[key]) {
            animateTextChange(element, data[key]);
        }
    });
}

// 初始化图表
function initCharts() {
    renderAbilityRadar();
    renderStudyTimeChart();
}

// 渲染能力雷达图
function renderAbilityRadar() {
    const chart = echarts.init(document.getElementById('abilityRadar'));
    
    const option = {
        title: {
            text: '写作能力分析',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 14,
                color: '#1d1d1f'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            data: ['当前水平', '班级平均'],
            bottom: 0
        },
        radar: {
            indicator: [
                { name: '内容构思', max: 100 },
                { name: '语言表达', max: 100 },
                { name: '结构布局', max: 100 },
                { name: '文体特征', max: 100 },
                { name: '创新思维', max: 100 }
            ],
            center: ['50%', '50%'],
            radius: '65%',
            splitNumber: 4,
            shape: 'circle',
            splitArea: {
                areaStyle: {
                    color: ['#f8f9fa', '#f3f4f6', '#e5e7eb', '#d1d5db'],
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#9ca3af'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#9ca3af'
                }
            }
        },
        series: [{
            name: '写作能力分析',
            type: 'radar',
            data: [
                {
                    value: [85, 78, 72, 80, 85],
                    name: '当前水平',
                    symbol: 'circle',
                    symbolSize: 6,
                    lineStyle: {
                        width: 2,
                        color: '#2563eb'
                    },
                    areaStyle: {
                        color: 'rgba(37, 99, 235, 0.2)'
                    },
                    itemStyle: {
                        color: '#2563eb'
                    }
                },
                {
                    value: [70, 75, 75, 70, 75],
                    name: '班级平均',
                    symbol: 'circle',
                    symbolSize: 6,
                    lineStyle: {
                        width: 2,
                        color: '#9ca3af',
                        type: 'dashed'
                    },
                    areaStyle: {
                        color: 'rgba(156, 163, 175, 0.1)'
                    },
                    itemStyle: {
                        color: '#9ca3af'
                    }
                }
            ]
        }]
    };
    
    chart.setOption(option);
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// 渲染学习时间分布图
function renderStudyTimeChart() {
    const chart = echarts.init(document.getElementById('studyTimeChart'));
    
    const option = {
        title: {
            text: '每日学习时间分布',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 14,
                color: '#1d1d1f'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine: {
                lineStyle: {
                    color: '#9ca3af'
                }
            },
            axisLabel: {
                color: '#4b5563'
            }
        },
        yAxis: {
            type: 'value',
            name: '学习时长(分钟)',
            nameTextStyle: {
                color: '#4b5563'
            },
            axisLine: {
                lineStyle: {
                    color: '#9ca3af'
                }
            },
            axisLabel: {
                color: '#4b5563'
            },
            splitLine: {
                lineStyle: {
                    color: '#e5e7eb'
                }
            }
        },
        series: [
            {
                name: '写作学习',
                type: 'bar',
                data: [45, 30, 60, 45, 50, 90, 75],
                itemStyle: {
                    color: '#2563eb'
                },
                barWidth: '40%',
                emphasis: {
                    itemStyle: {
                        color: '#1d4ed8'
                    }
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// 初始化通知功能
function initNotifications() {
    const notificationIcon = document.querySelector('.notification-icon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            // 这里应该显示通知列表
            showNotifications();
        });
    }
}

// 显示通知列表
function showNotifications() {
    // 创建通知弹窗
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.innerHTML = `
        <div class="notification-header">
            <h6>通知消息</h6>
            <button class="close-btn">&times;</button>
        </div>
        <div class="notification-list">
            <div class="notification-item unread">
                <div class="notification-content">
                    <div class="notification-title">作业提醒</div>
                    <div class="notification-text">《我的理想》作文今天截止</div>
                    <div class="notification-time">10分钟前</div>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-content">
                    <div class="notification-title">教师反馈</div>
                    <div class="notification-text">王老师对作文进行了点评</div>
                    <div class="notification-time">1小时前</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // 添加关闭按钮事件
    const closeBtn = popup.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(popup);
    });
    
    // 点击外部关闭
    document.addEventListener('click', function closePopup(e) {
        if (!popup.contains(e.target) && !document.querySelector('.notification-icon').contains(e.target)) {
            document.body.removeChild(popup);
            document.removeEventListener('click', closePopup);
        }
    });
}

// 初始化卡片动画
function initCardAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        });
    });
}

// 文本变化动画
function animateTextChange(element, newValue) {
    element.style.transition = 'opacity 0.3s ease';
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.opacity = '1';
    }, 300);
}

// 初始化错误处理
function initErrorHandling() {
    window.addEventListener('unhandledrejection', event => {
        handleError('操作失败', event.reason);
    });
}

// 错误处理函数
function handleError(message, error) {
    console.error(message, error);
    
    // 创建toast提示
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 自动消失
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 退出登录
async function logout() {
    try {
        // 这里应该调用退出登录API
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/index.html';
    } catch (error) {
        handleError('退出登录失败', error);
    }
}

// 初始化AI助手
function initAIAssistant() {
    const aiBtn = document.getElementById('aiAssistantBtn');
    const chatPanel = document.getElementById('aiChatPanel');
    const closeBtn = document.getElementById('closeChatBtn');
    const functionBtn = document.querySelector('.function-btn');
    const functionPanel = document.getElementById('functionPanel');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendMessageBtn');

    // 打开/关闭聊天面板
    aiBtn.addEventListener('click', () => {
        chatPanel.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        chatPanel.classList.remove('active');
        functionPanel.classList.remove('active');
    });

    // 切换功能面板
    functionBtn.addEventListener('click', () => {
        functionPanel.classList.toggle('active');
    });

    // 选择功能
    const functionItems = document.querySelectorAll('.function-item');
    functionItems.forEach(item => {
        item.addEventListener('click', () => {
            const function_type = item.dataset.function;
            functionPanel.classList.remove('active');
            handleFunctionSelect(function_type);
        });
    });

    // 发送消息
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 自动调整文本框高度
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });
}

// 处理功能选择
function handleFunctionSelect(function_type) {
    const messages = document.getElementById('chatMessages');
    let message = '';

    switch (function_type) {
        case 'analysis':
            message = `
                <div class="message ai">
                    我可以帮您分析孩子的写作学习情况:
                    <ul>
                        <li>写作水平评估和分析</li>
                        <li>学习进步趋势追踪</li>
                        <li>个性化能力诊断报告</li>
                        <li>写作习惯和态度分析</li>
                    </ul>
                    您想了解哪些方面的分析呢?
                </div>
            `;
            break;
        case 'guide':
            message = `
                <div class="message ai">
                    作为辅导顾问,我可以帮您:
                    <ul>
                        <li>制定科学的辅导计划</li>
                        <li>提供实用的辅导方法</li>
                        <li>解答辅导过程中的困惑</li>
                        <li>培养孩子的写作兴趣</li>
                    </ul>
                    请问您在辅导过程中遇到什么困难?
                </div>
            `;
            break;
        case 'resource':
            message = `
                <div class="message ai">
                    我可以为孩子推荐:
                    <ul>
                        <li>优质写作素材和范文</li>
                        <li>趣味写作练习活动</li>
                        <li>分级阅读书目推荐</li>
                        <li>写作竞赛和活动信息</li>
                    </ul>
                    需要我推荐哪类资源呢?
                </div>
            `;
            break;
        case 'communication':
            message = `
                <div class="message ai">
                    我可以协助您:
                    <ul>
                        <li>理解老师的评语和建议</li>
                        <li>准备家长会交流要点</li>
                        <li>记录和整理沟通重点</li>
                        <li>提供家校互动建议</li>
                    </ul>
                    您需要什么沟通帮助?
                </div>
            `;
            break;
    }

    messages.insertAdjacentHTML('beforeend', message);
    messages.scrollTop = messages.scrollHeight;
}

// 发送消息
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const messages = document.getElementById('chatMessages');
    const text = input.value.trim();

    if (!text) return;

    // 添加用户消息
    const userMessage = `
        <div class="message user">
            ${text}
        </div>
    `;
    messages.insertAdjacentHTML('beforeend', userMessage);

    // 清空输入框
    input.value = '';
    input.style.height = 'auto';

    // 显示AI正在输入
    const typingIndicator = `
        <div class="message ai typing">
            AI正在思考...
        </div>
    `;
    messages.insertAdjacentHTML('beforeend', typingIndicator);
    messages.scrollTop = messages.scrollHeight;

    try {
        // 这里应该调用后端API获取AI回复
        const response = await mockAIResponse(text);
        
        // 移除输入指示器
        const typingMessage = messages.querySelector('.typing');
        if (typingMessage) {
            typingMessage.remove();
        }

        // 添加AI回复
        const aiMessage = `
            <div class="message ai">
                ${response}
            </div>
        `;
        messages.insertAdjacentHTML('beforeend', aiMessage);
        messages.scrollTop = messages.scrollHeight;
    } catch (error) {
        handleError('AI响应失败', error);
    }
}

// 模拟AI响应
async function mockAIResponse(text) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 根据关键词智能回复
    if (text.includes('分析') || text.includes('水平') || text.includes('能力')) {
        return `
            根据最近一个月的数据分析,孩子的写作情况如下:
            <br><br>
            <b>优势:</b>
            <br>1. 想象力丰富,能够创造性地展开写作
            <br>2. 善于观察生活,素材积累较好
            <br><br>
            <b>待提升:</b>
            <br>1. 文章结构还需要加强
            <br>2. 标点符号使用有待规范
            <br><br>
            建议重点关注结构训练,我可以为您推荐一些相关的练习资源。
        `;
    } else if (text.includes('辅导') || text.includes('建议') || text.includes('方法')) {
        return `
            针对孩子目前的��况,建议您:
            <br><br>
            1. 每天固定15-20分钟的亲子阅读时间
            <br>2. 引导孩子写观察日记,培养观察能力
            <br>3. 用提问的方式启发孩子思考
            <br>4. 多鼓励表扬,营造轻松的写作氛围
            <br><br>
            需要我详细说明某个方面吗?
        `;
    } else if (text.includes('资源') || text.includes('练习') || text.includes('推荐')) {
        return `
            为孩子推荐以下资源:
            <br><br>
            <b>课外阅读:</b>
            <br>1.《小学生优秀作文选》
            <br>2.《我的自然观察日记》
            <br><br>
            <b>练习活动:</b>
            <br>1. 每周趣味写作主题挑战
            <br>2. 亲子共写小故事
            <br><br>
            您觉得这些适合孩子吗?
        `;
    } else if (text.includes('老师') || text.includes('评语') || text.includes('沟通')) {
        return `
            关于和老师的沟通,建议您:
            <br><br>
            1. 定期查看老师的评语和建议
            <br>2. 记录孩子在家写作的表现和困惑
            <br>3. 通过家校本反馈练习完成情况
            <br>4. 有问题及时与老师沟通
            <br><br>
            需要我帮您��理沟通要点吗?
        `;
    } else {
        return `
            感谢您的提问。为了给您更准确的建议,请告诉我:
            <br><br>
            1. 孩子目前写作学习中的具体困扰
            <br>2. 您最关心的是哪些方面
            <br>3. 希望获得什么样的帮助
            <br><br>
            我会根据您的需求提供更有针对性的建议。
        `;
    }
} 