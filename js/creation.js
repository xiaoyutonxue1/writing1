import { getFavorites, removeFavorite } from './utils/favorites.js';

// 编辑器状态管理
const editorState = {
    currentDocument: 'introduction',
    wordCount: 0,
    lastSaved: Date.now(),
    content: '',
    history: [],
    historyIndex: -1
};

// 写作模式管理
const writingModes = {
    free: { name: '自由写作', icon: 'fa-feather' },
    guided: { name: '引导写作', icon: 'fa-compass' },
    outline: { name: '大纲模式', icon: 'fa-list' }
};

let currentMode = 'free';

// 模拟数据
const MOCK_DATA = {
    taskInfo: {
        id: "task_001",
        title: "描写春天的散文",
        type: "写作训练",
        deadline: "2024-03-20",
        requirements: {
            minWords: 800,
            maxWords: 1200,
            theme: "春天的气息",
            focus: ["自然描写", "感官体验", "情感表达"],
            keywords: ["生机", "温暖", "色彩", "变化", "希望"]
        }
    },
    materials: [
        {
            id: "mat_001",
            title: "春天意象素材",
            type: "素材库",
            content: `1. 视觉意象：
- 新绿：嫩芽、新叶、青草
- 花朵：梅花、桃花、杏花、油菜花
- 春雨：蒙蒙细雨、春雨如丝
- 春光：和煦阳光、暖阳

2. 听觉意象：
- 鸟鸣：燕子啁啾、杜鹃啼鸣
- 流水：溪水潺潺、春水淙淙
- 风声：春风拂面、微风轻抚

3. 嗅觉意象：
- 花香：桃花芬芳、梨花馥郁
- 泥土：新翻土地的气息
- 青草：清新的草木香

4. 触觉意象：
- 温度：春风和煦、暖阳温柔
- 湿度：春雨润物、露珠晶莹
- 质感：嫩叶柔软、花瓣细腻`
        },
        {
            id: "mat_002",
            title: "优秀范文赏析",
            type: "范文",
            content: `《春》 - 朱自清

盼望着，盼望着，东风来了，春天的脚步近了。
一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。
小草偷偷地从土里钻出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。坐着，躺着，打两个滚，踢几脚球，赛几趟跑，捉几回迷藏。风轻悄悄的，草软绵绵的。

作品特点：
1. 拟人化手法：赋予春天生命力
2. 细腻的观察：捕捉春天细微变化
3. 动静结合：既有静态描写又有动态描写
4. 多感体验：视觉、触觉、听觉并用
5. 简洁生动的语言：短句运用，节奏明快`
        },
        {
            id: "mat_003",
            title: "写作建议",
            type: "指导",
            content: `春天主题写作技巧：

1. 观察要点：
- 注意季节变化的细节
- 关注自然界的生机
- 捕捉人们的活动变化
- 记录内心的感受

2. 描写手法：
- 运用多感官描写
- 善用比喻和拟人
- 动静结合
- 虚实结合

3. 情感表达：
- 结合个人体验
- 表达对生命的感悟
- 融入对春天的期待
- 抒发内心的喜悦

4. 结构安排：
- 时间顺序展开
- 空间变化推进
- 情感递进发展
- 首尾呼应`
        }
    ],
    teacherNotes: [
        {
            id: "note_001",
            title: "写作要点提示",
            content: "同学们要注意将自然描写与情感表达相结合，避免单纯的客观描述。要善于运用细节描写，让读者能够感同身受。"
        },
        {
            id: "note_002",
            title: "评分重点",
            content: `本次作文评分重点：
1. 描写的细腻程度：是否能够捕捉春天的细微变化
2. 情感的真实性：是否有真实的感受和体验
3. 语言的生动性：是否运用了恰当的修辞手法
4. 结构的完整性：是否层次分明，条理清晰`
        }
    ]
};

// 初始化编辑器
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    initializeToolbar();
    initializeWritingModes();
    initializeStoryBible();
    initializeAutoSave();
    updateWordCount();
    
    // 确保只调用一次初始化左侧栏
    initializeSidebarInteractions();
    
    loadTaskInfo();
    loadMaterials();
    loadTeacherNotes();
});

// 初始化编辑器
function initializeEditor() {
    const editor = document.getElementById('editor');
    
    // 编辑器内容变化监听
    editor.addEventListener('input', () => {
        updateWordCount();
        scheduleAutoSave();
        addToHistory();
    });

    // 快捷键支持
    editor.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'b':
                    e.preventDefault();
                    document.execCommand('bold', false, null);
                    break;
                case 'i':
                    e.preventDefault();
                    document.execCommand('italic', false, null);
                    break;
                case 'u':
                    e.preventDefault();
                    document.execCommand('underline', false, null);
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        redo();
                    } else {
                        undo();
                    }
                    break;
            }
        }
    });
}

// 初始化工具栏
function initializeToolbar() {
    // 格式化按钮
    document.querySelectorAll('.tool-btn[data-command]').forEach(btn => {
        btn.addEventListener('click', () => {
            const command = btn.getAttribute('data-command');
            document.execCommand(command, false, null);
        });
    });

    // 标题按钮
    document.querySelectorAll('.heading-buttons .tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.textContent;
            document.execCommand('formatBlock', false, level);
        });
    });

    // 返回按钮
    document.querySelector('.back-btn').addEventListener('click', () => {
        if (confirm('确定要返回吗？请确保已保存所有更改。')) {
            window.history.back();
        }
    });
}

// 初始化文档树
function initializeDocumentTree() {
    const treeItems = document.querySelectorAll('.tree-item');
    
    treeItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除其他项目的active类
            treeItems.forEach(i => i.classList.remove('active'));
            // 添加当前项目的active类
            item.classList.add('active');
            // 加载对应的文档内容
            loadDocument(item.querySelector('span').textContent);
        });
    });
}

// 自动保存功能
let autoSaveTimeout;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimeout);
    const saveStatus = document.querySelector('.save-status');
    saveStatus.textContent = '正在保存...';
    
    autoSaveTimeout = setTimeout(() => {
        saveDocument();
        saveStatus.textContent = '已保存';
    }, 1000);
}

// 保存文档
function saveDocument() {
    const editor = document.getElementById('editor');
    const content = editor.innerHTML;
    editorState.content = content;
    editorState.lastSaved = Date.now();
    
    // 保存到localStorage
    localStorage.setItem(`document_${editorState.currentDocument}`, content);
}

// 加载文档
function loadDocument(documentName) {
    const editor = document.getElementById('editor');
    const savedContent = localStorage.getItem(`document_${documentName}`);
    
    if (savedContent) {
        editor.innerHTML = savedContent;
    } else {
        editor.innerHTML = `<h1>${documentName}</h1><p>开始创作你的文章...</p>`;
    }
    
    editorState.currentDocument = documentName;
    updateWordCount();
}

// 更新字数统计
function updateWordCount() {
    const editor = document.getElementById('editor');
    const text = editor.innerText;
    const wordCount = text.length;
    
    document.querySelector('.word-count').textContent = `字数: ${wordCount}`;
    editorState.wordCount = wordCount;
}

// 撤销功能
function undo() {
    if (editorState.historyIndex > 0) {
        editorState.historyIndex--;
        const editor = document.getElementById('editor');
        editor.innerHTML = editorState.history[editorState.historyIndex];
        updateWordCount();
    }
}

// 重做功能
function redo() {
    if (editorState.historyIndex < editorState.history.length - 1) {
        editorState.historyIndex++;
        const editor = document.getElementById('editor');
        editor.innerHTML = editorState.history[editorState.historyIndex];
        updateWordCount();
    }
}

// 添加到历史记录
function addToHistory() {
    const editor = document.getElementById('editor');
    const content = editor.innerHTML;
    
    // 如果当前不是最新状态，删除之后的历史
    if (editorState.historyIndex < editorState.history.length - 1) {
        editorState.history = editorState.history.slice(0, editorState.historyIndex + 1);
    }
    
    editorState.history.push(content);
    editorState.historyIndex = editorState.history.length - 1;
    
    // 限制历史记录长度
    if (editorState.history.length > 50) {
        editorState.history.shift();
        editorState.historyIndex--;
    }
}

// 自动保存初始化
function initializeAutoSave() {
    // 每分钟检查一次是否需要保存
    setInterval(() => {
        const timeSinceLastSave = Date.now() - editorState.lastSaved;
        if (timeSinceLastSave > 60000) { // 1分钟
            saveDocument();
        }
    }, 60000);

    // 页面关闭前保存
    window.addEventListener('beforeunload', () => {
        saveDocument();
    });
}

// 初始化编辑器功能
const editor = document.getElementById('editor');
const wordCount = document.getElementById('wordCount');
const paragraphCount = document.getElementById('paragraphCount');
const timeSpent = document.getElementById('timeSpent');
const saveStatus = document.getElementById('saveStatus');
const aiAssistantBtn = document.getElementById('aiAssistantBtn');
const writingToolsBtn = document.getElementById('writingToolsBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const aiPanel = document.getElementById('aiAssistantPanel');
const toolsPanel = document.getElementById('writingToolsPanel');
const favoritesPanel = document.getElementById('favoritesPanel');
const submitBtn = document.getElementById('submitEssay');

let startTime = Date.now();
let saveTimeout;

// Make editor globally accessible for favorites functionality
window.editor = editor;

// Submit essay functionality
submitBtn.addEventListener('click', function() {
    const content = editor.innerText.trim();
    if (content.length < 100) {
        alert('作文内容太短，请至少写100字。');
        return;
    }

    if (confirm('确定要提交作文吗？提交后将不能再修改。')) {
        // Here you would typically send the essay to the server
        alert('作文提交成功！');
        // Optionally disable editing after submission
        editor.contentEditable = 'false';
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> 已提交';
    }
});

// Update stats function
function updateStats() {
    const text = editor.innerText.trim();
    wordCount.textContent = `字数：${text.length}`;
    const paragraphs = editor.getElementsByTagName('p').length;
    paragraphCount.textContent = `段落：${paragraphs}`;
    const minutes = Math.floor((Date.now() - startTime) / 60000);
    timeSpent.textContent = `用时：${minutes}分钟`;

    clearTimeout(saveTimeout);
    saveStatus.textContent = '正在保存...';
    saveTimeout = setTimeout(() => {
        saveStatus.textContent = '已自动保存';
        localStorage.setItem('draft', editor.innerHTML);
    }, 1000);
}

// Initialize toolbar functionality
document.querySelectorAll('.tool-btn[data-command]').forEach(btn => {
    btn.addEventListener('click', () => {
        const command = btn.getAttribute('data-command');
        document.execCommand(command, false, null);
        editor.focus();
    });
});

// Font size selection
document.getElementById('fontSize').addEventListener('change', function() {
    document.execCommand('fontSize', false, this.value);
    editor.focus();
});

// Panel toggle functionality
function togglePanel(panel, button) {
    const panels = [aiPanel, toolsPanel, favoritesPanel];
    const buttons = [aiAssistantBtn, writingToolsBtn, favoritesBtn];

    panels.forEach((p, index) => {
        if (p === panel) {
            if (p.classList.contains('show')) {
                p.classList.remove('show');
                buttons[index].classList.remove('active');
            } else {
                p.classList.add('show');
                buttons[index].classList.add('active');
            }
        } else {
            p.classList.remove('show');
            buttons[index].classList.remove('active');
        }
    });
}

// Button click events
aiAssistantBtn.addEventListener('click', () => togglePanel(aiPanel, aiAssistantBtn));
writingToolsBtn.addEventListener('click', () => togglePanel(toolsPanel, writingToolsBtn));
favoritesBtn.addEventListener('click', () => {
    togglePanel(favoritesPanel, favoritesBtn);
    updateFavoritesList();
});

// Close buttons
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const panel = this.closest('.tool-panel, .favorites-panel');
        panel.classList.remove('show');
        [aiAssistantBtn, writingToolsBtn, favoritesBtn].forEach(btn => {
            btn.classList.remove('active');
        });
    });
});

// Favorites functionality
function updateFavoritesList() {
    const favorites = getFavorites();
    const favoritesList = document.querySelector('.favorites-list');
    
    favoritesList.innerHTML = favorites.length ? favorites.map(item => `
        <div class="favorite-item" data-id="${item.id}">
            <div class="favorite-content">
                <h4>${item.title}</h4>
                <p>${item.preview}</p>
                <div class="favorite-meta">
                    <span><i class="fas fa-clock"></i> ${new Date(item.savedAt).toLocaleDateString()}</span>
                    <span><i class="fas fa-tag"></i> ${item.type}</span>
                </div>
            </div>
            <div class="favorite-actions">
                <button class="use-btn" title="引用内容">
                    <i class="fas fa-quote-right"></i>
                </button>
                <button class="remove-btn" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('') : '<div class="empty-message">暂无收藏内容</div>';

    // Add event listeners to buttons
    favoritesList.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.favorite-item');
            const id = parseInt(item.dataset.id);
            if (confirm('确定要删除这个收藏吗？')) {
                removeFavorite(id);
                updateFavoritesList();
            }
        });
    });

    favoritesList.querySelectorAll('.use-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.favorite-item');
            const id = parseInt(item.dataset.id);
            const favorite = getFavorites().find(f => f.id === id);
            if (favorite) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const quoteNode = document.createElement('blockquote');
                quoteNode.innerHTML = favorite.content;
                quoteNode.style.borderLeft = '3px solid #1890ff';
                quoteNode.style.paddingLeft = '1rem';
                quoteNode.style.margin = '1rem 0';
                range.insertNode(quoteNode);
                editor.focus();
            }
        });
    });
}

// AI Assistant chat functionality
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');
const chatMessages = document.getElementById('chatMessages');

function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    chatInput.value = '';

    // Simulate AI response
    setTimeout(() => {
        const response = "我理解您的问题。让我为您提供一些写作建议...";
        addMessage('ai', response);
    }, 1000);
}

sendMessage.addEventListener('click', handleMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleMessage();
    }
});

// Writing tools functionality
document.querySelectorAll('.tool-button').forEach(btn => {
    btn.addEventListener('click', function() {
        const toolType = this.getAttribute('data-tool');
        console.log(`Using tool: ${toolType}`);
    });
});

// Editor events
editor.addEventListener('input', updateStats);
editor.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
});

// Load draft
const savedDraft = localStorage.getItem('draft');
if (savedDraft) {
    editor.innerHTML = savedDraft;
}

// Initial stats update
updateStats();

// 浮动工具栏功能
const floatingToolbar = document.getElementById('floatingToolbar');

// 监听文本选择
document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (selection.toString().trim().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // 显示浮动工具栏
        floatingToolbar.style.display = 'flex';
        floatingToolbar.style.top = `${rect.top - floatingToolbar.offsetHeight - 10 + window.scrollY}px`;
        floatingToolbar.style.left = `${rect.left + (rect.width - floatingToolbar.offsetWidth) / 2}px`;
    } else {
        floatingToolbar.style.display = 'none';
    }
});

// 浮动工具栏按钮事件
document.querySelector('.floating-toolbar .rewrite-btn').addEventListener('click', () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
        requestAIRewrite(text);
    }
});

document.querySelector('.floating-toolbar .describe-btn').addEventListener('click', () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
        requestAIDescription(text);
    }
});

document.querySelector('.floating-toolbar .expand-btn').addEventListener('click', () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
        requestAIExpansion(text);
    }
});

document.querySelector('.floating-toolbar .quick-edit-btn').addEventListener('click', () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
        requestQuickEdit(text);
    }
});

// AI功能实现
async function requestAIRewrite(text) {
    try {
        // 这里应该调用后端API
        const response = await fetch('/api/ai/rewrite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        addSuggestionCard('REWRITE', data.suggestion);
    } catch (error) {
        console.error('AI重写请求失败:', error);
    }
}

async function requestAIDescription(text) {
    try {
        const response = await fetch('/api/ai/describe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        addSuggestionCard('DESCRIBE', data.suggestion);
    } catch (error) {
        console.error('AI描述请求失败:', error);
    }
}

async function requestAIExpansion(text) {
    try {
        const response = await fetch('/api/ai/expand', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        addSuggestionCard('EXPAND', data.suggestion);
    } catch (error) {
        console.error('AI展开请求失败:', error);
    }
}

async function requestQuickEdit(text) {
    try {
        const response = await fetch('/api/ai/quick-edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        addSuggestionCard('QUICK EDIT', data.suggestion);
    } catch (error) {
        console.error('快速编辑请求失败:', error);
    }
}

// 添加建议卡片
function addSuggestionCard(type, content) {
    const card = document.createElement('div');
    card.className = 'suggestion-card';
    card.innerHTML = `
        <div class="card-header">
            <i class="fas ${getIconForType(type)}"></i>
            <span>${type}</span>
        </div>
        <div class="card-content">
            <p>${content}</p>
        </div>
        <div class="card-actions">
            <button class="insert-btn">
                <i class="fas fa-plus"></i>
                插入
            </button>
            <button class="copy-btn">
                <i class="fas fa-copy"></i>
                复制
            </button>
            ${type === 'REWRITE' ? `
                <button class="more-btn">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            ` : ''}
        </div>
    `;
    
    // 添加按钮事件
    card.querySelector('.insert-btn').addEventListener('click', () => {
        insertContent(content);
    });
    
    card.querySelector('.copy-btn').addEventListener('click', () => {
        copyToClipboard(content);
    });
    
    const suggestionsContainer = document.querySelector('.writing-suggestions');
    suggestionsContainer.insertBefore(card, suggestionsContainer.firstChild);
}

// 辅助函数
function getIconForType(type) {
    const icons = {
        'REWRITE': 'fa-sync',
        'DESCRIBE': 'fa-align-left',
        'EXPAND': 'fa-expand-alt',
        'QUICK EDIT': 'fa-magic',
        'SHORTER': 'fa-compress-alt'
    };
    return icons[type] || 'fa-pencil-alt';
}

function insertContent(content) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(content));
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('已复制到剪贴板');
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

// 通知提示
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// 添加通知样式
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        animation: fadeInOut 2s ease-in-out;
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, 20px); }
        20% { opacity: 1; transform: translate(-50%, 0); }
        80% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);

// 初始化写作模式
function initializeWritingModes() {
    document.querySelectorAll('.dropdown-item[data-mode]').forEach(item => {
        item.addEventListener('click', () => {
            const mode = item.dataset.mode;
            switchWritingMode(mode);
        });
    });
}

// 切换写作模式
function switchWritingMode(mode) {
    currentMode = mode;
    const modeInfo = writingModes[mode];
    
    // 更新模式指示器
    const indicator = document.createElement('div');
    indicator.className = 'writing-mode-indicator';
    indicator.innerHTML = `
        <i class="fas ${modeInfo.icon}"></i>
        <span>${modeInfo.name}</span>
    `;
    
    const oldIndicator = document.querySelector('.writing-mode-indicator');
    if (oldIndicator) {
        oldIndicator.replaceWith(indicator);
    } else {
        document.querySelector('.editor-toolbar').appendChild(indicator);
    }
    
    // 根据模式调整编辑器
    adjustEditorForMode(mode);
}

// 根据模式调整编辑器
function adjustEditorForMode(mode) {
    const editor = document.getElementById('editor');
    
    switch(mode) {
        case 'outline':
            editor.classList.add('outline-mode');
            enableOutlineFeatures();
            break;
        case 'guided':
            editor.classList.add('guided-mode');
            startGuidedWriting();
            break;
        default:
            editor.classList.remove('outline-mode', 'guided-mode');
            break;
    }
}

// Story Bible功能
function initializeStoryBible() {
    const storyBible = document.createElement('div');
    storyBible.className = 'story-bible';
    storyBible.innerHTML = `
        <div class="story-bible-header">
            <h3>Story Bible</h3>
            <button class="close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="story-bible-content">
            <div class="story-element">
                <div class="element-header">
                    <span>人物</span>
                    <button class="add-btn">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="element-content" id="characters"></div>
            </div>
            <div class="story-element">
                <div class="element-header">
                    <span>场景</span>
                    <button class="add-btn">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="element-content" id="scenes"></div>
            </div>
            <div class="story-element">
                <div class="element-header">
                    <span>情节</span>
                    <button class="add-btn">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="element-content" id="plots"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(storyBible);
    
    // 绑定事件
    const storyBibleBtn = document.querySelector('.story-bible-btn');
    const closeBtn = storyBible.querySelector('.close-btn');
    
    storyBibleBtn.addEventListener('click', () => {
        storyBible.classList.toggle('show');
    });
    
    closeBtn.addEventListener('click', () => {
        storyBible.classList.remove('show');
    });
}

// AI功能增强
async function requestAIAssistance(type, text, options = {}) {
    try {
        const response = await fetch('/api/ai/assist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                text,
                options
            })
        });
        
        const data = await response.json();
        
        if (data.suggestions) {
            data.suggestions.forEach(suggestion => {
                addSuggestionCard(type, suggestion, options);
            });
        }
    } catch (error) {
        console.error('AI请求失败:', error);
        showNotification('AI助手暂时无法使用', 'error');
    }
}

// 增强的建议卡片
function addSuggestionCard(type, content, options = {}) {
    const card = document.createElement('div');
    card.className = `suggestion-card ${type.toLowerCase()}`;
    
    const confidence = options.confidence || Math.random() * 40 + 60; // 模拟AI置信度
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-type">
                <i class="fas ${getIconForType(type)}"></i>
                <span>${type}</span>
            </div>
            <div class="confidence-indicator" title="AI置信度: ${confidence.toFixed(1)}%">
                <div class="confidence-bar" style="width: ${confidence}%"></div>
            </div>
        </div>
        <div class="card-content">
            <p>${content}</p>
        </div>
        <div class="card-actions">
            <button class="insert-btn" data-tooltip="插入到当前位置">
                <i class="fas fa-plus"></i>
                插入
            </button>
            <button class="copy-btn" data-tooltip="复制到剪贴板">
                <i class="fas fa-copy"></i>
                复制
            </button>
            <button class="refresh-btn" data-tooltip="生成新的建议">
                <i class="fas fa-redo"></i>
                刷新
            </button>
            <button class="more-btn" data-tooltip="更多选项">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        </div>
    `;
    
    // 绑定事件
    card.querySelector('.insert-btn').addEventListener('click', () => {
        insertContent(content);
        showNotification('内容已插入');
    });
    
    card.querySelector('.copy-btn').addEventListener('click', () => {
        copyToClipboard(content);
    });
    
    card.querySelector('.refresh-btn').addEventListener('click', async () => {
        const newContent = await requestAIAssistance(type, content, {
            ...options,
            refresh: true
        });
        if (newContent) {
            card.querySelector('.card-content p').textContent = newContent;
            showNotification('内容已更新');
        }
    });
    
    card.querySelector('.more-btn').addEventListener('click', (e) => {
        showMoreOptions(e, type, content, options);
    });
    
    const suggestionsContainer = document.querySelector('.writing-suggestions');
    suggestionsContainer.insertBefore(card, suggestionsContainer.firstChild);
}

// 更多选项菜单
function showMoreOptions(event, type, content, options) {
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = `
        <button data-action="tone">调整语气</button>
        <button data-action="length">调整长度</button>
        <button data-action="style">更改风格</button>
        <button data-action="save">保存到收藏</button>
    `;
    
    // 定位菜单
    const rect = event.target.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.left = `${rect.left}px`;
    
    // 绑定事件
    menu.addEventListener('click', async (e) => {
        const action = e.target.dataset.action;
        if (action) {
            await handleMoreOption(action, type, content, options);
            menu.remove();
        }
    });
    
    // 点击其他地方关闭菜单
    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
    
    document.body.appendChild(menu);
}

// 处理更多选项
async function handleMoreOption(action, type, content, options) {
    switch(action) {
        case 'tone':
            showToneAdjustment(content);
            break;
        case 'length':
            showLengthAdjustment(content);
            break;
        case 'style':
            showStyleSelection(content);
            break;
        case 'save':
            saveToFavorites(type, content);
            break;
    }
}

// 加载草稿或笔记
function loadDraftOrNote(fileName) {
    console.log('Loading draft or note:', fileName);
    const mockContent = {
        '初稿 - 2024-03-15': '这是我的第一次尝试描写春天...',
        '修改稿 - 2024-03-16': '经过修改后的春天描写...',
        '写作构思': '1. 开头：描写早春的景象\n2. 中间：描写春天的变化\n3. 结尾：表达对春天的感受',
        '灵感记录': '- 今天看到了第一朵开放的桃花\n- 听到了久违的鸟叫声\n- 闻到了泥土的芬芳'
    };

    const content = mockContent[fileName] || '暂无内容';
    
    // 如果是草稿，直接加载到编辑器
    if (fileName.includes('草稿')) {
        const editor = document.getElementById('editor');
        if (editor) {
            editor.innerHTML = `<p>${content}</p>`;
            updateWordCount();
        }
    } else {
        // 如果是笔记，显示在弹窗中
        showNoteDetail(fileName, content);
    }
}

// 显示笔记详情
function showNoteDetail(title, content) {
    console.log('Showing note detail:', title);
    const dialog = document.createElement('div');
    dialog.className = 'modal-dialog';
    dialog.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="note-content">
                    ${content.split('\n').map(line => `<p>${line}</p>`).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="edit-btn">
                    <i class="fas fa-edit"></i>
                    编辑
                </button>
                <button class="close-btn">关闭</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // 绑定事件
    dialog.querySelectorAll('.close-btn').forEach(btn => {
        btn.onclick = () => dialog.remove();
    });
    
    dialog.querySelector('.edit-btn').onclick = () => {
        const noteContent = dialog.querySelector('.note-content');
        noteContent.contentEditable = true;
        noteContent.focus();
        
        // 添加保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> 保存';
        saveBtn.className = 'save-btn';
        dialog.querySelector('.modal-footer').insertBefore(saveBtn, dialog.querySelector('.close-btn'));
        
        saveBtn.onclick = () => {
            noteContent.contentEditable = false;
            showNotification('笔记已保存');
            saveBtn.remove();
        };
    };
}

// 搜索文件
function searchFiles(query) {
    console.log('Searching files with query:', query);
    const allItems = document.querySelectorAll('.tree-item, .project-item');
    allItems.forEach(item => {
        const name = item.querySelector('span').textContent.toLowerCase();
        const folder = item.closest('.tree-folder');
        const section = item.closest('.list-section');
        
        if (name.includes(query)) {
            item.style.display = 'flex';
            if (folder) {
                folder.style.display = 'block';
                folder.querySelector('.folder-header').classList.remove('collapsed');
                folder.querySelector('.folder-content').style.maxHeight = 'none';
            }
            if (section) {
                section.querySelector('.collapse-btn').classList.remove('collapsed');
                section.querySelector('.section-content').style.maxHeight = 'none';
            }
        } else {
            item.style.display = 'none';
        }
    });
}

// 初始化左侧栏
function initializeSidebarInteractions() {
    console.log('Initializing sidebar interactions...');

    // 折叠按钮功能
    document.querySelectorAll('.collapse-btn').forEach(btn => {
        console.log('Adding click event to collapse button');
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Collapse button clicked');
            
            const section = btn.closest('.list-section');
            const content = section.querySelector('.section-content');
            const icon = btn.querySelector('i');
            btn.classList.toggle('collapsed');
            
            if (btn.classList.contains('collapsed')) {
                content.style.maxHeight = '0';
                content.style.opacity = '0';
                icon.style.transform = 'rotate(-90deg)';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                icon.style.transform = 'rotate(0)';
            }
            return false;
        };
    });

    // 文件夹展开/收起功能
    document.querySelectorAll('.folder-header').forEach(header => {
        console.log('Adding click event to folder header');
        header.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Folder header clicked');
            
            const folder = header.closest('.tree-folder');
            const content = folder.querySelector('.folder-content');
            const icon = header.querySelector('.fa-chevron-down');
            
            header.classList.toggle('collapsed');
            if (header.classList.contains('collapsed')) {
                content.style.maxHeight = '0';
                content.style.opacity = '0';
                icon.style.transform = 'rotate(-90deg)';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                icon.style.transform = 'rotate(0)';
            }
            return false;
        };
    });

    // 文件点击功能
    document.querySelectorAll('.tree-item').forEach(item => {
        console.log('Adding click event to tree item');
        item.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Tree item clicked:', item);
            
            // 移除其他项目的active类
            document.querySelectorAll('.tree-item').forEach(i => {
                i.classList.remove('active');
            });
            // 添加当前项目的active类
            item.classList.add('active');
            
            // 加载对应的内容
            const fileName = item.querySelector('span').textContent;
            console.log('Loading file:', fileName);
            loadFileContent(fileName);
            return false;
        };
    });

    // 搜索功能
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        console.log('Adding input event to search bar');
        searchInput.oninput = debounce(function(e) {
            const query = e.target.value.toLowerCase();
            searchFiles(query);
        }, 300);
    }
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

// 更新样式以确保元素可点击
const sidebarStyles = document.createElement('style');
sidebarStyles.textContent = `
    .tree-folder .folder-content {
        max-height: 1000px;
        opacity: 1;
        overflow: hidden;
        transition: all 0.3s ease;
        pointer-events: auto;
    }

    .tree-folder .folder-header.collapsed + .folder-content {
        max-height: 0;
        opacity: 0;
    }

    .list-section .section-content {
        max-height: 1000px;
        opacity: 1;
        overflow: hidden;
        transition: all 0.3s ease;
        pointer-events: auto;
    }

    .list-section .collapse-btn.collapsed + .section-content {
        max-height: 0;
        opacity: 0;
    }

    .tree-item {
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        z-index: 1;
        pointer-events: auto;
        user-select: none;
        display: flex;
        align-items: center;
        padding: 8px 12px;
        margin: 2px 0;
        border-radius: 4px;
    }

    .tree-item:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    .tree-item.active {
        background: rgba(24, 144, 255, 0.1);
        color: #1890ff;
    }

    .tree-item i {
        margin-right: 8px;
        width: 16px;
        text-align: center;
    }

    .folder-header {
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        z-index: 1;
        pointer-events: auto;
        user-select: none;
        display: flex;
        align-items: center;
        padding: 8px 12px;
        margin: 2px 0;
        border-radius: 4px;
    }

    .folder-header:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    .folder-header i {
        margin-right: 8px;
        width: 16px;
        text-align: center;
    }

    .folder-header i.fa-chevron-down {
        transition: transform 0.3s ease;
    }

    .collapse-btn {
        cursor: pointer;
        pointer-events: auto;
        user-select: none;
        display: flex;
        align-items: center;
        padding: 4px;
        background: none;
        border: none;
        outline: none;
        margin: 2px 0;
        border-radius: 4px;
    }

    .collapse-btn:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    .collapse-btn i {
        margin-right: 8px;
        width: 16px;
        text-align: center;
        transition: transform 0.3s ease;
    }

    .left-sidebar {
        pointer-events: auto;
        user-select: none;
        padding: 16px;
    }

    .modal-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-width: 80%;
        max-height: 80vh;
        overflow-y: auto;
    }

    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 1000;
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 8px;
    }

    .section-header span {
        font-weight: 500;
    }

    .tree-folder {
        margin: 8px 0;
    }

    .folder-content {
        padding-left: 24px;
    }

    .list-section {
        margin-bottom: 16px;
    }

    .section-content {
        padding-left: 12px;
    }

    .search-bar {
        margin-bottom: 16px;
        position: relative;
    }

    .search-bar input {
        width: 100%;
        padding: 8px 12px 8px 32px;
        border: 1px solid #ddd;
        border-radius: 4px;
        outline: none;
    }

    .search-bar i {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
    }
`;
document.head.appendChild(sidebarStyles);

// 确保在DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSidebarInteractions);
} else {
    initializeSidebarInteractions();
}