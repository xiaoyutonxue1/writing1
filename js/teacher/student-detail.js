// 显示加载动画
function showLoading() {
    document.querySelector('.loading-overlay').style.display = 'flex';
}

// 隐藏加载动画
function hideLoading() {
    document.querySelector('.loading-overlay').style.display = 'none';
}

// 显示错误消息
function showErrorMessage(message, duration = 3000) {
    const errorElement = document.querySelector('.error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, duration);
}

// 显示成功消息
function showSuccessMessage(message, duration = 3000) {
    const errorElement = document.querySelector('.error-message');
    errorElement.style.background = '#dcfce7';
    errorElement.style.color = '#059669';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
        errorElement.style.background = '#fee2e2';
        errorElement.style.color = '#dc2626';
    }, duration);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        showLoading();
        
        // 从URL获取学生ID
        const urlParams = new URLSearchParams(window.location.search);
        const studentId = urlParams.get('id');
        
        if (!studentId) {
            showErrorMessage('未找到学生信息');
            return;
        }

        // 初始化页面数据
        await initializeStudentDetail(studentId);
        
        // 初始化事件监听
        initializeEventListeners();
        
    } catch (error) {
        console.error('初始化失败:', error);
        showErrorMessage('加载数据失败，请刷新页面重试');
    } finally {
        hideLoading();
    }
});

// 初始化学生详情数据
async function initializeStudentDetail(studentId) {
    try {
        showLoading();
        
        // 获取学生基本信息
        const studentInfo = await TeacherDataManager.getStudentInfo(studentId);
        updateStudentInfo(studentInfo);
        
        // 获取学生能力分析数据
        const abilityData = await TeacherDataManager.getStudentAbilityAnalysis(studentId);
        initAbilityRadarChart(abilityData);
        updateAbilityDetails(abilityData);
        
        // 获取写作历史记录
        const writingHistory = await TeacherDataManager.getStudentWritingHistory(studentId);
        renderWritingHistory(writingHistory);
        
    } catch (error) {
        console.error('加载学生详情失败:', error);
        showErrorMessage('加载学生详情失败');
        throw error;
    } finally {
        hideLoading();
    }
}

// 更新学生基本信息
function updateStudentInfo(info) {
    // 更新头像
    const avatarImg = document.querySelector('.student-avatar');
    avatarImg.onerror = async () => {
        try {
            // 如果头像加载失败，获取新的随机头像
            const newAvatar = await TeacherDataManager.getRandomAnimeAvatar();
            avatarImg.src = newAvatar;
        } catch (error) {
            console.error('加载头像失败:', error);
            // 如果还是失败，使用默认头像
            avatarImg.src = '../assets/avatar/default.jpg';
        }
    };
    avatarImg.src = info.avatar;
    
    // 更新基本信息
    document.querySelector('.student-name').textContent = info.name;
    document.querySelector('.student-class').textContent = info.class;
    
    // 更新标签
    const tagsContainer = document.querySelector('.student-tags');
    tagsContainer.innerHTML = '';
    if (info.progress === '进步') {
        tagsContainer.innerHTML += `<span class="tag progress-tag">进步</span>`;
    }
    if (info.needsAttention) {
        tagsContainer.innerHTML += `<span class="tag focus-tag">重点关注</span>`;
    }
    
    // 更新统计数据
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = info.writingCount;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = info.averageScore;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = info.latestScore;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = info.progressRate + '%';
    
    // 更新趋势
    updateTrendIndicator(
        document.querySelector('.stat-card:nth-child(1) .stat-trend'),
        info.writingCountTrend,
        '较上月'
    );
    updateTrendIndicator(
        document.querySelector('.stat-card:nth-child(2) .stat-trend'),
        info.averageScoreTrend,
        '较上月'
    );
    updateTrendIndicator(
        document.querySelector('.stat-card:nth-child(3) .stat-trend'),
        info.latestScoreTrend,
        '环比'
    );
    updateTrendIndicator(
        document.querySelector('.stat-card:nth-child(4) .stat-trend'),
        info.progressRateTrend,
        '较上月'
    );
    
    // 更新关注按钮状态
    const focusBtn = document.querySelector('.focus-btn');
    if (info.needsAttention) {
        focusBtn.innerHTML = '<i class="fas fa-star"></i>取消关注';
        focusBtn.classList.add('active');
    }
}

// 初始化能力雷达图
function initAbilityRadarChart(data) {
    const chart = echarts.init(document.getElementById('ability-radar-chart'));
    
    const option = {
        tooltip: {
            trigger: 'item'
        },
        radar: {
            indicator: [
                { name: '语言表达', max: 100 },
                { name: '内容创新', max: 100 },
                { name: '结构组织', max: 100 },
                { name: '思维深度', max: 100 },
                { name: '文学素养', max: 100 }
            ],
            radius: '65%',
            splitNumber: 4,
            axisName: {
                color: '#6b7280'
            },
            splitLine: {
                lineStyle: {
                    color: '#e5e7eb'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['#fff', '#f9fafb']
                }
            }
        },
        series: [
            {
                type: 'radar',
                data: [
                    {
                        value: [
                            data.language,
                            data.innovation,
                            data.structure,
                            data.thinking,
                            data.literature
                        ],
                        name: '能力水平',
                        itemStyle: {
                            color: '#2563eb'
                        },
                        areaStyle: {
                            color: 'rgba(37, 99, 235, 0.2)'
                        }
                    }
                ]
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 更新能力详情
function updateAbilityDetails(data) {
    const abilities = [
        { name: '语言表达', value: data.language },
        { name: '内容创新', value: data.innovation },
        { name: '结构组织', value: data.structure },
        { name: '思维深度', value: data.thinking }
    ];
    
    abilities.forEach((ability, index) => {
        const item = document.querySelector(`.ability-item:nth-child(${index + 1})`);
        item.querySelector('.progress').style.width = `${ability.value}%`;
        item.querySelector('.ability-score').textContent = 
            `${ability.value}分 - ${getAbilityLevel(ability.value)}`;
    });
}

// 获取能力水平评价
function getAbilityLevel(score) {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '中等';
    return '待提高';
}

// 渲染写作历史记录
function renderWritingHistory(history) {
    const listContainer = document.querySelector('.writing-list');
    listContainer.innerHTML = '';
    
    history.forEach(item => {
        const writingItem = document.createElement('div');
        writingItem.className = 'writing-item';
        writingItem.innerHTML = `
            <div class="writing-date">
                <span class="date">${formatDate(item.date, 'MM-DD')}</span>
                <span class="year">${formatDate(item.date, 'YYYY')}</span>
            </div>
            <div class="writing-content">
                <h3 class="writing-title">${item.title}</h3>
                <div class="writing-meta">
                    <span class="writing-type">${item.type}</span>
                    <span class="writing-words">${item.wordCount}字</span>
                    <span class="writing-score">${item.score}分</span>
                </div>
                <p class="writing-comment">${item.comment}</p>
                <div class="writing-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="writing-actions">
                <button class="view-btn" onclick="viewWritingDetail('${item.id}')">
                    查看详情
                </button>
            </div>
        `;
        listContainer.appendChild(writingItem);
    });
}

// 查看作文详情
async function viewWritingDetail(writingId) {
    try {
        const writingDetail = await TeacherDataManager.getWritingDetail(writingId);
        showWritingDetailModal(writingDetail);
    } catch (error) {
        console.error('加载作文详情失败:', error);
        showErrorMessage('加载作文详情失败');
    }
}

// 显示作文详情弹窗
function showWritingDetailModal(detail) {
    const modal = document.querySelector('.writing-detail-modal');
    
    // 更新弹窗内容
    modal.querySelector('.writing-title').textContent = detail.title;
    modal.querySelector('.writing-type').textContent = detail.type;
    modal.querySelector('.writing-date').textContent = formatDate(detail.date, 'YYYY-MM-DD');
    modal.querySelector('.writing-words').textContent = `${detail.wordCount}字`;
    modal.querySelector('.writing-score').textContent = `${detail.score}分`;
    
    // 更新作文内容
    modal.querySelector('.original-text').innerHTML = detail.content;
    
    // 更新评分详情
    const scoreDetails = modal.querySelectorAll('.score-item');
    scoreDetails[0].querySelector('.score-value').textContent = `${detail.scores.language}分`;
    scoreDetails[1].querySelector('.score-value').textContent = `${detail.scores.innovation}分`;
    scoreDetails[2].querySelector('.score-value').textContent = `${detail.scores.structure}分`;
    scoreDetails[3].querySelector('.score-value').textContent = `${detail.scores.thinking}分`;
    
    // 更新AI点评
    modal.querySelector('.ai-comments p').textContent = detail.aiComment;
    
    // 更新教师点评
    const teacherCommentTextarea = modal.querySelector('.teacher-comments textarea');
    teacherCommentTextarea.value = detail.teacherComment || '';
    
    // 显示弹窗
    modal.style.display = 'flex';
}

// 初始化事件监听
function initializeEventListeners() {
    // 关注按钮点击事件
    document.querySelector('.focus-btn').addEventListener('click', async (e) => {
        const btn = e.target.closest('.focus-btn');
        const isActive = btn.classList.contains('active');
        
        try {
            showLoading();
            await TeacherDataManager.toggleStudentFocus(getStudentId(), !isActive);
            btn.classList.toggle('active');
            btn.innerHTML = isActive ? 
                '<i class="fas fa-star"></i>设为重点关注' : 
                '<i class="fas fa-star"></i>取消关注';
            showSuccessMessage(isActive ? '已取消关注' : '已设为重点关注');
        } catch (error) {
            console.error('更新关注状态失败:', error);
            showErrorMessage('操作失败，请重试');
        } finally {
            hideLoading();
        }
    });
    
    // 导出报告按钮点击事件
    document.querySelector('.export-btn').addEventListener('click', async () => {
        try {
            showLoading();
            await TeacherDataManager.exportStudentReport(getStudentId());
            showSuccessMessage('报告导出成功');
        } catch (error) {
            console.error('导出报告失败:', error);
            showErrorMessage('导出失败，请重试');
        } finally {
            hideLoading();
        }
    });
    
    // 时间筛选按钮点击事件
    document.querySelectorAll('.time-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            try {
                const buttons = e.target.parentElement.querySelectorAll('.filter-btn');
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // 重新加载数据
                await initializeStudentDetail(getStudentId());
            } catch (error) {
                console.error('加载数据失败:', error);
                showErrorMessage('加载数据失败，请重试');
            }
        });
    });
    
    // 写作记录筛选事件
    document.querySelectorAll('.history-filter .filter-select').forEach(select => {
        select.addEventListener('change', async () => {
            try {
                showLoading();
                // 重新加载写作历史
                const writingHistory = await TeacherDataManager.getStudentWritingHistory(
                    getStudentId(),
                    getFilterOptions()
                );
                renderWritingHistory(writingHistory);
            } catch (error) {
                console.error('加载写作历史失败:', error);
                showErrorMessage('加载数据失败，请重试');
            } finally {
                hideLoading();
            }
        });
    });
    
    // 弹窗关闭按钮事件
    document.querySelector('.writing-detail-modal .close-btn').addEventListener('click', () => {
        document.querySelector('.writing-detail-modal').style.display = 'none';
    });
    
    // 点评保存按钮事件
    document.querySelector('.writing-detail-modal .save-btn').addEventListener('click', async () => {
        const textarea = document.querySelector('.teacher-comments textarea');
        const comment = textarea.value.trim();
        
        if (!comment) {
            showErrorMessage('请输入点评内容');
            return;
        }
        
        try {
            showLoading();
            await TeacherDataManager.saveTeacherComment(getWritingId(), comment);
            showSuccessMessage('点评保存成功');
        } catch (error) {
            console.error('保存点评失败:', error);
            showErrorMessage('保存失败，请重试');
        } finally {
            hideLoading();
        }
    });

    // 用户菜单事件
    document.querySelector('.user-info').addEventListener('click', (e) => {
        const menu = document.querySelector('.user-menu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        e.stopPropagation();
    });

    // 点击页面其他地方关闭用户菜单
    document.addEventListener('click', () => {
        document.querySelector('.user-menu').style.display = 'none';
    });
}

// 更新趋势指标
function updateTrendIndicator(element, trend, prefix = '') {
    const isPositive = trend > 0;
    element.className = `stat-trend ${isPositive ? 'positive' : 'negative'}`;
    element.innerHTML = `
        <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
        ${prefix}${isPositive ? '增长' : '下降'} ${Math.abs(trend)}${prefix.includes('月') ? '' : '%'}
    `;
}

// 格式化日期
function formatDate(dateString, format) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    switch (format) {
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'MM-DD':
            return `${month}-${day}`;
        case 'YYYY':
            return year.toString();
        default:
            return dateString;
    }
}

// 获取学生ID
function getStudentId() {
    return new URLSearchParams(window.location.search).get('id');
}

// 获取当前作文ID
function getWritingId() {
    // 从弹窗中获取当前查看的作文ID
    return document.querySelector('.writing-detail-modal').dataset.writingId;
}

// 获取筛选选项
function getFilterOptions() {
    return {
        type: document.querySelector('.filter-select[value="type"]').value,
        time: document.querySelector('.filter-select[value="time"]').value
    };
}

// 显示错误消息
function showErrorMessage(message) {
    // TODO: 实现错误消息提示
    console.error(message);
}

// 显示成功消息
function showSuccessMessage(message) {
    // TODO: 实现成功消息提示
    console.log(message);
} 