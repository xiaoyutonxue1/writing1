// 模拟数据
const mockData = {
    userInfo: {
        name: '王老师',
        avatar: null,
        teachingYears: 5,
        classes: ['初三(1)班', '初三(2)班'],
        introduction: '从事语文教学5年，擅长作文教学和批改指导。'
    },
    securityInfo: {
        phone: '138****8888',
        email: ''
    },
    teachingStats: {
        correctionCount: {
            total: 1234,
            trend: 12,
            monthly: [150, 230, 224, 218, 135, 147]
        },
        averageScore: {
            value: 88.5,
            trend: 2.5
        },
        aiUsage: {
            value: 85,
            trend: 5
        },
        scoreDistribution: [
            { value: 1048, name: '优秀 (90-100分)' },
            { value: 735, name: '良好 (80-89分)' },
            { value: 580, name: '中等 (70-79分)' },
            { value: 484, name: '及格 (60-69分)' },
            { value: 300, name: '不及格 (<60分)' }
        ]
    },
    resources: [
        {
            name: '记叙文写作教案',
            type: 'word',
            uploadTime: '2024-01-15'
        },
        {
            name: '议论文写作范文集',
            type: 'pdf',
            uploadTime: '2024-01-10'
        },
        {
            name: '作文批改要点指南',
            type: 'word',
            uploadTime: '2024-01-05'
        }
    ],
    settings: {
        notifications: {
            system: true,
            homework: true,
            email: false
        },
        preferences: {
            theme: 'light',
            fontSize: 'medium',
            language: 'zh-CN'
        }
    }
};

let avatarManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    avatarManager = new AvatarManager();
    loadUserData();
    initSideNavigation();
    initAvatarUpload();
    initClassTags();
    initPasswordModal();
    initNotificationSettings();
    initPreferences();
    initCharts();
    initResourceUpload();
});

// 初始化侧边导航
function initSideNavigation() {
    const sideNavItems = document.querySelectorAll('.profile-nav .nav-item');
    const sections = document.querySelectorAll('.content-section');

    // 显示默认页面
    document.getElementById('basic-info').style.display = 'block';

    sideNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);

            // 更新导航项状态
            sideNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // 更新内容区域显示
            sections.forEach(section => {
                section.style.display = section.id === targetId ? 'block' : 'none';
            });
        });
    });
}

// 加载用户数据
function loadUserData() {
    // 设置随机头像
    const avatarPreview = document.querySelector('.avatar-preview img');
    mockData.userInfo.avatar = avatarManager.generateRandomAvatar();
    avatarManager.setAvatar(avatarPreview, mockData.userInfo.avatar);

    // 加载基本信息
    document.querySelector('.avatar-preview img').src = mockData.userInfo.avatar;
    document.querySelector('input[placeholder="请输入姓名"]').value = mockData.userInfo.name;
    document.querySelector('input[placeholder="请输入教龄"]').value = mockData.userInfo.teachingYears;
    document.querySelector('textarea[placeholder="请输入个人简介"]').value = mockData.userInfo.introduction;

    // 加载班级标签
    const classTagsContainer = document.querySelector('.class-tags');
    const addClassBtn = classTagsContainer.querySelector('.add-class-btn');
    mockData.userInfo.classes.forEach(className => {
        const tag = document.createElement('span');
        tag.className = 'class-tag';
        tag.innerHTML = `
            ${className}
            <i class="fas fa-times"></i>
        `;
        classTagsContainer.insertBefore(tag, addClassBtn);
    });

    // 加载账号安全信息
    document.querySelector('.security-item:nth-child(2) .security-text p').textContent = 
        `已绑定：${mockData.securityInfo.phone}`;
    
    // 加载教学统计数据
    document.querySelector('.stats-card:nth-child(1) .stats-value').textContent = 
        mockData.teachingStats.correctionCount.total.toLocaleString();
    document.querySelector('.stats-card:nth-child(1) .stats-trend').textContent = 
        `较上月增长 ${mockData.teachingStats.correctionCount.trend}%`;

    document.querySelector('.stats-card:nth-child(2) .stats-value').textContent = 
        mockData.teachingStats.averageScore.value;
    document.querySelector('.stats-card:nth-child(2) .stats-trend').textContent = 
        `较上月增长 ${mockData.teachingStats.averageScore.trend}分`;

    document.querySelector('.stats-card:nth-child(3) .stats-value').textContent = 
        `${mockData.teachingStats.aiUsage.value}%`;
    document.querySelector('.stats-card:nth-child(3) .stats-trend').textContent = 
        `较上月增长 ${mockData.teachingStats.aiUsage.trend}%`;

    // 加载教学资源
    const resourceList = document.querySelector('.resource-list');
    const uploadArea = resourceList.querySelector('.resource-upload');
    mockData.resources.forEach(resource => {
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        resourceItem.innerHTML = `
            <div class="resource-icon">
                <i class="fas fa-file-${resource.type}"></i>
            </div>
            <div class="resource-info">
                <h3>${resource.name}</h3>
                <p>上传时间：${resource.uploadTime}</p>
            </div>
            <div class="resource-actions">
                <button class="action-btn">
                    <i class="fas fa-download"></i>
                    下载
                </button>
                <button class="action-btn">
                    <i class="fas fa-trash-alt"></i>
                    删除
                </button>
            </div>
        `;
        resourceList.insertBefore(resourceItem, uploadArea);
    });

    // 加载通知设置
    const switches = document.querySelectorAll('.switch input');
    switches[0].checked = mockData.settings.notifications.system;
    switches[1].checked = mockData.settings.notifications.homework;
    switches[2].checked = mockData.settings.notifications.email;

    // 加载偏好设置
    document.querySelector(`input[name="theme"][value="${mockData.settings.preferences.theme}"]`).checked = true;
    document.querySelector(`.size-btn:nth-child(${
        {'small': 1, 'medium': 2, 'large': 3}[mockData.settings.preferences.fontSize]
    })`).classList.add('active');
    document.querySelector('.language-select').value = mockData.settings.preferences.language;
}

// 初始化头像上传
function initAvatarUpload() {
    const uploadBtn = document.querySelector('.upload-btn');
    const avatarPreview = document.querySelector('.avatar-preview img');

    // 添加随机头像按钮
    const randomBtn = document.createElement('button');
    randomBtn.className = 'upload-btn random-avatar-btn';
    randomBtn.innerHTML = '<i class="fas fa-random"></i> 随机头像';
    randomBtn.style.marginLeft = '8px';
    uploadBtn.parentElement.appendChild(randomBtn);

    // 随机头像按钮点击事件
    randomBtn.addEventListener('click', () => {
        avatarManager.updateAvatar(avatarPreview);
        showSuccess('头像已更新');
    });

    // 原有的上传功能
    uploadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showError('文件大小不能超过2MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarManager.setAvatar(avatarPreview, e.target.result);
                    showSuccess('头像已更新');
                };
                reader.readAsDataURL(file);
            }
        };

        input.click();
    });
}

// 初始化班级标签
function initClassTags() {
    const classTagsContainer = document.querySelector('.class-tags');
    const addClassBtn = document.querySelector('.add-class-btn');

    // 删除班级标签
    classTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-times')) {
            e.target.parentElement.remove();
        }
    });

    // 添加班级标签
    addClassBtn.addEventListener('click', () => {
        const className = prompt('请输入班级名称');
        if (className) {
            const tag = document.createElement('span');
            tag.className = 'class-tag';
            tag.innerHTML = `
                ${className}
                <i class="fas fa-times"></i>
            `;
            addClassBtn.parentElement.insertBefore(tag, addClassBtn);
        }
    });
}

// 初始化修改密码弹窗
function initPasswordModal() {
    const modal = document.querySelector('.password-modal');
    const modifyBtn = document.querySelector('.security-item .modify-btn');
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const confirmBtn = modal.querySelector('.confirm-btn');
    const inputs = modal.querySelectorAll('input');

    // 打开弹窗
    modifyBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        inputs.forEach(input => input.value = '');
    });

    // 关闭弹窗
    const closeModal = () => {
        modal.style.display = 'none';
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 确认修改
    confirmBtn.addEventListener('click', () => {
        const [oldPassword, newPassword, confirmPassword] = Array.from(inputs).map(input => input.value);

        if (!oldPassword || !newPassword || !confirmPassword) {
            showError('请填写完整信息');
            return;
        }

        if (newPassword !== confirmPassword) {
            showError('两次输入的新密码不一致');
            return;
        }

        if (newPassword.length < 6) {
            showError('密码长度不能少于6位');
            return;
        }

        // TODO: 调用修改密码API
        closeModal();
        showSuccess('密码修改成功');
    });
}

// 初始化通知设置
function initNotificationSettings() {
    const switches = document.querySelectorAll('.switch input');

    switches.forEach(switchInput => {
        switchInput.addEventListener('change', () => {
            const settingName = switchInput.closest('.setting-item').querySelector('h3').textContent;
            const enabled = switchInput.checked;
            
            // TODO: 调用更新设置API
            showSuccess(`${settingName}已${enabled ? '开启' : '关闭'}`);
        });
    });
}

// 初始化偏好设置
function initPreferences() {
    // 主题切换
    const themeInputs = document.querySelectorAll('input[name="theme"]');
    themeInputs.forEach(input => {
        input.addEventListener('change', () => {
            const theme = input.value;
            document.body.className = theme;
            // TODO: 保存主题设置
        });
    });

    // 字体大小
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const size = btn.textContent;
            document.documentElement.style.fontSize = {
                '小': '14px',
                '中': '16px',
                '大': '18px'
            }[size];
            // TODO: 保存字体大小设置
        });
    });

    // 语言切换
    const languageSelect = document.querySelector('.language-select');
    languageSelect.addEventListener('change', () => {
        const language = languageSelect.value;
        // TODO: 切换语言
        showSuccess('语言切换成功，需要刷新页面生效');
    });
}

// 初始化图表
function initCharts() {
    // 批改数量趋势图
    const correctionTrendChart = echarts.init(document.getElementById('correction-trend-chart'));
    correctionTrendChart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: mockData.teachingStats.correctionCount.monthly,
            type: 'line',
            smooth: true,
            areaStyle: {
                opacity: 0.2
            },
            itemStyle: {
                color: '#1890ff'
            }
        }]
    });

    // 分数分布图
    const scoreDistributionChart = echarts.init(document.getElementById('score-distribution-chart'));
    scoreDistributionChart.setOption({
        tooltip: {
            trigger: 'item'
        },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '20',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: mockData.teachingStats.scoreDistribution
        }]
    });

    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', () => {
        correctionTrendChart.resize();
        scoreDistributionChart.resize();
    });
}

// 初始化资源上传
function initResourceUpload() {
    const uploadArea = document.querySelector('.resource-upload');
    const resourceList = document.querySelector('.resource-list');

    // 处理拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#1890ff';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#d9d9d9';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#d9d9d9';
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });

    // 处理点击上传
    uploadArea.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.doc,.docx,.pdf';
        input.multiple = true;

        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            handleFiles(files);
        };

        input.click();
    });

    // 处理文件上传
    function handleFiles(files) {
        files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                showError(`文件 ${file.name} 大小超过10MB`);
                return;
            }

            const extension = file.name.split('.').pop().toLowerCase();
            if (!['doc', 'docx', 'pdf'].includes(extension)) {
                showError(`文件 ${file.name} 格式不支持`);
                return;
            }

            // 创建资源项
            const resourceItem = document.createElement('div');
            resourceItem.className = 'resource-item';
            resourceItem.innerHTML = `
                <div class="resource-icon">
                    <i class="fas fa-file-${extension === 'pdf' ? 'pdf' : 'word'}"></i>
                </div>
                <div class="resource-info">
                    <h3>${file.name}</h3>
                    <p>上传时间：${new Date().toLocaleDateString()}</p>
                </div>
                <div class="resource-actions">
                    <button class="action-btn">
                        <i class="fas fa-download"></i>
                        下载
                    </button>
                    <button class="action-btn">
                        <i class="fas fa-trash-alt"></i>
                        删除
                    </button>
                </div>
            `;

            // 插入到列表开头
            resourceList.insertBefore(resourceItem, resourceList.firstChild);

            // TODO: 调用上传API
            showSuccess(`文件 ${file.name} 上传成功`);
        });
    }

    // 处理资源操作
    resourceList.addEventListener('click', (e) => {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;

        const resourceItem = btn.closest('.resource-item');
        const fileName = resourceItem.querySelector('h3').textContent;

        if (btn.textContent.includes('下载')) {
            // TODO: 调用下载API
            showSuccess(`开始下载 ${fileName}`);
        } else if (btn.textContent.includes('删除')) {
            if (confirm(`确定要删除 ${fileName} 吗？`)) {
                resourceItem.remove();
                // TODO: 调用删除API
                showSuccess(`${fileName} 已删除`);
            }
        }
    });
}

// 显示错误提示
function showError(message) {
    const errorMessage = document.querySelector('.error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

// 显示成功提示
function showSuccess(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    document.body.appendChild(successMessage);

    // 添加动画效果
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 10);

    // 3秒后移除
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 3000);
} 