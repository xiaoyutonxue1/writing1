document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('开始初始化图表...');
        
        // 初始化核心能力雷达图
        const coreAbilityRadarEl = document.getElementById('coreAbilityRadar');
        console.log('核心能力雷达图容器:', coreAbilityRadarEl);
        
        if (!coreAbilityRadarEl) {
            throw new Error('找不到核心能力雷达图容器');
        }
        
        const coreAbilityRadar = echarts.init(coreAbilityRadarEl);
        console.log('核心能力雷达图初始化完成');

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
                        value: [85, 78, 82, 75, 88, 72],
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
                        value: [75, 70, 72, 70, 75, 68],
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

        coreAbilityRadar.setOption(coreAbilityOption);
        console.log('核心能力雷达图配置完成');

        // 初始化多维能力图表
        const multiDimensionChartEl = document.getElementById('multiDimensionChart');
        if (!multiDimensionChartEl) {
            throw new Error('找不到多维能力图表容器');
        }

        const multiDimensionChart = echarts.init(multiDimensionChartEl);
        
        const multiDimensionOption = {
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['当前水平', '班级平均'],
                bottom: 10,
                left: 'center',
                itemWidth: 15,
                itemHeight: 10,
                textStyle: {
                    color: '#666'
                }
            },
            grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: [{
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
                    rotate: 30,
                    color: '#666',
                    fontSize: 12
                },
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                max: 100,
                splitNumber: 5,
                axisLabel: {
                    color: '#666',
                    fontSize: 12
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#eee'
                    }
                }
            }],
            series: [
                {
                    name: '当前水平',
                    type: 'bar',
                    barWidth: '20%',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#1890ff' },
                            { offset: 1, color: '#096dd9' }
                        ]),
                        borderRadius: [4, 4, 0, 0]
                    },
                    data: [85, 88, 82, 78, 84, 86, 80, 83, 87],
                    animationDelay: function (idx) {
                        return idx * 100;
                    }
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
                    data: [75, 76, 74, 72, 75, 73, 71, 74, 76],
                    animationDelay: function (idx) {
                        return idx * 100 + 300;
                    }
                }
            ],
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicOut'
        };

        multiDimensionChart.setOption(multiDimensionOption);
        console.log('多维能力图表初始化完成');

        // 初始化写作能力进步趋势图
        const trendChartEl = document.getElementById('trendChart');
        if (!trendChartEl) {
            throw new Error('找不到写作能力进步趋势图容器');
        }

        const trendChart = echarts.init(trendChartEl);
        
        // 生成近6个月的日期标签
        const getDateLabels = (months) => {
            const labels = [];
            const now = new Date();
            for (let i = months - 1; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                labels.push(date.getMonth() + 1 + '月');
            }
            return labels;
        };

        // 生成模拟数据
        const generateData = (months, baseScore) => {
            const data = [];
            let score = baseScore;
            for (let i = 0; i < months; i++) {
                // 在基础分上增加一个随机增长（0.5-2分）
                score += 0.5 + Math.random() * 1.5;
                // 保证分数不超过100
                score = Math.min(score, 100);
                data.push(parseFloat(score.toFixed(1)));
            }
            return data;
        };

        const updateTrendChart = (months = 6) => {
            const trendOption = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        const data = params[0];
                        return `${data.name}<br/>${data.seriesName}：${data.value}分`;
                    }
                },
                grid: {
                    top: '10%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: getDateLabels(months),
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisLabel: {
                        color: '#666',
                        fontSize: 12
                    }
                },
                yAxis: {
                    type: 'value',
                    min: 60,
                    max: 100,
                    splitNumber: 4,
                    axisLabel: {
                        color: '#666',
                        fontSize: 12,
                        formatter: '{value} 分'
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#eee'
                        }
                    }
                },
                series: [{
                    name: '写作水平',
                    type: 'line',
                    smooth: true,
                    symbolSize: 8,
                    itemStyle: {
                        color: '#1890ff'
                    },
                    lineStyle: {
                        width: 3,
                        shadowColor: 'rgba(24, 144, 255, 0.3)',
                        shadowBlur: 10
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
                        ])
                    },
                    data: generateData(months, 75)
                }],
                animation: true,
                animationDuration: 1000,
                animationEasing: 'cubicOut'
            };

            trendChart.setOption(trendOption);
        };

        // 初始化趋势图
        updateTrendChart(6);

        // 监听时间范围选择变化
        document.querySelector('.time-range select').addEventListener('change', function() {
            updateTrendChart(parseInt(this.value));
        });

        // 统一的窗口大小改变事件处理
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                try {
                    if (coreAbilityRadar) {
                        coreAbilityRadar.resize();
                    }
                    if (multiDimensionChart) {
                        multiDimensionChart.resize();
                    }
                    if (trendChart) {
                        trendChart.resize();
                    }
                } catch (error) {
                    console.error('调整图表大小时出错:', error);
                }
            }, 250);
        });

        console.log('图表初始化完成');

    } catch (error) {
        console.error('图表初始化错误:', error);
        // 显示错误信息到页面
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.padding = '10px';
        errorDiv.textContent = '图表加载失败: ' + error.message;
        document.querySelector('.ability-analysis').prepend(errorDiv);
    }
});

// 生成诊断报告
function generateReport() {
    const reportContent = document.querySelector('.report-content');
    if (!reportContent) return;
    
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
                <li>扩充写作素材库，增加说服力，注意积累优质素材</li>
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