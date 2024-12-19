// 初始化所有图表
document.addEventListener('DOMContentLoaded', () => {
    // 初始化数据管理器
    const dataManager = new TeacherDataManager();
    
    // 初始化事件监听
    initEventListeners();
    
    // 加载并分析学生数据
    loadAndAnalyzeStudentData();
});

// 加载并分析学生数据
async function loadAndAnalyzeStudentData() {
    try {
        // 获取所有学生数据
        const studentData = await TeacherDataManager.getStudentData();
        
        // 初始化各个分析图表
        initWritingAnalysisChart(studentData);
        initCommonIssuesChart(studentData);
        initAIAccuracyChart(studentData);
        initStudentProgressChart(studentData);
        
        // 加载详细数据表格
        loadDetailedTable(studentData);
        
    } catch (error) {
        console.error('加载学生数据失败:', error);
        showErrorMessage('数据加载失败，请稍后重试');
    }
}

// 初始化写作分析图表
function initWritingAnalysisChart(studentData) {
    const chart = echarts.init(document.getElementById('writing-analysis-chart'));
    
    // 处理数据
    const analysisData = processWritingAnalysisData(studentData);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['写作数量', '平均质量分']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: analysisData.dates,
            axisLabel: {
                color: '#6b7280'
            }
        }],
        yAxis: [
            {
                type: 'value',
                name: '写作数量',
                axisLabel: {
                    color: '#6b7280'
                }
            },
            {
                type: 'value',
                name: '平均质量分',
                max: 100,
                axisLabel: {
                    color: '#6b7280'
                }
            }
        ],
        series: [
            {
                name: '写作数量',
                type: 'bar',
                data: analysisData.counts,
                itemStyle: {
                    color: '#2563eb'
                }
            },
            {
                name: '平均质量分',
                type: 'line',
                yAxisIndex: 1,
                data: analysisData.scores,
                itemStyle: {
                    color: '#059669'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化常见问题分析图表
function initCommonIssuesChart(studentData) {
    const chart = echarts.init(document.getElementById('common-issues-chart'));
    
    // 分析常见问题
    const issuesData = analyzeCommonIssues(studentData);
    
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [{
            name: '问题分布',
            type: 'pie',
            radius: '50%',
            data: issuesData.map(item => ({
                value: item.count,
                name: item.issue,
                itemStyle: {
                    color: item.color
                }
            })),
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化AI批改准确率分析图表
function initAIAccuracyChart(studentData) {
    const chart = echarts.init(document.getElementById('ai-accuracy-chart'));
    
    // 分析AI批改准确率
    const accuracyData = analyzeAIAccuracy(studentData);
    
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['AI准确率', '人工修正率']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: accuracyData.dates,
            axisLabel: {
                color: '#6b7280'
            }
        },
        yAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
                formatter: '{value}%',
                color: '#6b7280'
            }
        },
        series: [
            {
                name: 'AI准确率',
                type: 'line',
                data: accuracyData.aiAccuracy,
                itemStyle: {
                    color: '#2563eb'
                }
            },
            {
                name: '人工修正率',
                type: 'line',
                data: accuracyData.humanCorrection,
                itemStyle: {
                    color: '#dc2626'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化学生进步趋势图表
function initStudentProgressChart(studentData) {
    const chart = echarts.init(document.getElementById('student-progress-chart'));
    
    // 分析学生进步数据
    const progressData = analyzeStudentProgress(studentData);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['写作水平', '语言表达', '内容创新', '结构组织']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: progressData.dates,
            axisLabel: {
                color: '#6b7280'
            }
        },
        yAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
                color: '#6b7280'
            }
        },
        series: [
            {
                name: '写作水平',
                type: 'line',
                data: progressData.overall,
                itemStyle: {
                    color: '#2563eb'
                }
            },
            {
                name: '语言表达',
                type: 'line',
                data: progressData.language,
                itemStyle: {
                    color: '#059669'
                }
            },
            {
                name: '内容创新',
                type: 'line',
                data: progressData.content,
                itemStyle: {
                    color: '#d97706'
                }
            },
            {
                name: '结构组织',
                type: 'line',
                data: progressData.structure,
                itemStyle: {
                    color: '#7c3aed'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 加载详细数据表格
function loadDetailedTable(studentData) {
    const tbody = document.querySelector('table tbody');
    const tableData = processTableData(studentData);
    
    tbody.innerHTML = tableData.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.writingCount}</td>
            <td>${student.averageScore}</td>
            <td>${student.commonIssues}</td>
            <td>${student.lastSubmission}</td>
            <td>
                <div class="progress-indicators">
                    ${generateProgressIndicators(student.progress)}
                </div>
            </td>
            <td>
                <button class="view-btn" data-student-id="${student.id}">
                    <i class="fas fa-chart-line"></i>
                    详细分析
                </button>
            </td>
        </tr>
    `).join('');
    
    // 添加查看详情事件监听
    tbody.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => showStudentDetail(btn.dataset.studentId));
    });
}

// 数据处理函数
function processWritingAnalysisData(studentData) {
    // 处理写作分析数据
    return {
        dates: [], // 日期数组
        counts: [], // 写作数量数组
        scores: [] // 质量分数组
    };
}

function analyzeCommonIssues(studentData) {
    // 分析常见问题
    return [
        { issue: '病句', count: 0, color: '#2563eb' },
        { issue: '用词不当', count: 0, color: '#059669' },
        { issue: '结构混乱', count: 0, color: '#d97706' },
        { issue: '主题不明', count: 0, color: '#7c3aed' },
        { issue: '内容单薄', count: 0, color: '#dc2626' }
    ];
}

function analyzeAIAccuracy(studentData) {
    // 分析AI批改准确率
    return {
        dates: [], // 日期数组
        aiAccuracy: [], // AI准确率数组
        humanCorrection: [] // 人工修正率数组
    };
}

function analyzeStudentProgress(studentData) {
    // 分析学生进步情况
    return {
        dates: [], // 日期数组
        overall: [], // 整体水平数组
        language: [], // 语言表达数组
        content: [], // 内容创新数组
        structure: [] // 结构组织数组
    };
}

function processTableData(studentData) {
    // 处理表格数据
    return [];
}

function generateProgressIndicators(progress) {
    // 生成进步指标HTML
    return `
        <span class="progress-indicator ${progress.trend}">
            <i class="fas fa-arrow-${progress.trend}"></i>
            ${progress.value}%
        </span>
    `;
}

// 显示学生详细分析
function showStudentDetail(studentId) {
    // TODO: 实现学生详细分析弹窗
    console.log('显示学生详细分析:', studentId);
}

// 显示错误消息
function showErrorMessage(message) {
    // TODO: 实现错误消息提示
    console.error(message);
}

// 工具函数：防抖
function debounce(func, wait) {
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