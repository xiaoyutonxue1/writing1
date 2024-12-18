document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    document.body.appendChild(modalContainer);

    // Theory Learning Section
    const theorySection = document.querySelector('.theory-section');
    theorySection?.addEventListener('click', async () => {
        const { createTheoryLearningModal } = await import('./learning/theoryLearning.js');
        showModal(createTheoryLearningModal());
        initializeTheoryListeners();
    });

    // Skills Training Section
    const skillsSection = document.querySelector('.skills-section');
    skillsSection?.addEventListener('click', async () => {
        const { createSkillsTrainingModal } = await import('./learning/skillsTraining.js');
        showModal(createSkillsTrainingModal());
        initializeSkillsListeners();
    });

    // Tool buttons functionality
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const toolType = this.textContent.trim();
            console.log(`Opening ${toolType}`);
        });
    });

    // 初始化课程模态框
    const courseModal = document.getElementById('courseModal');
    const closeModalBtn = courseModal?.querySelector('.close-modal');
    const startBtns = document.querySelectorAll('.start-btn');
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const chapters = document.querySelectorAll('.chapter');

    // 打开课程模态框
    startBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止默认行为
            e.stopPropagation(); // 阻止事件冒泡
            if (courseModal) {
                courseModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // 关闭课程模态框
    closeModalBtn?.addEventListener('click', () => {
        if (courseModal) {
            courseModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // 停止视频播放
            const video = document.getElementById('courseVideo');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && courseModal && courseModal.style.display === 'block') {
            courseModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // 停止视频播放
            const video = document.getElementById('courseVideo');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        }
    });

    // 点击模态框外部关闭
    courseModal?.addEventListener('click', (e) => {
        if (e.target === courseModal) {
            courseModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // 停止视频播放
            const video = document.getElementById('courseVideo');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        }
    });

    // 章节切换功能
    chapters.forEach(chapter => {
        chapter.addEventListener('click', () => {
            chapters.forEach(ch => ch.classList.remove('active'));
            chapter.classList.add('active');
            
            // 切换视频源
            const video = document.getElementById('courseVideo');
            const videoTitle = chapter.querySelector('span').textContent;
            const videoSrc = chapter.dataset.video;
            video.src = videoSrc;
            video.play();
            console.log(`切换到章节: ${videoTitle}`);
        });
    });

    // 初始化预设问题按钮
    const questionBtns = document.querySelectorAll('.question-btn');
    questionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.textContent;
            if (chatInput) {
                chatInput.value = question;
                sendMessage();
            }
        });
    });

    // 发送消息功能
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // 添加用户消息
            addMessage(message, 'user');
            // 清空输入框
            chatInput.value = '';
            // 模拟AI助教回复
            setTimeout(() => {
                const response = getAIResponse(message);
                addMessage(response, 'assistant');
            }, 1000);
        }
    }

    // 添加消息到聊天界面
    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        if (chatMessages) {
            chatMessages.appendChild(messageDiv);
            // 滚动到底部
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // 模拟AI助教回复
    function getAIResponse(message) {
        // 测试相关的回答
        const testResponses = {
            '我想测试一下学习成果': `好的，让我来考考你对这节课的理解。
第一个问题：在记叙文写作中，"多感官描写"主要包含哪些感官的描写？请举例说明。`,

            '请考考这节课的重点': `这节课的一个重点是人物对话的运用。
请你用一段对话，展现一个"焦急"的情绪。记住要结合动作、神态等细节描写。`,

            '来道练习题吧': `好的，这是一道综合运用的题目：
请用100字左右描写"放学后的操场"，要求：
1. 运用至少两种感官描写
2. 要有细节刻画
3. 体现时间的流动

你可以开始写作了，写好后我来点评。`
        };

        // 检查是否是测试问题
        if (testResponses[message]) {
            return testResponses[message];
        }

        // 评价学生的回答
        if (message.length > 50) {  // 如果学生回答较长，说明是在回答练习题
            const feedbacks = [
                "写得不错！特别是",
                "整体表达清晰，但建议",
                "有一定的表现力，如果能",
                "基本符合要求，还可以"
            ];
            const suggestions = [
                "多加入一些细节描写会更生动。",
                "注意感官描写的自然融入。",
                "可以适当增加一些动作描写。",
                "在时间推进上可以更流畅一些。"
            ];
            return feedbacks[Math.floor(Math.random() * feedbacks.length)] + 
                   suggestions[Math.floor(Math.random() * suggestions.length)] +
                   "\n\n要继续测试吗？可以点击上面的按钮。";
        }

        // 其他问题的通用回复
        const defaultResponses = [
            "这是课程中的重要知识点，让我来为你解答...",
            "根据老师的讲解，这个问题可以这样理解...",
            "结合课程内容，我建议你可以这样思考...",
            "这个问题在课程中有详细讲解，主要包括以下几点..."
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // 发送消息事件监听
    sendBtn?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 初始化工具按钮
    const toolBtns = document.querySelectorAll('.tool-btn');
    toolBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const toolType = this.querySelector('.tool-info span').textContent;
            console.log(`Opening ${toolType}`);
            // TODO: 实现工具功能
        });
    });
});

// Show modal function
function showModal(modalContent) {
    const modalContainer = document.querySelector('.modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = modalContent;
    modalContainer.style.display = 'flex';

    // Close button functionality
    const closeBtn = modalContainer.querySelector('.close-modal');
    closeBtn?.addEventListener('click', () => {
        modalContainer.style.display = 'none';
        modalContainer.innerHTML = '';
    });

    // Close on outside click
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            modalContainer.style.display = 'none';
            modalContainer.innerHTML = '';
        }
    });
}

// Initialize theory learning listeners
async function initializeTheoryListeners() {
    const modal = document.querySelector('.theory-modal');
    if (!modal) return;

    const { createSystematicContent, createMicroContent, createCaseContent } = 
        await import('./learning/theoryLearning.js');

    const options = modal.querySelectorAll('.learning-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.getAttribute('data-type');
            let content;
            switch (type) {
                case 'systematic':
                    content = createSystematicContent();
                    break;
                case 'micro':
                    content = createMicroContent();
                    break;
                case 'case':
                    content = createCaseContent();
                    break;
            }
            modal.querySelector('.modal-body').innerHTML = content;
            initializeBackButtons();
            initializeVideoPlayers();
        });
    });
}

// Initialize skills training listeners
function initializeSkillsListeners() {
    const modal = document.querySelector('.skills-modal');
    if (!modal) return;

    const startButtons = modal.querySelectorAll('.start-btn');
    startButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const trainingType = this.closest('.training-item').querySelector('h4').textContent;
            console.log(`Starting training: ${trainingType}`);
        });
    });
}

// Initialize back buttons
async function initializeBackButtons() {
    const backBtns = document.querySelectorAll('.back-btn');
    backBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            const modalBody = this.closest('.modal-body');
            const modalType = this.closest('.learning-modal').classList[1];
            
            switch (modalType) {
                case 'theory-modal':
                    const { createTheoryLearningModal } = await import('./learning/theoryLearning.js');
                    modalBody.innerHTML = createTheoryLearningModal()
                        .match(/<div class="modal-body">([\s\S]*?)<\/div>/)[1];
                    initializeTheoryListeners();
                    break;
            }
        });
    });
}

// Initialize video players
async function initializeVideoPlayers() {
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        item.addEventListener('click', async () => {
            const title = item.querySelector('span').textContent;
            const { createVideoPlayer, initializeVideoControls } = await import('./learning/videoPlayer.js');
            const modalBody = item.closest('.modal-body');
            modalBody.innerHTML = createVideoPlayer('https://example.com/sample-video.mp4', title);
            initializeVideoControls('https://example.com/sample-video.mp4', title);
        });
    });
}