// 全局状态管理
const state = {
    currentStep: 1,
    selectedTopic: null,
    outline: [],
    materials: [],
    content: '',
    timer: {
        startTime: null,
        elapsed: 0,
        interval: null
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeStepNavigation();
    initializeTopicSelection();
    initializeOutlineEditor();
    initializeMaterialsCollection();
    initializeWritingEditor();
    initializeTimer();
    initializeAIAssistant();
});

// 步骤导航初始化
function initializeStepNavigation() {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('click', () => {
            const stepNumber = parseInt(step.dataset.step);
            if (canNavigateToStep(stepNumber)) {
                navigateToStep(stepNumber);
            } else {
                showNotification('请先完成当前步骤');
            }
        });
    });
}

// 检查是否可以导航到指定步骤
function canNavigateToStep(stepNumber) {
    // 检查前置步骤是否完成
    switch(stepNumber) {
        case 1:
            return true;
        case 2:
            return state.selectedTopic !== null;
        case 3:
            return state.outline.length > 0;
        case 4:
            return state.materials.length > 0;
        case 5:
            return state.content.length > 0;
        default:
            return false;
    }
}

// 导航到指定步骤
function navigateToStep(stepNumber) {
    // 更新步骤指示器
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

    // 更新内容显示
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`step-${stepNumber}`).classList.add('active');

    // 更新当前步骤
    state.currentStep = stepNumber;
    updateProgress();
}

// 主题选择初始化
function initializeTopicSelection() {
    // 推荐主题选择
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', () => {
            selectTopic(card.querySelector('h4').textContent);
        });
    });

    // 自定义主题
    const customTopicBtn = document.querySelector('.confirm-topic');
    const customTopicInput = document.querySelector('.topic-input');
    
    customTopicBtn.addEventListener('click', () => {
        const topic = customTopicInput.value.trim();
        if (topic) {
            selectTopic(topic);
        } else {
            showNotification('请输入主题');
        }
    });
}

// 选择主题
function selectTopic(topic) {
    state.selectedTopic = topic;
    showNotification(`已选择主题：${topic}`);
    // 自动进入下一步
    navigateToStep(2);
    // 请求AI建议
    requestAIOutlineSuggestion(topic);
}

// 大纲编辑器初始化
function initializeOutlineEditor() {
    const addSectionBtn = document.querySelector('.add-section');
    const addPointBtn = document.querySelector('.add-point');
    const getSuggestionBtn = document.querySelector('.get-suggestion');

    addSectionBtn.addEventListener('click', () => {
        addOutlineSection();
    });

    addPointBtn.addEventListener('click', () => {
        addOutlinePoint();
    });

    getSuggestionBtn.addEventListener('click', () => {
        requestAIOutlineSuggestion(state.selectedTopic);
    });
}

// 添加大纲章节
function addOutlineSection() {
    const outlineContent = document.querySelector('.outline-content');
    const section = document.createElement('div');
    section.className = 'outline-section';
    section.innerHTML = `
        <h3 contenteditable="true">新章节</h3>
        <ul>
            <li contenteditable="true">要点</li>
        </ul>
    `;
    outlineContent.appendChild(section);
    updateOutlineState();
}

// 添加大纲要点
function addOutlinePoint() {
    const activeSection = document.querySelector('.outline-section.active');
    if (activeSection) {
        const ul = activeSection.querySelector('ul');
        const li = document.createElement('li');
        li.contenteditable = true;
        li.textContent = '新要点';
        ul.appendChild(li);
        updateOutlineState();
    } else {
        showNotification('请先选择一个章节');
    }
}

// 素材收集初始化
function initializeMaterialsCollection() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const categoryBtns = document.querySelectorAll('.category-btn');

    searchBtn.addEventListener('click', () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            searchMaterials(keyword);
        }
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadCategoryMaterials(btn.textContent);
        });
    });
}

// 素材数据
const materialDatabase = {
    '名言警句': {
        '理想校园': [
            {
                content: '教育是一个灵魂唤醒另一个灵魂的过程。 —— 柏拉图',
                source: '古希腊哲学家'
            },
            {
                content: '学校应该是一个培养人格、陶冶情操的地方。 —— 陶行知',
                source: '中国教育家'
            }
        ],
        '比赛': [
            {
                content: '胜不骄，败不馁。 —— 孔子',
                source: '论语'
            },
            {
                content: '失败是成功之母。 —— 俗语',
                source: '中国谚语'
            }
        ],
        '科技': [
            {
                content: '科技是第一生产力。 —— 邓小平',
                source: '改革开放理论'
            },
            {
                content: '想象力比知识更重要。 —— 爱因斯坦',
                source: '现代理学家'
            }
        ]
    },
    '优秀片段': {
        '理想校园': [
            {
                content: '在这里，每一个角落都洋溢着求知的气息。图书馆里，同学们专注地阅读；实验室中，创新的火花不断迸发；操场上，青春的活力肆意挥洒...',
                source: '优秀作文选段'
            },
            {
                content: '我理想中的校园，不仅有先进的教学设施，更重要的是有着浓厚的人文气息。师生之间亦师亦友，同学之间互帮互助...',
                source: '范文精选'
            }
        ],
        '比赛': [
            {
                content: '决赛的哨声响起的那一刻，时间仿佛凝固了。所有的汗水、付出、期待，都凝聚在这最后的几秒钟...',
                source: '获奖作文'
            },
            {
                content: '赛场上的较量，不仅是实力的比拼，更是意志的对决。当我看到对手眼中的坚定，我知道这将是一场难忘的比赛...',
                source: '作文精选'
            }
        ],
        '科技': [
            {
                content: '智能手机的出现，彻底改变了我们的生活方式。从早晨的闹钟到深夜的阅读，这个小小的设备承载着我们生活的方方面面...',
                source: '科技随笔'
            },
            {
                content: '人工智能就像一位无形的助手，它帮我们整理日程、回答问题、甚至创作艺术，让我们的生活变得更加便捷和丰富...',
                source: '科技文摘'
            }
        ]
    },
    '相关案例': {
        '理想校园': [
            {
                content: '芬兰赫尔辛基设计高中：没有固定教室，所有空间都是学习场所。学生可以自由选择学习地点，培养自主学习能力...',
                source: '教育案例'
            },
            {
                content: '深圳南山科技中学：将科技与教育深度融合，每个教室都配备智能互动设备，学生可以进行沉浸式学习...',
                source: '教育创新'
            }
        ],
        '比赛': [
            {
                content: '2008年奥运会刘翔退赛：带伤参赛却不得不退出，展现了运动员面对挫折的勇气和担当...',
                source: '体育故事'
            },
            {
                content: '2019年世界杯女排决赛：中国女排在逆境中奋起，最终夺冠，展现了永不言弃的精神...',
                source: '体育经典'
            }
        ],
        '科技': [
            {
                content: 'AlphaGo战胜李世石：人工智能首次在围棋领域战胜人类顶尖选手，开启了AI新纪元...',
                source: '科技里程碑'
            },
            {
                content: '"天问一号"成功登陆火星：中国首次火星探测任务取得成功，标志着中国航天技术的重大突破...',
                source: '科技成就'
            }
        ]
    }
};

// 加载分类素材
function loadCategoryMaterials(category) {
    const materials = [];
    if (state.selectedTopic) {
        for (let topic in materialDatabase[category]) {
            if (state.selectedTopic.includes(topic)) {
                materials.push(...materialDatabase[category][topic]);
            }
        }
    }
    
    if (materials.length === 0) {
        // 如果没有找到相关素材，显示通用素材
        materials.push(...materialDatabase[category][Object.keys(materialDatabase[category])[0]]);
    }

    displayMaterials(materials.map(m => ({
        type: category,
        content: `${m.content}\n—— ${m.source}`
    })));
}

// 搜索素材
function searchMaterials(keyword) {
    const results = [];
    
    // 搜索所有分类和主题
    for (let category in materialDatabase) {
        for (let topic in materialDatabase[category]) {
            const materials = materialDatabase[category][topic];
            materials.forEach(material => {
                if (material.content.includes(keyword) || material.source.includes(keyword)) {
                    results.push({
                        type: category,
                        content: `${material.content}\n—— ${material.source}`
                    });
                }
            });
        }
    }

    displayMaterials(results.length > 0 ? results : [
        {
            type: '搜索结果',
            content: `未找到与"${keyword}"相关的素材，建议尝试其他关键词。`
        }
    ]);
}

// 显示素材
function displayMaterials(materials) {
    const materialList = document.querySelector('.material-list');
    materialList.innerHTML = materials.map(material => `
        <div class="material-item">
            <div class="material-content">${material.content}</div>
            <button class="collect-btn">收藏</button>
        </div>
    `).join('');

    // 添加收藏功能
    document.querySelectorAll('.collect-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            collectMaterial(materials[index]);
        });
    });
}

// 写作编辑器初始化
function initializeWritingEditor() {
    const editor = document.querySelector('.editor');
    const formatBtn = document.querySelector('.tool-btn.format');
    const saveBtn = document.querySelector('.tool-btn.save');
    const helpBtn = document.querySelector('.tool-btn.help');

    // 自动保存
    editor.addEventListener('input', () => {
        state.content = editor.innerHTML;
        autoSave();
    });

    formatBtn.addEventListener('click', () => {
        formatText();
    });

    saveBtn.addEventListener('click', () => {
        saveContent();
    });

    helpBtn.addEventListener('click', () => {
        showHelp();
    });
}

// AI助手初始化
function initializeAIAssistant() {
    const sendBtn = document.querySelector('.send-btn');
    const aiInput = document.querySelector('.ai-input');
    const minimizeBtn = document.querySelector('.minimize-btn');

    sendBtn.addEventListener('click', () => {
        const message = aiInput.value.trim();
        if (message) {
            sendToAI(message);
            aiInput.value = '';
        }
    });

    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    minimizeBtn.addEventListener('click', () => {
        toggleAssistant();
    });
}

// 发送消息给AI
function sendToAI(message) {
    const messageList = document.querySelector('.message-list');
    
    // 添加用户消息
    messageList.innerHTML += `
        <div class="message user-message">
            <div class="message-content">${message}</div>
        </div>
    `;

    // 模拟AI响应
    setTimeout(() => {
        const response = generateAIResponse(message);
        messageList.innerHTML += `
            <div class="message ai-message">
                <div class="message-content">${response}</div>
            </div>
        `;
        messageList.scrollTop = messageList.scrollHeight;
    }, 1000);
}

// 生成AI响应
function generateAIResponse(message) {
    // 根据不同的关键词生成不同的回复
    const keywords = {
        '开始': [
            '让我们开始写作吧！首先，你可以先思考一下主题的核心内容是什么...',
            '好的，我来帮你梳理一下写作思路。这个主题可以从以下几个方面展开...'
        ],
        '不会': [
            '没关系，让我来帮你一步步分析。首先，我们可以...',
            '写作是一个循序渐进的过程，我们可以先从简单的开始...'
        ],
        '怎么写': [
            '对于这个主题，你可以先列出几个关键点，比如...',
            '我建议可以从以下几个角度来写：1. ... 2. ... 3. ...'
        ],
        '素材': [
            '我为你找到了一些相关的素材，你可以参考：...',
            '这里有一些好的例子可以借鉴：...'
        ],
        '修改': [
            '让我看看你的文章...这里的表达可以更生动一些，比如...',
            '整体结构不错，不过有几个地方可以优化：...'
        ],
        '建议': [
            '基于你的写作内容，我有以下建议：...',
            '你的文章写得不错，可以考虑在这些方面进一步加强：...'
        ]
    };

    // 主题相关的回复
    const topicResponses = {
        '理想校园': [
            '谈到理想校园，你可以从环境、设施、氛围等方面展开描写...',
            '不妨想象一下，在理想的校园中，你最希望看到什么样的场景？'
        ],
        '比赛': [
            '描写比赛时，可以注意记录自己的心理变化和关键时刻的细节...',
            '比赛的过程、结果都很重要，但更重要的是你从中学到了什么'
        ],
        '科技': [
            '写科技主题时，可以结合自己的亲身体验，说说科技给生活带来的变化...',
            '可以选择一两个具体的科技产品或应用，详细描述它们如何改变了我们的生活'
        ]
    };

    // 检查消息是否包含关键词
    for (let keyword in keywords) {
        if (message.includes(keyword)) {
            const responses = keywords[keyword];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    // 检查是否与当前主题相关
    if (state.selectedTopic) {
        for (let topic in topicResponses) {
            if (state.selectedTopic.includes(topic)) {
                const responses = topicResponses[topic];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
    }

    // 默认回复
    const defaultResponses = [
        '这是一个很好的问题，让我想想...',
        '我明白你的意思，让我帮你分析一下...',
        '这个问题很有趣，我们可以这样思考...',
        '根据我的理解，你可以尝试...'
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// 计时器功能
function initializeTimer() {
    const startBtn = document.querySelector('.timer-btn.start');
    const pauseBtn = document.querySelector('.timer-btn.pause');
    const resetBtn = document.querySelector('.timer-btn.reset');

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
}

// 开始计时
function startTimer() {
    if (!state.timer.interval) {
        state.timer.startTime = Date.now() - (state.timer.elapsed || 0);
        state.timer.interval = setInterval(updateTimer, 1000);
    }
}

// 暂停计时
function pauseTimer() {
    if (state.timer.interval) {
        clearInterval(state.timer.interval);
        state.timer.interval = null;
        state.timer.elapsed = Date.now() - state.timer.startTime;
    }
}

// 重置计时
function resetTimer() {
    pauseTimer();
    state.timer.elapsed = 0;
    updateTimerDisplay(0);
}

// 更新计时器显示
function updateTimer() {
    const elapsed = Date.now() - state.timer.startTime;
    updateTimerDisplay(elapsed);
}

// 更新计时器显示
function updateTimerDisplay(elapsed) {
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 1000 / 60) % 60;
    const hours = Math.floor(elapsed / 1000 / 60 / 60);
    
    const display = document.querySelector('.time-display');
    display.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// 数字补零
function pad(number) {
    return number.toString().padStart(2, '0');
}

// 更新进度
function updateProgress() {
    const progress = document.querySelector('.progress');
    const percentage = (state.currentStep - 1) * 20;
    progress.style.width = `${percentage}%`;
    progress.querySelector('span').textContent = `${percentage}%`;
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // 添加动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // 自动移除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 自动保存
function autoSave() {
    // 这里应该调用实际的保存API
    console.log('自动保存内容...');
}

// 格式化文本
function formatText() {
    // 现文本格式化逻辑
    console.log('格式化文本...');
}

// 保存内容
function saveContent() {
    // 实现内容保存逻辑
    console.log('保存内容...');
    showNotification('内容已保存');
}

// 显示帮助
function showHelp() {
    // 显示帮助信息
    showNotification('正在打开帮助文档...');
}

// 切换AI助手显示状态
function toggleAssistant() {
    const assistant = document.querySelector('.writing-assistant');
    assistant.classList.toggle('minimized');
}

// 更新AI建议的模拟数据
function requestAIOutlineSuggestion(topic) {
    const outlineSuggestions = {
        '我的理想校园': {
            title: '我的理想校园 - 写作建议',
            sections: [
                {
                    title: '引言',
                    points: [
                        '介绍对理想校园的向往',
                        '说明描写理想校园的意义'
                    ]
                },
                {
                    title: '校园环境',
                    points: [
                        '自然环境：绿树、花园、小溪等',
                        '人文环境：图书馆、体育场、艺术中心等',
                        '学习环境：智能教室、实验室等'
                    ]
                },
                {
                    title: '校园氛围',
                    points: [
                        '学习氛围：求知欲强、互帮互助',
                        '文化氛围：多彩的校园活动',
                        '师生关系：和谐互动、亦师亦友'
                    ]
                },
                {
                    title: '创新特色',
                    points: [
                        '科技创新：智能化管理和教学',
                        '人文关怀：心理辅导、个性化培养',
                        '国际视野：文化交流、国际合作'
                    ]
                },
                {
                    title: '结语',
                    points: [
                        '总结理想校园的特点',
                        '表达对理想校园的期望'
                    ]
                }
            ]
        },
        '难忘的一次比赛': {
            title: '难忘的一次比赛 - 写作建议',
            sections: [
                {
                    title: '引言',
                    points: [
                        '介绍比赛的基本情况',
                        '说明这次比赛的特殊意义'
                    ]
                },
                {
                    title: '赛前准备',
                    points: [
                        '身体和技能的训练',
                        '心理准备和团队配合',
                        '教练和队友的支持'
                    ]
                },
                {
                    title: '比赛过程',
                    points: [
                        '关键时刻的描写',
                        '个人或团队的表现',
                        '情绪和心理变化'
                    ]
                },
                {
                    title: '比赛结果',
                    points: [
                        '最终成绩',
                        '意外或转折',
                        '现场气氛描写'
                    ]
                },
                {
                    title: '感悟总结',
                    points: [
                        '比赛的收获和成长',
                        '对未来的启示'
                    ]
                }
            ]
        },
        '科技改变生活': {
            title: '科技改变生活 - 写作建议',
            sections: [
                {
                    title: '引言',
                    points: [
                        '引出科技与生活的关系',
                        '点明科技发展的重要性'
                    ]
                },
                {
                    title: '学习方面',
                    points: [
                        '在线教育的便利',
                        '学习资源的丰富',
                        '学习方式的改变'
                    ]
                },
                {
                    title: '生活方面',
                    points: [
                        '智能家居的便利',
                        '交通出行的变化',
                        '娱乐方式的革新'
                    ]
                },
                {
                    title: '交往方面',
                    points: [
                        '社交方式的改变',
                        '信息获取的便捷',
                        '全球交流的机会'
                    ]
                },
                {
                    title: '展望未来',
                    points: [
                        '科技发展趋势',
                        '对未来生活的期待'
                    ]
                }
            ]
        }
    };

    // 根据主题生成建议
    let suggestion = '';
    if (outlineSuggestions[topic]) {
        const outline = outlineSuggestions[topic];
        suggestion = `
            <div class="ai-suggestion">
                <h4>${outline.title}</h4>
                <ol>
                    ${outline.sections.map(section => `
                        <li>${section.title}
                            <ul>
                                ${section.points.map(point => `
                                    <li>${point}</li>
                                `).join('')}
                            </ul>
                        </li>
                    `).join('')}
                </ol>
            </div>
        `;
    } else {
        // 生成通用建议
        suggestion = `
            <div class="ai-suggestion">
                <h4>写作建议</h4>
                <ol>
                    <li>引言
                        <ul>
                            <li>背景介绍</li>
                            <li>主题说明</li>
                        </ul>
                    </li>
                    <li>主要内容
                        <ul>
                            <li>核心论点</li>
                            <li>论据支撑</li>
                            <li>实例说明</li>
                        </ul>
                    </li>
                    <li>结论
                        <ul>
                            <li>总结要点</li>
                            <li>升华主题</li>
                        </ul>
                    </li>
                </ol>
            </div>
        `;
    }
    
    document.querySelector('.suggestion-content').innerHTML = suggestion;
}

// 更新大纲状态
function updateOutlineState() {
    const outlineContent = document.querySelector('.outline-content');
    state.outline = Array.from(outlineContent.querySelectorAll('.outline-section')).map(section => ({
        title: section.querySelector('h3').textContent,
        points: Array.from(section.querySelectorAll('li')).map(li => li.textContent)
    }));
}

// 收藏素材
function collectMaterial(material) {
    state.materials.push(material);
    updateCollectedMaterials();
    showNotification('素材已收藏');
}

// 更新已收藏的素材
function updateCollectedMaterials() {
    const collectedList = document.querySelector('.collected-list');
    collectedList.innerHTML = state.materials.map(material => `
        <div class="collected-item">
            <div class="material-content">${material.content}</div>
            <button class="remove-btn">删除</button>
        </div>
    `).join('');

    // 添加删除功能
    document.querySelectorAll('.remove-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            state.materials.splice(index, 1);
            updateCollectedMaterials();
        });
    });
} 