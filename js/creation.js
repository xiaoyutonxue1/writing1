import { getFavorites, removeFavorite } from './utils/favorites.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize editor functionality
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
});