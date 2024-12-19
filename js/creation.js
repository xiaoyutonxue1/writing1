// 核心应用类
class WritingApp {
    constructor() {
        this.version = 'v2.1.0';  // 更新版本号
        console.log('WritingApp 构造函数被调用');
        this.editor = document.getElementById('editor');
        this.wordCountElement = document.getElementById('wordCount');
        this.paragraphCountElement = document.getElementById('paragraphCount');
        this.timeSpentElement = document.getElementById('timeSpent');
        this.floatingToolbar = document.getElementById('floatingToolbar');
        this.startTime = new Date();
        
        // 确保在构造函数中获取左侧栏元素
        this.leftSidebar = document.querySelector('.left-sidebar');
        if (!this.leftSidebar) {
            console.error('左侧栏元素未找到');
            return;
        }
        
        this.initializeUI();
        this.bindEvents();
        this.updateStats();
        this.addAnimationStyles();
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

    // 绑定侧边栏事件 - 使用事件委托
    bindSidebarEvents() {
        console.log('开始绑定侧边栏事件...');
        
        if (!this.leftSidebar) {
            console.error('左侧栏元素不存在,无法绑定事件');
            return;
        }

        // 使用事件委托,将点击事件绑定到左侧栏容器
        this.leftSidebar.addEventListener('click', (e) => {
            console.log('左侧栏被点击:', e.target);
            
            // 处理文件项点击
            if (e.target.closest('.tree-item')) {
                const item = e.target.closest('.tree-item');
                console.log('文件项被点击:', item);
                e.preventDefault();
                e.stopPropagation();
                this.handleTreeItemClick(item);
            }
            
            // 处理文件夹点击
            else if (e.target.closest('.folder-header')) {
                const header = e.target.closest('.folder-header');
                console.log('文件夹被点击:', header);
                e.preventDefault();
                e.stopPropagation();
                this.handleFolderClick(header);
            }
            
            // 处理折叠按钮点击
            else if (e.target.closest('.collapse-btn')) {
                const btn = e.target.closest('.collapse-btn');
                console.log('折叠按钮被点击:', btn);
                e.preventDefault();
                e.stopPropagation();
                this.handleCollapseClick(btn);
            }
        });

        console.log('侧边栏事件绑定完成');
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
        console.log('处理文件项点击:', item);
        
        // 移除其他项目的active类
        document.querySelectorAll('.tree-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // 添加当前项目的active类
        item.classList.add('active');
        
        // 加载文件内容
        const fileName = item.querySelector('span')?.textContent;
        if (fileName) {
            console.log('加载文件:', fileName);
            this.loadFileContent(fileName);
        }
    }

    // 处理文件夹点击
    handleFolderClick(header) {
        console.log('处理文件夹点击:', header);
        
        const folder = header.closest('.tree-folder');
        const content = folder?.querySelector('.folder-content');
        const icon = header.querySelector('i.fa-chevron-down');
        
        if (!folder || !content || !icon) {
            console.error('找不到必要的DOM元素');
            return;
        }

        // 切换折叠状态
        const isCollapsed = header.classList.contains('collapsed');
        console.log('当前折叠状态:', isCollapsed);

        if (!isCollapsed) {
            // 折叠
            header.classList.add('collapsed');
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            icon.style.transform = 'rotate(-90deg)';
        } else {
            // 展开
            header.classList.remove('collapsed');
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            icon.style.transform = 'rotate(0)';
        }
    }

    // 处理折叠按钮点击
    handleCollapseClick(btn) {
        console.log('处理折叠按钮点击:', btn);
        
        const section = btn.closest('.list-section');
        const content = section?.querySelector('.section-content');
        const icon = btn.querySelector('i');
        
        if (!section || !content || !icon) {
            console.error('找不到必要的DOM元素');
            return;
        }

        // 切换折叠状态
        const isCollapsed = btn.classList.contains('collapsed');
        console.log('当前折叠状态:', isCollapsed);

        if (!isCollapsed) {
            // 折叠
            btn.classList.add('collapsed');
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            icon.style.transform = 'rotate(-90deg)';
        } else {
            // 展开
            btn.classList.remove('collapsed');
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            icon.style.transform = 'rotate(0)';
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
                content: `盼望着，盼望着，东风来了，春天的���步近了。

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
                text: '建议通过更丰富的意象和更细腻的描写来增强画面感。建议：\n"春日里，嫩芽偷偷探出头来，像一个个顽皮的精灵，将大地点缀得生机盎然。放眼望去，园林与田野间尽是一片片青翠欲滴的新绿。\n\n果树们仿在举办盛大的春日庆典，桃花红得似火般热烈，杏花粉得像霞般温柔，梨花白得如雪般纯洁。阵阵花香在微风中流转，闭上眼，仿佛已能看到满树硕果实在枝头轻轻摇曳。\n\n春风裹挟着燕子的欢唱，牵引着风筝的舞姿，还有孩童们的笑声在草地上、池水旁回荡，构成了一幅动感十足的春日画卷。"',
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
                    { value: 'descriptive', text: '描写��格' },
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
}

// AI聊天助手类
class AIChat {
    constructor() {
        this.chat = document.getElementById('aiChat');
        this.toggle = document.getElementById('aiToggle');
        this.messages = document.getElementById('aiMessages');
        this.closeBtn = this.chat.querySelector('.ai-chat-close');
        this.input = this.chat.querySelector('textarea');
        this.sendBtn = this.chat.querySelector('.send-btn');
        this.quickBtns = this.chat.querySelectorAll('.quick-btn');
        
        this.isOpen = false;
        this.isProcessing = false;
        this.messageQueue = [];
        
        this.mockResponses = {
            '写作技巧': [
                '描写春天时，可以从以下几个方面入手：\n1. 视觉：新绿、花朵、春雨\n2. 听觉：鸟鸣、风声、雨声\n3. 嗅觉：花香、泥土气息\n4. 触觉：春风、温暖阳光',
                '写作要注意细节描写，可以用比喻、拟人等修辞手法让文章更生动。比如：\n- 比喻：春风像温柔的手\n- 拟人：小草探出好奇的脑袋\n- 夸张：百花齐放，春意盎然',
                '建议按时间顺序或空间顺序来组织文章结构，让描写更有条理：\n1. 时间顺序：清晨→中午→傍晚\n2. 空间顺序：远处→近处，或上→下'
            ],
            '景色描写': [
                '春天的景色可以这样描写：\n1. 天空：碧空如洗，白云悠悠\n2. 植物：\n - 树木：嫩芽初绽，新叶吐绿\n - 花朵：桃红柳绿，百花争艳\n3. 小动物：蝴蝶翩翩，小鸟欢唱',
                '可以重点描写春天特有的景象：\n1. 春雨：细雨如丝，滋润万物\n2. 春风：和煦温柔，拂面生香\n3. 春水：冰雪消融，小溪潺潺\n4. 春芽：嫩绿新芽，破土而出',
                '注意捕捉春天的色彩变化：\n- 绿色：新叶嫩芽，青草如茵\n- 粉色：桃花灼灼，杏花烂漫\n- 黄色：迎春花开，油菜花田\n- 白色：梨花如雪，白云悠悠'
            ],
            '感官描写': [
                '春天的感官描写素材\n【视觉】\n- 嫩绿的新芽\n- 绚丽的花朵\n- 飘洒的春雨\n【听觉】\n- 鸟儿的啁啾\n- 春雨的滴答\n- 溪水的潺潺\n【嗅觉】\n- 泥土的芬芳\n- 花草的清香\n【触觉】\n- 温暖的阳光\n- 柔和的春风',
                '可以多角度描写春雨：\n1. 视觉：雨丝如烟，朦胧轻盈\n2. 听觉：滴滴答答，奏响春之歌\n3. 触觉：润物无声，细腻温柔\n4. 嗅觉：泥土芬芳，清新怡人',
                '描写春风的感受：\n1. 温度：温暖如母亲的手\n2. 触感：轻柔似丝绸抚摸\n3. 气：带来花草的芬芳\n4. 视觉：摇��的花枝，飘舞的柳絮'
            ],
            '情感表达': [
                '春天象征着希望和新生，可以表达：\n1. 对生命的热爱\n2. 对未来的期待\n3. 对美好的向往\n4. 对自然的赞美',
                '可以从这些角度抒发感情：\n1. 生机勃勃带来的喜悦\n2. 万物复苏激发的希望\n3. 美好春光引发的感动\n4. 春暖花开带来的温馨',
                '把自然景物和心情结合：\n- 春芽破土：充满生机与希望\n- 春雨润物：滋养心灵的温柔\n- 百花绽放：绚烂多彩的梦想\n- 春风拂面：温暖治愈的感动'
            ],
            '好词好句': [
                '描写春天的好词：\n【颜色词】\n- 嫩绿、青翠、粉嫩、灼灼\n【声音词】\n- 潺潺、淙淙、啁啾、沙沙\n【动作词】\n- 萌发、绽放、飘洒、吐绿\n【形词】\n- 温润、和煦、清新、盎然',
                '优美句子参考：\n1. "春雨如丝，润物无声，让大地披上了一层薄薄的轻纱。"\n2. "春风和煦，像母亲的手轻轻抚过大地，唤醒了沉睡的万物。"\n3. "嫩绿的小草刚刚探出头，像是大地绣出的一幅翠绿的地毯。"',
                '可以用这些词语：\n【春天景色】\n- 春意盎然、春光明媚、春色满园\n【���天气息】\n- 春暖花开、春意融融、春风和煦\n【春天生机】\n- 欣欣向荣、蓬勃生机、万象更新'
            ],
            '开头技巧': [
                '春天文章的开头可以这样写：\n1. 拟人开头：\n"春姑娘悄悄地来了，她轻轻地敲响了大地的门。"\n\n2. 比喻开头：\n"春天像一位画家，用她的画笔为大地增添色彩。"\n\n3. 感官开头：\n"一阵温暖的春风拂面而来，带来了泥土和花香的气息。"',
                '好的开头方式：\n1. 环境描写：从天气、景色入手\n2. 人物活动：描写人们的春日活动\n3. 感受抒发：表达对春天的期待\n4. 场景对比：冬去春来的变化',
                '开头注意事项：\n1. 要简洁生动\n2. 紧扣春天特点\n3. 引起读者兴趣\n4. 为全文定下基调\n\n可以从这些方面入手：\n- 春风、春雨、春芽\n- 气温变化、日照变化\n- 人们的春日活动'
            ]
        };

        this.initEventListeners();
    }

    initEventListeners() {
        // 打开/关闭聊天窗口
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());

        // 发送消息
        this.sendBtn.addEventListener('click', () => this.handleSend());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // 自动调整输入框高度
        this.input.addEventListener('input', () => {
            this.input.style.height = 'auto';
            this.input.style.height = Math.min(this.input.scrollHeight, 120) + 'px';
        });

        // 快捷问题点击
        this.quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isProcessing) return;
                const question = btn.dataset.question;
                this.handleQuickQuestion(question);
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chat.classList.toggle('show');
        this.toggle.classList.toggle('active');

        if (this.isOpen && this.messages.children.length === 0) {
            this.showWelcomeMessage();
        }
    }

    showWelcomeMessage() {
        const welcomeMessages = [
            '你好！我是你的AI写作助手。我可以帮你：',
            '1. 提供写作建议和技巧',
            '2. 帮助你构思和完善文章',
            '3. 解答你的写作疑问',
            '有什么我���以帮你的吗？'
        ];
        
        this.addMessage(welcomeMessages.join('\n'), 'ai');
    }

    addMessage(content, type) {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        message.appendChild(avatar);
        message.appendChild(messageContent);
        
        this.messages.appendChild(message);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    handleSend() {
        if (this.isProcessing) return;
        
        const content = this.input.value.trim();
        if (!content) return;
        
        // 添加用户消息
        this.addMessage(content, 'user');
        
        // 清空输入框
        this.input.value = '';
        this.input.style.height = '44px';
        
        // 处理响应
        this.processResponse(content);
    }

    handleQuickQuestion(question) {
        if (this.isProcessing) return;
        
        // 添加用户消息
        this.addMessage(question, 'user');
        
        // 处理响应
        this.processQuickResponse(question);
    }

    processResponse(userInput) {
        this.isProcessing = true;
        
        try {
            let response;
            if (userInput.includes('景色') || userInput.includes('描写')) {
                response = this.getRandomResponse('景色描写');
            } else if (userInput.includes('感官') || userInput.includes('感受')) {
                response = this.getRandomResponse('感官描写');
            } else if (userInput.includes('心情') || userInput.includes('情感')) {
                response = this.getRandomResponse('情感表达');
            } else if (userInput.includes('词') || userInput.includes('句')) {
                response = this.getRandomResponse('好词好句');
            } else if (userInput.includes('开头') || userInput.includes('开始')) {
                response = this.getRandomResponse('开头技巧');
            } else {
                response = this.getRandomResponse('写作技巧');
            }
            
            // 使用setTimeout模拟延迟,但不使用Promise
            setTimeout(() => {
                if (this.isOpen) {
                    this.addMessage(response, 'ai');
                }
                this.isProcessing = false;
            }, 800);
            
        } catch (error) {
            console.error('处理响应出错:', error);
            if (this.isOpen) {
                this.addMessage('抱歉,我现在无法回应。请稍后再试。', 'ai');
            }
            this.isProcessing = false;
        }
    }

    processQuickResponse(question) {
        this.isProcessing = true;
        
        try {
            let response;
            if (question.includes('景色')) {
                response = this.getRandomResponse('景色描写');
            } else if (question.includes('感官')) {
                response = this.getRandomResponse('感官描写');
            } else if (question.includes('心情') || question.includes('情感')) {
                response = this.getRandomResponse('情感表达');
            } else if (question.includes('好词好句')) {
                response = this.getRandomResponse('好词好句');
            } else if (question.includes('开头')) {
                response = this.getRandomResponse('开头技巧');
            } else {
                response = this.getRandomResponse('写作技巧');
            }
            
            // 使用setTimeout模拟延迟,但不使用Promise
            setTimeout(() => {
                if (this.isOpen) {
                    this.addMessage(response, 'ai');
                }
                this.isProcessing = false;
            }, 800);
            
        } catch (error) {
            console.error('处理快速响应出错:', error);
            if (this.isOpen) {
                this.addMessage('抱歉,我现在无法回应。请稍后再试。', 'ai');
            }
            this.isProcessing = false;
        }
    }

    getRandomResponse(category) {
        const responses = this.mockResponses[category];
        if (!responses || responses.length === 0) {
            return '抱歉,我现在无法提供合适的回应。';
        }
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// ���待DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成,开始初始化应用...');
    window.writingApp = new WritingApp();
    window.aiChat = new AIChat();
    console.log('应用初始化完成');
});