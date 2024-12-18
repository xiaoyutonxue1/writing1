// 核心应用类
class WritingApp {
    constructor() {
        this.editor = document.getElementById('editor');
        this.wordCountElement = document.getElementById('wordCount');
        this.paragraphCountElement = document.getElementById('paragraphCount');
        this.timeSpentElement = document.getElementById('timeSpent');
        this.floatingToolbar = document.getElementById('floatingToolbar');
        this.startTime = new Date();

        if (!this.editor || !this.floatingToolbar) {
            console.error('必要的DOM元素未找到');
            return;
        }

        this.initializeUI();
        this.bindEvents();
        this.updateStats();
        this.addAnimationStyles();
        this.initializeFolderStates();
    }

    // 初始化UI
    initializeUI() {
        console.log('初始化UI...');
        
        // 确保右侧建议区域存在
        const rightSidebar = document.querySelector('.right-sidebar');
        if (rightSidebar) {
            // 检查是否已存在建议列表容器
            let suggestionsContainer = rightSidebar.querySelector('.suggestions-list');
            if (!suggestionsContainer) {
                // 创建建议列表容器
                suggestionsContainer = document.createElement('div');
                suggestionsContainer.className = 'suggestions-list';
                rightSidebar.appendChild(suggestionsContainer);
            }
        } else {
            console.error('未找到右侧栏容器');
        }

        // 加载任务信息
        this.loadTaskInfo();
        // 加载学习资料
        this.loadMaterials();
    }

    // 绑定事件
    bindEvents() {
        console.log('绑定事件...');
        this.bindSidebarEvents();
        this.bindEditorEvents();
        this.bindTaskInfoEvents();
    }

    // 绑定侧边栏事件
    bindSidebarEvents() {
        try {
            const projectList = document.querySelector('.project-list');
            if (!projectList) {
                console.error('未找到项目列表容器');
                return;
            }

            projectList.addEventListener('click', (e) => {
                const target = e.target;
                let handled = false;

                // 处理文件夹点击
                const folderHeader = target.closest('.folder-header');
                if (folderHeader) {
                    e.preventDefault();
                    this.handleFolderClick(folderHeader);
                    handled = true;
                }

                // 处理树形项点击
                const treeItem = target.closest('.tree-item');
                if (treeItem && !handled) {
                    e.preventDefault();
                    this.handleTreeItemClick(treeItem);
                    handled = true;
                }

                // 处理折叠按钮点击
                const collapseBtn = target.closest('.collapse-btn');
                if (collapseBtn && !handled) {
                    e.preventDefault();
                    this.handleCollapseClick(collapseBtn);
                    handled = true;
                }

                if (handled) {
                    e.stopPropagation();
                    return false;
                }
            });
        } catch (error) {
            console.error('绑定侧边栏事件时出错:', error);
        }
    }

    // 绑定编辑器事件
    bindEditorEvents() {
        if (this.editor) {
            // 监听输入事件
            this.editor.addEventListener('input', () => {
                this.handleEditorInput();
                this.updateStats();
            });

            // 监听选择事件
            this.editor.addEventListener('mouseup', () => {
                this.handleTextSelection();
            });

            // 监听键盘选择事件
            this.editor.addEventListener('keyup', (e) => {
                // 当使用Shift+方向键选择文本时
                if (e.shiftKey && (e.key.includes('Arrow') || e.key === 'Home' || e.key === 'End')) {
                    this.handleTextSelection();
                }
            });

            // 点击其他区域时隐藏工具栏
            document.addEventListener('mousedown', (e) => {
                if (!this.floatingToolbar.contains(e.target) && !this.editor.contains(e.target)) {
                    this.hideFloatingToolbar();
                }
            });

            // 定期更新用时
            setInterval(() => {
                this.updateStats();
            }, 60000);
        }

        // 绑定浮动工具栏按钮事件
        if (this.floatingToolbar) {
            const buttons = this.floatingToolbar.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleToolbarAction(button.classList[0]);
                });
            });
        }
    }

    // 绑定任务信息相关事件
    bindTaskInfoEvents() {
        const taskInfo = document.querySelector('.task-header');
        if (!taskInfo) {
            console.log('未找到任务信息区域');
            return;
        }

        // 获取或创建折叠按钮
        let toggleBtn = taskInfo.querySelector('.task-toggle-btn');
        if (!toggleBtn) {
            // 创建折叠按钮
            toggleBtn = document.createElement('button');
            toggleBtn.className = 'task-toggle-btn';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            
            // 创建按钮容器
            const btnContainer = document.createElement('div');
            btnContainer.className = 'task-toggle-container';
            btnContainer.appendChild(toggleBtn);
            
            // 将按钮添加到任务信息区域
            taskInfo.appendChild(btnContainer);
        }

        // 获取需要折叠的内容
        const taskContent = document.querySelector('.task-requirements');
        if (!taskContent) {
            console.log('未找到任务内容区域');
            return;
        }

        // 设置初始状态
        taskContent.style.maxHeight = taskContent.scrollHeight + 'px';
        taskContent.style.overflow = 'hidden';
        taskContent.style.transition = 'max-height 0.3s ease';

        // 移除现有的事件监听器
        toggleBtn.replaceWith(toggleBtn.cloneNode(true));
        toggleBtn = taskInfo.querySelector('.task-toggle-btn');

        // 绑定点击事件
        toggleBtn.addEventListener('click', () => {
            const isCollapsed = taskContent.style.maxHeight === '0px';
            
            if (isCollapsed) {
                // 展开
                taskContent.style.maxHeight = taskContent.scrollHeight + 'px';
                toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
                toggleBtn.setAttribute('title', '收起');
            } else {
                // 折叠
                taskContent.style.maxHeight = '0px';
                toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
                toggleBtn.setAttribute('title', '展开');
            }
        });
    }

    // 处理文件项点击
    handleTreeItemClick(item) {
        if (!item) return;
        
        // 移除其他项目的active类
        document.querySelectorAll('.tree-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // 添加当前项目的active类
        item.classList.add('active');
        
        // 获取文件名
        const nameSpan = item.querySelector('span');
        if (nameSpan) {
            const fileName = nameSpan.textContent;
            this.loadFileContent(fileName);
        }
    }

    // 处理文件夹点击
    handleFolderClick(header) {
        if (!header) {
            console.log('未找到文件夹头部');
            return;
        }

        try {
            const folder = header.closest('.tree-folder');
            if (!folder) {
                console.log('未找到文件夹容器');
                return;
            }

            const content = folder.querySelector('.folder-content');
            const icon = header.querySelector('.fa-chevron-down');
            if (!content || !icon) {
                console.log('未找到必要元素');
                return;
            }

            // 切换折叠状态
            const isCollapsed = header.classList.contains('collapsed');
            const contentHeight = content.scrollHeight;

            // 使用requestAnimationFrame确保样式变化平滑
            requestAnimationFrame(() => {
                header.classList.toggle('collapsed');
                
                if (!isCollapsed) {
                    // 折叠
                    content.style.maxHeight = '0px';
                    content.style.opacity = '0';
                    icon.style.transform = 'rotate(-90deg)';
                } else {
                    // 展开
                    content.style.maxHeight = `${contentHeight}px`;
                    content.style.opacity = '1';
                    icon.style.transform = 'rotate(0deg)';
                }
            });

            console.log(`文件夹 ${header.textContent.trim()} ${!isCollapsed ? '已折叠' : '已展开'}`);
        } catch (error) {
            console.error('处理文件夹点击时出错:', error);
        }
    }

    // 处理折叠按钮点击
    handleCollapseClick(btn) {
        if (!btn) {
            console.log('未找到折叠按钮');
            return;
        }

        const section = btn.closest('.list-section');
        if (!section) {
            console.log('未找到列表区块');
            return;
        }

        const content = section.querySelector('.section-content');
        if (!content) {
            console.log('未找到内容区域');
            return;
        }

        // 切换折叠状态
        btn.classList.toggle('collapsed');
        
        // 设置内容高度
        if (btn.classList.contains('collapsed')) {
            // 折叠状态
            content.style.maxHeight = '0px';
            content.style.opacity = '0';
        } else {
            // 展开状态
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            
            // 确保子内容也能正确显示
            const subContents = content.querySelectorAll('.folder-content');
            if (subContents.length > 0) {
                subContents.forEach(subContent => {
                    const parentHeader = subContent.previousElementSibling;
                    if (parentHeader && !parentHeader.classList.contains('collapsed')) {
                        subContent.style.maxHeight = subContent.scrollHeight + 'px';
                        subContent.style.opacity = '1';
                    }
                });
            }
        }
    }

    // 处理编辑器输入
    handleEditorInput() {
        console.log('编辑器内容已更改');
        // 触发自动保存等其他逻辑...
    }

    // 加载文件内容
    loadFileContent(fileName) {
        console.log('加载文件内容:', fileName);
        
        // 范文内容
        const articles = {
            '朱自清《春》': {
                title: '春',
                author: '朱自清',
                content: `盼望着，盼望着，东风来了，春天的脚步近了。

一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。

小草偷偷地从土里钻出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。

桃树、杏树、梨树，你不让我，我不让你，都开满了花赶趟儿。红的像火，粉的像霞，白的像雪。花里带着甜味儿；闭了眼，树上仿佛已经满是桃儿、杏儿、梨儿。

燕子来了，带着忙忙碌碌的消息，风筝也来了，带着柳絮样的轻飘，儿童们也都出来了，草地上，池水旁。

青蛙睡醒了，哈欠连连，挪动到了暖和的地方，花园里，院子里，瞧去，一大队一大队的。

蝴蝶也来了，阳光里晃悠着翅膀，一个个"娇嫩得像嫩姑娘"。

小鸟儿呢，在树稍上呼朋引伴，在空中翩翩飞舞。`
            }
        };

        try {
            // 根据文件名加载内容
            if (fileName.includes('朱自清')) {
                const article = articles['朱自清《春》'];
                if (this.editor) {
                    this.editor.innerHTML = `
                        <h1>${article.title}</h1>
                        <div class="article-meta">
                            <span class="author">作者：${article.author}</span>
                        </div>
                        ${article.content.split('\n').map(p => `<p>${p}</p>`).join('\n')}
                    `;
                    console.log('内容加载成功');
                    this.updateStats(); // 加载内容后更新统计
                }
            }
        } catch (error) {
            console.error('加载文件内容时出错:', error);
        }
    }

    // 加载任务信息
    loadTaskInfo() {
        console.log('加载任务信息...');
        // 这里可以添加加载任务信息的逻辑
    }

    // 加载学习资料
    loadMaterials() {
        console.log('加载学习资料...');
        // 这里可以添加加载学习资料的逻辑
    }

    // 更新统计信息
    updateStats() {
        if (!this.editor) return;
        
        // 获取编辑器内容
        const content = this.editor.innerText || '';
        
        // 计算字数（中文算一个字，英文单词算一个字）
        const wordCount = this.calculateWordCount(content);
        
        // 计算段落数
        const paragraphCount = this.calculateParagraphCount(content);
        
        // 计算用时
        const timeSpent = this.calculateTimeSpent();
        
        // 更新显示
        if (this.wordCountElement) {
            this.wordCountElement.textContent = `字数：${wordCount}`;
        }
        if (this.paragraphCountElement) {
            this.paragraphCountElement.textContent = `段落：${paragraphCount}`;
        }
        if (this.timeSpentElement) {
            this.timeSpentElement.textContent = `用时：${timeSpent}分钟`;
        }
    }

    // 计算字数
    calculateWordCount(text) {
        if (!text) return 0;
        
        // 移除HTML标签
        text = text.replace(/<[^>]+>/g, '');
        
        // 移除空格和换行
        text = text.replace(/\s+/g, '');
        
        // 计算中文字符和英文单词
        const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0);
        
        return chineseCount + englishWords.length;
    }

    // 计算段落数
    calculateParagraphCount(text) {
        if (!text) return 0;
        
        // 通过换行符分割，过滤掉空段落
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        return paragraphs.length;
    }

    // 计算用时（分钟）
    calculateTimeSpent() {
        const now = new Date();
        const diffInMinutes = Math.floor((now - this.startTime) / 1000 / 60);
        return diffInMinutes;
    }

    // 处理文本选择
    handleTextSelection() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText) {
            // 获取选中文本的位置
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // 显示工具栏
            this.showFloatingToolbar(rect);
        } else {
            this.hideFloatingToolbar();
        }
    }

    // 显示浮动工具栏
    showFloatingToolbar(rect) {
        if (!this.floatingToolbar) return;

        // 计算工具栏位置
        const editorRect = this.editor.getBoundingClientRect();
        const toolbarRect = this.floatingToolbar.getBoundingClientRect();
        
        // 默认显示在选中文本上方
        let top = rect.top - toolbarRect.height - 10;
        
        // 如果上方空间不够，就显示在下方
        if (top < 0) {
            top = rect.bottom + 10;
        }

        // 水平居中对齐
        let left = rect.left + (rect.width - toolbarRect.width) / 2;
        
        // 确保不超出编辑器边界
        if (left < 0) {
            left = 10;
        } else if (left + toolbarRect.width > editorRect.right) {
            left = editorRect.right - toolbarRect.width - 10;
        }

        // 设置工具栏位置
        this.floatingToolbar.style.top = `${top + window.scrollY}px`;
        this.floatingToolbar.style.left = `${left}px`;
        this.floatingToolbar.classList.add('show');
    }

    // 隐藏浮动工具栏
    hideFloatingToolbar() {
        if (this.floatingToolbar) {
            this.floatingToolbar.classList.remove('show');
        }
    }

    // 处理工具栏按钮点击
    handleToolbarAction(action) {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (!selectedText) return;

        switch (action) {
            case 'rewrite-btn':
                this.handleAIRewrite(selectedText);
                break;
            case 'describe-btn':
                this.handleAIDescribe(selectedText);
                break;
            case 'expand-btn':
                this.handleAIExpand(selectedText);
                break;
            case 'quick-edit-btn':
                this.handleQuickEdit(selectedText);
                break;
        }
    }

    // AI重写功能
    handleAIRewrite(text) {
        console.log('开始执行AI重写...');
        
        // 获取右侧建议区域
        const rightSidebar = document.querySelector('.right-sidebar');
        if (!rightSidebar) {
            console.error('未找到右侧栏容器');
            return;
        }
        console.log('成功获取右侧栏容器');

        // 获取或创建建议列表容器
        let suggestionsContent = rightSidebar.querySelector('.suggestions-list');
        if (!suggestionsContent) {
            console.log('创建建议列表容器');
            suggestionsContent = document.createElement('div');
            suggestionsContent.className = 'suggestions-list';
            rightSidebar.appendChild(suggestionsContent);
        }
        
        // 确保容器可见
        suggestionsContent.style.display = 'block';
        suggestionsContent.style.minHeight = '200px';
        
        // 清空现有建议
        suggestionsContent.innerHTML = '';
        console.log('清空并准备添加新建议');
        
        // 生成3个模拟建议
        const suggestions = [
            {
                type: 'rewrite',
                icon: 'sync',
                title: '改写建议',
                text: '这段春天的描写可以从视觉、听觉、嗅觉等多个感官角度进行细致刻画。建议：\n"嫩绿的新芽悄然破土，像一支支翠绿的画笔，在大地上勾勒生机。目光所及，园林田野间铺展着一片片新绿的地毯。\n\n各色果树竞相绽放，桃花似朝霞般灿烂，杏花如晚霞般绚丽，梨花若白雪般纯净。花香沁人心脾，闭目遐想，仿佛已能看到枝头挂满累累硕果。\n\n春风送来燕子的喜讯，也带来风筝的欢笑。孩童们在草地上嬉戏，在池畔追逐，为这春日增添了无限生趣。"',
                options: [
                    { value: 'formal', text: '正式改写' },
                    { value: 'casual', text: '轻松改写' },
                    { value: 'literary', text: '文学改写' }
                ]
            },
            {
                type: 'polish',
                icon: 'magic',
                title: '润色建议',
                text: '建议通过更丰富的意象和更细腻的描写来增强画面感。建议：\n"春日里，嫩芽偷偷探出头来，像一个个顽皮的精灵，将大地点缀得生机盎然。放眼望去，园林与田野间尽是一片片青翠欲滴的新绿。\n\n果树们仿佛在举办盛大的春日庆典，桃花红得似火般热烈，杏花粉得像霞般温柔，梨花白得如雪般纯洁。阵阵花香在微风中流转，闭上眼，仿佛已能看到满树的果实在枝头轻轻摇曳。\n\n春风裹挟着燕子的欢唱，牵引着风筝的舞姿，还有孩童们的笑声在草地上、池水旁回荡，构成了一幅动感十足的春日画卷。"',
                options: [
                    { value: 'concise', text: '简洁版本' },
                    { value: 'detailed', text: '详细版本' },
                    { value: 'vivid', text: '生动版本' }
                ]
            },
            {
                type: 'style',
                icon: 'palette',
                title: '风格建议',
                text: '建议采用更富有诗意和韵律感的表达方式。建议：\n"春意悄然，新绿的精灵从沉睡的土地中苏醒，点点嫩芽如碧玉般晶莹，编织成一幅生机勃勃的翠绿画卷，在园林与田野间徐徐展开。\n\n百花争艳，果树枝头绽放出春天的调色盘：桃花如朝霞初绽，灿若云霓；杏花似晚霞留恋，绚若彩虹；梨花若云雪飘散，纯净无暇。花香氤氲，沁人心脾，让人不禁遐想满树硕果的丰收景象。\n\n春风拂过，带来燕子的欢唱与风筝的翩跹，还有孩童们在草地上、池水旁追逐嬉戏的欢声笑语，共同谱写这春日的交响乐章。"',
                options: [
                    { value: 'narrative', text: '叙事风格' },
                    { value: 'descriptive', text: '描写风格' },
                    { value: 'emotional', text: '抒情风格' }
                ]
            }
        ];

        // 立即显示所有卡片
        suggestions.forEach((suggestion, index) => {
            console.log(`创建第${index + 1}个建议卡片`);
            const card = this.createSuggestionCard('rewrite', suggestion);
            if (card) {
                suggestionsContent.appendChild(card);
                // 确保卡片可见
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                console.error(`第${index + 1}个建议卡片创建失败`);
            }
        });
        
        console.log('AI重写完成');
    }

    // AI描述功能
    handleAIDescribe(text) {
        console.log('AI描述:', text);
        // TODO: 调用AI描述API
        this.showAIPanel('describe', text);
    }

    // AI扩展功能
    handleAIExpand(text) {
        console.log('AI扩展:', text);
        // TODO: 调用AI扩展API
        this.showAIPanel('expand', text);
    }

    // 快速编辑功能
    handleQuickEdit(text) {
        console.log('快速编辑:', text);
        // TODO: 显示快速编辑面板
        this.showAIPanel('quick-edit', text);
    }

    // 显示AI面板
    showAIPanel(type, text) {
        // 获取右侧建议区域
        const suggestionsContent = document.querySelector('.suggestion-cards');
        if (!suggestionsContent) return;

        // 清空现有建议
        suggestionsContent.innerHTML = '';

        // 模拟AI生成多个建议
        const suggestions = this.generateAISuggestions(type, text);
        
        // 添加建议卡片
        suggestions.forEach(suggestion => {
            const card = this.createSuggestionCard(type, suggestion);
            suggestionsContent.appendChild(card);
        });
    }

    // 生成AI建议（模拟）
    generateAISuggestions(type, text) {
        // 这里应该是调用实际的AI API
        // 现在用模拟数据演示
        const suggestions = [];
        const types = {
            'rewrite': '重写建议',
            'describe': '描述建议',
            'expand': '扩展建议',
            'quick-edit': '快速编辑'
        };

        // 生成3个建议选项
        for (let i = 1; i <= 3; i++) {
            suggestions.push({
                id: `suggestion-${Date.now()}-${i}`,
                type: types[type],
                content: `这是第${i}个${types[type]}的示例内容。这里应该是AI生成的内容，基于用户选中的文本："${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
            });
        }

        return suggestions;
    }

    // 创建建议卡片
    createSuggestionCard(type, suggestion) {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        
        // 分离建议内容的标题和正文，并去除多余空格
        const [title, content] = suggestion.text.split('建议：').map(text => text.trim());
        
        // 检查是否已收藏
        const isFavorited = this.checkIfFavorited(suggestion);
        
        // 确保内容不为空
        if (!content) {
            console.error('建议内容为空:', suggestion);
            return null;
        }

        card.innerHTML = `
            <div class="suggestion-header">
                <div class="suggestion-title">
                    <i class="fas fa-${suggestion.icon}"></i>
                    ${suggestion.title}
                </div>
                <div class="action-buttons">
                    <button class="action-btn favorite-btn ${isFavorited ? 'active' : ''}" title="收藏">
                        <i class="fa${isFavorited ? 's' : 'r'} fa-star"></i>
                    </button>
                    <button class="action-btn" title="更多">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            <div class="suggestion-content">
                <div class="suggestion-desc">${title}</div>
                <div class="suggestion-text">${content}</div>
                <div class="suggestion-actions">
                    <div class="button-group">
                        <button class="insert-btn primary-btn">
                            <i class="fas fa-plus"></i>
                            插入
                        </button>
                        <button class="copy-btn secondary-btn">
                            <i class="far fa-copy"></i>
                            复制
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        this.addCardStyles();

        // 绑定按钮事件
        this.setupCardActions(card, suggestion);
        
        return card;
    }

    // 设置卡片按钮事件
    setupCardActions(card, suggestion) {
        const insertBtn = card.querySelector('.insert-btn');
        const copyBtn = card.querySelector('.copy-btn');
        const favoriteBtn = card.querySelector('.favorite-btn');
        const moreBtn = card.querySelector('.action-btn[title="更多"]');

        if (insertBtn) {
            insertBtn.addEventListener('click', () => {
                this.insertSuggestion(suggestion);
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copySuggestion(suggestion);
            });
        }

        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleFavorite(suggestion, favoriteBtn);
            });
        }

        if (moreBtn) {
            moreBtn.addEventListener('click', (e) => {
                this.showMoreOptions(e, suggestion);
            });
        }
    }

    // 插入建议内容
    insertSuggestion(suggestion) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        
        // 获取建议文本内容
        const [_, content] = suggestion.text.split('建议：');
        
        // 直接插入文本内容
        range.deleteContents();
        range.insertNode(document.createTextNode(content.trim()));

        // 更新统计
        this.updateStats();
    }

    // 复制建议内容
    copySuggestion(suggestion) {
        // 获取建议文本内容
        const [_, content] = suggestion.text.split('建议：');
        const textToCopy = content.trim();

        // 复制到剪贴板
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.showToast('内容已复制到剪贴板');
            console.log('复制成功:', textToCopy);
        }).catch(err => {
            console.error('复制失败:', err);
            this.showToast('复制失败，请重试');
        });
    }

    // 显示更多选项
    showMoreOptions(event, suggestion) {
        // TODO: 实现更多选项菜单
        console.log('显示更多选项:', suggestion);
    }

    // 显示提示消息
    showToast(message) {
        // 移除现有的toast
        const existingToast = document.querySelector('.toast-message');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新的toast
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);

        // 2秒后自动消失
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    // 创建建议卡片的CSS动画
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .suggestion-card {
                opacity: 1;
                transform: none;
            }
            
            .suggestion-card.loading {
                opacity: 1;
                transform: none;
                animation: none;
            }

            .suggestions-list {
                display: block;
                opacity: 1;
                visibility: visible;
                min-height: 200px;
            }
        `;
        document.head.appendChild(style);
    }

    // 显示错误提示
    showError(message) {
        const rightSidebar = document.querySelector('.right-sidebar');
        if (!rightSidebar) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        rightSidebar.appendChild(errorDiv);

        // 3秒后自动消失
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // 应用建议
    applySuggestion(suggestion, option) {
        console.log('应用建议:', suggestion, '选项:', option);
        // TODO: 实现应用建议的逻辑
    }

    // 处理收藏
    handleFavorite(suggestion, button) {
        if (!button) return;
        
        const isFavorited = button.classList.contains('active');
        console.log('处理收藏:', suggestion, '当前状态:', isFavorited);
        
        if (isFavorited) {
            // 取消收藏
            if (this.removeFromFavorites(suggestion)) {
                button.classList.remove('active');
                button.querySelector('i').className = 'far fa-star';
                this.showToast('已取消收藏');
                console.log('取消收藏成功');
            } else {
                console.error('取消收藏失败');
            }
        } else {
            // 添加收藏
            if (this.addToFavorites(suggestion)) {
                button.classList.add('active');
                button.querySelector('i').className = 'fas fa-star';
                this.showToast('已添加到收藏');
                console.log('添加收藏成功');
            } else {
                console.error('添加收藏失败');
            }
        }
    }

    // 添加到收藏
    addToFavorites(suggestion) {
        try {
            const favorites = this.getFavorites();
            // 检查是否已经收藏
            if (!favorites.some(fav => fav.text === suggestion.text)) {
                favorites.push({
                    ...suggestion,
                    timestamp: Date.now()
                });
                localStorage.setItem('favorites', JSON.stringify(favorites));
                console.log('收藏数据已保存:', favorites);
                return true;
            }
            return false;
        } catch (error) {
            console.error('添加收藏失败:', error);
            return false;
        }
    }

    // 从收藏中移除
    removeFromFavorites(suggestion) {
        try {
            const favorites = this.getFavorites();
            const newFavorites = favorites.filter(fav => fav.text !== suggestion.text);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            console.log('更新后的收藏列表:', newFavorites);
            return true;
        } catch (error) {
            console.error('移除收藏失败:', error);
            return false;
        }
    }

    // 检查建议是否已收藏
    checkIfFavorited(suggestion) {
        try {
            const favorites = this.getFavorites();
            const isFavorited = favorites.some(fav => fav.text === suggestion.text);
            console.log('检查收藏状态:', suggestion.title, isFavorited);
            return isFavorited;
        } catch (error) {
            console.error('检查收藏状态失败:', error);
            return false;
        }
    }

    // 获取收藏列表
    getFavorites() {
        try {
            const favorites = localStorage.getItem('favorites');
            const parsedFavorites = favorites ? JSON.parse(favorites) : [];
            console.log('获取收藏列表:', parsedFavorites);
            return parsedFavorites;
        } catch (error) {
            console.error('获取收藏列表失败:', error);
            return [];
        }
    }

    // 添加卡片样式
    addCardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .suggestions-list {
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                background: #f8fafc;
                min-height: 200px;
                overflow-y: auto;
            }

            .suggestion-card {
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                overflow: hidden;
            }

            .suggestion-header {
                padding: 8px 12px;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .suggestion-title {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                font-weight: 500;
                color: #1f2937;
            }

            .action-buttons {
                display: flex;
                gap: 4px;
            }

            .action-btn {
                padding: 4px;
                background: none;
                border: none;
                color: #6b7280;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            .action-btn:hover {
                color: #2563eb;
                background: #f3f4f6;
            }

            .suggestion-content {
                padding: 8px 12px;
            }

            .suggestion-desc {
                font-size: 12px;
                color: #6b7280;
                line-height: 1.4;
                margin-bottom: 8px;
                white-space: pre-wrap;
                word-break: break-word;
            }

            .suggestion-text {
                font-size: 14px;
                line-height: 1.6;
                color: #374151;
                margin-bottom: 12px;
                white-space: pre-wrap;
                word-break: break-word;
                max-height: 300px;
                overflow-y: auto;
                padding: 0;
            }

            .suggestion-actions {
                display: flex;
                justify-content: flex-end;
                padding-top: 8px;
                border-top: 1px solid #f0f0f0;
            }

            .button-group {
                display: flex;
                gap: 8px;
            }

            .primary-btn,
            .secondary-btn {
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                transition: all 0.2s ease;
            }

            .primary-btn {
                background: #2563eb;
                color: #ffffff;
                border: none;
            }

            .primary-btn:hover {
                background: #1d4ed8;
            }

            .secondary-btn {
                background: #ffffff;
                color: #374151;
                border: 1px solid #e5e7eb;
            }

            .secondary-btn:hover {
                border-color: #2563eb;
                color: #2563eb;
            }

            /* 滚动条样式 */
            .suggestion-text::-webkit-scrollbar {
                width: 4px;
            }

            .suggestion-text::-webkit-scrollbar-track {
                background: transparent;
            }

            .suggestion-text::-webkit-scrollbar-thumb {
                background: #e5e7eb;
                border-radius: 2px;
            }

            .suggestion-text::-webkit-scrollbar-thumb:hover {
                background: #d1d5db;
            }
        `;
        
        // 检查是否已经添加过样式
        const existingStyle = document.querySelector('style[data-style="suggestion-card"]');
        if (!existingStyle) {
            style.setAttribute('data-style', 'suggestion-card');
            document.head.appendChild(style);
        }
    }

    // 添加初始化方法
    initializeFolderStates() {
        try {
            // 设置所有文件夹内容的初始高度
            const folderContents = document.querySelectorAll('.folder-content');
            if (folderContents.length > 0) {
                folderContents.forEach(content => {
                    const header = content.previousElementSibling;
                    if (header && header.classList.contains('folder-header')) {
                        if (header.classList.contains('collapsed')) {
                            content.style.maxHeight = '0px';
                            content.style.opacity = '0';
                        } else {
                            content.style.maxHeight = content.scrollHeight + 'px';
                            content.style.opacity = '1';
                        }
                    }
                });
            }
        } catch (error) {
            console.error('初始化文件夹状态时出错:', error);
        }
    }
}

// 等待DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('初始化应用...');
    window.app = new WritingApp();
});

// 移除重复的DOMContentLoaded监听器
const existingInitFunction = window.initFloatingToolbar;
if (existingInitFunction) {
    document.removeEventListener('DOMContentLoaded', existingInitFunction);
}