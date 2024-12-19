// 初始化所有图表
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 初始化事件监听
        initEventListeners();
        
        // 加载并分析学生数据
        await loadAndAnalyzeStudentData();
    } catch (error) {
        console.error('初始化失败:', error);
        showErrorMessage('初始化失败，请刷新页面重试');
    }
});

// 初始化事件监听
function initEventListeners() {
    // 时间范围筛选
    document.getElementById('time-filter').addEventListener('change', async (e) => {
        await loadAndAnalyzeStudentData();
    });

    // 班级筛选
    document.getElementById('class-filter').addEventListener('change', async (e) => {
        await loadAndAnalyzeStudentData();
    });

    // 导出按钮
    document.querySelector('.export-btn').addEventListener('click', async () => {
        await TeacherDataManager.exportAnalysisReport('pdf');
    });

    // 图表时间范围切换
    document.querySelectorAll('.chart-action-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const buttons = e.target.parentElement.querySelectorAll('.chart-action-btn');
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            await loadAndAnalyzeStudentData();
        });
    });
}

// 加载并分析学生数据
async function loadAndAnalyzeStudentData() {
    try {
        // 获取筛选条件
        const timeRange = document.getElementById('time-filter').value;
        const classId = document.getElementById('class-filter').value;

        // 获取写作分析数据
        const writingAnalysis = await TeacherDataManager.getWritingAnalysis(timeRange);
        initWritingAnalysisChart(writingAnalysis);

        // 获取常见问题数据
        const commonIssues = await TeacherDataManager.getCommonIssues('all');
        initCommonIssuesChart(commonIssues);

        // 获取AI准确率数据
        const aiAccuracy = await TeacherDataManager.getAIAccuracy(timeRange);
        initAIAccuracyChart(aiAccuracy);

        // 获取学生进步数据
        const studentProgress = await TeacherDataManager.getStudentProgress('all');
        initStudentProgressChart(studentProgress);

        // 更新数据概览卡片
        await updateOverviewCards();
        
        // 渲染学生写作详情表格
        renderStudentWritingDetails();
        
    } catch (error) {
        console.error('加载数据失败:', error);
        showErrorMessage('数据加载失败，请稍后重试');
    }
}

// 初始化写作分析图表
function initWritingAnalysisChart(data) {
    const chart = echarts.init(document.getElementById('writing-analysis-chart'));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['写作数量', '平均分数'],
            textStyle: {
                color: '#6b7280'
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
            data: data.dates,
            axisLabel: {
                color: '#6b7280'
            }
        },
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
                name: '平均分数',
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
                data: data.counts,
                itemStyle: {
                    color: '#2563eb'
                }
            },
            {
                name: '平均分数',
                type: 'line',
                yAxisIndex: 1,
                data: data.scores,
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
function initCommonIssuesChart(data) {
    const chart = echarts.init(document.getElementById('common-issues-chart'));
    
    // 模拟数据
    const mockData = [
        { value: 35, name: '语言表达不准确' },
        { value: 25, name: '段落结构混乱' },
        { value: 20, name: '主题不明确' },
        { value: 15, name: '论据不充分' },
        { value: 5, name: '标点符号错误' }
    ];
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            bottom: 0,
            left: 'center',
            itemWidth: 25,
            itemHeight: 14,
            textStyle: {
                color: '#6b7280',
                fontSize: 12
            }
        },
        series: [
            {
                name: '问题分布',
                type: 'pie',
                radius: ['45%', '75%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}: {d}%',
                    fontSize: 12,
                    alignTo: 'edge',
                    edgeDistance: '10%',
                    distanceToLabelLine: 5
                },
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10,
                    smooth: true,
                    lineStyle: {
                        width: 1
                    }
                },
                data: mockData,
                color: ['#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626']
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化AI批改准确率分析图表
function initAIAccuracyChart(data) {
    const chart = echarts.init(document.getElementById('ai-accuracy-chart'));
    
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['AI准确率', '人工修正率'],
            textStyle: {
                color: '#6b7280'
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
            data: data.dates,
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
                data: data.aiAccuracy,
                itemStyle: {
                    color: '#2563eb'
                }
            },
            {
                name: '人工修正率',
                type: 'line',
                data: data.humanCorrection,
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
function initStudentProgressChart(data) {
    const chart = echarts.init(document.getElementById('student-progress-chart'));
    
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['总体水平', '语言表达', '内容创新', '结构组织'],
            textStyle: {
                color: '#6b7280'
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
            data: ['第一周', '第二周', '第三周', '第四周'],
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
                name: '总体水平',
                type: 'line',
                data: data.overall,
                itemStyle: {
                    color: '#2563eb'
                }
            },
            {
                name: '语言表达',
                type: 'line',
                data: data.language,
                itemStyle: {
                    color: '#059669'
                }
            },
            {
                name: '内容创新',
                type: 'line',
                data: data.content,
                itemStyle: {
                    color: '#d97706'
                }
            },
            {
                name: '结构组织',
                type: 'line',
                data: data.structure,
                itemStyle: {
                    color: '#7c3aed'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 更新数据概览卡片
async function updateOverviewCards() {
    try {
        const data = await TeacherDataManager.getStudentData();
        const stats = data.statistics;

        // 更新写作总量
        document.querySelector('.overview-card:nth-child(1) .card-value').textContent = 
            stats.totalWritings.toLocaleString();

        // 更新平均水平
        document.querySelector('.overview-card:nth-child(2) .card-value').textContent = 
            stats.averageScore.toFixed(1);

        // 更新AI批改准确率
        document.querySelector('.overview-card:nth-child(3) .card-value').textContent = 
            stats.aiAccuracy.toFixed(1) + '%';

        // 更新进步学生比例
        document.querySelector('.overview-card:nth-child(4) .card-value').textContent = 
            stats.progressRate.toFixed(0) + '%';

        // 计算环比增长
        const calculateGrowth = (current, previous) => {
            return ((current - previous) / previous * 100).toFixed(1);
        };

        // 更新趋势指标
        const timeDistribution = stats.timeDistribution;
        const currentIndex = timeDistribution.counts.length - 1;
        const previousIndex = currentIndex - 1;

        // 写作总量增长率
        const writingGrowth = calculateGrowth(
            timeDistribution.counts[currentIndex],
            timeDistribution.counts[previousIndex]
        );
        updateTrendIndicator(
            document.querySelector('.overview-card:nth-child(1) .card-trend'),
            writingGrowth,
            '较上月'
        );

        // 平均分增长
        const scoreGrowth = calculateGrowth(
            timeDistribution.scores[currentIndex],
            timeDistribution.scores[previousIndex]
        );
        updateTrendIndicator(
            document.querySelector('.overview-card:nth-child(2) .card-trend'),
            scoreGrowth,
            '较上月',
            '分'
        );

        // AI准确率增长
        const aiGrowth = calculateGrowth(
            stats.aiPerformance.aiAccuracy[currentIndex],
            stats.aiPerformance.aiAccuracy[previousIndex]
        );
        updateTrendIndicator(
            document.querySelector('.overview-card:nth-child(3) .card-trend'),
            aiGrowth,
            '较上月'
        );

        // 进步率增长（这里使用固定值，实际应从后端获取）
        updateTrendIndicator(
            document.querySelector('.overview-card:nth-child(4) .card-trend'),
            5,
            '较上月'
        );

    } catch (error) {
        console.error('更新数据概览失败:', error);
    }
}

// 更新趋势指标
function updateTrendIndicator(element, growth, prefix = '', unit = '%') {
    const isPositive = growth > 0;
    element.className = `card-trend ${isPositive ? 'positive' : 'negative'}`;
    element.innerHTML = `
        <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
        ${prefix}${isPositive ? '增长' : '下降'} ${Math.abs(growth)}${unit}
    `;
}

// 显示错误消息
function showErrorMessage(message) {
    // 这里可以添加显示错误消息的逻辑
    console.error(message);
}

// 渲染学生写作详情表格
function renderStudentWritingDetails() {
    // 模拟学生数据
    const mockStudentData = [
        {
            id: '1',
            name: '张三',
            class: '初三(1)班',
            writingCount: 15,
            averageScore: 88.5,
            commonIssues: '语言表达不准确',
            lastSubmission: '2024-01-14',
            progress: '进步',
        },
        {
            id: '2',
            name: '李四',
            class: '初三(1)班',
            writingCount: 12,
            averageScore: 92.0,
            commonIssues: '段落结构混乱',
            lastSubmission: '2024-01-13',
            progress: '稳定',
        },
        {
            id: '3',
            name: '王五',
            class: '初三(2)班',
            writingCount: 18,
            averageScore: 85.5,
            commonIssues: '主题不明确',
            lastSubmission: '2024-01-14',
            progress: '进步',
        },
        {
            id: '4',
            name: '赵六',
            class: '初三(2)班',
            writingCount: 10,
            averageScore: 78.5,
            commonIssues: '论据不充分',
            lastSubmission: '2024-01-12',
            progress: '需要关注',
        },
        {
            id: '5',
            name: '孙七',
            class: '初三(1)班',
            writingCount: 16,
            averageScore: 90.5,
            commonIssues: '标点符号错误',
            lastSubmission: '2024-01-14',
            progress: '优秀',
        },
        {
            id: '6',
            name: '周八',
            class: '初三(3)班',
            writingCount: 14,
            averageScore: 82.0,
            commonIssues: '语言表达不准确',
            lastSubmission: '2024-01-13',
            progress: '稳定',
        },
        {
            id: '7',
            name: '吴九',
            class: '初三(3)班',
            writingCount: 13,
            averageScore: 87.5,
            commonIssues: '段落结构混乱',
            lastSubmission: '2024-01-14',
            progress: '进步',
        },
        {
            id: '8',
            name: '郑十',
            class: '初三(2)班',
            writingCount: 11,
            averageScore: 84.0,
            commonIssues: '主题不明确',
            lastSubmission: '2024-01-12',
            progress: '稳定',
        },
        {
            id: '9',
            name: '刘一',
            class: '初三(1)班',
            writingCount: 17,
            averageScore: 93.5,
            commonIssues: '标点符号错误',
            lastSubmission: '2024-01-14',
            progress: '优秀',
        },
        {
            id: '10',
            name: '陈二',
            class: '初三(3)班',
            writingCount: 9,
            averageScore: 76.5,
            commonIssues: '论据不充分',
            lastSubmission: '2024-01-13',
            progress: '需要关注',
        }
    ];

    // 获取表格容器
    const tableBody = document.querySelector('.data-table-section table tbody');
    if (!tableBody) {
        console.error('找不到表格容器');
        return;
    }

    // 清空现有内容
    tableBody.innerHTML = '';

    // 渲染数据
    mockStudentData.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.writingCount}</td>
            <td>${student.averageScore}</td>
            <td>${student.commonIssues}</td>
            <td>${student.lastSubmission}</td>
            <td>
                <span class="progress-indicator ${getProgressClass(student.progress)}">
                    ${student.progress}
                </span>
            </td>
            <td>
                <button class="view-btn" onclick="viewStudentDetail('${student.id}')">
                    <i class="fas fa-eye"></i>
                    查看详情
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // 更新分页信息
    document.querySelector('.page-info').textContent = '第 1 页，共 10 页';
}

// 获取进度状态对应的样式类
function getProgressClass(progress) {
    switch (progress) {
        case '优秀':
        case '进步':
            return 'up';
        case '需要关注':
            return 'down';
        default:
            return '';
    }
}

// 查看学生详情
function viewStudentDetail(studentId) {
    // 跳转到学生详情页面
    window.location.href = `student-detail.html?id=${studentId}`;
} 