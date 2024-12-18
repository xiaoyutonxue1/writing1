document.addEventListener('DOMContentLoaded', function() {
    // Progress bar animations
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });

    // Timeline item animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Report modal functionality
    window.showFullReport = function() {
        const modal = document.getElementById('reportModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.closeReportModal = function() {
        const modal = document.getElementById('reportModal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    // Close modal when clicking outside
    const modal = document.getElementById('reportModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeReportModal();
        }
    });

    // AI Assistant functionality
    const aiToggle = document.querySelector('.ai-toggle');
    const aiPanel = document.querySelector('.ai-chat-panel');
    const aiCloseBtn = aiPanel.querySelector('.close-btn');
    const actionBtns = aiPanel.querySelectorAll('.action-btn');
    const chatInput = aiPanel.querySelector('input');
    const sendBtn = aiPanel.querySelector('.send-btn');
    const messagesContainer = aiPanel.querySelector('.chat-messages');

    // Toggle AI panel
    aiToggle.addEventListener('click', () => {
        aiPanel.classList.toggle('show');
    });

    aiCloseBtn.addEventListener('click', () => {
        aiPanel.classList.remove('show');
    });

    // Quick actions
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'analyze') {
                addMessage('ai', `让我来为您分析这份学习报告。
                
根据报告显示，小明的整体学习情况良好：

1. 学习投入度高：
- 总学习时长达32小时
- 完成作文18篇
- 作业完成率92%

2. 能力表现突出：
- 语言表达能力最为突出，达到92%
- 内容构思能力良好，达到85%
- 结构组织能力稳定，达到78%

建议重点关注：
1. 加强结构组织能力的训练
2. 保持语言表达的优势
3. 继续培养写作兴趣

需要了解更具体的分析吗？`);
            } else if (action === 'suggest') {
                addMessage('ai', `基于学习报告，我为小明制定了以下建议：

1. 短期目标：
- 每周完成2-3篇议论文练习
- 建立个人写作素材库
- 练习文章结构大纲设计

2. 中期规划：
- 参加写作竞赛或投稿
- 阅读优秀范文进行模仿
- 培养批判性思维能力

3. 学习方法：
- 使用思维导图梳理文章结构
- 建立写作模板库
- 定期复盘和总结

需要针对某个具体方面详细讨论吗？`);
            }
        });
    });

    // Send message
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage('user', text);
        chatInput.value = '';

        // Simulate AI response
        setTimeout(() => {
            const response = generateAIResponse(text);
            addMessage('ai', response);
        }, 1000);
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function generateAIResponse(userInput) {
        // 这里可以根据用户输入生成更智能的回复
        return `我理解您的问题。让我为您详细分析一下这个情况...`;
    }

    // Initialize charts (placeholder)
    function initializeCharts() {
        console.log('Initializing charts');
    }

    // Call chart initialization
    initializeCharts();

    // Responsive handling
    function handleResponsive() {
        const width = window.innerWidth;
        if (width <= 768) {
            // Add mobile adaptations if needed
        }
    }

    window.addEventListener('resize', handleResponsive);
    handleResponsive();
});