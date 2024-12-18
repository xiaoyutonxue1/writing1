import { getFavorites, removeFavorite } from './utils/favorites.js';
import Chart from 'chart.js/auto';
import echarts from 'echarts';

document.addEventListener('DOMContentLoaded', function() {
    // 初始化核心能力雷达图
    const coreAbilityRadar = echarts.init(document.getElementById('coreAbilityRadar'));
    
    const coreAbilityOption = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'item'
        },
        legend: {
            data: ['个人水平', '年级标准'],
            bottom: 0,
            itemWidth: 12,
            itemHeight: 12,
            textStyle: {
                color: '#666'
            }
        },
        radar: {
            shape: 'circle',
            splitNumber: 5,
            radius: '60%',
            center: ['50%', '50%'],
            name: {
                textStyle: {
                    color: '#666',
                    fontSize: 14,
                    padding: [3, 5]
                }
            },
            indicator: [
                { name: '语言表达能力', max: 100 },
                { name: '思维发展水平', max: 100 },
                { name: '写作过程掌控', max: 100 },
                { name: '写作策略运用', max: 100 },
                { name: '文体格式规范', max: 100 },
                { name: '创新表现能力', max: 100 }
            ],
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#eee'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['#fff', '#f8f9fa']
                }
            }
        },
        series: [{
            type: 'radar',
            data: [
                {
                    name: '个人水平',
                    value: [88, 85, 85, 82, 90, 78],
                    symbolSize: 5,
                    lineStyle: {
                        width: 2,
                        color: '#1890ff'
                    },
                    areaStyle: {
                        color: 'rgba(24, 144, 255, 0.2)'
                    },
                    itemStyle: {
                        color: '#1890ff'
                    }
                },
                {
                    name: '年级标准',
                    value: [75, 75, 75, 75, 75, 75],
                    symbolSize: 5,
                    lineStyle: {
                        width: 2,
                        type: 'dashed',
                        color: '#52c41a'
                    },
                    areaStyle: {
                        color: 'rgba(82, 196, 26, 0.1)'
                    },
                    itemStyle: {
                        color: '#52c41a'
                    }
                }
            ]
        }]
    };

    // 设置图表配置
    coreAbilityRadar.setOption(coreAbilityOption);

    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        coreAbilityRadar.resize();
    });

    // Initialize ability radar chart
    const abilityCtx = document.getElementById('abilityChart');
    new Chart(abilityCtx, {
        type: 'radar',
        data: {
            labels: ['内容构思', '语言表达', '结构组织', '写作技巧', '创新思维'],
            datasets: [{
                label: '能力水平',
                data: [85, 92, 78, 88, 82],
                backgroundColor: 'rgba(24, 144, 255, 0.2)',
                borderColor: '#1890ff',
                pointBackgroundColor: '#1890ff',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#1890ff'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Initialize progress line chart
    const progressCtx = document.getElementById('progressChart');
    new Chart(progressCtx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
                label: '写作水平',
                data: [65, 70, 75, 82, 88, 92],
                borderColor: '#1890ff',
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Initialize favorites
    function updateFavorites() {
        const favorites = getFavorites();
        const favoritesGrid = document.querySelector('.favorites-grid');
        favoritesGrid.innerHTML = favorites.length ? favorites.map(item => `
            <div class="favorite-card" data-id="${item.id}">
                <div class="favorite-header">
                    <h4>${item.title}</h4>
                    <button class="remove-btn" title="删除">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <p>${item.preview}</p>
                <div class="favorite-meta">
                    <span><i class="fas fa-clock"></i> ${new Date(item.savedAt).toLocaleDateString()}</span>
                    <span><i class="fas fa-tag"></i> ${item.type}</span>
                </div>
            </div>
        `).join('') : '<div class="empty-message">暂无收藏内容</div>';

        // Add event listeners to remove buttons
        document.querySelectorAll('.favorite-card .remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.favorite-card');
                const id = parseInt(card.dataset.id);
                if (confirm('确定要删除这个收藏吗？')) {
                    removeFavorite(id);
                    updateFavorites();
                }
            });
        });
    }

    // Initial load
    updateFavorites();

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Avatar upload
    const editAvatarBtn = document.querySelector('.edit-avatar');
    editAvatarBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.querySelector('.profile-avatar img').src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    // 初始化雷达图
    const radarChart = echarts.init(document.getElementById('radarChart'));
    
    // 雷达图配置
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['当前水平', '班级平均']
        },
        radar: {
            indicator: [
                { name: '词汇运用', max: 100 },
                { name: '句子结构', max: 100 },
                { name: '段落组织', max: 100 },
                { name: '主题立意', max: 100 },
                { name: '材料运用', max: 100 },
                { name: '逻辑结构', max: 100 },
                { name: '构思能力', max: 100 },
                { name: '写作速度', max: 100 },
                { name: '修改能力', max: 100 }
            ],
            shape: 'circle',
            splitNumber: 5,
            axisName: {
                color: '#666'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            splitArea: {
                show: false
            }
        },
        series: [{
            name: '写作能力分析',
            type: 'radar',
            data: [
                {
                    value: [85, 90, 88, 82, 85, 87, 80, 85, 83],
                    name: '当前水平',
                    lineStyle: {
                        color: '#1890ff'
                    },
                    areaStyle: {
                        color: 'rgba(24, 144, 255, 0.2)'
                    }
                },
                {
                    value: [75, 78, 76, 75, 77, 74, 73, 76, 75],
                    name: '班级平均',
                    lineStyle: {
                        color: '#52c41a'
                    },
                    areaStyle: {
                        color: 'rgba(82, 196, 26, 0.2)'
                    }
                }
            ]
        }]
    };
    
    // 渲染雷达图
    radarChart.setOption(option);
    
    // 窗口大小改变时自动调整图表大小
    window.addEventListener('resize', function() {
        radarChart.resize();
    });

    // 初始化趋势图
    const trendChart = echarts.init(document.getElementById('trendChart'));
    
    const trendOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['语言表达', '内容思维', '写作过程']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
            type: 'value',
            max: 100
        },
        series: [
            {
                name: '语言表达',
                type: 'line',
                smooth: true,
                data: [75, 78, 82, 85, 88, 88],
                lineStyle: {
                    color: '#1890ff'
                },
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '内容思维',
                type: 'line',
                smooth: true,
                data: [70, 72, 75, 78, 80, 82],
                lineStyle: {
                    color: '#52c41a'
                },
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: '写作过程',
                type: 'line',
                smooth: true,
                data: [72, 75, 78, 82, 85, 85],
                lineStyle: {
                    color: '#faad14'
                },
                itemStyle: {
                    color: '#faad14'
                }
            }
        ]
    };

    trendChart.setOption(trendOption);

    // 监听时间范围选择变化
    document.querySelectorAll('.time-range select').forEach(select => {
        select.addEventListener('change', function() {
            // 这里可以根据选择的时间范围更新图表数据
            // updateChartData(this.value);
        });
    });

    // 窗口大小改变时调整所有图表大小
    window.addEventListener('resize', function() {
        radarChart.resize();
        trendChart.resize();
    });

    // 生成诊断报告
    generateReport();

    // 初始化多维能力图表
    const multiDimensionChart = echarts.init(document.getElementById('multiDimensionChart'));
    
    const multiDimensionOption = {
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
        xAxis: [
            {
                type: 'category',
                data: [
                    '词汇运用',
                    '句子结构',
                    '段落组织',
                    '主题立意',
                    '材料运用',
                    '逻辑结构',
                    '构思能力',
                    '写作速度',
                    '修改能力'
                ],
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                max: 100,
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            }
        ],
        series: [
            {
                name: '当前水平',
                type: 'bar',
                barWidth: '20%',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#1890ff' },
                        { offset: 1, color: '#096dd9' }
                    ])
                },
                data: [85, 90, 88, 82, 85, 87, 80, 85, 83]
            },
            {
                name: '班级平均',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    color: '#52c41a',
                    width: 2
                },
                itemStyle: {
                    color: '#52c41a',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                data: [75, 78, 76, 75, 77, 74, 73, 76, 75]
            }
        ]
    };

    multiDimensionChart.setOption(multiDimensionOption);

    // 窗口大小改变时调整所有图表大小
    window.addEventListener('resize', function() {
        radarChart.resize();
        trendChart.resize();
        multiDimensionChart.resize();
    });

    // 更新窗口大小改变事件处理
    window.addEventListener('resize', function() {
        coreAbilityRadar.resize();
        // 其他图表resize保持不变...
    });
});

// 生成诊断报告
function generateReport() {
    const reportContent = document.querySelector('.report-content');
    const report = `
        <div class="report-section">
            <h4><i class="fas fa-chart-line"></i> 总体评价</h4>
            <p>您的写作能力处于进阶水平，各项指标均衡发展。在语言表达方面表现突出，建议继续加强内容思维维度的训练。近期进步明显，特别是在词汇运用和句式变化方面有显著提升。</p>
        </div>
        <div class="report-section">
            <h4><i class="fas fa-star"></i> 优势特点</h4>
            <ul>
                <li>词汇运用丰富，用词准确，生僻词使用恰当</li>
                <li>句式变化多样，长短句搭配合理，层次分明</li>
                <li>段落结构完整，过渡自然，逻辑性强</li>
                <li>写作速度稳定，修改意识强，完成度高</li>
            </ul>
        </div>
        <div class="report-section">
            <h4><i class="fas fa-lightbulb"></i> 提升建议</h4>
            <ul>
                <li>加强主题深度思考，提升立意高度，尝试多角度思考问题</li>
                <li>扩充写作素材库，增加例证说服力，注意积累优质素材</li>
                <li>适当延长构思时间，完善写作大纲，提高写作效率</li>
                <li>可以尝试更多新颖的表达方式，提升文章的创新性</li>
            </ul>
        </div>
        <div class="report-section">
            <h4><i class="fas fa-tasks"></i> 后续规划</h4>
            <ul>
                <li>每周完成2-3篇不同类型的写作练习</li>
                <li>坚持阅读优质文章，做好笔记和积累</li>
                <li>参与同学间的写作交流和互评活动</li>
                <li>定期复盘和总结写作经验，形成个人写作特色</li>
            </ul>
        </div>
    `;
    
    reportContent.innerHTML = report;
}