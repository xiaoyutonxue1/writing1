document.addEventListener('DOMContentLoaded', function() {
    // 筛选标签切换
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 在同一组内切换active状态
            const group = this.closest('.filter-group');
            group.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // TODO: 根据筛选条件过滤范文列表
            filterEssays();
        });
    });

    // 收藏按钮切换
    const collectBtns = document.querySelectorAll('.collect-btn');
    collectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            
            // TODO: 保存收藏状态
            saveCollectionStatus();
        });
    });

    // 打开范文详情
    const readBtns = document.querySelectorAll('.read-btn');
    const modal = document.querySelector('.essay-modal');
    readBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.essay-card');
            openEssayDetail(card);
        });
    });

    // 关闭范文详情
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // 保存笔记
    const saveNoteBtn = document.querySelector('.save-note-btn');
    saveNoteBtn.addEventListener('click', function() {
        const textarea = document.querySelector('.note-section textarea');
        const note = textarea.value.trim();
        if (note) {
            // TODO: 保存笔记到后端
            saveNote(note);
            // 显示保存成功提示
            showToast('笔记保存成功！');
            // 清空输入框
            textarea.value = '';
        }
    });

    // 搜索功能
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');

    function performSearch() {
        const keyword = searchInput.value.trim();
        if (keyword) {
            // TODO: 执行搜索
            searchEssays(keyword);
        }
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});

// 打开范文详情
function openEssayDetail(card) {
    const modal = document.querySelector('.essay-modal');
    const title = card.querySelector('.essay-title').textContent;
    const type = card.querySelector('.essay-type').textContent;
    const score = card.querySelector('.essay-score').textContent;
    
    // 更新模态框内容
    modal.querySelector('.modal-title h2').textContent = title;
    modal.querySelector('.modal-meta .type').textContent = type;
    modal.querySelector('.modal-meta .score').textContent = score;
    
    // TODO: 加载完整的文章内容和分析
    loadEssayContent(title);
    
    // 显示模态框
    modal.classList.add('show');
}

// 加载文章内容
function loadEssayContent(title) {
    // TODO: 从后端加载文章内容和批注
    // 这里使用模拟数据
    const content = {
        text: `
            <p>
                那是一堂特别的语文课，老师没有照本宣科，而是带着我们走出教室，来到校园的小花园里。
                <span class="highlight scene-desc" data-note-id="note-1">春日的阳光温暖而不刺眼，微风轻拂，花香四溢...</span>
            </p>
            <p>
                老师指着一朵含苞待放的花骨朵说：
                <span class="highlight metaphor" data-note-id="note-2">"同学们，你们看，这朵花像不像一个害羞的小姑娘？"</span>
                这一个简单的比喻，瞬间让我们眼前一亮。
                <span class="highlight psychology" data-note-id="note-3">是啊，那微微低垂的花苞，确实像个羞涩的少女，让人忍不住想一探究竟...</span>
            </p>
            <p>
                <span class="highlight transition" data-note-id="note-4">就这样，在老师的引导下，我们开始用心观察周围的一草一木。</span>
                <span class="highlight enlightenment" data-note-id="note-5">不知不觉中，我发现原来写作的素材就在身边，关键是要用心去发现，用心去感受...</span>
            </p>
        `,
        notes: [
            {
                id: 'note-1',
                type: '开头点评',
                content: '开头新颖,直接带入情境,吸引读者注意力。通过"特别"一词,引发读者好奇心。'
            },
            {
                id: 'note-2',
                type: '比喻运用',
                content: '将含苞待放的花比作害羞的小姑娘,形象生动,贴切自然,增强了文章的趣味性。'
            },
            {
                id: 'note-3',
                type: '心理描写',
                content: '细腻地描写了学生的内心感受,让读者感同身受,增强了文章的感染力。'
            },
            {
                id: 'note-4',
                type: '过渡技巧',
                content: '过渡自然流畅,承上启下,使文章结构更加紧凑。'
            },
            {
                id: 'note-5',
                type: '主题升华',
                content: '点明写作启示,升华主题,体现了作者的思考和感悟。'
            }
        ]
    };
    
    // 更新文章内容
    const contentContainer = document.querySelector('.essay-content .essay-text');
    contentContainer.innerHTML = content.text;

    // 更新批注列表
    const noteList = document.querySelector('.note-list');
    noteList.innerHTML = content.notes.map(note => `
        <div class="note-item" id="${note.id}">
            <div class="note-type">${note.type}</div>
            <div class="note-content">${note.content}</div>
        </div>
    `).join('');

    // 添加高亮文本交互
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        // 鼠标悬停时高亮对应的批注
        highlight.addEventListener('mouseenter', () => {
            const noteId = highlight.getAttribute('data-note-id');
            const noteItem = document.getElementById(noteId);
            
            // 移除所有高亮
            document.querySelectorAll('.highlight').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.note-item').forEach(n => n.classList.remove('active'));
            
            // 添加高亮
            highlight.classList.add('active');
            noteItem.classList.add('active');
            
            // 滚动到对应的批注
            noteItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });

    // 添加批注项交互
    const noteItems = document.querySelectorAll('.note-item');
    noteItems.forEach(noteItem => {
        // 鼠标悬停时高亮对应的文本
        noteItem.addEventListener('mouseenter', () => {
            const noteId = noteItem.id;
            const highlight = document.querySelector(`[data-note-id="${noteId}"]`);
            
            // 移除所有高亮
            document.querySelectorAll('.highlight').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.note-item').forEach(n => n.classList.remove('active'));
            
            // 添加高亮
            highlight.classList.add('active');
            noteItem.classList.add('active');
            
            // 滚动到对应的文本
            highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    // 初始化拖拽功能
    initDraggableNotes();
}

// 保存笔记
function saveNote(note) {
    // TODO: 将笔记保存到后端
    console.log('保存笔记:', note);
}

// 保存收藏状态
function saveCollectionStatus() {
    // TODO: 将收藏状态保存到后端
    console.log('更新收藏状态');
}

// 根据筛选条件过滤范文
function filterEssays() {
    // TODO: 根据选中的筛选标签过滤范文列表
    console.log('筛选范文');
}

// 搜索范文
function searchEssays(keyword) {
    // TODO: 根据关键词搜索范文
    console.log('搜索范文:', keyword);
}

// 显示提示信息
function showToast(message) {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 添加显示类名
    setTimeout(() => toast.classList.add('show'), 10);
    
    // 3秒后移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 初始化拖拽功能
function initDraggableNotes() {
    const notesPanel = document.querySelector('.teacher-notes');
    const dragHandle = notesPanel.querySelector('.note-header');
    const minimizeBtn = document.createElement('button');
    minimizeBtn.className = 'minimize-btn';
    minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
    dragHandle.appendChild(minimizeBtn);

    let isMinimized = false;
    let isDragging = false;
    let startX, startY, initialX, initialY;

    // 从localStorage获取位置和状态
    const savedState = localStorage.getItem('teacherNotesState');
    if (savedState) {
        const state = JSON.parse(savedState);
        notesPanel.style.left = state.left;
        notesPanel.style.top = state.top;
        if (state.isMinimized) {
            toggleMinimize();
        }
    }

    // 最小化/展开面板
    minimizeBtn.addEventListener('click', toggleMinimize);

    function toggleMinimize() {
        isMinimized = !isMinimized;
        notesPanel.classList.toggle('minimized');
        minimizeBtn.innerHTML = isMinimized ? 
            '<i class="fas fa-expand"></i>' : 
            '<i class="fas fa-minus"></i>';
        saveState();
    }

    // 开始拖动
    dragHandle.addEventListener('mousedown', startDragging);
    dragHandle.addEventListener('touchstart', startDragging);

    function startDragging(e) {
        isDragging = true;
        notesPanel.classList.add('dragging');
        
        if (e.type === 'mousedown') {
            startX = e.clientX;
            startY = e.clientY;
        } else {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
        
        initialX = notesPanel.offsetLeft;
        initialY = notesPanel.offsetTop;

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);
    }

    // 拖动中
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        let currentX, currentY;
        if (e.type === 'mousemove') {
            currentX = e.clientX;
            currentY = e.clientY;
        } else {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        }

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        const newLeft = initialX + deltaX;
        const newTop = initialY + deltaY;

        // 确保面板不会被拖出视口
        const rect = notesPanel.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (newLeft >= 0 && newLeft + rect.width <= viewportWidth) {
            notesPanel.style.left = newLeft + 'px';
        }
        if (newTop >= 0 && newTop + rect.height <= viewportHeight) {
            notesPanel.style.top = newTop + 'px';
        }
    }

    // 停止拖动
    function stopDragging() {
        isDragging = false;
        notesPanel.classList.remove('dragging');
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDragging);
        document.removeEventListener('touchend', stopDragging);

        saveState();
    }

    // 保存状态
    function saveState() {
        const state = {
            left: notesPanel.style.left,
            top: notesPanel.style.top,
            isMinimized: isMinimized
        };
        localStorage.setItem('teacherNotesState', JSON.stringify(state));
    }

    // 防止文本选择
    dragHandle.addEventListener('selectstart', e => e.preventDefault());
} 