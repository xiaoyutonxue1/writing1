// 批改页面类
class CorrectionPage {
    constructor() {
        // 初始化数据管理器
        this.dataManager = new TeacherDataManager();
        
        // 获取URL参数中的作业ID
        const urlParams = new URLSearchParams(window.location.search);
        this.assignmentId = parseInt(urlParams.get('id')) || 1; // 如果没有ID参数，默认使用1
        
        // 初始化页面元素
        this.initializeElements();
        
        // 初始化事件监听
        this.initializeEventListeners();
        
        // 加载作业数据
        this.loadAssignment();
        
        // 初始化导航栏
        this.initializeNavigation();
    }

    // 初始化页面元素
    initializeElements() {
        // 作文内容相关元素
        this.essayText = document.querySelector('.essay-text');
        this.studentName = document.querySelector('.student-name');
        this.classInfo = document.querySelector('.class-info');
        this.essayTitle = document.querySelector('.essay-title');
        this.essayMeta = document.querySelector('.essay-meta');

        // 工具相关元素
        this.toolButtons = document.querySelectorAll('.tool-btn');
        this.colorDots = document.querySelectorAll('.color-dot');
        this.currentTool = null;
        this.currentColor = '#ffd400';

        // AI批改相关元素
        this.aiCorrectionBtn = document.querySelector('.ai-correction-btn');
        this.aiResultsPanel = document.querySelector('.ai-results-panel');
        this.closeAiPanelBtn = document.querySelector('.close-panel');
        this.acceptAllBtn = document.querySelector('.accept-all-btn');

        // 评分相关元素
        this.scoreInputs = document.querySelectorAll('.score-item input');
        this.totalScoreSpan = document.querySelector('.total-score span');

        // 评语相关元素
        this.quickComments = document.querySelectorAll('.quick-comment-tag');
        this.commentTextarea = document.querySelector('.comment-section textarea');

        // 操作按钮
        this.saveDraftBtn = document.querySelector('.save-draft');
        this.submitCorrectionBtn = document.querySelector('.submit-correction');

        // 初始化颜色选择器
        this.colorDots[0].classList.add('active');
    }

    // 初始化事件监听
    initializeEventListeners() {
        if (!this.toolButtons || !this.colorDots || !this.essayText) {
            console.error('Required elements not found');
            return;
        }

        // 工具按钮点击事件
        this.toolButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleToolClick(btn));
        });

        // 颜色选择事件
        this.colorDots.forEach(dot => {
            dot.addEventListener('click', () => this.handleColorSelect(dot));
        });

        // 文本选择事件
        this.essayText.addEventListener('mouseup', () => this.handleTextSelection());

        // AI批改相关事件
        if (this.aiCorrectionBtn) {
            this.aiCorrectionBtn.addEventListener('click', () => this.startAICorrection());
        }
        if (this.closeAiPanelBtn) {
            this.closeAiPanelBtn.addEventListener('click', () => this.closeAIResults());
        }
        if (this.acceptAllBtn) {
            this.acceptAllBtn.addEventListener('click', () => this.acceptAllAISuggestions());
        }

        // 评分输入事件
        if (this.scoreInputs) {
            this.scoreInputs.forEach(input => {
                input.addEventListener('input', () => this.calculateTotalScore());
            });
        }

        // 快速评语点击事件
        if (this.quickComments) {
            this.quickComments.forEach(tag => {
                tag.addEventListener('click', () => this.handleQuickComment(tag));
            });
        }

        // 保存和提交事件
        if (this.saveDraftBtn) {
            this.saveDraftBtn.addEventListener('click', () => this.saveDraft());
        }
        if (this.submitCorrectionBtn) {
            this.submitCorrectionBtn.addEventListener('click', () => this.submitCorrection());
        }

        // 自动保存
        setInterval(() => this.saveDraft(), 60000); // 每分钟自动保存
    }

    // 加载作业数据
    loadAssignment() {
        // 使用模拟数据
        const assignment = {
            id: this.assignmentId,
            studentName: '李明',
            className: '三年级一班',
            title: '春天的早晨',
            content: this.essayText.innerHTML,
            submitTime: '2024-01-15 09:30',
            wordCount: 800,
            draft: 2
        };

        // 更新页面信息
        if (this.studentName) this.studentName.textContent = assignment.studentName;
        if (this.classInfo) this.classInfo.textContent = assignment.className;
        if (this.essayTitle) this.essayTitle.textContent = assignment.title;
        if (this.essayText) this.essayText.innerHTML = assignment.content;

        // 更新元数据
        if (this.essayMeta) {
            const metaSpans = this.essayMeta.querySelectorAll('span');
            if (metaSpans[0]) metaSpans[0].innerHTML = `<i class="fas fa-clock"></i>提交时间：${assignment.submitTime}`;
            if (metaSpans[1]) metaSpans[1].innerHTML = `<i class="fas fa-file-alt"></i>字数：${assignment.wordCount}`;
            if (metaSpans[2]) metaSpans[2].innerHTML = `<i class="fas fa-redo"></i>第${assignment.draft}稿`;
        }

        // 加载草稿数据
        const draft = localStorage.getItem(`draft_${this.assignmentId}`);
        if (draft) {
            this.loadDraft(JSON.parse(draft));
        }
    }

    // 处理工具点击
    handleToolClick(btn) {
        const toolType = btn.dataset.tool;
        
        // 切换工具状态
        if (this.currentTool === toolType) {
            this.currentTool = null;
            btn.classList.remove('active');
        } else {
            this.toolButtons.forEach(b => b.classList.remove('active'));
            this.currentTool = toolType;
            btn.classList.add('active');
        }
    }

    // 处理颜色选择
    handleColorSelect(dot) {
        this.currentColor = dot.dataset.color;
        this.colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
    }

    // 处理文本选择
    handleTextSelection() {
        if (!this.currentTool) return;

        const selection = window.getSelection();
        if (!selection.toString().trim()) return;

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        
        // 创建批注
        this.createAnnotation(range, selectedText);
        
        // 清除选择
        selection.removeAllRanges();
    }

    // 创建批注
    createAnnotation(range, text) {
        try {
            // 创建批注元素
            const annotation = document.createElement('span');
            annotation.className = `annotation-${this.currentTool}`;
            
            if (this.currentTool === 'highlight') {
                annotation.style.backgroundColor = `${this.currentColor}4D`;
                annotation.style.borderBottom = 'none';
            } else if (this.currentTool === 'underline') {
                annotation.style.backgroundColor = 'transparent';
                annotation.style.borderBottom = `2px solid ${this.currentColor}`;
            } else if (this.currentTool === 'comment') {
                annotation.style.backgroundColor = 'transparent';
                annotation.style.borderBottom = `2px dotted ${this.currentColor}`;
            }
            
            // 将选中文本包装在批注元素中
            range.surroundContents(annotation);
            
            // 创建批注数据
            const annotationData = {
                id: Date.now(),
                type: this.currentTool,
                color: this.currentColor,
                text: text,
                comment: ''
            };
            
            // 添加点击事件以显示评论框
            annotation.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showCommentBox(annotation, annotationData);
            });
        } catch (error) {
            console.error('创建批注失败:', error);
        }
    }

    // 显示评论框
    showCommentBox(annotationElement, annotationData) {
        // 移除现有的评论框
        document.querySelectorAll('.annotation-comment-box').forEach(box => box.remove());
        
        // 创建新的评论框
        const commentBox = document.createElement('div');
        commentBox.className = 'annotation-comment-box';
        
        // 评论框内容
        commentBox.innerHTML = `
            <textarea placeholder="添加评语...">${annotationData.comment}</textarea>
            <div class="comment-actions">
                <button class="save-comment">保存</button>
                <button class="delete-annotation">删除</button>
            </div>
        `;
        
        // 定位评论框
        const rect = annotationElement.getBoundingClientRect();
        const container = this.essayText.getBoundingClientRect();
        
        commentBox.style.position = 'absolute';
        commentBox.style.left = `${rect.left - container.left}px`;
        commentBox.style.top = `${rect.bottom - container.top + 8}px`;
        commentBox.style.zIndex = '1000';
        
        // 添加评论框到文档
        this.essayText.appendChild(commentBox);
        
        // 绑定评论框事件
        const textarea = commentBox.querySelector('textarea');
        textarea.focus();
        
        commentBox.querySelector('.save-comment').addEventListener('click', () => {
            annotationData.comment = textarea.value;
            commentBox.remove();
        });
        
        commentBox.querySelector('.delete-annotation').addEventListener('click', () => {
            this.deleteAnnotation(annotationElement, annotationData);
            commentBox.remove();
        });
        
        // 点击其他地方关闭评论框
        document.addEventListener('click', (e) => {
            if (!commentBox.contains(e.target) && !annotationElement.contains(e.target)) {
                commentBox.remove();
            }
        });
    }

    // 删除批注
    deleteAnnotation(annotationElement, annotationData) {
        try {
            // 从DOM中移除批注元素
            const parent = annotationElement.parentNode;
            while (annotationElement.firstChild) {
                parent.insertBefore(annotationElement.firstChild, annotationElement);
            }
            parent.removeChild(annotationElement);
        } catch (error) {
            console.error('删除批注失败:', error);
        }
    }

    // 开始AI批改
    async startAICorrection() {
        try {
            if (!this.aiCorrectionBtn || !this.aiResultsPanel) return;

            this.aiCorrectionBtn.disabled = true;
            this.aiCorrectionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>AI正在批改...';
            
            // 获取作文内容
            const essayContent = this.essayText.innerText;
            
            // 调用AI批改接口
            const aiResults = await this.dataManager.getAICorrection(essayContent);
            
            // 显示AI批改结果
            this.displayAIResults(aiResults);
        } catch (error) {
            console.error('AI批改失败:', error);
            alert('AI批改失败，请稍后重试');
        } finally {
            if (this.aiCorrectionBtn) {
                this.aiCorrectionBtn.disabled = false;
                this.aiCorrectionBtn.innerHTML = '<i class="fas fa-robot"></i>AI智能批改';
            }
        }
    }

    // 显示AI批改结果
    displayAIResults(results) {
        if (!this.aiResultsPanel) return;

        // 更新统计数据
        const summaryItems = this.aiResultsPanel.querySelectorAll('.summary-item .value');
        if (summaryItems[0]) summaryItems[0].textContent = results.score;
        if (summaryItems[1]) summaryItems[1].textContent = results.highlights.length;
        if (summaryItems[2]) summaryItems[2].textContent = results.improvements.length;

        // 更新亮点列表
        const highlightsList = this.aiResultsPanel.querySelector('.highlights-list');
        if (highlightsList) {
            highlightsList.innerHTML = results.highlights.map(highlight => `
                <li data-text="${highlight.text}">
                    <i class="fas fa-star text-warning"></i>
                    ${highlight.comment}
                </li>
            `).join('');
        }

        // 更新改进建议列表
        const improvementsList = this.aiResultsPanel.querySelector('.improvements-list');
        if (improvementsList) {
            improvementsList.innerHTML = results.improvements.map(improvement => `
                <li data-text="${improvement.text}">
                    <i class="fas fa-exclamation-circle text-danger"></i>
                    ${improvement.comment}
                </li>
            `).join('');
        }

        // 更新建议评语
        const suggestedComment = this.aiResultsPanel.querySelector('.suggested-comment');
        if (suggestedComment) {
            suggestedComment.textContent = results.suggestedComment || '';
        }

        // 显示结果面板
        this.aiResultsPanel.style.display = 'flex';

        // 绑定点击事件
        this.bindAIResultsEvents();
    }

    // 绑定AI结果交互事件
    bindAIResultsEvents() {
        if (!this.aiResultsPanel) return;

        // 点击亮点和改进建议时高亮对应文本
        const resultItems = this.aiResultsPanel.querySelectorAll('.highlights-list li, .improvements-list li');
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.dataset.text;
                this.highlightText(text);
            });
        });
    }

    // 高亮文本
    highlightText(text) {
        if (!this.essayText) return;

        const content = this.essayText.innerHTML;
        const highlightedContent = content.replace(
            new RegExp(text, 'g'),
            `<span class="temp-highlight">${text}</span>`
        );
        this.essayText.innerHTML = highlightedContent;
        
        // 3秒后移除高亮
        setTimeout(() => {
            const highlights = this.essayText.querySelectorAll('.temp-highlight');
            highlights.forEach(highlight => {
                const parent = highlight.parentNode;
                while (highlight.firstChild) {
                    parent.insertBefore(highlight.firstChild, highlight);
                }
                parent.removeChild(highlight);
            });
        }, 3000);
    }

    // 采纳所有AI建议
    acceptAllAISuggestions() {
        if (!this.aiResultsPanel || !this.commentTextarea) return;

        // 将AI建议的评语添加到总评语中
        const suggestedComment = this.aiResultsPanel.querySelector('.suggested-comment');
        if (suggestedComment) {
            this.commentTextarea.value = suggestedComment.textContent;
        }
        
        // 关闭AI结果面板
        this.closeAIResults();
    }

    // 关闭AI结果面板
    closeAIResults() {
        if (this.aiResultsPanel) {
            this.aiResultsPanel.style.display = 'none';
        }
    }

    // 处理快速评语
    handleQuickComment(tag) {
        if (!this.commentTextarea) return;

        const comment = tag.textContent;
        const currentComment = this.commentTextarea.value;
        this.commentTextarea.value = currentComment ? `${currentComment}\n${comment}` : comment;
    }

    // 计算总分
    calculateTotalScore() {
        if (!this.scoreInputs || !this.totalScoreSpan) return;

        let total = 0;
        this.scoreInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            // 确保分数在有效范围内
            input.value = Math.min(Math.max(value, 0), parseInt(input.max));
            total += parseInt(input.value) || 0;
        });
        this.totalScoreSpan.textContent = total;
    }

    // 保存草稿
    saveDraft() {
        if (!this.scoreInputs || !this.commentTextarea) return;

        const draft = {
            scores: Array.from(this.scoreInputs).map(input => parseInt(input.value) || 0),
            comment: this.commentTextarea.value,
            lastModified: new Date().toISOString()
        };

        localStorage.setItem(`draft_${this.assignmentId}`, JSON.stringify(draft));
    }

    // 加载草稿
    loadDraft(draft) {
        if (!draft || !this.scoreInputs || !this.commentTextarea) return;

        // 恢复评分
        if (draft.scores) {
            this.scoreInputs.forEach((input, index) => {
                input.value = draft.scores[index] || 0;
            });
            this.calculateTotalScore();
        }

        // 恢复评语
        if (draft.comment) {
            this.commentTextarea.value = draft.comment;
        }
    }

    // 提交批改
    async submitCorrection() {
        try {
            if (!this.submitCorrectionBtn || !this.scoreInputs || !this.commentTextarea || !this.totalScoreSpan) return;

            this.submitCorrectionBtn.disabled = true;
            this.submitCorrectionBtn.textContent = '正在提交...';

            const correction = {
                assignmentId: this.assignmentId,
                scores: Array.from(this.scoreInputs).map(input => parseInt(input.value) || 0),
                totalScore: parseInt(this.totalScoreSpan.textContent) || 0,
                comment: this.commentTextarea.value,
                submittedAt: new Date().toISOString()
            };

            await this.dataManager.submitCorrection(correction);
            
            // 清除草稿
            localStorage.removeItem(`draft_${this.assignmentId}`);
            
            alert('批改提交成功！');
            window.location.href = 'correction.html';
        } catch (error) {
            console.error('提交批改失败:', error);
            alert('提交批改失败，请稍后重试');
        } finally {
            if (this.submitCorrectionBtn) {
                this.submitCorrectionBtn.disabled = false;
                this.submitCorrectionBtn.textContent = '提交批改';
            }
        }
    }

    // 初始化导航栏
    initializeNavigation() {
        // 用户菜单交互
        const userSection = document.querySelector('.user-section');
        const userMenu = document.querySelector('.user-menu');
        
        if (userSection && userMenu) {
            // 点击用户头像显示/隐藏菜单
            userSection.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
            });
            
            // 点击其他地方关闭菜单
            document.addEventListener('click', () => {
                userMenu.style.display = 'none';
            });
        }
        
        // 退出登录
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('确定要退出登录吗？')) {
                    // 清除登录状态
                    localStorage.removeItem('teacherId');
                    // 跳转到登录页
                    window.location.href = '../login.html';
                }
            });
        }
        
        // 导航栏高亮当前页面
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            if (currentPath.includes(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        });
    }
}

// 初始化批改页面
document.addEventListener('DOMContentLoaded', () => {
    const correctionPage = new CorrectionPage();
}); 